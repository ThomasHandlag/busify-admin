import {
  Button,
  Form,
  message,
  Modal,
  Select,
  Space,
  type FormInstance,
} from "antd";
import React from "react";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  contractsApi,
  ReviewAction,
  type ContractData,
  type ReviewContractRequest,
} from "../../app/api/contracts";

interface ModalReviewProps {
  isReviewModalVisible: boolean;
  setIsReviewModalVisible: (visible: boolean) => void;
  selectedContract: ContractData | null;
  reviewForm: FormInstance;
}

const ModalReview: React.FC<ModalReviewProps> = ({
  isReviewModalVisible,
  setIsReviewModalVisible,
  selectedContract,
  reviewForm,
}) => {
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: ({
      contractId,
      data,
    }: {
      contractId: number;
      data: ReviewContractRequest;
    }) => {
      const response = contractsApi.reviewContract(contractId, data);
      return response;
    },
    onSuccess: (response, contract) => {
      if (response.code === 200) {
        message.success("Đánh giá hợp đồng thành công");
        queryClient.setQueryData(["contract", contract.contractId], contract);
        queryClient.invalidateQueries({ queryKey: ["contracts"] });
        setIsReviewModalVisible(false);
        reviewForm.resetFields();
      } else {
        message.error(response.message || "Đánh giá hợp đồng thất bại");
      }
    },
    onError: (error) => {
      console.error("Review contract error:", error);
      message.error("Có lỗi xảy ra khi đánh giá hợp đồng!");
    },
  });

  const handleReviewSubmit = (values: {
    action: ReviewAction;
    adminNote?: string;
  }) => {
    if (!selectedContract) return;

    reviewMutation.mutate({
      contractId: selectedContract.id,
      data: {
        action: values.action,
        adminNote: values.adminNote,
      },
    });
  };

  return (
    <Modal
      title="Đánh giá Hợp đồng"
      open={isReviewModalVisible}
      onCancel={() => {
        setIsReviewModalVisible(false);
        reviewForm.resetFields();
      }}
      footer={null}
      width={600}
    >
      {selectedContract && (
        <>
          <div style={{ marginBottom: 16 }}>
            <strong>Hợp đồng:</strong> {selectedContract.vatCode} -{" "}
            {selectedContract.email}
          </div>
          <Form
            form={reviewForm}
            layout="vertical"
            onFinish={handleReviewSubmit}
            initialValues={{
              action: ReviewAction.APPROVE,
            }}
          >
            <Form.Item
              name="action"
              label="Hành động"
              rules={[{ required: true, message: "Vui lòng chọn hành động!" }]}
            >
              <Select placeholder="Chọn hành động">
                <Select.Option value={ReviewAction.APPROVE}>
                  <CheckOutlined style={{ color: "green", marginRight: 8 }} />
                  Phê duyệt
                </Select.Option>
                <Select.Option value={ReviewAction.REJECT}>
                  <CloseOutlined style={{ color: "red", marginRight: 8 }} />
                  Từ chối
                </Select.Option>
                <Select.Option value={ReviewAction.REQUEST_REVISION}>
                  <EditOutlined style={{ color: "orange", marginRight: 8 }} />
                  Yêu cầu chỉnh sửa
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="adminNote"
              label="Ghi chú admin"
              rules={[
                {
                  validator: (_, value) => {
                    const action = reviewForm.getFieldValue("action");
                    if (
                      (action === ReviewAction.REJECT ||
                        action === ReviewAction.REQUEST_REVISION) &&
                      !value
                    ) {
                      return Promise.reject(
                        new Error(
                          "Vui lòng nhập ghi chú khi từ chối hoặc yêu cầu chỉnh sửa!"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập ghi chú admin (bắt buộc khi từ chối hoặc yêu cầu chỉnh sửa)"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button
                  onClick={() => {
                    setIsReviewModalVisible(false);
                    reviewForm.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={reviewMutation.isPending}
                >
                  Xác nhận
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default ModalReview;
