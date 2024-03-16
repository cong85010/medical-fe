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
  CaretRightOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  RightCircleOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { getListAppointment } from "src/api/appointment";
import {
  FORMAT_DATE,
  STATUS_BOOKING,
  formatedDate,
  formatedTime,
  getToday,
} from "src/utils";
import UserItem from "src/components/UserItem";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ExaminationPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterDate, setFilterDate] = useState(dayjs());
  const [listAppointment, setListAppointment] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      ellipsis: true,
      width: 100,
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
      width: 150,
      render: (date) => formatedDate(date),
    },
    {
      title: "Giờ khám",
      ellipsis: true,
      dataIndex: "time",
      width: 100,
      key: "time",
      render: (time) => formatedTime(time),
    },
    {
      ellipsis: true,
      title: "Bệnh nhân",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId, record) => {
        return patientId.fullName;
      },
    },
    {
      width: 150,
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (birthday, record) => (
        <span>
          {dayjs(record?.patientId?.birthday).format("DD/MM/YYYY")}-{" "}
          {dayjs().diff(record?.patientId?.birthday, "year")} tuổi
        </span>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (_, record) => {
        return record?.patientId.phone;
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (_, record) => {
        return record?.patientId.address;
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<CaretRightOutlined />}
            onClick={() => navigate("/examination/" + record._id)}
          >
            Khám
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const initData = async () => {
      setInitLoading(true);
      // Replace this with the actual API call to fetch appointments
      const { appointments } = await getListAppointment({
        date: formatedDate(filterDate),
        doctorId: user?._id,
        status: STATUS_BOOKING.booked,
        sort: "time=1",
      });
      setInitLoading(false);
      setListAppointment(appointments);
    };

    if (user._id) {
      initData();
    }
  }, [filterDate, user]);

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

export default ExaminationPage;
