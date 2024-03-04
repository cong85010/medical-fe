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
  Divider,
} from "antd";
import dayjs from "dayjs";
import Title from "src/components/Title";
import {
  ArrowRightOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { getListAppointment } from "src/api/appointment";
import { FORMAT_DATE, getToday } from "src/utils";
import UserItem from "src/components/UserItem";

const AppointmentPatientPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterDate, setFilterDate] = useState(dayjs());
  const [listAppointment, setListAppointment] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      ellipsis: true,
      width: 50,
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
      width: 80,
      render: (date) => dayjs(date).format(FORMAT_DATE),
    },
    {
      title: "Giờ khám",
      ellipsis: true,
      dataIndex: "time",
      width: 80,
      key: "time",
      render: (time) => dayjs(time, "HH:mm").format("HH:mm"),
    },
    {
      width: 150,
      ellipsis: true,
      title: "Bệnh nhân",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId) => {
        return <UserItem user={patientId} />;
      },
    },
    {
      width: 150,
      ellipsis: true,
      title: "Bác sĩ",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctorId) => {
        return <UserItem user={doctorId} />;
      },
    },
  ];

  useEffect(() => {
    const initData = async () => {
      setInitLoading(true);
      // Replace this with the actual API call to fetch appointments
      const { appointments } = await getListAppointment({
        date: filterDate.format(FORMAT_DATE),
      });
      setInitLoading(false);
      setListAppointment(appointments);
    };
    initData();
  }, [filterDate]);

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <Card>
        <Title
          title="Danh sách thứ tự khám"
          styleContainer={{
            justifyContent: "space-between",
          }}
          right={
            <Flex align="center" gap={10}>
              <Typography.Title level={5} style={{ margin: 0 }}>
                Ngày: {filterDate.format(FORMAT_DATE)}
              </Typography.Title>
              <Divider type="vertical" />
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                onClick={() => setFilterDate(dayjs())}
              >
                Hôm nay
              </Button>
              <Button
                icon={<RightCircleOutlined />}
                onClick={() => setFilterDate(dayjs(filterDate).add(1, "day"))}
              >
                Ngày mai
              </Button>
              <DatePicker
                value={filterDate}
                format={FORMAT_DATE}
                onChange={(date) => setFilterDate(date)}
              />
            </Flex>
          }
        />
        <Table
          className="demo-loadmore-list"
          loading={initLoading}
          columns={columns}
          dataSource={listAppointment}
          scroll={{ x: 800, y: 500 }}
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

export default AppointmentPatientPage;
