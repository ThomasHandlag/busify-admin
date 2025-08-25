export const getTypeColor = (type: string) => {
  switch (type) {
    case "cancel":
      return "orange";
    case "refund":
      return "red";
    case "change":
      return "blue";
    case "complaint":
      return "purple";
    default:
      return "default";
  }
};

export const getTypeText = (type: string) => {
  switch (type) {
    case "cancel":
      return "Hủy vé";
    case "refund":
      return "Hoàn tiền";
    case "change":
      return "Đổi vé";
    case "complaint":
      return "Khiếu nại";
    default:
      return "Khác";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "red";
    case "in_progress":
      return "blue";
    case "resolved":
      return "green";
    case "closed":
      return "default";
    default:
      return "default";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "open":
      return "Mới";
    case "in_progress":
      return "Đang xử lý";
    case "resolved":
      return "Đã giải quyết";
    case "closed":
      return "Đã đóng";
    default:
      return status;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "#f5222d";
    case "high":
      return "#fa8c16";
    case "medium":
      return "#faad14";
    case "low":
      return "#52c41a";
    default:
      return "#d9d9d9";
  }
};
