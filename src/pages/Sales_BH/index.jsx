// AppointmentPage.js
import React, { useCallback, useEffect, useState } from "react";
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
  Tag,
  Alert,
  notification,
  Input,
  Tooltip,
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
  ReloadOutlined,
  RightCircleOutlined,
  SearchOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  getListAppointment,
  getListAppointmentQuery,
  updateStatusAppointment,
} from "src/api/appointment";
import {
  FORMAT_DATE,
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  formatedDate,
  formatedTime,
  getToday,
} from "src/utils";
import UserItem from "src/components/UserItem";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CopyPhonenumber } from "src/components/CopyPhone";

const SalesPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filterDate, setFilterDate] = useState(dayjs());
  const [listAppointment, setListAppointment] = useState([]);
  const [patientExamaning, setPatientExamaning] = useState(null);
  const [initLoading, setInitLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [reload, setReload] = useState(true);
  const [keyword, setKeyword] = useState("");

  const handlePrescribing = (record) => {
    navigate(`/sales/${record._id}`);
  };

  const handleGoToExamnation = () => {
    try {
      if (patientExamaning) {
        navigate(`/examination/${patientExamaning._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 50,
      render: (text, record, index) => (
        <Typography.Text>{index + 1}</Typography.Text>
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
      width: 200,
      title: "Bệnh nhân",
      dataIndex: "patientFullName",
      key: "patientFullName",
      render: (patientFullName, record) => {
        return patientFullName;
      },
    },
    {
      width: 170,
      title: "Ngày sinh",
      dataIndex: "patientBirthday",
      key: "patientBirthday",
      render: (patientBirthday, record) => (
        <span>
          {dayjs(patientBirthday).format("DD/MM/YYYY")}-{" "}
          {dayjs().diff(patientBirthday, "year")} tuổi
        </span>
      ),
    },
    {
      title: "Số điện thoại",
      width: 150,
      dataIndex: "patientPhone",
      key: "patientPhone",
      render: (patientPhone, record) => {
        return <CopyPhonenumber phone={patientPhone} />;
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
      key: "action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<CaretRightOutlined />}
            onClick={() => handlePrescribing(record)}
          >
            Kê toa
          </Button>
        </Space>
      ),
    },
  ];

  const initData = useCallback(async () => {
    setInitLoading(true);
    // Replace this with the actual API call to fetch appointments
    const { appointments } = await getListAppointmentQuery({
      date: formatedDate(filterDate),
      status: STATUS_BOOKING.finished,
      sort: "time=1",
      searchKey: keyword,
    });
    setInitLoading(false);
    setListAppointment(appointments);
  }, [filterDate, keyword]);

  useEffect(() => {
    initData();
  }, [initData]);

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleResearch = () => {
    setKeyword("");
    setReload(!reload);
  };

  return (
    <div>
      <Title
        title="Danh sách đã khám"
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
            <DatePicker
              value={filterDate}
              format={FORMAT_DATE}
              onChange={(date) => setFilterDate(date)}
            />
          </Flex>
        }
      />
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
      </Flex>
      <Table
        rowKey={"_id"}
        className="demo-loadmore-list"
        loading={initLoading}
        columns={columns}
        dataSource={listAppointment}
        scroll={{ x: 800, y: 500 }}
      />
    </div>
  );
};

export default SalesPage;
