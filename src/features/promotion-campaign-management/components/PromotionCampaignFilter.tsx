import React from "react";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import type { PromotionCampaignFilterParams } from "../../../app/api/promotion-campaign";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface PromotionCampaignFilterProps {
  onFilter: (params: PromotionCampaignFilterParams) => void;
  loading?: boolean;
}

const PromotionCampaignFilter: React.FC<PromotionCampaignFilterProps> = ({
  onFilter,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const filterParams: PromotionCampaignFilterParams = {};

    if (values.search?.trim()) {
      filterParams.search = values.search.trim();
    }

    if (values.active !== undefined) {
      filterParams.active = values.active;
    }

    if (values.deleted !== undefined) {
      filterParams.deleted = values.deleted;
    }

    if (values.dateRange && values.dateRange.length === 2) {
      filterParams.startDate = values.dateRange[0].format("YYYY-MM-DD");
      filterParams.endDate = values.dateRange[1].format("YYYY-MM-DD");
    }

    onFilter(filterParams);
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="search" label="Tìm kiếm">
              <Input
                placeholder="Nhập tiêu đề chiến dịch"
                allowClear
                prefix={<SearchOutlined />}
                onPressEnter={handleSearch}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="active" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" allowClear>
                <Option value={true}>Hoạt động</Option>
                <Option value={false}>Tạm ngưng</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="deleted" label="Tình trạng">
              <Select placeholder="Tất cả chiến dịch" allowClear>
                <Option value={false}>Chiến dịch hiện tại</Option>
                <Option value={true}>Chiến dịch đã xóa</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="dateRange" label="Thời gian">
              <RangePicker
                style={{ width: "100%" }}
                placeholder={["Từ ngày", "Đến ngày"]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item label=" ">
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={loading}
                >
                  Tìm kiếm
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

export default PromotionCampaignFilter;
