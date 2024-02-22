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

const { Option } = Select;

const ExaminationPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [examinationHistory, setExaminationHistory] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [isExaminationModalVisible, setIsExaminationModalVisible] =
    useState(false);

  // Simulating fetching patients from an API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("https://api.example.com/patients");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

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

  return (
    <div>
      <h1>Khám bệnh</h1>
      <Table dataSource={patients} columns={columns} />
      <div>
        <h2>Patient Information</h2>
        <Descriptions bordered>
          <Descriptions.Item label="Patient ID">
            {selectedPatient?.id}
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            {selectedPatient?.name}
          </Descriptions.Item>
          {/* Add more patient details as needed */}
        </Descriptions>
      </div>
      <div>
        <h2>Examination History for {selectedPatient?.name}</h2>
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

export default ExaminationPage;
