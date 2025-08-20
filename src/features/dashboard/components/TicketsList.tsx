import React from "react";
import { Card, Typography, Avatar, Tag, Button, Space } from "antd";
import {
  PhoneOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { Ticket } from "../types";
import {
  getTypeColor,
  getTypeText,
  getStatusColor,
  getStatusText,
  getPriorityColor,
} from "../utils/ticketUtils";

interface TicketsListProps {
  tickets: Ticket[];
  onTicketAction: (action: string, ticketId: string) => void;
}

export const TicketsList: React.FC<TicketsListProps> = ({
  tickets,
  onTicketAction,
}) => {
  const ticketCardStyle: React.CSSProperties = {
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(20,20,30,0.04)",
    overflow: "hidden",
    background: "#fff",
  };

  return (
    <Card
      style={{
        ...ticketCardStyle,
        border: "1px solid #f0f0f0",
        background: "#fafafa",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          Danh sách yêu cầu ({tickets.length})
        </Typography.Title>
      </div>
      <div style={{ padding: "8px 0" }}>
        {tickets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#999",
            }}
          >
            <SearchOutlined style={{ fontSize: 24, marginBottom: 8 }} />
            <div>Không có yêu cầu phù hợp</div>
          </div>
        ) : (
          tickets.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f5f5f5",
                background: "#fff",
                margin: "0 8px 8px",
                borderRadius: 8,
                border: "1px solid #f0f0f0",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = "#d9d9d9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#f0f0f0";
              }}
            >
              {/* Header Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 6,
                    }}
                  >
                    <Typography.Text
                      strong
                      style={{
                        fontSize: 15,
                        color: "#262626",
                      }}
                    >
                      {item.subject}
                    </Typography.Text>
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        backgroundColor: getPriorityColor(item.priority),
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <Tag
                      color={getTypeColor(item.type)}
                      style={{
                        margin: 0,
                        fontSize: 11,
                        borderRadius: 4,
                        fontWeight: 500,
                      }}
                    >
                      {getTypeText(item.type)}
                    </Tag>

                    <Tag
                      color={getStatusColor(item.status)}
                      style={{
                        margin: 0,
                        fontSize: 11,
                        borderRadius: 4,
                        fontWeight: 500,
                      }}
                    >
                      {getStatusText(item.status)}
                    </Tag>

                    <div
                      style={{
                        height: 12,
                        width: 1,
                        backgroundColor: "#f0f0f0",
                      }}
                    />

                    <Typography.Text
                      style={{
                        fontSize: 12,
                        color: "#8c8c8c",
                      }}
                    >
                      #{item.id}
                    </Typography.Text>
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    minWidth: 80,
                  }}
                >
                  <Typography.Text
                    style={{
                      fontSize: 11,
                      color: "#999",
                      display: "block",
                    }}
                  >
                    Tạo lúc
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#595959",
                    }}
                  >
                    {dayjs(item.createdAt).format("DD/MM HH:mm")}
                  </Typography.Text>
                </div>
              </div>

              {/* Customer Info Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                  padding: "8px 12px",
                  backgroundColor: "#fafafa",
                  borderRadius: 6,
                }}
              >
                <Avatar
                  size={32}
                  style={{
                    backgroundColor: "#f0f2f5",
                    color: "#595959",
                    fontWeight: 600,
                  }}
                >
                  {item.customerName.split(" ").slice(-1)[0].charAt(0)}
                </Avatar>

                <div style={{ flex: 1 }}>
                  <Typography.Text
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#262626",
                      display: "block",
                    }}
                  >
                    {item.customerName}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      fontSize: 12,
                      color: "#8c8c8c",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <PhoneOutlined style={{ fontSize: 11 }} />
                    {item.phone}
                  </Typography.Text>
                </div>

                <div style={{ textAlign: "right" }}>
                  <Typography.Text
                    style={{
                      fontSize: 11,
                      color: "#999",
                    }}
                  >
                    Hạn xử lý
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: dayjs().isAfter(dayjs(item.dueAt))
                        ? "#ff4d4f"
                        : "#52c41a",
                      display: "block",
                    }}
                  >
                    {dayjs(item.dueAt).format("DD/MM HH:mm")}
                  </Typography.Text>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 12 }}>
                <Typography.Text
                  style={{
                    fontSize: 13,
                    color: "#595959",
                    lineHeight: 1.4,
                    display: "block",
                  }}
                >
                  {item.description.length > 100
                    ? `${item.description.substring(0, 100)}...`
                    : item.description}
                </Typography.Text>
              </div>

              {/* Action Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 8,
                  borderTop: "1px solid #f5f5f5",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 4,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${
                          item.priority === "urgent"
                            ? 100
                            : item.priority === "high"
                            ? 75
                            : item.priority === "medium"
                            ? 50
                            : 25
                        }%`,
                        height: "100%",
                        backgroundColor: getPriorityColor(item.priority),
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <Typography.Text
                    style={{
                      fontSize: 10,
                      color: "#999",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  >
                    {item.priority}
                  </Typography.Text>
                </div>

                <Space size="small">
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTicketAction("View", item.id);
                    }}
                    style={{
                      color: "#595959",
                      fontSize: 12,
                      height: 28,
                      padding: "0 8px",
                    }}
                  >
                    Xem
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTicketAction("Process", item.id);
                    }}
                    style={{
                      color: "#1890ff",
                      fontSize: 12,
                      height: 28,
                      padding: "0 8px",
                      fontWeight: 500,
                    }}
                  >
                    Xử lý
                  </Button>
                </Space>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
