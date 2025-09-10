import React from "react";
import { Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flexDirection: "column",
        gap: "20px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div
        style={{
          padding: "40px",
          background: "#fff",
          borderRadius: "50%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <MessageOutlined style={{ fontSize: "64px", color: "#d9d9d9" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography.Text
          style={{
            fontSize: "18px",
            color: "#262626",
            display: "block",
            marginBottom: "8px",
          }}
        >
          {title}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: "14px" }}>
          {description}
        </Typography.Text>
      </div>
    </div>
  );
};
