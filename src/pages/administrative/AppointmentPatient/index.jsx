// AppointmentPage.js
import {
  ArrowRightOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  RightCircleOutlined
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  notification
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  getListAppointment,
  updateStatusAppointment,
} from "src/api/appointment";
import Title from "src/components/Title";
import UserItem from "src/components/UserItem";
import {
  FORMAT_DATE,
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  formatedDate,
  formatedTime,
  getSpecialtyName
} from "src/utils";

const AppointmentPatientPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filterDate, setFilterDate] = useState(dayjs());
  const [listAppointment, setListAppointment] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const handleEnterExamination = async (record) => {
    try {
      const result = await updateStatusAppointment({
        appointmentId: record._id,
        status: STATUS_BOOKING.waiting,
      });

      notification.success({
        message: `Bệnh nhân ${record.patientId.fullName} đã vào phòng chờ khám`,
      });
      setReload(!reload);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
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
      key: "date",
      width: 80,
      render: (date) => formatedDate(date),
    },
    {
      title: "Giờ khám",
      dataIndex: "time",
      width: 80,
      key: "time",
      render: (time) => formatedTime(time),
    },
    {
      title: "Chuyên khoa",
      dataIndex: "specialty",
      width: 80,
      key: "specialty",
      render: (specialty) => getSpecialtyName(specialty),
    },
    {
      width: 170,
      title: "Bệnh nhân",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId) => {
        return <UserItem user={patientId} showBirthDay />;
      },
    },
    {
      width: 170,
      title: "Bác sĩ",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctorId) => {
        return <UserItem user={doctorId} />;
      },
    },
    {
      width: 100,
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      key: "status",
      render: (key) => {
        return (
          <Tag color={STATUS_BOOKING_COLOR[key]}>{STATUS_BOOKING_STR[key]}</Tag>
        );
      },
    },
    {
      title: "Hành động",
      width: 100,
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            icon={<CheckCircleOutlined style={{ color: "green" }} />}
            title="Xác nhận chờ khám"
            placement="topRight"
            description={
              <>
                <Typography.Text>Thời gian: </Typography.Text>{" "}
                <strong>
                  {record.date} - {record.time}
                </strong>
              </>
            }
            onConfirm={() => handleEnterExamination(record)}
            okText="Xác nhận"
            cancelText="Không"
          >
            <Tooltip title="Chờ khám">
              <Button icon={<ArrowRightOutlined />}>Chờ khám</Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const initData = async () => {
      setInitLoading(true);
      // Replace this with the actual API call to fetch appointments
      const { appointments } = await getListAppointment({
        date: filterDate.format(FORMAT_DATE),
        status: STATUS_BOOKING.booked,
      });
      setInitLoading(false);
      setListAppointment(appointments);
    };
    initData();
  }, [filterDate, reload]);

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
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
        rowKey={"_id"}
        className="demo-loadmore-list"
        loading={initLoading}
        columns={columns}
        dataSource={listAppointment}
        scroll={{ x: 800, y: 500 }}
      />
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
