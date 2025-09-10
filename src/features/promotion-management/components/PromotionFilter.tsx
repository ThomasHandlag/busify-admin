import React from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  PromotionStatus,
  PromotionType,
  type PromotionFilterParams,
} from "../../../app/api/promotion";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface PromotionFilterProps {
  onFilter: (filters: PromotionFilterParams) => void;
  loading?: boolean;
}

const PromotionFilter: React.FC<PromotionFilterProps> = ({
  onFilter,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleFilter = () => {
    const values = form.getFieldsValue();
    const filters: PromotionFilterParams = {
      search: values.search?.trim(),
      status: values.status,
      type: values.type,
      minDiscount: values.discountRange?.[0],
      maxDiscount: values.discountRange?.[1],
      startDate: values.dateRange?.[0]?.format("YYYY-MM-DD"),
      endDate: values.dateRange?.[1]?.format("YYYY-MM-DD"),
    };

    // Remove undefined/empty values
    Object.keys(filters).forEach((key) => {
      if (
        filters[key as keyof PromotionFilterParams] === undefined ||
        filters[key as keyof PromotionFilterParams] === ""
      ) {
        delete filters[key as keyof PromotionFilterParams];
      }
    });

    onFilter(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleFilter}
        autoComplete="off"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="search"
              label="Tìm kiếm"
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Tên mã hoặc mô tả..."
                allowClear
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="status"
              label="Trạng thái"
              style={{ marginBottom: 0 }}
            >
              <Select placeholder="Chọn trạng thái" allowClear>
                <Option value={PromotionStatus.ACTIVE}>Đang hoạt động</Option>
                <Option value={PromotionStatus.INACTIVE}>Tạm ngưng</Option>
                <Option value={PromotionStatus.EXPIRED}>Đã hết hạn</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="type" label="Loại KM" style={{ marginBottom: 0 }}>
              <Select placeholder="Chọn loại" allowClear>
                <Option value={PromotionType.AUTO}>Tự động</Option>
                <Option value={PromotionType.COUPON}>Mã giảm giá</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="discountRange"
              label="Giá trị giảm"
              style={{ marginBottom: 0 }}
            >
              <Input.Group compact>
                <Form.Item name={["discountRange", 0]} noStyle>
                  <InputNumber
                    placeholder="Từ"
                    style={{ width: "50%" }}
                    min={0}
                  />
                </Form.Item>
                <Form.Item name={["discountRange", 1]} noStyle>
                  <InputNumber
                    placeholder="Đến"
                    style={{ width: "50%" }}
                    min={0}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="dateRange"
              label="Thời gian"
              style={{ marginBottom: 0 }}
            >
              <RangePicker
                style={{ width: "100%" }}
                placeholder={["Từ ngày", "Đến ngày"]}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleFilter}
                  loading={loading}
                >
                  Tìm
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  disabled={loading}
                >
                  Đặt lại
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default PromotionFilter;
