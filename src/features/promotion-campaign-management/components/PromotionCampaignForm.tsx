import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  Row,
  Col,
  Space,
  Button,
  Typography,
  Upload,
} from "antd";
import {
  ThunderboltOutlined,
  UploadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import {
  type PromotionCampaignCreateDTO,
  type PromotionCampaignUpdateDTO,
  type PromotionCampaignResponseDTO,
  type CampaignPromotionData,
} from "../../../app/api/promotion-campaign";
import CampaignPromotionSelector from "./CampaignPromotionSelector";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface PromotionCampaignFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (
    values: PromotionCampaignCreateDTO | PromotionCampaignUpdateDTO
  ) => Promise<void>;
  editingCampaign?: PromotionCampaignResponseDTO | null;
  loading?: boolean;
}

const PromotionCampaignForm: React.FC<PromotionCampaignFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  editingCampaign,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [promotions, setPromotions] = React.useState<CampaignPromotionData[]>(
    []
  );

  // Reset form when modal opens/closes or when editing campaign changes
  useEffect(() => {
    if (visible) {
      if (editingCampaign) {
        console.log("Editing campaign:", editingCampaign);

        // Populate form for editing
        form.setFieldsValue({
          title: editingCampaign.title,
          description: editingCampaign.description,
          dateRange: [
            dayjs(editingCampaign.startDate),
            dayjs(editingCampaign.endDate),
          ],
          active: editingCampaign.active,
        });

        // Set existing banner if available
        if (editingCampaign.bannerUrl) {
          setFileList([
            {
              uid: "-1",
              name: "banner.jpg",
              status: "done",
              url: editingCampaign.bannerUrl,
            },
          ]);
        } else {
          setFileList([]);
        }

        // Load existing promotion IDs when editing
        console.log("promotions from backend:", editingCampaign.promotions);
        console.log("promotionCount:", editingCampaign.promotionCount);

        if (
          editingCampaign.promotions &&
          editingCampaign.promotions.length > 0
        ) {
          console.log("Extracting promotion IDs from backend data");
          // Extract promotion IDs and create CampaignPromotionData format for display
          const existingPromotions: CampaignPromotionData[] =
            editingCampaign.promotions.map((promotion) => ({
              tempId: `existing-${promotion.id}`,
              promotionId: promotion.id,
              code: promotion.code,
              isExisting: true,
              discountType: promotion.discountType as
                | "PERCENTAGE"
                | "FIXED_AMOUNT",
              promotionType: promotion.promotionType as "auto" | "coupon",
              discountValue: promotion.discountValue,
              status: promotion.status as "active" | "inactive" | "expired",
              minOrderValue: promotion.minOrderValue,
              usageLimit: promotion.usageLimit,
              startDate: promotion.startDate,
              endDate: promotion.endDate,
            }));

          setPromotions(existingPromotions);
        } else {
          console.log("No promotions found, setting empty array");
          setPromotions([]);
        }
      } else {
        // Reset form for creating new campaign
        form.resetFields();
        form.setFieldsValue({
          active: true,
        });
        setFileList([]);
        setPromotions([]);
      }
    }
  }, [visible, editingCampaign, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange;

      const campaignData:
        | PromotionCampaignCreateDTO
        | PromotionCampaignUpdateDTO = {
        title: values.title,
        description: values.description,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        active: values.active,
      };

      // Add banner file if uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        campaignData.banner = fileList[0].originFileObj as File;
      }

      // Add promotions if any (remove tempId for API)
      if (promotions.length > 0) {
        campaignData.promotions = promotions.map((promotion) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { tempId, ...promotionData } = promotion;
          return promotionData;
        });
      }

      await onSubmit(campaignData);
      form.resetFields();
      setFileList([]);
      setPromotions([]);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setPromotions([]);
    onCancel();
  };

  const handleUploadChange = (info: UploadChangeParam) => {
    setFileList(info.fileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      console.error("Chỉ được tải lên file ảnh!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      console.error("Ảnh phải nhỏ hơn 5MB!");
      return false;
    }
    return false; // Prevent auto upload
  };

  return (
    <Modal
      title={
        <Space>
          <ThunderboltOutlined />
          <Title level={4} style={{ margin: 0 }}>
            {editingCampaign ? "Chỉnh sửa chiến dịch" : "Tạo chiến dịch mới"}
          </Title>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {editingCampaign ? "Cập nhật" : "Tạo mới"}
        </Button>,
      ]}
      width={1000}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          active: true,
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Tiêu đề chiến dịch"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề chiến dịch" },
                { max: 200, message: "Tiêu đề không được vượt quá 200 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tiêu đề chiến dịch" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[
                { max: 1000, message: "Mô tả không được vượt quá 1000 ký tự" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập mô tả cho chiến dịch (tùy chọn)"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dateRange"
              label="Thời gian chiến dịch"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thời gian chiến dịch",
                },
              ]}
            >
              <RangePicker
                style={{ width: "100%" }}
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                suffixIcon={<CalendarOutlined />}
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="banner" label="Banner chiến dịch">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                {fileList.length === 0 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Chấp nhận: JPG, PNG. Tối đa 5MB
              </Text>
            </Form.Item>
          </Col>
        </Row>

        {/* Promotion Management - Show for both create and edit */}
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <CampaignPromotionSelector
              promotions={promotions}
              onChange={setPromotions}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item name="active" valuePropName="checked">
              <Space>
                <Switch />
                <Text>Kích hoạt chiến dịch ngay sau khi tạo</Text>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PromotionCampaignForm;
