import React, { useState, useMemo } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Modal,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  StopOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  type PromotionCampaignFilterParams,
  type PromotionCampaignCreateDTO,
  type PromotionCampaignUpdateDTO,
  type PromotionCampaignResponseDTO,
} from "../../../app/api/promotion-campaign";
import PromotionCampaignTable from "../components/PromotionCampaignTable";
import PromotionCampaignForm from "../components/PromotionCampaignForm";
import PromotionCampaignFilter from "../components/PromotionCampaignFilter";
import {
  usePromotionCampaigns,
  useCreatePromotionCampaign,
  useUpdatePromotionCampaign,
  useDeletePromotionCampaign,
  useRestorePromotionCampaign,
} from "../hooks/usePromotionCampaigns";

const { Title } = Typography;
const { confirm } = Modal;

const PromotionCampaignManagement: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<PromotionCampaignResponseDTO | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [filters, setFilters] = useState<PromotionCampaignFilterParams>({});

  // Prepare query params
  const queryParams = useMemo(
    () => ({
      ...filters,
      page: pagination.current,
      size: pagination.pageSize,
    }),
    [filters, pagination]
  );

  // TanStack Query hooks
  const { data: campaignData, isLoading } = usePromotionCampaigns(queryParams);
  const createMutation = useCreatePromotionCampaign();
  const updateMutation = useUpdatePromotionCampaign();
  const deleteMutation = useDeletePromotionCampaign();
  const restoreMutation = useRestorePromotionCampaign();

  // Calculate stats from campaigns data (exclude deleted campaigns unless specifically filtering for them)
  const stats = useMemo(() => {
    if (!campaignData?.campaigns) {
      return { total: 0, active: 0, inactive: 0, totalPromotions: 0 };
    }

    // Only include deleted campaigns in stats if user is specifically filtering for them
    const isFilteringDeleted = filters.deleted === true;
    const campaignsToCount = isFilteringDeleted
      ? campaignData.campaigns
      : campaignData.campaigns.filter((campaign) => !campaign.deleted);

    return campaignsToCount.reduce(
      (acc, campaign) => {
        acc.total++;
        if (campaign.active) {
          acc.active++;
        } else {
          acc.inactive++;
        }
        acc.totalPromotions += campaign.promotionCount;
        return acc;
      },
      { total: 0, active: 0, inactive: 0, totalPromotions: 0 }
    );
  }, [campaignData?.campaigns, filters.deleted]);

  // Handle filter
  const handleFilter = (filterParams: PromotionCampaignFilterParams) => {
    setFilters(filterParams);
    setPagination({ current: 1, pageSize: pagination.pageSize }); // Reset to first page
  };

  // Handle pagination
  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination({
      current: page,
      pageSize: pageSize || pagination.pageSize,
    });
  };

  // Handle create/edit form
  const handleFormSubmit = async (
    data: PromotionCampaignCreateDTO | PromotionCampaignUpdateDTO
  ) => {
    try {
      if (editingCampaign) {
        // Update existing campaign
        await updateMutation.mutateAsync({
          id: editingCampaign.campaignId,
          data: data as PromotionCampaignUpdateDTO,
        });
        setFormVisible(false);
        setEditingCampaign(null);
      } else {
        // Create new campaign
        await createMutation.mutateAsync(data as PromotionCampaignCreateDTO);
        setFormVisible(false);
        // Reset to first page to see new campaign
        setPagination({ current: 1, pageSize: pagination.pageSize });
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error("Form submission error:", error);
    }
  };

  // Handle edit
  const handleEdit = (campaign: PromotionCampaignResponseDTO) => {
    setEditingCampaign(campaign);
    setFormVisible(true);
  };

  // Handle delete
  const handleDelete = (campaign: PromotionCampaignResponseDTO) => {
    confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa chiến dịch "${campaign.title}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteMutation.mutate(campaign.campaignId);
      },
    });
  };

  // Handle restore
  const handleRestore = (campaign: PromotionCampaignResponseDTO) => {
    confirm({
      title: "Xác nhận khôi phục",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn khôi phục chiến dịch "${campaign.title}"?`,
      okText: "Khôi phục",
      okType: "primary",
      cancelText: "Hủy",
      onOk: () => {
        restoreMutation.mutate(campaign.campaignId);
      },
    });
  };

  // Handle view details (placeholder for future implementation)
  const handleView = (campaign: PromotionCampaignResponseDTO) => {
    console.log("View campaign details:", campaign);
    // TODO: Implement campaign detail modal
  };

  // Handle form close
  const handleFormClose = () => {
    setFormVisible(false);
    setEditingCampaign(null);
  };

  // Handle create new
  const handleCreateNew = () => {
    setEditingCampaign(null);
    setFormVisible(true);
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            <Space>
              <ThunderboltOutlined />
              Quản lý Chiến dịch khuyến mãi
            </Space>
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            size="large"
          >
            Tạo chiến dịch
          </Button>
        </div>

        {/* Statistics */}
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Tổng chiến dịch"
                value={stats.total}
                prefix={<ThunderboltOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Đang hoạt động"
                value={stats.active}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Tạm ngưng"
                value={stats.inactive}
                prefix={<StopOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Tổng khuyến mãi đã áp dụng"
                value={stats.totalPromotions}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Filter */}
      <PromotionCampaignFilter onFilter={handleFilter} loading={isLoading} />

      {/* Table */}
      <Card>
        <PromotionCampaignTable
          data={campaignData?.campaigns || []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onView={handleView}
          pagination={{
            current: pagination.current,
            total: campaignData?.totalElements || 0,
            pageSize: pagination.pageSize,
            onChange: handlePaginationChange,
          }}
        />
      </Card>

      {/* Form Modal */}
      <PromotionCampaignForm
        visible={formVisible}
        onCancel={handleFormClose}
        onSubmit={handleFormSubmit}
        editingCampaign={editingCampaign}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default PromotionCampaignManagement;
