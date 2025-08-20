import React, { useState } from "react";
import { Col, Row, message } from "antd";
import dayjs from "dayjs";
import { DashboardHeader } from "../components/DashboardHeader";
import { MetricsCard } from "../components/MetricsCard";
import { TicketsList } from "../components/TicketsList";
import { DashboardSidebar } from "../components/DashboardSidebar";
import type { Ticket, Notification, ChatSession } from "../types";

export const DashboardWithCustomerService = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  // Mock data
  const mockTickets: Ticket[] = [
    {
      id: "TK001",
      customerName: "Nguyễn Văn An",
      phone: "0912345678",
      email: "an.nguyen@email.com",
      type: "cancel",
      status: "open",
      priority: "high",
      subject: "Yêu cầu hủy vé do thay đổi lịch trình",
      description:
        "Khách hàng cần hủy vé chuyến đi ngày 15/12 do có việc đột xuất",
      createdAt: "2024-12-10T08:30:00",
      updatedAt: "2024-12-10T08:30:00",
      dueAt: "2024-12-10T17:30:00",
    },
    {
      id: "TK002",
      customerName: "Trần Thị Bình",
      phone: "0987654321",
      email: "binh.tran@email.com",
      type: "refund",
      status: "in_progress",
      priority: "medium",
      subject: "Hoàn tiền sau khi hủy chuyến",
      description:
        "Chuyến xe bị hủy do thời tiết, khách hàng yêu cầu hoàn tiền",
      createdAt: "2024-12-09T14:20:00",
      updatedAt: "2024-12-10T09:15:00",
      dueAt: "2024-12-11T14:20:00",
    },
    {
      id: "TK003",
      customerName: "Lê Minh Cường",
      phone: "0923456789",
      email: "cuong.le@email.com",
      type: "complaint",
      status: "open",
      priority: "urgent",
      subject: "Khiếu nại về chất lượng dịch vụ",
      description: "Xe đến muộn 2 tiếng, tài xế thái độ không tốt",
      createdAt: "2024-12-10T07:45:00",
      updatedAt: "2024-12-10T07:45:00",
      dueAt: "2024-12-10T15:45:00",
    },
    {
      id: "TK004",
      customerName: "Phạm Thị Dung",
      phone: "0934567890",
      email: "dung.pham@email.com",
      type: "change",
      status: "resolved",
      priority: "low",
      subject: "Đổi vé sang chuyến khác",
      description: "Khách hàng muốn đổi từ chuyến 8:00 sang chuyến 10:00",
      createdAt: "2024-12-09T16:30:00",
      updatedAt: "2024-12-10T10:00:00",
      dueAt: "2024-12-11T16:30:00",
    },
    {
      id: "TK005",
      customerName: "Võ Văn Em",
      phone: "0945678901",
      email: "em.vo@email.com",
      type: "other",
      status: "closed",
      priority: "low",
      subject: "Hỏi thông tin lịch trình",
      description: "Khách hàng muốn biết thông tin chi tiết về điểm đón",
      createdAt: "2024-12-08T11:15:00",
      updatedAt: "2024-12-09T09:30:00",
      dueAt: "2024-12-09T11:15:00",
    },
  ];

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

  // Filter tickets based on status and search
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesSearch =
      searchText === "" ||
      ticket.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    totalOpen: mockTickets.filter((t) => t.status === "open").length,
    inProgress: mockTickets.filter((t) => t.status === "in_progress").length,
    resolvedToday: mockTickets.filter(
      (t) =>
        t.status === "resolved" && dayjs(t.updatedAt).isSame(dayjs(), "day")
    ).length,
    overdue: mockTickets.filter(
      (t) =>
        (t.status === "open" || t.status === "in_progress") &&
        dayjs().isAfter(dayjs(t.dueAt))
    ).length,
    avgResponseTime: "2.5",
    customerSatisfaction: 4.2,
  };

  const handleTicketAction = (action: string, ticketId: string) => {
    message.success(`${action} ticket ${ticketId}`);
  };

  const handleRefresh = () => {
    // Add refresh logic here
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
          <TicketsList
            tickets={filteredTickets}
            onTicketAction={handleTicketAction}
          />
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

  