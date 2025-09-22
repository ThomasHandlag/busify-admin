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
  GiftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  type PromotionFilterParams,
  type PromotionRequestDTO,
  type PromotionResponseDTO,
  PromotionStatus,
} from "../../../app/api/promotion";
import PromotionTable from "../components/PromotionTable";
import PromotionForm from "../components/PromotionForm";
import PromotionFilter from "../components/PromotionFilter";
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
} from "../hooks/usePromotions";

const { Title } = Typography;
const { confirm } = Modal;

const PromotionManagement: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] =
    useState<PromotionResponseDTO | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [filters, setFilters] = useState<PromotionFilterParams>({});

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
  const { data: promotionData, isLoading } = usePromotions(queryParams);
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const deleteMutation = useDeletePromotion();

  // Calculate stats from promotions data
  const stats = useMemo(() => {
    if (!promotionData?.promotions) {
      return { total: 0, active: 0, expired: 0, inactive: 0 };
    }

    return promotionData.promotions.reduce(
      (acc, promotion) => {
        acc.total++;
        switch (promotion.status) {
          case PromotionStatus.ACTIVE:
            acc.active++;
            break;
          case PromotionStatus.EXPIRED:
            acc.expired++;
            break;
          case PromotionStatus.INACTIVE:
            acc.inactive++;
            break;
        }
        return acc;
      },
      { total: 0, active: 0, expired: 0, inactive: 0 }
    );
  }, [promotionData?.promotions]);

  // Handle filter
  const handleFilter = (filterParams: PromotionFilterParams) => {
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
  const handleFormSubmit = async (data: PromotionRequestDTO) => {
    try {
      if (editingPromotion) {
        // Update existing promotion
        await updateMutation.mutateAsync({ id: editingPromotion.id, data });
        setFormVisible(false);
        setEditingPromotion(null);
      } else {
        // Create new promotion
        await createMutation.mutateAsync(data);
        setFormVisible(false);
        // Reset to first page to see new promotion
        setPagination({ current: 1, pageSize: pagination.pageSize });
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error("Form submission error:", error);
    }
  };

  // Handle edit
  const handleEdit = (promotion: PromotionResponseDTO) => {
    setEditingPromotion(promotion);
    setFormVisible(true);
  };

  // Handle delete
  const handleDelete = (promotion: PromotionResponseDTO) => {
    confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa mã giảm giá "${promotion.code}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteMutation.mutate(promotion.id);
      },
    });
  };

  // Handle view details (placeholder for future implementation)
  const handleView = (promotion: PromotionResponseDTO) => {
    console.log("View promotion details:", promotion);
    // TODO: Implement promotion detail modal
  };

  // Handle form close
  const handleFormClose = () => {
    setFormVisible(false);
    setEditingPromotion(null);
  };

  // Handle create new
  const handleCreateNew = () => {
    setEditingPromotion(null);
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
              <GiftOutlined />
              Quản lý Mã giảm giá
            </Space>
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            size="large"
          >
            Tạo mã giảm giá
          </Button>
        </div>

        {/* Statistics */}
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Tổng mã giảm giá"
                value={stats.total}
                prefix={<GiftOutlined />}
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
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Đã hết hạn"
                value={stats.expired}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: "#8c8c8c" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Filter */}
      <PromotionFilter onFilter={handleFilter} loading={isLoading} />

      {/* Table */}
      <Card>
        <PromotionTable
          data={promotionData?.promotions || []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          pagination={{
            current: pagination.current,
            total: promotionData?.totalElements || 0,
            pageSize: pagination.pageSize,
            onChange: handlePaginationChange,
          }}
        />
      </Card>

      {/* Form Modal */}
      <PromotionForm
        visible={formVisible}
        onCancel={handleFormClose}
        onSubmit={handleFormSubmit}
        editingPromotion={editingPromotion}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default PromotionManagement;
