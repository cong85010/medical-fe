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

const MedicalRecord = () => {
  const [userRecords, setUserRecords] = useState([]);
  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const [isModalAppointmentVisible, setIsModalAppointmentVisible] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchUserRecords = async () => {
      try {
        const response = await fetch("/api/user/medical-records");
        const data = await response.json();
        setUserRecords(data);
      } catch (error) {
        console.error("Error fetching user records:", error);
      }
    };

    fetchUserRecords();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Chuẩn đoán",
      dataIndex: "diagnosis",
      key: "diagnosis",
    },
    {
      title: "Bác sĩ điều trị",
      dataIndex: "treatingDoctor",
      key: "treatingDoctor",
    },
    {
      title: "Xem chi tiết",
      key: "action",
      render: (text, record) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];
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
  }

  return (
    <div>
      <Title title="Danh sách bệnh án của bạn" />
      <Flex justify="end" style={{ marginBottom: 10 }}>
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={() => setIsModalAppointmentVisible(true)}
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

      <AppointmentModal
        visible={isModalAppointmentVisible}
        onCancel={handleModalAppCancel}
        onOk={handleModalOk}
        selectedRecord={selectedRecord}
      />
    </div>
  );
};

export default MedicalRecord;
