import { Descriptions, Modal } from "antd";
import React from "react";

export default function ViewModalRecordModal({
  visible,
  onCancel,
  selectedRecord,
}) {
  return (
    <Modal
      title="Chi tiết bệnh án"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      {selectedRecord && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{selectedRecord.id}</Descriptions.Item>
          <Descriptions.Item label="Tên bệnh nhân">
            {selectedRecord.patientName}
          </Descriptions.Item>
          <Descriptions.Item label="Tuổi">
            {selectedRecord.age}
          </Descriptions.Item>
          <Descriptions.Item label="Chuẩn đoán">
            {selectedRecord.diagnosis}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {selectedRecord.address}
          </Descriptions.Item>
          <Descriptions.Item label="Bác sĩ điều trị">
            {selectedRecord.treatingDoctor}
          </Descriptions.Item>
          {/* Thêm các thông tin khác nếu cần */}
        </Descriptions>
      )}
    </Modal>
  );
}
