import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getOrderByMedicalRecordId } from "src/api/order";
import {
  ColorsCustom,
  FORMAT_DATE_TIME,
  PAYMENT_ORDER_COLOR,
  PAYMENT_ORDER_STR,
  STATUS_ORDER_COLOR,
  STATUS_ORDER_STR,
  formatPrice,
  formatedDate,
  getSpecialtyName,
} from "src/utils";
import { CopyPhonenumber } from "../CopyPhone";
import SpaceDiv from "../SpaceDiv";
import { getUsagesTable } from "src/utils/utilJsx";

const ViewOrderModal = ({
  visible,
  onCancel,
  selectedOrder,
  medicalRecordId,
  hiddenFooter = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [medicinesAdded, setMedicinesAdded] = useState([]);
  const [order, setOrder] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchOrderByMedicalId = async () => {
      try {
        const { order: result } = await getOrderByMedicalRecordId(
          medicalRecordId
        );
        form.setFieldsValue({
          ...result,
          createdAt: dayjs(result.createdAt).format("DD/MM/YYYY HH:mm"),
        });
        setOrder(result);
      } catch (error) {
        console.error("Error fetching examination history:", error);
      }
    };

    if (visible && !selectedOrder) {
      fetchOrderByMedicalId();
    }
  }, [form, medicalRecordId, selectedOrder, visible]);

  useEffect(() => {
    if (visible && selectedOrder) {
      form.setFieldsValue({
        ...selectedOrder,
        createdAt: dayjs(selectedOrder.createdAt).format("DD/MM/YYYY HH:mm"),
      });
      setOrder(selectedOrder);
    }
  }, [form, selectedOrder, visible]);

  const columns = [
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      width: 120,
      title: "Cách dùng",
      dataIndex: "usage",
      key: "usage",
      align: "center",
      render: (usage) => getUsagesTable(usage),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "end",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "end",
      render: (price, record) => {
        return formatPrice(price);
      },
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 150,
      align: "end",
      render: (_, record) => {
        return formatPrice(record.price * record.quantity);
      },
    },
  ];

  const handleCancel = function () {
    setMedicinesAdded([]);
    onCancel();
  };

  const handlePrint = function () {
    window.print();
  };

  return (
    <Modal
      title={`Đơn hàng: ${order?.orderNumber}`}
      open={visible}
      onCancel={handleCancel}
      footer={
        hiddenFooter
          ? null
          : [
              <Button key="back" onClick={handleCancel}>
                Đóng
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handlePrint}
                loading={loading}
              >
                In hoá đơn
              </Button>,
            ]
      }
      okText="Thanh toán"
      cancelText="Hủy"
      centered
      width={800}
      styles={{
        body: { height: "80vh", overflowY: "auto" },
      }}
    >
      <Form
        form={form}
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 4 }}
        labelAlign="left"
        disabled
      >
        <Flex gap={20} align="center">
          <Flex align="center" style={{ width: "45%" }}>
            <Typography.Text strong>Ngày mua:</Typography.Text>
            <SpaceDiv width={10} />
            <Typography.Text>
              {formatedDate(
                dayjs(order?.createdAt),
                FORMAT_DATE_TIME,
                FORMAT_DATE_TIME
              )}
            </Typography.Text>
          </Flex>
          <Divider type="vertical" />
          {order?.medicalRecordId?.patientId ? (
            <Flex align="center">
              <Typography.Text strong>Bệnh nhân:</Typography.Text>
              <SpaceDiv width={10} />
              <Typography.Text>
                {order?.medicalRecordId?.patientId?.fullName}
              </Typography.Text>
              <Divider type="vertical" />
              <SpaceDiv width={10} />
              <Typography.Text>
                <CopyPhonenumber
                  phone={order?.medicalRecordId?.patientId?.phone}
                />
              </Typography.Text>
            </Flex>
          ) : order?.patientId ? (
            <Flex align="center">
              <Typography.Text strong>Bệnh nhân:</Typography.Text>
              <SpaceDiv width={10} />
              <Typography.Text>{order?.patientId?.fullName}</Typography.Text>
              <Divider type="vertical" />
              <SpaceDiv width={10} />
              <Typography.Text>
                <CopyPhonenumber phone={order?.patientId?.phone} />
              </Typography.Text>
            </Flex>
          ) : null}
        </Flex>
        <SpaceDiv height={20} />
        <Flex gap={20} align="center">
          <Flex align="center" style={{ width: "45%" }}>
            <Typography.Text strong>Thu ngân:</Typography.Text>
            <SpaceDiv width={10} />
            <Typography.Text>{order?.salesId?.fullName}</Typography.Text>
            <Divider type="vertical" />
            <Typography.Text>
              <CopyPhonenumber phone={order?.salesId?.phone} />
            </Typography.Text>
          </Flex>
          <Divider type="vertical" />
          {order?.medicalRecordId?.doctorId && (
            <Flex align="center">
              <Typography.Text strong>Bác sĩ:</Typography.Text>
              <SpaceDiv width={10} />
              <Typography.Text>
                {order?.medicalRecordId?.doctorId?.fullName}
              </Typography.Text>
              <Divider type="vertical" />
              <SpaceDiv width={10} />
              <Typography.Text>
                {getSpecialtyName(order?.medicalRecordId?.doctorId?.specialty)}
              </Typography.Text>
            </Flex>
          )}
        </Flex>

        <SpaceDiv height={20} />
        <Table
          className="table-view-order"
          rowKey="_id"
          columns={columns}
          dataSource={order?.medicines}
          pagination={false}
          footer={() => (
            <Flex
              justify="flex-end"
              align="center"
              style={{ textAlign: "right" }}
            >
              <b>Tổng tiền:</b>{" "}
              <Typography.Text
                style={{
                  color: ColorsCustom.primary,
                  width: 120,
                  textAlign: "end",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {formatPrice(order?.totalPrice)}
              </Typography.Text>
            </Flex>
          )}
        />
        <SpaceDiv height={20} />
        <Flex gap={10} style={{ minHeight: 80 }}>
          <Typography.Text strong>Ghi chú:</Typography.Text>
          <Typography.Paragraph>{order.note || "Không"}</Typography.Paragraph>
        </Flex>
        <Flex>
          <Typography.Text strong>Thanh toán:</Typography.Text>
          <SpaceDiv width={10} />
          <Tag
            style={{ fontSize: 17 }}
            color={PAYMENT_ORDER_COLOR[order?.paymentMethod]}
          >
            {PAYMENT_ORDER_STR[order?.paymentMethod]}
          </Tag>
        </Flex>
        <SpaceDiv height={20} />
        <Flex>
          <Typography.Text strong>Trạng thái:</Typography.Text>
          <SpaceDiv width={10} />
          <Tag
            style={{ fontSize: 17 }}
            color={STATUS_ORDER_COLOR[order?.status]}
          >
            {STATUS_ORDER_STR[order?.status]}
          </Tag>
        </Flex>
      </Form>
    </Modal>
  );
};

export default ViewOrderModal;
