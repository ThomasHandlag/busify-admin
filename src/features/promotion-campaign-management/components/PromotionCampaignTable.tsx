import React from "react";
import { Table, Tag, Space, Button, Image, Typography, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import { type PromotionCampaignResponseDTO } from "../../../app/api/promotion-campaign";

const { Text } = Typography;

interface PromotionCampaignTableProps {
  data: PromotionCampaignResponseDTO[];
  loading?: boolean;
  onEdit: (campaign: PromotionCampaignResponseDTO) => void;
  onDelete: (campaign: PromotionCampaignResponseDTO) => void;
  onRestore?: (campaign: PromotionCampaignResponseDTO) => void;
  onView: (campaign: PromotionCampaignResponseDTO) => void;
  pagination?: TableProps<PromotionCampaignResponseDTO>["pagination"];
}

const PromotionCampaignTable: React.FC<PromotionCampaignTableProps> = ({
  data,
  loading = false,
  onEdit,
  onDelete,
  onRestore,
  onView,
  pagination,
}) => {
  const columns: ColumnsType<PromotionCampaignResponseDTO> = [
    {
      title: "ID",
      dataIndex: "campaignId",
      key: "campaignId",
      width: 80,
      sorter: (a, b) => a.campaignId - b.campaignId,
    },
    {
      title: "Banner",
      dataIndex: "bannerUrl",
      key: "bannerUrl",
      width: 100,
      render: (bannerUrl: string) => {
        if (bannerUrl) {
          return (
            <Image
              width={60}
              height={40}
              src={bannerUrl}
              alt="Campaign banner"
              style={{ objectFit: "cover", borderRadius: 4 }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8G+STzAXSgtTLIhEOBJFIvMCFknhgwhEIhHYJBJBJhJBJhJBJBJJ4nE0snLnlh8kxJEdI6+Ezxcvg"
            />
          );
        }
        return <Text type="secondary">Không có</Text>;
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title: string) => (
        <Tooltip title={title}>
          <Text strong style={{ maxWidth: 200, display: "block" }} ellipsis>
            {title}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (description: string) => {
        if (description) {
          return (
            <Tooltip title={description}>
              <Text style={{ maxWidth: 200, display: "block" }} ellipsis>
                {description}
              </Text>
            </Tooltip>
          );
        }
        return <Text type="secondary">Không có mô tả</Text>;
      },
    },
    {
      title: "Thời gian",
      key: "dateRange",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {dayjs(record.startDate).format("DD/MM/YYYY")}
          </Text>
          <Text type="secondary">
            đến {dayjs(record.endDate).format("DD/MM/YYYY")}
          </Text>
        </Space>
      ),
    },
    {
      title: "Số khuyến mãi",
      dataIndex: "promotionCount",
      key: "promotionCount",
      width: 120,
      sorter: (a, b) => a.promotionCount - b.promotionCount,
      render: (count: number) => (
        <Tag color={count > 0 ? "blue" : "default"}>{count} khuyến mãi</Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Tạm ngưng", value: false },
      ],
      onFilter: (value, record) => record.active === value,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={record.active ? "success" : "error"}>
            {record.active ? "Hoạt động" : "Tạm ngưng"}
          </Tag>
          {record.deleted && <Tag color="red">Đã xóa</Tag>}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>

          {!record.deleted ? (
            // Actions for active campaigns
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(record)}
                />
              </Tooltip>
            </>
          ) : (
            // Actions for deleted campaigns
            onRestore && (
              <Tooltip title="Khôi phục">
                <Button
                  type="text"
                  icon={<UndoOutlined />}
                  style={{ color: "#52c41a" }}
                  onClick={() => onRestore(record)}
                />
              </Tooltip>
            )
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="campaignId"
      pagination={pagination}
      scroll={{ x: 1200 }}
      size="middle"
    />
  );
};

export default PromotionCampaignTable;
