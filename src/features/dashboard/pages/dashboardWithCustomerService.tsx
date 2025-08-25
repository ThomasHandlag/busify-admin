import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, message, Spin, Button } from "antd"; // Thêm Spin, Button, message
import { ExclamationCircleOutlined } from "@ant-design/icons"; // Thêm ExclamationCircleOutlined
import dayjs from "dayjs";
import { MetricsCard } from "../components/MetricsCard";
import { TicketsList } from "../components/TicketsList";
import { DashboardSidebar } from "../components/DashboardSidebar";
import type { Notification, ChatSession } from "../types";
// Import các hàm API và interface ComplaintDetail
import {
  getComplaintByAgent,
  type ComplaintDetail,
} from "../../../app/api/complaint"; // Điều chỉnh đường dẫn nếu cần
import { DashboardHeader } from "../components/DashboardHeader";
import { useAuthStore } from "../../../stores/auth_store";

export const DashboardWithCustomerService = () => {
  const { loggedInUser } = useAuthStore();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  // States để lưu trữ dữ liệu từ API
  const [complaints, setComplaints] = useState<ComplaintDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm fetch data
  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset lỗi mỗi khi fetch
    try {
      const email = loggedInUser?.email;
      if (!email) {
        throw new Error("Không tìm thấy email của người dùng đăng nhập.");
      }
      const response = await getComplaintByAgent(email);

      if (response.code === 200) {
        setComplaints(response.result);
      } else {
        // Xử lý lỗi từ response API
        const errorMessage =
          response.message || "Không thể tải danh sách khiếu nại.";
        setError(errorMessage);
        message.error(errorMessage);
      }
    } catch (err: any) {
      // Xử lý lỗi mạng hoặc lỗi không xác định
      const errorMessage =
        err.message || "Đã xảy ra lỗi không mong muốn khi tải dữ liệu.";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // [] đảm bảo hàm này chỉ được tạo một lần

  // Gọi fetchComplaints khi component mount
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]); // Dependency array bao gồm fetchComplaints (do useCallback)

  // Mock data cho Notifications và ChatSessions (giữ nguyên nếu bạn muốn)
  const mockNotifications: Notification[] = [
    {
      id: "N001",
      type: "sla_breach",
      message: "Ticket TK003 sắp quá hạn xử lý (còn 1 giờ)",
      time: "2024-12-10T14:30:00",
      severity: "warning",
    },
    {
      id: "N002",
      type: "new_ticket",
      message: "Ticket mới TK006 từ khách hàng Nguyễn Thị Hoa",
      time: "2024-12-10T14:25:00",
      severity: "info",
    },
    {
      id: "N003",
      type: "chat_waiting",
      message: "Khách hàng Trần Văn Khải đang chờ phản hồi trong chat",
      time: "2024-12-10T14:20:00",
      severity: "warning",
    },
  ];

  const mockChatSessions: ChatSession[] = [
    {
      id: "CH001",
      customerName: "Nguyễn Thị Lan",
      status: "active",
      lastMessage: "Tôi muốn đổi vé sang ngày mai được không?",
      unreadCount: 2,
      startTime: "2024-12-10T14:15:00",
    },
    {
      id: "CH002",
      customerName: "Trần Văn Khải",
      status: "waiting",
      lastMessage: "Cảm ơn, tôi đã hiểu rồi",
      unreadCount: 0,
      startTime: "2024-12-10T13:45:00",
    },
    {
      id: "CH003",
      customerName: "Lê Thị Mai",
      status: "active",
      lastMessage: "Xe có wifi không ạ?",
      unreadCount: 1,
      startTime: "2024-12-10T14:30:00",
    },
  ];

  // Filter tickets based on status and search, sử dụng `complaints` thay vì `mockTickets`
  const filteredTickets = complaints.filter((ticket) => {
    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesSearch =
      searchText === "" ||
      ticket.customer.customerName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.id.toString().toLowerCase().includes(searchText.toLowerCase()); // id là number, chuyển sang string để tìm kiếm
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics, sử dụng `complaints`
  const stats = {
    totalOpen: complaints.filter((t) => t.status === "open").length,
    inProgress: complaints.filter((t) => t.status === "in_progress").length,
    // Cập nhật logic resolvedToday và overdue nếu ComplaintDetail có trường dueAt
    // Hiện tại ComplaintDetail không có dueAt, nên phần này cần được xem xét lại.
    // Tạm thời để nguyên logic cũ với updatedAt cho resolvedToday, và loại bỏ overdue nếu không có dueAt.
    resolvedToday: complaints.filter(
      (t) =>
        t.status === "resolved" && dayjs(t.updatedAt).isSame(dayjs(), "day")
    ).length,
    // Do ComplaintDetail không có dueAt, chúng ta không thể tính toán overdue dựa trên nó.
    // Nếu bạn muốn tính overdue, cần thêm trường dueAt vào ComplaintDetail ở backend.
    // Tạm thời, để giá trị 0 hoặc loại bỏ nếu không áp dụng.
    overdue: 0, // Giá trị tạm thời hoặc loại bỏ
    avgResponseTime: "2.5", // Giữ nguyên giá trị mock
    customerSatisfaction: 4.2, // Giữ nguyên giá trị mock
  };

  const handleTicketAction = (action: string, ticketId: number) => {
    // id là number
    message.success(`${action} ticket ${ticketId}`);
    // Sau khi xử lý action (ví dụ: cập nhật ticket), bạn có thể fetch lại data
    // fetchComplaints(); // Nếu cần refresh danh sách sau mỗi hành động
  };

  const handleRefresh = () => {
    fetchComplaints(); // Gọi lại hàm fetch data khi refresh
  };

  // Modern minimal styles
  const containerStyle: React.CSSProperties = {
    padding: 24,
    background: "#f4f6f8",
    minHeight: "100%",
  };

  return (
    <div style={containerStyle}>
      <DashboardHeader onRefresh={handleRefresh} />

      <MetricsCard
        stats={stats}
        searchText={searchText}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchText}
        onStatusChange={setSelectedStatus}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Spin size="large" />
              <p style={{ marginTop: 16, color: "#999" }}>
                Đang tải yêu cầu...
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#ff4d4f",
              }}
            >
              <ExclamationCircleOutlined
                style={{ fontSize: 24, marginBottom: 8 }}
              />
              <div>Lỗi: {error}</div>
              <Button onClick={fetchComplaints} style={{ marginTop: 16 }}>
                Thử lại
              </Button>
            </div>
          ) : (
            <TicketsList
              tickets={filteredTickets}
              onTicketAction={handleTicketAction}
            />
          )}
        </Col>

        <Col xs={24} lg={8}>
          <DashboardSidebar
            customerSatisfaction={stats.customerSatisfaction}
            chatSessions={mockChatSessions}
            notifications={mockNotifications}
          />
        </Col>
      </Row>
    </div>
  );
};
