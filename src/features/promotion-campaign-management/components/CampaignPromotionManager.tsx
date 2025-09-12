import React from "react";
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  Divider,
  Typography,
  List,
  Tag,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  PercentageOutlined,
  DollarOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import {
  DiscountType,
  PromotionType,
  PromotionStatus,
  type PromotionRequestDTO,
} from "../../../app/api/promotion";

const { Text } = Typography;
const { Option } = Select;

interface CampaignPromotionData
  extends Omit<PromotionRequestDTO, "startDate" | "endDate"> {
  tempId: string; // Temporary ID for frontend management
}

interface CampaignPromotionManagerProps {
  promotions: CampaignPromotionData[];
  onChange: (promotions: CampaignPromotionData[]) => void;
}

const CampaignPromotionManager: React.FC<CampaignPromotionManagerProps> = ({
  promotions,
  onChange,
}) => {
  const [form] = Form.useForm();

  const addPromotion = () => {
    form
      .validateFields()
      .then((values) => {
        const newPromotion: CampaignPromotionData = {
          tempId: Date.now().toString(),
          discountType: values.discountType,
          promotionType: values.promotionType,
          discountValue: values.discountValue,
          minOrderValue: values.minOrderValue,
          usageLimit: values.usageLimit,
          priority: values.priority || 1,
          status: values.status,
        };

        console.log("Adding promotion:", newPromotion);

        onChange([...promotions, newPromotion]);
        form.resetFields();
        // Set default values after reset
        form.setFieldsValue({
          discountType: DiscountType.PERCENTAGE,
          promotionType: PromotionType.AUTO,
          status: PromotionStatus.ACTIVE,
          priority: 1,
        });
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  const removePromotion = (tempId: string) => {
    onChange(promotions.filter((p) => p.tempId !== tempId));
  };

  const getPromotionDisplayInfo = (promotion: CampaignPromotionData) => {
    const discountDisplay =
      promotion.discountType === DiscountType.PERCENTAGE
        ? `${promotion.discountValue}%`
        : `${promotion.discountValue.toLocaleString()} VNĐ`;

    const typeDisplay =
      promotion.promotionType === PromotionType.AUTO
        ? "Tự động"
        : "Mã giảm giá";
    const statusDisplay =
      promotion.status === PromotionStatus.ACTIVE ? "Hoạt động" : "Tạm ngưng";

    return { discountDisplay, typeDisplay, statusDisplay };
  };

  return (
    <Card
      title={
        <Space>
          <GiftOutlined />
          <span>Mã giảm giá cho chiến dịch</span>
        </Space>
      }
      size="small"
    >
      {/* Form để thêm mã giảm giá */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          discountType: DiscountType.PERCENTAGE,
          promotionType: PromotionType.AUTO,
          status: PromotionStatus.ACTIVE,
          priority: 1,
        }}
      >
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item
              name="discountType"
              label="Kiểu giảm"
              rules={[{ required: true, message: "Chọn kiểu giảm giá" }]}
            >
              <Select size="small">
                <Option value={DiscountType.PERCENTAGE}>
                  <Space>
                    <PercentageOutlined />%
                  </Space>
                </Option>
                <Option value={DiscountType.FIXED_AMOUNT}>
                  <Space>
                    <DollarOutlined />
                    VNĐ
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="discountValue"
              label="Giá trị"
              rules={[
                { required: true, message: "Nhập giá trị" },
                { type: "number", min: 0.01, message: "Giá trị > 0" },
              ]}
            >
              <InputNumber
                size="small"
                style={{ width: "100%" }}
                min={0.01}
                placeholder="Nhập giá trị"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="minOrderValue" label="Đơn tối thiểu">
              <InputNumber
                size="small"
                style={{ width: "100%" }}
                min={0}
                placeholder="Không giới hạn"
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="usageLimit" label="Giới hạn SD">
              <InputNumber
                size="small"
                style={{ width: "100%" }}
                min={1}
                placeholder="Vô hạn"
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label=" ">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="small"
                onClick={addPromotion}
                style={{ width: "100%" }}
              >
                Thêm
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="promotionType"
              label="Loại"
              rules={[{ required: true, message: "Chọn loại" }]}
            >
              <Select size="small">
                <Option value={PromotionType.AUTO}>Tự động</Option>
                <Option value={PromotionType.COUPON}>Mã giảm giá</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select size="small">
                <Option value={PromotionStatus.ACTIVE}>Hoạt động</Option>
                <Option value={PromotionStatus.INACTIVE}>Tạm ngưng</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="priority"
              label="Độ ưu tiên"
              rules={[{ type: "number", min: 1, max: 10, message: "1-10" }]}
            >
              <InputNumber
                size="small"
                style={{ width: "100%" }}
                min={1}
                max={10}
                placeholder="1"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider style={{ margin: "12px 0" }} />

      {/* Danh sách mã giảm giá đã thêm */}
      {promotions.length > 0 ? (
        <div>
          <Text strong>Mã giảm giá sẽ được tạo ({promotions.length}):</Text>
          <List
            size="small"
            style={{ marginTop: 8 }}
            dataSource={promotions}
            renderItem={(promotion) => {
              const { discountDisplay, typeDisplay, statusDisplay } =
                getPromotionDisplayInfo(promotion);
              return (
                <List.Item
                  actions={[
                    <Popconfirm
                      key="delete"
                      title="Xóa mã giảm giá này?"
                      onConfirm={() => removePromotion(promotion.tempId)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      />
                    </Popconfirm>,
                  ]}
                >
                  <Space>
                    <Tag color="blue">{discountDisplay}</Tag>
                    <Tag color="green">{typeDisplay}</Tag>
                    <Tag
                      color={
                        promotion.status === PromotionStatus.ACTIVE
                          ? "success"
                          : "default"
                      }
                    >
                      {statusDisplay}
                    </Tag>
                    {promotion.minOrderValue && (
                      <Text type="secondary">
                        Đơn tối thiểu:{" "}
                        {promotion.minOrderValue.toLocaleString()} VNĐ
                      </Text>
                    )}
                    {promotion.usageLimit && (
                      <Text type="secondary">
                        Giới hạn: {promotion.usageLimit}
                      </Text>
                    )}
                  </Space>
                </List.Item>
              );
            }}
          />
        </div>
      ) : (
        <Text type="secondary">Chưa có mã giảm giá nào được thêm</Text>
      )}
    </Card>
  );
};

export default CampaignPromotionManager;
