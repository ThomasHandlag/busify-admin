import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Row,
  Col,
  Space,
  Button,
  Divider,
  Typography,
} from "antd";
import {
  GiftOutlined,
  PercentageOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  DiscountType,
  PromotionType,
  PromotionStatus,
  type PromotionRequestDTO,
  type PromotionResponseDTO,
} from "../../../app/api/promotion";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface PromotionFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: PromotionRequestDTO) => Promise<void>;
  editingPromotion?: PromotionResponseDTO | null;
  loading?: boolean;
}

const PromotionForm: React.FC<PromotionFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  editingPromotion,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [discountType, setDiscountType] = React.useState<string>(
    DiscountType.PERCENTAGE
  );

  // Reset form when modal opens/closes or when editing promotion changes
  useEffect(() => {
    if (visible) {
      if (editingPromotion) {
        console.log("Editing promotion:", editingPromotion);
        console.log("Promotion status:", editingPromotion.status);
        const isActiveValue =
          editingPromotion.status === PromotionStatus.ACTIVE;
        console.log("Setting isActive to:", isActiveValue);

        // Populate form for editing
        form.setFieldsValue({
          ...editingPromotion,
          dateRange: [
            dayjs(editingPromotion.startDate),
            dayjs(editingPromotion.endDate),
          ],
          isActive: isActiveValue,
        });

        setDiscountType(editingPromotion.discountType);
      } else {
        // Reset form for creating new promotion
        form.resetFields();
        const defaultType = DiscountType.PERCENTAGE;
        form.setFieldsValue({
          discountType: defaultType,
          promotionType: PromotionType.AUTO,
          status: PromotionStatus.ACTIVE,
          isActive: true,
          priority: 1,
        });
        setDiscountType(defaultType);
      }
    }
  }, [visible, editingPromotion, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange;

      const promotionData: PromotionRequestDTO = {
        discountType: values.discountType,
        promotionType: values.promotionType,
        discountValue: values.discountValue,
        minOrderValue: values.minOrderValue,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        usageLimit: values.usageLimit,
        priority: values.priority,
        status: values.isActive
          ? PromotionStatus.ACTIVE
          : PromotionStatus.INACTIVE,
      };

      await onSubmit(promotionData);
      form.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <GiftOutlined />
          <Title level={4} style={{ margin: 0 }}>
            {editingPromotion ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
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
          {editingPromotion ? "Cập nhật" : "Tạo mới"}
        </Button>,
      ]}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          discountType: DiscountType.PERCENTAGE,
          promotionType: PromotionType.AUTO,
          status: PromotionStatus.ACTIVE,
          priority: 1,
        }}
      >
        <Row gutter={16}>
          <Form.Item name="code" label="Mã giảm giá" hidden={true}>
            <Input style={{ textTransform: "uppercase" }} />
          </Form.Item>
          <Col span={12}>
            <Form.Item
              name="promotionType"
              label="Loại khuyến mãi"
              rules={[
                { required: true, message: "Vui lòng chọn loại khuyến mãi" },
              ]}
            >
              <Select placeholder="Chọn loại khuyến mãi">
                <Option value={PromotionType.AUTO}>Tự động</Option>
                <Option value={PromotionType.COUPON}>Mã giảm giá</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">
          <Text strong>Thông tin giảm giá</Text>
        </Divider>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="discountType"
              label="Kiểu giảm giá"
              rules={[
                { required: true, message: "Vui lòng chọn kiểu giảm giá" },
              ]}
            >
              <Select
                placeholder="Chọn kiểu giảm giá"
                onChange={(value) => {
                  setDiscountType(value);
                  // Reset discountValue when changing type
                  form.setFieldsValue({ discountValue: undefined });
                }}
              >
                <Option value={DiscountType.PERCENTAGE}>
                  <Space>
                    <PercentageOutlined />
                    Phần trăm (%)
                  </Space>
                </Option>
                <Option value={DiscountType.FIXED_AMOUNT}>
                  <Space>
                    <DollarOutlined />
                    Số tiền cố định (VNĐ)
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="discountValue"
              label="Giá trị giảm"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị giảm" },
                {
                  type: "number",
                  min: 0.01,
                  message: "Giá trị phải lớn hơn 0",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder={
                  discountType === DiscountType.PERCENTAGE
                    ? "Nhập % (ví dụ: 20)"
                    : "Nhập số tiền (ví dụ: 50000)"
                }
                formatter={(value) => {
                  if (!value) return "";
                  if (discountType === DiscountType.PERCENTAGE) {
                    return `${value}`;
                  } else {
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }
                }}
                min={0.01}
                max={discountType === DiscountType.PERCENTAGE ? 100 : undefined}
                addonAfter={
                  discountType === DiscountType.PERCENTAGE ? "%" : "VNĐ"
                }
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="minOrderValue"
              label="Giá trị đơn hàng tối thiểu"
              rules={[{ type: "number", min: 0, message: "Giá trị phải >= 0" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Không giới hạn"
                formatter={(value) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                }
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">
          <Text strong>Thời gian và giới hạn</Text>
        </Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dateRange"
              label="Thời gian hiệu lực"
              rules={[
                { required: true, message: "Vui lòng chọn thời gian hiệu lực" },
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
          <Col span={6}>
            <Form.Item
              name="usageLimit"
              label="Giới hạn"
              rules={[{ type: "number", min: 1, message: "Phải >= 1" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Không giới hạn"
                min={1}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="priority"
              label="Độ ưu tiên"
              rules={[
                { type: "number", min: 1, max: 10, message: "Từ 1 đến 10" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="1"
                min={1}
                max={10}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item name="isActive" valuePropName="checked">
              <Space>
                <Switch />
                <Text>Kích hoạt ngay sau khi tạo</Text>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PromotionForm;
