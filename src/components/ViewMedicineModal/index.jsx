import React, { useEffect, useState } from "react";
import { Modal, Typography, List, Table, Space, Tag } from "antd";
const columns = [
  {
    title: "Tên thuốc",
    dataIndex: "medicineName",
    key: "medicineName",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Trước/Sau ăn",
    dataIndex: "usage",
    key: "usage",
    render: (usage) => (
      <Tag color={usage === "before" ? "green" : "volcano"}>{usage}</Tag>
    ),
  },
  {
    title: "Sáng",
    dataIndex: "morning",
    key: "morning",
  },
  {
    title: "Trưa",
    dataIndex: "noon",
    key: "noon",
  },
  {
    title: "Chiều",
    dataIndex: "evening",
    key: "evening",
  },
];

const ViewMedicineModal = ({ visible, onCancel, medicalRecord }) => {
  const [medications, setMedications] = useState([
    {
      medicineName: "Paracetamol",
      quantity: 10,
      timing: "Trước ăn",
      morning: "1 viên",
      noon: "1 viên",
      evening: "2 viên",
    },
    {
      medicineName: "Ibuprofen",
      quantity: 20,
      timing: "Sau ăn",
      morning: "2 viên",
      noon: "1 viên",
      evening: "1 viên",
    },
    // Add more medication objects as needed
  ]);

  useEffect(() => {
    // Fetch API get medicineInfo
  }, [medicalRecord]);
  return (
    <Modal
      destroyOnClose
      title="Thông tin thuốc"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Table
        dataSource={medications}
        columns={columns}
        rowKey="medicineName"
      
      />
    </Modal>
  );
};

export default ViewMedicineModal;
