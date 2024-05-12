import {
  CalendarOutlined,
  EditOutlined,
  EyeOutlined,
  FileDoneOutlined,
  MinusOutlined,
  RightCircleOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getListMedicalRecord } from "src/api/medicalRecord";
import MedicineModal from "src/components/MedicineModal";
import Title from "src/components/Title";
import UserItem from "src/components/UserItem";
import ViewOrderModal from "src/components/ViewOrderModal";
import {
  FORMAT_DATE,
  FORMAT_DATE_TIME,
  STATUS_MEDICAL,
  STATUS_MEDICAL_COLOR,
  STATUS_MEDICAL_STR,
} from "src/utils";
import { getTypeFile } from "src/utils/utilJsx";
const MedicalRecord = () => {
  const [examinationHistory, setExaminationHistory] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isShowViewOrder, setisShowViewOrder] = useState(false);
  const [filterDate, setFilterDate] = useState(dayjs());

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
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
        return doctorId?.fullName;
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
      width: 150,
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <Tag color={STATUS_MEDICAL_COLOR[status]}>
            {STATUS_MEDICAL_STR[status]}
          </Tag>
        );
      },
    },
    {
      width: 150,
      title: "Hành động",
      align: "center",
      key: "action",
      render: (_, record, indx) => {
        return (
          <Space>
            <Tooltip title="Xem đơn hàng">
              <Button
                icon={<FileDoneOutlined />}
                onClick={() => handleViewOrder(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleViewOrder = (record) => {
    setSelectedRecord(record);
    setisShowViewOrder(true);
    // Handle examination logic here
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  useEffect(() => {
    // Simulating fetching examination history for the selected patient
    const fetchExaminationHistory = async () => {
      if (user?._id) {
        try {
          const { medicalRecords } = await getListMedicalRecord({
            date: filterDate.format(FORMAT_DATE),
            patientId: user?._id,
          });
          setExaminationHistory(medicalRecords);
        } catch (error) {
          console.error("Error fetching examination history:", error);
        }
      }
    };

    fetchExaminationHistory();
  }, [filterDate, user?._id]);

  return (
    <div>
      <Title
        title="Danh sách bệnh án"
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
            <Button
              icon={<RightCircleOutlined />}
              onClick={() => setFilterDate(dayjs(filterDate).add(1, "day"))}
            >
              Ngày mai
            </Button>
            <DatePicker
              value={filterDate}
              format={FORMAT_DATE}
              onChange={(date) => setFilterDate(date)}
            />
          </Flex>
        }
      />
      <Table dataSource={examinationHistory} columns={columns} />
      <MedicineModal
        selected={selectedRecord}
        visible={modalVisible}
        onCancel={handleCloseModal}
      />
      <ViewOrderModal
        visible={isShowViewOrder}
        medicalRecordId={selectedRecord?._id}
        onCancel={() => {
          setisShowViewOrder(false);
        }}
        hiddenFooter
      />
    </div>
  );
};

export default MedicalRecord;
