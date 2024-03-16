import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Descriptions,
  Modal,
} from "antd";
import ExaminationFormModal from "src/components/ExaminationFormModal";
import { useParams } from "react-router-dom";
import {
  FORMAT_TIME,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  TIME_PHYSICAL_EXAM,
  formatedTime,
  getSpecialtyName,
} from "src/utils";
import dayjs from "dayjs";
import { getAppointment, getListAppointment } from "src/api/appointment";

const { Option } = Select;

const ExaminationDetailPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [examinationHistory, setExaminationHistory] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [isExaminationModalVisible, setIsExaminationModalVisible] =
    useState(false);
  const params = useParams();
  const { id: appointmentId } = params;

  console.log(appointmentId);
  // Simulating fetching patients from an API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { appointment } = await getAppointment(appointmentId);
        setSelectedPatient(appointment);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [appointmentId]);

  useEffect(() => {
    // Simulating fetching examination history for the selected patient
    const fetchExaminationHistory = async () => {
      if (selectedPatient) {
        try {
          const response = await fetch(
            `https://api.example.com/examination-history/${selectedPatient.id}`
          );
          const data = await response.json();
          setExaminationHistory(data);
        } catch (error) {
          console.error("Error fetching examination history:", error);
        }
      }
    };

    fetchExaminationHistory();
  }, [selectedPatient]);

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space>
          <Button type="primary" onClick={() => handleExamine(record)}>
            Examine
          </Button>
          <Button
            type="primary"
            onClick={() => handlePrescribe(record)}
            disabled={!selectedPatient}
          >
            Prescribe
          </Button>
        </Space>
      ),
    },
  ];

  const handleExamine = (patient) => {
    setSelectedPatient(patient);
    // Handle examination logic here
  };

  const handlePrescribe = (patient) => {
    setSelectedPatient(patient);
    // Handle prescribing logic here
  };

  const handleCancel = (patient) => {
    setIsExaminationModalVisible(false);
    // Handle prescribing logic here
  };

  console.log(selectedPatient);
  return (
    <div>
      <h1>Khám bệnh</h1>
      <div>
        <h2>Thông tin bệnh nhân</h2>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Bệnh nhân">
            {selectedPatient?.patientId?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Điện thoại">
            {selectedPatient?.patientId?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày khám">
            {selectedPatient?.date}
          </Descriptions.Item>
          <Descriptions.Item
            label="Thời gian khám"
            style={{ fontWeight: "bold" }}
          >
            {selectedPatient?.time} ~{" "}
            {formatedTime(
              dayjs(selectedPatient?.time, FORMAT_TIME).add(
                TIME_PHYSICAL_EXAM,
                "minute"
              )
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Chuyên khoa">
            {getSpecialtyName(selectedPatient?.specialty)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={STATUS_BOOKING_COLOR[selectedPatient?.status]}>
              {STATUS_BOOKING_STR[selectedPatient?.status]}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div>
        <h2>Lịch sử khám bệnh</h2>
        <Table
          dataSource={examinationHistory}
          columns={[
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
            },
            {
              title: "Result",
              dataIndex: "result",
              key: "result",
            },
          ]}
        />
      </div>
      <Button type="primary" onClick={() => setIsExaminationModalVisible(true)}>
        Kết quả khám bệnh
      </Button>

      <ExaminationFormModal
        isExaminationModalVisible={isExaminationModalVisible}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ExaminationDetailPage;
