/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, message, Spin, Button, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MetricsCard } from "../components/MetricsCard";
import { TicketsList } from "../components/TicketsList";
import { DashboardSidebar } from "../components/DashboardSidebar";
import {
  getComplaintByAgent,
  type ComplaintDetail,
  updateComplaintStatus,
  getComplaintStatsForCurrentAgent,
  getDailyComplaintStatsForCurrentAgent,
} from "../../../app/api/complaint";
import { DashboardHeader } from "../components/DashboardHeader";
import ComplaintDetailModal from "../../complaints-management/components/ComplaintDetailModal";
import MailSenderModal from "../../../components/MailSenderModal";
import type { ChatSession } from "../../../app/api/chat";
import { fetchRecentChatSessions } from "../../../app/api/chat";
import { useWebSocket } from "../../../app/provider/WebSocketContext";
import type { ChatNotification } from "../../../app/service/WebSocketService";

export const DashboardWithCustomerService = () => {
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isMailModalVisible, setIsMailModalVisible] = useState(false);
  const [selectedTicketForEmail, setSelectedTicketForEmail] =
    useState<ComplaintDetail | null>(null);
  const [mailForm] = Form.useForm();

  // --- Tích hợp React Query cho Khiếu nại ---
  const {
    data: complaints = [],
    isLoading: isLoadingComplaints,
    isError: isErrorComplaints,
    error: errorComplaints,
  } = useQuery<ComplaintDetail[], Error>({
    queryKey: ["complaints", "agent"],
    queryFn: async () => {
      const response = await getComplaintByAgent();
      if (response.code !== 200) {
        throw new Error(
          response.message || "Không thể tải danh sách khiếu nại."
        );
      }
      return response.result;
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ["complaintStats", "agent"],
    queryFn: async () => {
      const [statsResponse, dailyStatsResponse] = await Promise.all([
        getComplaintStatsForCurrentAgent(),
        getDailyComplaintStatsForCurrentAgent(),
      ]);
      if (statsResponse.code !== 200 || dailyStatsResponse.code !== 200) {
        console.error("Failed to fetch stats");
        return { stats: null, dailyStats: null };
      }
      return {
        stats: statsResponse.result,
        dailyStats: dailyStatsResponse.result,
      };
    },
  });

  const { stats, dailyStats } = statsData || {
    stats: null,
    dailyStats: null,
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: number; status: string }) =>
      updateComplaintStatus(ticketId, status),
    onSuccess: (_, variables) => {
      message.success(
        `Trạng thái khiếu nại #${variables.ticketId} đã được cập nhật.`
      );
      queryClient.invalidateQueries({ queryKey: ["complaints", "agent"] });
      queryClient.invalidateQueries({ queryKey: ["complaintStats", "agent"] });
    },
    onError: (error: Error, variables) => {
      message.error(
        `Lỗi khi cập nhật khiếu nại #${variables.ticketId}: ${error.message}`
      );
    },
  });
  // --- Kết thúc tích hợp React Query ---

  // State và logic cho Chat vẫn giữ nguyên
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(true);
  const [chatError, setChatError] = useState<string | null>(null);
  const { addNotificationHandler, removeNotificationHandler } = useWebSocket();

  const fetchChatSessions = useCallback(async () => {
    setChatLoading(true);
    setChatError(null);
    try {
      const sessions = await fetchRecentChatSessions();
      setChatSessions(sessions);
    } catch (err: any) {
      const errorMessage =
        err.message || "Không thể tải danh sách chat sessions.";
      setChatError(errorMessage);
      message.error(errorMessage);
    } finally {
      setChatLoading(false);
    }
  }, []);

  const handleChatNotification = useCallback(
    (notification: ChatNotification) => {
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === notification.roomId
            ? {
                ...chat,
                lastMessage: notification.contentPreview,
                lastMessageTime: notification.timestamp,
                unreadCount: (chat.unreadCount || 0) + 1,
              }
            : chat
        )
      );
    },
    []
  );

  useEffect(() => {
    fetchChatSessions();
  }, [fetchChatSessions]);

  useEffect(() => {
    addNotificationHandler(handleChatNotification);
    return () => {
      removeNotificationHandler(handleChatNotification);
    };
  }, [
    addNotificationHandler,
    removeNotificationHandler,
    handleChatNotification,
  ]);

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

  const metrics = {
    new: dailyStats?.inProgressCount ?? 0,
    pending: stats?.pending ?? 0,
    inProgress: stats?.in_progress ?? 0,
    resolved: stats?.resolved ?? 0,
    rejected: stats?.rejected ?? 0,
    resolvedToday: dailyStats?.resolvedCount ?? 0,
    avgResponseTime: "2.5",
    customerSatisfaction: 4.2,
  };

  const handleTicketAction = (
    action: string,
    ticketId: number,
    extra?: any
  ) => {
    const complaint = complaints.find((c) => c.id === ticketId);
    if (!complaint) {
      message.error("Không tìm thấy khiếu nại");
      return;
    }

    if (action === "View") {
      setSelectedComplaint(complaint);
      setIsModalVisible(true);
    } else if (action === "SendEmail") {
      setSelectedTicketForEmail(complaint);
      setIsMailModalVisible(true);
    } else if (action === "ChangeStatus") {
      updateStatusMutation.mutate({ ticketId, status: extra });
    } else {
      message.success(`${action} ticket ${ticketId}`);
    }
  };

  const handleEmailSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["complaints", "agent"] });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedComplaint(null);
  };

  const handleRefresh = () => {
    message.loading("Đang làm mới...", 0.5);
    queryClient.invalidateQueries({ queryKey: ["complaints", "agent"] });
    queryClient.invalidateQueries({ queryKey: ["complaintStats", "agent"] });
    fetchChatSessions(); // Chat chưa dùng react-query nên gọi thủ công
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
        stats={metrics}
        searchText={searchText}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchText}
        onStatusChange={setSelectedStatus}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          {isLoadingComplaints ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Spin size="large" />
              <p style={{ marginTop: 16, color: "#999" }}>
                Đang tải yêu cầu...
              </p>
            </div>
          ) : isErrorComplaints ? (
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
              <div>Lỗi: {errorComplaints.message}</div>
              <Button
                onClick={() =>
                  queryClient.refetchQueries({
                    queryKey: ["complaints", "agent"],
                  })
                }
                style={{ marginTop: 16 }}
              >
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
            customerSatisfaction={metrics.customerSatisfaction}
            chatSessions={chatSessions}
            chatLoading={chatLoading}
            chatError={chatError}
          />
        </Col>
      </Row>

      <ComplaintDetailModal
        complaint={selectedComplaint}
        visible={isModalVisible}
        onClose={handleModalClose}
      />

      <MailSenderModal
        isVisible={isMailModalVisible}
        setIsVisible={setIsMailModalVisible}
        form={mailForm}
        defaultRecipient={selectedTicketForEmail?.customer?.customerEmail || ""}
        defaultSubject={`Phản hồi khiếu nại #${
          selectedTicketForEmail?.id || ""
        }`}
        defaultUserName={selectedTicketForEmail?.customer?.customerName || ""}
        caseNumber={selectedTicketForEmail?.id?.toString() || ""}
        csRepName="Admin"
        onSuccess={handleEmailSuccess}
      />
    </div>
  );
};
