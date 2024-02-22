// src/pages/PatientPage.js
import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  Table,
  Space,
  Flex,
  Button,
  Image,
} from "antd";
import { birthdayAndAge } from "src/utils";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "src/api/user";
import {
  ArrowLeftOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Title from "src/components/Title";

const patient = {
  fullName: "John Doe",
  birthday: "01/01/1990",
  address: "123 Main Street",
  username: "johndoe123",
  email: "john.doe@example.com",
  phone: "555-1234",
  userType: "Patient",
  activeStatus: true,
  photo: "url/to/photo.jpg",
  // Add more fields as needed
};

const PatientPage = () => {
  const param = useParams();
  const [patient, setPatient] = useState({});
  const id = param.id || "";
  useEffect(() => {
    const initData = async () => {
      const result = await getUserById(id);
      setPatient(result?.user);
    };
    initData();
  }, [id]);

  const columns = [
    {
      title: "Tên bệnh",
      dataIndex: "nameMedical",
      key: "nameMedical",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Ngày giờ vào",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Ngày giờ xong",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Lịch hẹn",
      dataIndex: "appoinment",
      key: "appoinment",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "photos",
      key: "photos",
      render: (text, record) => (
        <Image.PreviewGroup>
          <Image
            src="https://www.pockethealth.com/wp-content/uploads/2023/02/X-ray-Hero.png"
            width={70}
            height={70}
            style={{ objectFit: "cover" }}
          />
        </Image.PreviewGroup>
      ),
    },
    {
      title: "Kết quả khám",
      dataIndex: "result",
      key: "result",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Lưu ý",
      dataIndex: "note",
      key: "note",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Kê toa",
      dataIndex: "medicine",
      key: "medicine",
      width: 100,
      ellipsis: true,
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} />
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      nameMedical: "Nhứt đầu",
      startDate: "2024-02-22 08:00",
      endDate: "2024-02-22 09:30",
      appoinment: "2024-03-01 10:00",
      result: "Không có",
      medicine: "Paracetamol 500mg",
      note: "Nên nghỉ ngơi nhiều",
    },
  ];

  return (
    <Flex gap={20} vertical>
      <Title title="Thông tin bệnh nhân" showBack />
      <Card title="Thông tin">
        <Descriptions>
          <Descriptions.Item label="Họ tên">
            {patient?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {birthdayAndAge(patient?.birthday)}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {patient?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{patient?.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {patient?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Lưu ý">{patient?.note}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Lịch sử khám bệnh">
        <Table
          scroll={{ x: 1500, y: 500 }}
          columns={columns}
          dataSource={data}
        />
      </Card>
    </Flex>
  );
};

export default PatientPage;
