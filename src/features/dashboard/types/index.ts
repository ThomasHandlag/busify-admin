export interface Ticket {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  type: "cancel" | "refund" | "change" | "complaint" | "other";
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
}

export interface Notification {
  id: string;
  type: "sla_breach" | "new_ticket" | "chat_waiting" | "system_error";
  message: string;
  time: string;
  severity: "info" | "warning" | "error";
}
