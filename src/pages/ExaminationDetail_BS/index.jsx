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
  Image,
  Tooltip,
  Typography,
} from "antd";
import MedicalRecordModal from "src/components/MedicalRecordModal";
import { useNavigate, useParams } from "react-router-dom";
import {
  FORMAT_DATE,
  FORMAT_DATE_TIME,
  FORMAT_TIME,
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  TIME_PHYSICAL_EXAM,
  birthdayAndAge,
  formatedDate,
  formatedTime,
  getSourceImage,
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
import {
  CheckCircleOutlined,
  EditFilled,
  EditOutlined,
  EyeOutlined,
  FileOutlined,
  FilePdfOutlined,
  FolderOpenOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { getListMedicalRecord } from "src/api/medicalRecord";
import UserItem from "src/components/UserItem";
import PrescriptionModal from "src/components/PrescriptionModal";

const { Option } = Select;

const ExaminationDetailPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [examinationHistory, setExaminationHistory] = useState([]);
  const [isExaminationModalVisible, setIsExaminationModalVisible] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [reloadMedical, setReloadMedical] = useState(false);

  const params = useParams();
  const { id: appointmentId } = params;
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

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
          const { medicalRecords } = await getListMedicalRecord({
            patientId: selectedPatient?.patientId?._id,
          });
          setExaminationHistory(medicalRecords);
        } catch (error) {
          console.error("Error fetching examination history:", error);
        }
      }
    };

    fetchExaminationHistory();
  }, [selectedPatient, reloadMedical]);

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

  const getTypeFile = (url) => {
    const urlBE = getSourceImage(url);
    if (!url) return "";

    if (url.includes("pdf") || url.includes("docx")) {
      return (
        <Tooltip title="Tài liệu">
          <Button icon={<FilePdfOutlined />} href={urlBE} target="_blank" />
        </Tooltip>
      );
    }
    return (
      <Image
        src={urlBE}
        alt="hinhanh"
        width={50}
        height={50}
        style={{ borderRadius: 10, objectFit: "cover" }}
      />
    );
  };

  const columns = [
    {
      title: "Ngày khám",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (createdAt) => dayjs(createdAt).format(FORMAT_DATE_TIME),
    },
    {
      width: 170,
      title: "Bác sĩ",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctorId) => {
        return <UserItem user={doctorId} showSpecialty />;
      },
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
    },
    {
      title: "Lưu ý",
      dataIndex: "note",
      key: "note",
    },
    {
      align: "center",
      title: "Đơn thuốc",
      dataIndex: "prescriptions",
      key: "prescriptions",
      render: (prescriptions, record) => {
        return prescriptions.length > 0 ? (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setModalVisible(true);
            }}
          />
        ) : (
          <Tooltip title="Trống">
            <MinusOutlined />
          </Tooltip>
        );
      },
    },
    {
      align: "center",
      title: "Tư liệu",
      dataIndex: "files",
      key: "files",
      render: (files) => {
        return files.length > 0 ? (
          <Flex gap={5}>{files?.map((file) => getTypeFile(file))}</Flex>
        ) : (
          <Tooltip title="Trống">
            <MinusOutlined />
          </Tooltip>
        );
      },
    },
    {
      width: 150,
      title: "Hành động",
      key: "action",
      render: (_, record, indx) => {
        return (
          indx === 0 && (
            <Space>
              <Tooltip title="Chỉnh sửa">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditRecord(record)}
                />
              </Tooltip>
            </Space>
          )
        );
      },
    },
  ];

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setIsExaminationModalVisible(true);
    // Handle examination logic here
  };

  const handlePrescribe = (patient) => {
    setSelectedPatient(patient);
    // Handle prescribing logic here
  };

  const handleCancel = (patient) => {
    setIsExaminationModalVisible(false);
    setSelectedRecord(null);
    // Handle prescribing logic here
  };

  const handleCreatedMedical = (patient) => {
    setIsExaminationModalVisible(false);

    setReloadMedical(!reloadMedical);
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
        <Title title="Thông tin bệnh nhân" />
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Bệnh nhân" style={{ fontWeight: "bold" }}>
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
            {selectedPatient?.date} | {selectedPatient?.time} ~{" "}
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

        <Table dataSource={examinationHistory} columns={columns} />
      </div>
      <MedicalRecordModal
        visible={isExaminationModalVisible}
        patientId={selectedPatient?.patientId?._id}
        doctorId={selectedPatient?.doctorId?._id}
        medicalRecord={selectedRecord}
        onCancel={handleCancel}
        onCreated={handleCreatedMedical}
      />
      <PrescriptionModal
        selected={selectedRecord}
        visible={modalVisible}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default ExaminationDetailPage;
