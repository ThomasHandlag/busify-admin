import { Button, Descriptions, Modal, Tag } from "antd";
import React from "react";
import { ContractStatus, type ContractData } from "../../app/api/contracts";

interface ModalDetailProps {
  isDetailModalVisible: boolean;
  setIsDetailModalVisible: (visible: boolean) => void;
  selectedContract: ContractData | null;
}

const getStatusTagColor = (status: ContractStatus): string => {
  switch (status) {
    case ContractStatus.PENDING:
      return "warning";
    case ContractStatus.ACCEPTED:
      return "success";
    case ContractStatus.REJECTED:
      return "error";
    default:
      return "default";
  }
};

const getStatusText = (status: ContractStatus): string => {
  switch (status) {
    case ContractStatus.PENDING:
      return "Chờ duyệt";
    case ContractStatus.ACCEPTED:
      return "Đã duyệt";
    case ContractStatus.REJECTED:
      return "Từ chối";
    default:
      return status;
  }
};

const ModalDetail = ({
  isDetailModalVisible,
  setIsDetailModalVisible,
  selectedContract,
}: ModalDetailProps) => {
  return (
    <Modal
      title="Chi tiết Hợp đồng"
      open={isDetailModalVisible}
      onCancel={() => setIsDetailModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      {selectedContract && (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="ID" span={2}>
            {selectedContract.id}
          </Descriptions.Item>
          <Descriptions.Item label="Mã số thuế">
            {selectedContract.vatCode}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {selectedContract.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {selectedContract.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>
            {selectedContract.address}
          </Descriptions.Item>
          <Descriptions.Item label="Khu vực hoạt động" span={2}>
            {selectedContract.operationArea}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu">
            {new Date(selectedContract.startDate).toLocaleDateString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">
            {new Date(selectedContract.endDate).toLocaleDateString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusTagColor(selectedContract.status)}>
              {getStatusText(selectedContract.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(selectedContract.createdDate).toLocaleString("vi-VN")}
          </Descriptions.Item>
          {selectedContract.approvedDate && (
            <Descriptions.Item label="Ngày duyệt">
              {new Date(selectedContract.approvedDate).toLocaleString("vi-VN")}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Ngày cập nhật">
            {new Date(selectedContract.updatedDate).toLocaleString("vi-VN")}
          </Descriptions.Item>
          {selectedContract.adminNote && (
            <Descriptions.Item label="Ghi chú admin" span={2}>
              {selectedContract.adminNote}
            </Descriptions.Item>
          )}
          {selectedContract.attachmentUrl && (
            <Descriptions.Item label="Tài liệu đính kèm" span={2}>
              <a
                href={selectedContract.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem tài liệu
              </a>
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
};

export default ModalDetail;
