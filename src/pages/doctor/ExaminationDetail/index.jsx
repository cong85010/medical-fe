import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Flex,
  Image,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAppointment, updateStatusAppointment } from "src/api/appointment";
import { getListMedicalRecord } from "src/api/medicalRecord";
import MedicalRecordModal from "src/components/MedicalRecordModal";
import MedicineModal from "src/components/MedicineModal";
import Title from "src/components/Title";
import UserItem from "src/components/UserItem";
import {
  ColorsCustom,
  FORMAT_DATE_TIME,
  FORMAT_TIME,
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  STATUS_MEDICAL,
  TIME_PHYSICAL_EXAM,
  birthdayAndAge,
  formatedTime,
  getSourceImage,
  getSpecialtyName,
} from "src/utils";

const { Option } = Select;

const ExaminationDetailPage = () => {
  const [selectedAppoiment, setSelectedAppoiment] = useState(null);
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

  const initDataAppoiment = useCallback(async () => {
    try {
      const { appointment } = await getAppointment(appointmentId);
      setSelectedAppoiment(appointment);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, [appointmentId]);

  // Simulating fetching patients from an API
  useEffect(() => {
    initDataAppoiment();
  }, [appointmentId, initDataAppoiment]);

  useEffect(() => {
    // Simulating fetching examination history for the selected patient
    const fetchExaminationHistory = async () => {
      if (selectedAppoiment) {
        try {
          const { medicalRecords } = await getListMedicalRecord({
            patientId: selectedAppoiment?.patientId?._id,
          });
          setExaminationHistory(medicalRecords);
        } catch (error) {
          console.error("Error fetching examination history:", error);
        }
      }
    };

    fetchExaminationHistory();
  }, [selectedAppoiment, reloadMedical]);

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
      dataIndex: "medicines",
      key: "medicines",
      render: (medicines, record) => {
        return medicines.length > 0 ? (
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
        return record.status === STATUS_MEDICAL.medicined ? null : (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEditRecord(record)}
              />
            </Tooltip>
          </Space>
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
    setSelectedAppoiment(patient);
    // Handle prescribing logic here
  };

  const handleCancel = (patient) => {
    setIsExaminationModalVisible(false);
    setSelectedRecord(null);
    // Handle prescribing logic here
  };

  const handleCreatedMedical = (patient) => {
    setIsExaminationModalVisible(false);
    initDataAppoiment();
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
              <Tooltip
                title={
                  !selectedAppoiment?.isExamined
                    ? "Chưa có kết quả khám"
                    : "Khám xong"
                }
              >
                <Button
                  type="primary"
                  style={{
                    backgroundColor: selectedAppoiment?.isExamined
                      ? ColorsCustom.success
                      : ColorsCustom.disable,
                  }}
                  disabled={!selectedAppoiment?.isExamined}
                  icon={<CheckCircleOutlined />}
                >
                  Khám xong
                </Button>
              </Tooltip>
            </Popconfirm>
          </Flex>
        }
      />
      <div>
        <Title title="Thông tin bệnh nhân" />
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Bệnh nhân" style={{ fontWeight: "bold" }}>
            {selectedAppoiment?.patientId?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {birthdayAndAge(selectedAppoiment?.patientId?.birthday)}
          </Descriptions.Item>
          <Descriptions.Item label="Điện thoại">
            {selectedAppoiment?.patientId?.phone}
          </Descriptions.Item>
          <Descriptions.Item
            label="Thời gian khám"
            style={{ fontWeight: "bold" }}
          >
            {selectedAppoiment?.date} | {selectedAppoiment?.time} ~{" "}
            {formatedTime(
              dayjs(selectedAppoiment?.time, FORMAT_TIME).add(
                TIME_PHYSICAL_EXAM,
                "minute"
              )
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Chuyên khoa">
            {getSpecialtyName(selectedAppoiment?.specialty)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={STATUS_BOOKING_COLOR[selectedAppoiment?.status]}>
              {STATUS_BOOKING_STR[selectedAppoiment?.status]}
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
        patientId={selectedAppoiment?.patientId?._id}
        doctorId={selectedAppoiment?.doctorId?._id}
        appointmentId={selectedAppoiment?._id}
        medicalRecord={selectedRecord}
        onCancel={handleCancel}
        onCreated={handleCreatedMedical}
      />
      <MedicineModal
        selected={selectedRecord}
        visible={modalVisible}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default ExaminationDetailPage;
