// AppointmentPage.js
import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  List,
  Skeleton,
  Avatar,
  Card,
  Flex,
  Typography,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import Title from "src/components/Title";
import { ArrowRightOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { getListAppointment } from "src/api/appointment";
import { FORMAT_DATE, getToday } from "src/utils";
import UserItem from "src/components/UserItem";

const AppointmentWaitingPatient = () => {
  const [appointments, setAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterDate, setFilterDate] = useState(dayjs());
  const [listAppointment, setListAppointment] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initData = async () => {
      // Replace this with the actual API call to fetch appointments
      const { appointments } = await getListAppointment({
        date: filterDate.format(FORMAT_DATE),
        status: "waiting",
      });
      setInitLoading(false);
      setPendingAppointments(appointments);
    };
    initData();
  }, [filterDate]);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      ellipsis: true,
      width: 80,
      render: (text, record, index) => (
        <Typography.Text strong style={{ fontSize: 17 }}>
          {index + 1}
        </Typography.Text>
      ),
    },
    {
      title: "Ngày khám",
      dataIndex: "date",
      ellipsis: true,
      key: "date",
      width: 120,
      render: (date) => dayjs(date).format(FORMAT_DATE),
    },
    {
      title: "Giờ khám",
      ellipsis: true,
      dataIndex: "time",
      width: 100,
      key: "time",
      render: (time) => dayjs(time, "HH:mm").format("HH:mm"),
    },
    {
      ellipsis: true,
      title: "Bệnh nhân",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId) => {
        return <UserItem user={patientId} />;
      },
    },
    {
      ellipsis: true,
      title: "Bác sĩ",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctorId) => {
        return <UserItem user={doctorId} />;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleApprove(record.key)}>Phê duyệt</Button>
          <Button onClick={() => handleReject(record.key)}>Từ chối</Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleDelete = (key) => {
    setAppointments(appointments.filter((item) => item.key !== key));
  };

  const handleApprove = (key) => {
    const selectedAppointment = pendingAppointments.find(
      (item) => item.key === key
    );
    setAppointments([
      ...appointments,
      { key: Date.now(), ...selectedAppointment },
    ]);
    setPendingAppointments(
      pendingAppointments.filter((item) => item.key !== key)
    );
  };

  const handleReject = (key) => {
    setPendingAppointments(
      pendingAppointments.filter((item) => item.key !== key)
    );
  };

  return (
    <div>
      <Card style={{ flex: "1 1" }}>
        <Title
          title="Danh sách chờ phê duyệt"
          styleContainer={{
            justifyContent: "space-between",
          }}
          right={
            <Flex align="center">
              <Typography.Text strong style={{ marginRight: 10 }}>
                Chọn ngày:
              </Typography.Text>
              <DatePicker
                value={filterDate}
                format={FORMAT_DATE}
                onChange={(date) => setFilterDate(date)}
              />
            </Flex>
          }
        />

        <Table
          dataSource={pendingAppointments}
          columns={columns}
          rowKey="key"
        />
      </Card>

      <Modal
        title="Thông báo"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Chức năng này chưa được triển khai trong ví dụ này.</p>
      </Modal>
    </div>
  );
};

export default AppointmentWaitingPatient;
