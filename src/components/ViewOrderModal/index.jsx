import {
  Upload,
  Modal,
  Form,
  Input,
  InputNumber,
  Table,
  Space,
  Checkbox,
  Button,
  Tooltip,
  Flex,
  notification,
  message,
  Typography,
  Divider,
  Select,
  Popconfirm,
  Tag,
  Radio,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  FORMAT_DATE_TIME,
  PAYMENT_ORDER_COLOR,
  PAYMENT_ORDER_STR,
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  STATUS_ORDER_COLOR,
  STATUS_ORDER_STR,
  beforeUpload,
  formatPrice,
  formatedDate,
  getBase64,
} from "src/utils";
import { getListMedicine } from "src/api/medicine";
import { DebounceSelect } from "../DeboundSelect";
import { updateStatusAppointment } from "src/api/appointment";
import {
  createMedicalRecord,
  updateMedicalRecord,
} from "src/api/medicalRecord";
import { uploadFile, uploadFiles } from "src/api/upload";
import SpaceDiv from "../SpaceDiv";
import { createOrder, getOrderByMedicalRecordId } from "src/api/order";
import dayjs from "dayjs";
import { CopyPhonenumber } from "../CopyPhone";

const ViewOrderModal = ({ visible, onCancel, medicalRecordId }) => {
  const [loading, setLoading] = useState(false);
  const [medicinesAdded, setMedicinesAdded] = useState([]);
  const [order, setOrder] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchOrderByMedicalId = async () => {
      try {
        const { order: result } = await getOrderByMedicalRecordId(
          medicalRecordId
        );
        form.setFieldsValue({
          ...result,
          salesFullname: result.salesId.fullName,
          createdAt: dayjs(result.createdAt).format("DD/MM/YYYY HH:mm"),
        });
        setOrder(result);
      } catch (error) {
        console.error("Error fetching examination history:", error);
      }
    };

    if (visible) {
      fetchOrderByMedicalId();
    }
  }, [form, medicalRecordId, visible]);

  const columns = [
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      width: 120,
      title: "Cách dùng",
      dataIndex: "affterEat",
      key: "affterEat",
      align: "center",
      render: (affterEat, record) => {
        return <Space>{affterEat ? "Sau khi ăn" : "Trước khi ăn"}</Space>;
      },
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

  return (
    <Modal
      title={`Đơn hàng: ${order?.orderNumber}`}
      open={visible}
      onCancel={handleCancel}
      footer={null}
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
          <Flex align="center">
            <Typography.Text strong>Ngày tạo:</Typography.Text>
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
          <Flex align="center">
            <Typography.Text strong>Người tạo:</Typography.Text>
            <SpaceDiv width={10} />
            <Typography.Text>{order?.salesId?.fullName}</Typography.Text>
            <Divider type="vertical" />
            <Typography.Text strong>Điện thoại:</Typography.Text>
            <SpaceDiv width={10} />
            <Typography.Text>
              <CopyPhonenumber phone={order?.salesId?.phone} />
            </Typography.Text>
          </Flex>
        </Flex>
        <SpaceDiv height={20} />
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={order?.medicines}
          pagination={false}
          footer={() => (
            <Flex justify="flex-end" style={{ textAlign: "right" }}>
              <b>Tổng tiền:</b>{" "}
              <Typography.Text
                strong
                style={{ color: "#123123", width: 120, textAlign: "end" }}
              >
                {formatPrice(order?.totalPrice)}
              </Typography.Text>
            </Flex>
          )}
        />
        <SpaceDiv height={20} />
        <Form.Item
          label="Ghi chú"
          name="note"
          rules={[{ message: "Vui lòng nhập ghi chú" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Flex>
          <Typography.Text strong>Thanh toán:</Typography.Text>
          <SpaceDiv width={10} />
          <Tag style={{fontSize: 17}} color={PAYMENT_ORDER_COLOR[order?.paymentMethod]}>
            {PAYMENT_ORDER_STR[order?.paymentMethod]}
          </Tag>
        </Flex>
        <SpaceDiv height={20} />
        <Flex>
          <Typography.Text strong>Trạng thái:</Typography.Text>
          <SpaceDiv width={10} />
          <Tag style={{fontSize: 17}}  color={STATUS_ORDER_COLOR[order?.status]}>
            {STATUS_ORDER_STR[order?.status]}
          </Tag>
        </Flex>
      </Form>
    </Modal>
  );
};

export default ViewOrderModal;
