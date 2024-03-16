import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Descriptions,
  Form,
  Input,
  DatePicker,
  Flex,
} from "antd";
import { Link } from "react-router-dom";
import Title from "src/components/Title";
import ViewModalRecordModal from "src/components/ViewMedicalRecordModal";
import { PlusCircleFilled } from "@ant-design/icons";
import AppointmentModal from "src/components/AppointmentModal";
import AddAppointmentPatient from "src/components/AddAppointmentPatient";
import { useSelector } from "react-redux";
import ViewScheduleModal from "src/components/ViewScheduleModal";
import { getUsers } from "src/api/user";

const MedicalRecord = () => {
  const [userRecords, setUserRecords] = useState([]);
  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const [isModalAppointmentVisible, setIsModalAppointmentVisible] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addVisiableAppointment, setAddVisiableAppointment] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAppointent, setSelectedAppointent] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const patient = useSelector((state) => state.auth.user);
  const handleAppointmentOk = async (values) => {
    setReload(!reload);
    setAddVisiableAppointment(false);
  };

  const showAddAppointmentModal = (record = null) => {
    setAddVisiableAppointment(true);
  };

  const handleAddAppointmentCancel = (reset) => {
    setAddVisiableAppointment(false);

    reset();
  };

  const columns = [
    {
      title: "Tên bệnh nhân",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (birthday, record) => (
        <span>
          {dayjs(birthday).format("DD/MM/YYYY")}-{" "}
          {dayjs().diff(birthday, "year")} tuổi
        </span>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Lịch khám",
      dataIndex: "totalBooked",
      key: "totalBooked",
      render: (totalBooked, record) => (
        <Flex gap={10}>
          <Tooltip title="Xem lịch khám">
            <Button
              onClick={() => showViewAppointmentModal(record)}
              icon={<EyeOutlined />}
            >
              {/* <Typography.Text>{totalBooked}</Typography.Text> */}
            </Button>
          </Tooltip>
          <Tooltip title="Tạo lịch khám">
            <Button
              onClick={() => showAddAppointmentModal(record)}
              icon={<PlusOutlined />}
            ></Button>
          </Tooltip>
        </Flex>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Flex gap={10}>
          <Tooltip title="Xem chi tiết">
            <Button
              onClick={() => navigate("/profile-medical/" + record._id)}
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => showAddPatientModal(record)}
              icon={<EditOutlined />}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getUsers({
          userType: "user",
          searchKey: keyword,
          sort: { createdAt: 1 },
          limit: pagination.pageSize,
          skip: pagination.pageSize * (pagination.current - 1),
        });
        setUserRecords(result?.users);
        setPagination({
          ...pagination,
          total: result?.total,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload, pagination.current]);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalAppCancel = () => {
    setIsModalAppointmentVisible(false);
  };

  const handleModalDetailCancel = () => {
    setIsModalDetailVisible(false);
  };

  const handleModalOk = (values) => {
    console.log("Received values of form: ", values);
    setIsModalAppointmentVisible(false);
  };

  return (
    <div>
      <Title title="Danh sách bệnh án của bạn" />
      <Flex justify="end" style={{ marginBottom: 10 }}>
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={() => setAddVisiableAppointment(true)}
        >
          Hẹn lịch khám
        </Button>
      </Flex>
      <Table dataSource={userRecords} columns={columns} />

      <ViewModalRecordModal
        visible={isModalDetailVisible}
        onCancel={handleModalDetailCancel}
        selectedRecord={selectedRecord}
      />

      <AddAppointmentPatient
        visible={addVisiableAppointment}
        onCancel={handleAddAppointmentCancel}
        onFinish={handleAppointmentOk}
        selectedPatient={patient}
        selectedAppointent={selectedAppointent}
        isPatient
      />

      
    </div>
  );
};

export default MedicalRecord;
