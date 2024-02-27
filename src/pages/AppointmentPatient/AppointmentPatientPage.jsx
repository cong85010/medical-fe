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
} from "antd";
import dayjs from "dayjs";
import Title from "src/components/Title";
import { ArrowRightOutlined, ArrowUpOutlined } from "@ant-design/icons";

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const AppointmentPatientPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [list, setList] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const columns = [
    {
      title: "Ngày khám",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ khám",
      dataIndex: "time",
      key: "time",
      render: (time) => dayjs(time).format("HH:mm"),
    },
    {
      title: "Họ tên bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
    },
  ];
  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.results);
        setList(res.results);
      });
  }, []);

  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          name: {},
          picture: {},
        }))
      )
    );
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.results);
        setData(newData);
        setList(newData);
        setLoading(false);
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event("resize"));
      });
  };
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  const pendingColumns = [
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ đặt",
      dataIndex: "time",
      key: "time",
      render: (time) => dayjs(time).format("HH:mm"),
    },
    {
      title: "Họ tên bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
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
      <Flex justify="space-between" gap={20}>
        <Card style={{ flex: "0.7 1" }}>
          <Title title="Danh sách thứ tự khám" />
          <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button icon={<ArrowRightOutlined />} type="text">Vào khám</Button>,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                 <Flex align="center" gap={20}>
                 <Typography.Text strong style={{ fontSize: 19 }}>
                    {index + 1}
                  </Typography.Text>
                  <List.Item.Meta
                    avatar={<Avatar src={item.picture.large} />}
                    title={item.name?.last}
                    description={'02321321323'}
                  />
                 </Flex>
                </Skeleton>
              </List.Item>
            )}
          />
        </Card>
        <Card style={{ flex: "1 1" }}>
          <Title title="Danh sách chờ phê duyệt" />
          <Table
            dataSource={pendingAppointments}
            columns={pendingColumns}
            rowKey="key"
          />
        </Card>
      </Flex>

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
