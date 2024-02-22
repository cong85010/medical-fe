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

const ProfileMedicalPage = () => {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [visiableAppointment, setVisiableAppointment] = useState(false);
  const [visiblePatientModal, setVisiblePatientModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const showAppointmentModal = (record) => {
    setVisiableAppointment(true);
    setSelectedPatient(record);
  };

  const showAddPatientModal = (record) => {
    setVisiblePatientModal(true);
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
      dataIndex: "appointment",
      key: "appointment",
      render: (text, record) => (
        <span>
          {text ? (
            `${text.date.format("DD/MM/YYYY")} ${text.time.format("HH:mm")}`
          ) : (
            <Button onClick={() => showAppointmentModal(record)}>
              Tạo lịch khám
            </Button>
          )}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Flex gap={10}>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => showAddPatientModal(record)}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button
              onClick={() => navigate("/profile-medical/" + record._id)}
              icon={<EyeOutlined />}
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

  const handleAppointmentCancel = () => {
    setVisiableAppointment(false);
  };

  const handleCreatedPatientModal = (result) => {
    setVisiblePatientModal(false);
    setReload(!reload);
  };

  const handleAppointmentOk = (result) => {};

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
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
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
        <Button type="primary" onClick={showAddPatientModal}>
          <PlusOutlined />
          Tạo hồ sơ bệnh nhân
        </Button>
      </Flex>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: (event) => {
              navigate("/profile-medical/" + record._id);
            },
          };
        }}
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
        visible={visiableAppointment}
        onCancel={handleAppointmentCancel}
        onFinish={handleAppointmentOk}
        selectedPatient={selectedPatient}
      />
      <AddPatientModal
        visible={visiblePatientModal}
        onCancel={() => setVisiblePatientModal(false)}
        onFinish={handleCreatedPatientModal}
        selectedPatient={selectedPatient}
      />
    </div>
  );
};

export default ProfileMedicalPage;
