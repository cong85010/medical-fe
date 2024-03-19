import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Space,
  Flex,
  Tooltip,
  Spin,
  Typography,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SpaceDiv from "src/components/SpaceDiv";
import Title from "src/components/Title";
import { getUsers } from "src/api/user";
import dayjs from "dayjs";
import AddAppointmentPatient from "src/components/AddAppointmentPatient";
import AddPatientModal from "src/components/AddPatientModal";
import { useNavigate } from "react-router-dom";
import { createAppointment } from "src/api/appointment";
import ViewScheduleModal from "src/components/ViewScheduleModal";

const ProfileMedicalPage = () => {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [addVisiableAppointment, setAddVisiableAppointment] = useState(false);
  const [visiblePatientModal, setVisiblePatientModal] = useState(false);
  const [viewVisibleAppointmentModal, setViewVisibleAppointmentModal] =
    useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointent, setSelectedAppointent] = useState(null);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const showAddAppointmentModal = (record = null) => {
    setAddVisiableAppointment(true);
    setSelectedPatient(record);
  };

  const showAddPatientModal = (record = null) => {
    setVisiblePatientModal(true);
    setSelectedPatient(record);
  };

  const showViewAppointmentModal = (record = null) => {
    setViewVisibleAppointmentModal(true);
    setSelectedPatient(record);
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
          limit: pagination.pageSize,
          skip: pagination.pageSize * (pagination.page - 1),
        });
        setPatients(result?.users);
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
  }, [reload, pagination.page]);

  const handleAddAppointmentCancel = (reset) => {
    setAddVisiableAppointment(false);

    if (!viewVisibleAppointmentModal) {
      setSelectedPatient(null);
      setSelectedAppointent(null);
    }
    reset();
  };

  const handleViewAppointmentCancel = () => {
    setViewVisibleAppointmentModal(false);
    setSelectedPatient(null);
    setSelectedAppointent(null);
  };

  const handleViewAppointmentEdit = (record) => {
    setAddVisiableAppointment(true);
    setSelectedAppointent(record);
  };

  const handleAddPatientCancel = () => {
    setVisiblePatientModal(false);
    setSelectedPatient(null);
  };

  const handleCreatedPatientModal = (result) => {
    setVisiblePatientModal(false);
    setReload(!reload);
  };

  const handleAppointmentOk = async (values) => {
    try {
      setReload(!reload);
      setAddVisiableAppointment(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResearch = () => {
    setKeyword("");
    setReload(!reload);
  };

  const handleChange = ({ current }) => {
    setPagination({
      ...pagination,
      page: current,
    });
  };

  return (
    <div>
      <Title title="Quản lý hồ sơ bệnh nhân" />
      <Flex gap={10} justify="space-between" style={{ marginBottom: 10 }}>
        <Flex gap={10}>
          <Tooltip title="Khôi phục">
            <Button onClick={handleResearch}>
              <ReloadOutlined />
            </Button>
          </Tooltip>
          <Input
            value={keyword}
            placeholder="Tìm kiếm"
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => setReload(!reload)}
          />
          <Button type="primary" onClick={() => setReload(!reload)}>
            <SearchOutlined />
          </Button>
        </Flex>
        <Button type="primary" onClick={() => showAddPatientModal()}>
          <PlusOutlined />
          Tạo hồ sơ bệnh nhân
        </Button>
      </Flex>
      <Table
        rowKey="_id"
        dataSource={patients}
        columns={columns}
        loading={loading}
        onChange={handleChange}
        pagination={{
          pageSize: pagination.pageSize,
          total: pagination.total,
          current: pagination.page,
        }}
      />
      <AddAppointmentPatient
        visible={addVisiableAppointment}
        onCancel={handleAddAppointmentCancel}
        onFinish={handleAppointmentOk}
        selectedPatient={selectedPatient}
        selectedAppointent={selectedAppointent}
      />
      <AddPatientModal
        visible={visiblePatientModal}
        onCancel={handleAddPatientCancel}
        onFinish={handleCreatedPatientModal}
        selectedPatient={selectedPatient}
      />
      <ViewScheduleModal
        onEdit={handleViewAppointmentEdit}
        onCancel={handleViewAppointmentCancel}
        visible={viewVisibleAppointmentModal}
        selectedPatient={selectedPatient}
        reload={reload}
      />
    </div>
  );
};

export default ProfileMedicalPage;
