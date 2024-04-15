import React from "react";
import { Modal } from "antd";
import { FORMAT_DATE_MONGO, FORMAT_DATE_MONGO_ISO, FORMAT_DATE_TIME, formatedDate } from "src/utils";

const MedicineModal = ({ selected, visible, onCancel }) => {
  return (
    <Modal
      title={`Đơn thuốc ngày: ${formatedDate(
        selected?.createdAt,
        FORMAT_DATE_MONGO_ISO,
        FORMAT_DATE_TIME
      )}`}
      centered
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      {selected?.medicines.map((item) => (
        <div key={item._id}>
          <p>
            {item.name} - {item.quantity} viên -{" "}
            {item.affterEat ? "Sau khi ăn" : "Trước khi ăn"}
          </p>
        </div>
      ))}
    </Modal>
  );
};

export default MedicineModal;
