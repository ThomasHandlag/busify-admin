/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, message, Spin, Button, Form } from "antd"; // Thêm Form
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { MetricsCard } from "../components/MetricsCard";
import { TicketsList } from "../components/TicketsList";
import { DashboardSidebar } from "../components/DashboardSidebar";
import type { ChatSession } from "../types";
import {
  getComplaintByAgent,
  type ComplaintDetail,
  updateComplaintStatus, // Giả định API này tồn tại để cập nhật trạng thái
} from "../../../app/api/complaint";
import { DashboardHeader } from "../components/DashboardHeader";
import ComplaintDetailModal from "../../complaints-management/components/ComplaintDetailModal";
import MailSenderModal from "../../../components/MailSenderModal"; // Thêm import

export const DashboardWithCustomerService = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  const [complaints, setComplaints] = useState<ComplaintDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Thêm state cho modal gửi email
  const [isMailModalVisible, setIsMailModalVisible] = useState(false);
  const [selectedTicketForEmail, setSelectedTicketForEmail] =
    useState<ComplaintDetail | null>(null);
  const [mailForm] = Form.useForm(); // Form instance cho modal

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getComplaintByAgent();

      if (response.code === 200) {
        setComplaints(response.result);
      } else {
        const errorMessage =
          response.message || "Không thể tải danh sách khiếu nại.";
        setError(errorMessage);
        message.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Đã xảy ra lỗi không mong muốn khi tải dữ liệu.";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

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

  const filteredTickets = complaints.filter((ticket) => {
    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesSearch =
      searchText === "" ||
      ticket.customer.customerName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.id.toString().toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalOpen: complaints.filter((t) => t.status === "open").length,
    inProgress: complaints.filter((t) => t.status === "in_progress").length,
    resolvedToday: complaints.filter(
      (t) =>
        t.status === "resolved" && dayjs(t.updatedAt).isSame(dayjs(), "day")
    ).length,
    overdue: 0,
    avgResponseTime: "2.5",
    customerSatisfaction: 4.2,
  };

  const handleTicketAction = (
    action: string,
    ticketId: number,
    extra?: any
  ) => {
    if (action === "View") {
      const complaint = complaints.find((c) => c.id === ticketId);
      if (complaint) {
        setSelectedComplaint(complaint);
        setIsModalVisible(true);
      } else {
        message.error("Không tìm thấy khiếu nại");
      }
    } else if (action === "SendEmail") {
      const complaint = complaints.find((c) => c.id === ticketId);
      if (complaint) {
        setSelectedTicketForEmail(complaint);
        setIsMailModalVisible(true);
      } else {
        message.error("Không tìm thấy khiếu nại để gửi email");
      }
    } else if (action === "ChangeStatus") {
      // Cập nhật trạng thái local
      setComplaints((prev) =>
        prev.map((c) => (c.id === ticketId ? { ...c, status: extra } : c))
      );
      // Gọi API để cập nhật trạng thái (giả định)
      updateComplaintStatus(ticketId, extra)
        .then(() =>
          message.success(
            `Trạng thái khiếu nại ${ticketId} đã được cập nhật thành ${extra}`
          )
        )
        .catch(() => message.error("Lỗi khi cập nhật trạng thái"));
    } else {
      message.success(`${action} ticket ${ticketId}`);
    }
  };

  // Hàm xử lý khi gửi email thành công
  const handleEmailSuccess = () => {
    fetchComplaints(); // Refresh danh sách khiếu nại
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedComplaint(null);
  };

  const handleRefresh = () => {
    fetchComplaints();
  };

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
          />
        </Col>
      </Row>

      <ComplaintDetailModal
        complaint={selectedComplaint}
        visible={isModalVisible}
        onClose={handleModalClose}
      />

      {/* Thêm MailSenderModal */}
      <MailSenderModal
        isVisible={isMailModalVisible}
        setIsVisible={setIsMailModalVisible}
        form={mailForm}
        defaultRecipient={selectedTicketForEmail?.customer?.customerEmail || ""} // Giả định customer có email
        defaultSubject={`Phản hồi khiếu nại #${
          selectedTicketForEmail?.id || ""
        }`}
        defaultUserName={selectedTicketForEmail?.customer?.customerName || ""}
        caseNumber={selectedTicketForEmail?.id?.toString() || ""}
        csRepName="Admin" // Có thể lấy từ user hiện tại
        onSuccess={handleEmailSuccess}
      />
    </div>
  );
};
