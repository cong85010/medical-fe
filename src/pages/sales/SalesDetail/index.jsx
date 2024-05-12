import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FileDoneOutlined,
  FilePdfOutlined,
  MinusOutlined,
  ShopOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Flex,
  Image,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAppointment, updateStatusAppointment } from "src/api/appointment";
import { getListMedicalRecord } from "src/api/medicalRecord";
import { getListOrder, getListOrderByPatientId } from "src/api/order";
import MedicalRecordModal from "src/components/MedicalRecordModal";
import MedicineModal from "src/components/MedicineModal";
import PrescriptionSalesModal from "src/components/PrescriptionSalesModal";
import Title from "src/components/Title";
import UserItem from "src/components/UserItem";
import ViewOrderModal from "src/components/ViewOrderModal";
import {
  ColorsCustom,
  FORMAT_DATE_TIME,
  FORMAT_TIME,
  PAYMENT_ORDER_COLOR,
  PAYMENT_ORDER_STR,
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  STATUS_MEDICAL_COLOR,
  STATUS_MEDICAL_STR,
  STATUS_ORDER_COLOR,
  STATUS_ORDER_STR,
  TIME_PHYSICAL_EXAM,
  birthdayAndAge,
  formatedTime,
  getSourceImage,
  getSpecialtyName,
} from "src/utils";

const SalesDetailPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [examinationHistory, setExaminationHistory] = useState([]);
  const [ordersHistory, setOrdersHistory] = useState([]);

  const [isExaminationModalVisible, setIsExaminationModalVisible] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [reloadMedical, setReloadMedical] = useState(false);
  const [isShowViewOrder, setisShowViewOrder] = useState(false);

  const params = useParams();
  const { id: appointmentId } = params;
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  // Simulating fetching patients from an API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { appointment } = await getAppointment(appointmentId);
        setSelectedPatient(appointment);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [appointmentId]);

  useEffect(() => {
    // Simulating fetching examination history for the selected patient
    const fetchExaminationHistory = async () => {
      if (selectedPatient) {
        try {
          const { medicalRecords } = await getListMedicalRecord({
            patientId: selectedPatient?.patientId?._id,
          });
          setExaminationHistory(medicalRecords);
        } catch (error) {
          console.error("Error fetching examination history:", error);
        }
      }
    };

    fetchExaminationHistory();
  }, [selectedPatient, reloadMedical]);

  useEffect(() => {
    // Simulating fetching examination history for the selected patient
    const fetchOrdersHistory = async () => {
      if (selectedPatient) {
        try {
          const { orders } = await getListOrderByPatientId(
            selectedPatient?.patientId?._id
          );
          setOrdersHistory(orders);
        } catch (error) {
          console.error("Error fetching examination history:", error);
        }
      }
    };

    fetchOrdersHistory();
  }, [selectedPatient, reloadMedical]);

  const handleUpdateStatus = () => {
    try {
      updateStatusAppointment({
        appointmentId,
        status: STATUS_BOOKING.medicined,
      });
      notification.success({
        message: "Thành công",
      });
      navigate("/sales");
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Ngày khám",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (createdAt) => dayjs(createdAt).format(FORMAT_DATE_TIME),
    },
    {
      width: 170,
      title: "Bác sĩ",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctorId) => {
        return <UserItem user={doctorId} showSpecialty />;
      },
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
    },
    {
      title: "Lưu ý",
      dataIndex: "note",
      key: "note",
    },
    {
      align: "center",
      title: "Đơn thuốc",
      dataIndex: "medicines",
      key: "medicines",
      render: (medicines, record) => {
        return medicines.length > 0 ? (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setModalVisible(true);
            }}
          />
        ) : (
          <Tooltip title="Trống">
            <MinusOutlined />
          </Tooltip>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_MEDICAL_COLOR[status]}>
          {STATUS_MEDICAL_STR[status]}
        </Tag>
      ),
    },
    {
      width: 150,
      title: "Đơn hàng",
      key: "action",
      align: "center",
      render: (_, record, indx) => {
        return record.status !== STATUS_BOOKING.medicined ? (
          <Tooltip title="Thanh toán">
            <Button
              icon={<ShoppingOutlined />}
              onClick={() => handleEditRecord(record)}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Xem đơn hàng">
            <Button
              icon={<FileDoneOutlined />}
              onClick={() => handleViewOrder(record)}
            />
          </Tooltip>
        );
      },
    },
  ];

  const columnsOrders = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber, record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedOrder(record);
            setisShowViewOrder(true);
          }}
        >
          {orderNumber}
        </Button>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (createdAt) => dayjs(createdAt).format(FORMAT_DATE_TIME),
    },
    {
      title: "Thu ngân",
      dataIndex: "salesId",
      key: "salesId",
      render: (salesId) => {
        return <UserItem user={salesId} />;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => <span>{totalPrice.toLocaleString()} VNĐ</span>,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (paymentMethod) => (
        <Tag
          style={{ fontSize: 17 }}
          color={PAYMENT_ORDER_COLOR[paymentMethod]}
        >
          {PAYMENT_ORDER_STR[paymentMethod]}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag style={{ fontSize: 17 }} color={STATUS_ORDER_COLOR[status]}>
          {STATUS_ORDER_STR[status]}
        </Tag>
      ),
    },
    {
      title: "Hóa đơn",
      dataIndex: "medicines",
      key: "medicines",
      render: (medicines, record) => {
        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedOrder(record);
                setisShowViewOrder(true);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setIsExaminationModalVisible(true);
    // Handle examination logic here
  };

  const handleViewOrder = (record) => {
    setSelectedRecord(record);
    setisShowViewOrder(true);
    // Handle examination logic here
  };

  const handlePrescribe = () => {
    setModalVisible(false);
    setIsExaminationModalVisible(true);
    // Handle prescribing logic here
  };

  const handleCancel = () => {
    setIsExaminationModalVisible(false);
    setSelectedRecord(null);
  };

  const handleCreatedOrder = () => {
    handleCancel();
    setReloadMedical(!reloadMedical);
  };

  // TODO: Bổ sung lịch sử đơn hàng ???
  return (
    <div>
      <Title
        title="Kê toa bệnh án"
        showBack
        right={
          <Flex justify="end" style={{ flex: "1 1" }}>
            <Popconfirm
              title="Xác nhận kê toa xong"
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={handleUpdateStatus}
            >
              <Button
                type="primary"
                style={{ backgroundColor: ColorsCustom.success }}
                icon={<CheckCircleOutlined />}
              >
                Kê toa xong
              </Button>
            </Popconfirm>
          </Flex>
        }
      />
      <div>
        <Title title="Thông tin bệnh nhân" />
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Bệnh nhân" style={{ fontWeight: "bold" }}>
            {selectedPatient?.patientId?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {birthdayAndAge(selectedPatient?.patientId?.birthday)}
          </Descriptions.Item>
          <Descriptions.Item label="Điện thoại">
            {selectedPatient?.patientId?.phone}
          </Descriptions.Item>
          <Descriptions.Item
            label="Thời gian khám"
            style={{ fontWeight: "bold" }}
          >
            {selectedPatient?.date} | {selectedPatient?.time} ~{" "}
            {formatedTime(
              dayjs(selectedPatient?.time, FORMAT_TIME).add(
                TIME_PHYSICAL_EXAM,
                "minute"
              )
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Chuyên khoa">
            {getSpecialtyName(selectedPatient?.specialty)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={STATUS_BOOKING_COLOR[selectedPatient?.status]}>
              {STATUS_BOOKING_STR[selectedPatient?.status]}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div>
        <Title
          title={"Lịch sử khám bệnh"}
          justify="space-between"
          styleContainer={{
            marginTop: 20,
          }}
        />

        <Table dataSource={examinationHistory} columns={columns} />
      </div>
      <div>
        <Title
          title={"Lịch sử đơn hàng"}
          justify="space-between"
          styleContainer={{
            marginTop: 20,
          }}
          right={
            <Button
              type="primary"
              onClick={() => setIsExaminationModalVisible(true)}
            >
              Bán thuốc
            </Button>
          }
        />

        <Table
          rowKey="_id"
          dataSource={ordersHistory}
          columns={columnsOrders}
        />
      </div>
      <PrescriptionSalesModal
        visible={isExaminationModalVisible}
        medicalRecordId={selectedRecord?._id}
        salesId={user._id}
        patientId={selectedPatient?.patientId?._id}
        medicalRecord={selectedRecord}
        medicinesImported={selectedRecord?.medicines}
        onCancel={handleCancel}
        onCreated={handleCreatedOrder}
      />
      <ViewOrderModal
        visible={isShowViewOrder}
        medicalRecordId={selectedRecord?._id}
        selectedOrder={selectedOrder}
        onCancel={() => {
          setisShowViewOrder(false);
          setSelectedOrder(null);
        }}
      />
      <MedicineModal
        isSales
        onMove={handlePrescribe}
        selected={selectedRecord}
        visible={modalVisible}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default SalesDetailPage;
