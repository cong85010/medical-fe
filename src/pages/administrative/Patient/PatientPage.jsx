import {
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  MinusOutlined
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Flex,
  Image,
  Select,
  Space,
  Table,
  Tooltip
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListMedicalRecord } from "src/api/medicalRecord";
import { getUserById } from "src/api/user";
import MedicineModal from "src/components/MedicineModal";
import Title from "src/components/Title";
import UserItem from "src/components/UserItem";
import {
  FORMAT_DATE_TIME,
  Gender,
  STATUS_MEDICAL,
  birthdayAndAge,
  getSourceImage
} from "src/utils";

const { Option } = Select;

const PatientPage = () => {
  const [selectedUser, setSelectedUser] = useState({});
  const [examinationHistory, setExaminationHistory] = useState([]);
  const [isExaminationModalVisible, setIsExaminationModalVisible] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [reloadMedical, setReloadMedical] = useState(false);

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  const initDataUser = useCallback(async () => {
    try {
      const { user } = await getUserById(userId);
      setSelectedUser(user);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, [userId]);

  // Simulating fetching patients from an API
  useEffect(() => {
    initDataUser();
  }, [userId, initDataUser]);

  useEffect(() => {
    // Simulating fetching examination history for the selected patient
    const fetchExaminationHistory = async () => {
      if (selectedUser) {
        try {
          const { medicalRecords } = await getListMedicalRecord({
            patientId: selectedUser?._id,
          });
          setExaminationHistory(medicalRecords);
        } catch (error) {
          console.error("Error fetching examination history:", error);
        }
      }
    };

    fetchExaminationHistory();
  }, [selectedUser, reloadMedical]);

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
  return (
    <div>
      <Title title="Thông tin bệnh nhân" showBack />
      <div>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Bệnh nhân" style={{ fontWeight: "bold" }}>
            {selectedUser?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {birthdayAndAge(selectedUser?.birthday)}
          </Descriptions.Item>
          <Descriptions.Item label="Điện thoại">
            {selectedUser?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {selectedUser?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {selectedUser?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {Gender[selectedUser?.gender]}
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
        />

        <Table dataSource={examinationHistory} columns={columns} />
      </div>
      <MedicineModal
        selected={selectedRecord}
        visible={modalVisible}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default PatientPage;
