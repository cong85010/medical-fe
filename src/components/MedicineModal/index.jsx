import React from "react";
import { Alert, Button, Flex, Modal, Table } from "antd";
import {
  FORMAT_DATE_MONGO,
  FORMAT_DATE_MONGO_ISO,
  FORMAT_DATE_TIME,
  STATUS_MEDICAL,
  formatedDate,
} from "src/utils";
import { getUsagesTable } from "src/utils/utilJsx";
import { ArrowRightOutlined } from "@ant-design/icons";

const MedicineModal = ({
  selected,
  visible,
  onCancel,
  isSales = false,
  onMove,
}) => {
  const columns = [
    {
      title: "Thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Cách dùng",
      dataIndex: "usage",
      key: "usage",
    },
  ];

  const dataSource = selected?.medicines.map((item) => ({
    key: item._id,
    name: item.name,
    quantity: `${item.quantity} viên`,
    usage: getUsagesTable(item.usage),
  }));

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
      <Table columns={columns} dataSource={dataSource} />
      <Flex justify="flex-end">
        {isSales ? (
          selected?.status === STATUS_MEDICAL.medicined ? (
            <Alert message="Đơn thuốc đã được kê toa" type="warning" showIcon />
          ) : (
            <Button
              type="primary"
              onClick={() => onMove(selected?.medicines)}
              icon={<ArrowRightOutlined />}
            >
              Kê toa theo đơn thuốc
            </Button>
          )
        ) : null}
      </Flex>
    </Modal>
  );
};

export default MedicineModal;
