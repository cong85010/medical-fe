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
  notification,
  Flex,
  Popconfirm,
} from "antd";
import ExaminationFormModal from "src/components/ExaminationFormModal";
import { useNavigate, useParams } from "react-router-dom";
import {
  FORMAT_TIME,
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  TIME_PHYSICAL_EXAM,
  birthdayAndAge,
  formatedTime,
  getSpecialtyName,
} from "src/utils";
import dayjs from "dayjs";
import {
  getAppointment,
  getListAppointment,
  updateStatusAppointment,
} from "src/api/appointment";
import Title from "src/components/Title";
import AddPrescription from "src/components/AddPrescription";
import { CheckCircleOutlined } from "@ant-design/icons";

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
  const navigate = useNavigate();

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
        // try {
        //   const response = await fetch(
        //     `https://api.example.com/examination-history/${selectedPatient.id}`
        //   );
        //   const data = await response.json();
        //   setExaminationHistory(data);
        // } catch (error) {
        //   console.error("Error fetching examination history:", error);
        // }
      }
    };

    fetchExaminationHistory();
  }, [selectedPatient]);

  const handleUpdateStatus = () => {
    try {
      updateStatusAppointment({
        appointmentId,
        status: STATUS_BOOKING.finished,
      });
      notification.success({
        message: "Thành công",
      });
      navigate("/examination");
    } catch (error) {
      console.error(error);
    }
  };

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
      <Title
        title="Khám bệnh"
        showBack
        right={
          <Flex justify="end" style={{ flex: "1 1" }}>
            <Popconfirm
              title="Xác nhận khám xong"
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={handleUpdateStatus}
            >
              <Button type="primary" icon={<CheckCircleOutlined />}>
                Khám xong
              </Button>
            </Popconfirm>
          </Flex>
        }
      />
      <div>
        <h2>Thông tin bệnh nhân</h2>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Bệnh nhân">
            {selectedPatient?.patientId?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {birthdayAndAge(selectedPatient?.patientId?.birthday)}
          </Descriptions.Item>
          <Descriptions.Item label="Điện thoại">
            {selectedPatient?.patientId?.phone}
          </Descriptions.Item>
          <Descriptions.Item
            label="Thời gian khám"
            style={{ fontWeight: "bold" }}
          >
            {selectedPatient?.date} | {" "}
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
        <Title
          title={"Lịch sử khám bệnh"}
          justify="space-between"
          styleContainer={{
            marginTop: 20,
          }}
          right={
            <Button
              type="primary"
              onClick={() => setIsExaminationModalVisible(true)}
            >
              Kết quả khám bệnh
            </Button>
          }
        />

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
      <ExaminationFormModal
        visible={isExaminationModalVisible}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ExaminationDetailPage;
