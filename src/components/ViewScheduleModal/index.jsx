// ViewScheduleModal.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Table,
  Calendar,
  Popconfirm,
  Typography,
  notification,
  Tag,
  Flex,
  Divider,
  Tooltip,
} from "antd";
import {
  getListAppointment,
  updateStatusAppointment,
} from "src/api/appointment";
import dayjs from "dayjs";
import {
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  SpecialtiesMap,
  TIME_CAN_EDIT,
  isTimeBeforeCurrentByHours,
} from "src/utils";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const ViewScheduleModal = ({
  visible,
  selectedPatient,
  onEdit,
  onCancel,
  reload: reloadSchedule,
  isPage,
}) => {
  const [appointments, setAppointments] = useState([]);
  const [reload, setReload] = useState(false);

  const handleEditAppointment = (record) => {
    // TODO: Edit appinment
    onEdit(record);
  };

  const handleCancelAppmt = async (record) => {
    try {
      await updateStatusAppointment({
        appointmentId: record._id,
        status: "cancelled",
      });

      setReload(!reload);
      notification.success({
        message: "Cập nhật thành công",
      });
    } catch (error) {
      notification.error({
        message: "Cập nhật không thành công",
      });
    }
  };

  const hasPermissionEdit = (record) => {
    //Có thể chỉnh sửa nếu thời gian đặt cách thời gian hiện tại 2 tiếng
    return record.status === STATUS_BOOKING.booked &&
      isTimeBeforeCurrentByHours(record.date, record.time, TIME_CAN_EDIT) ? (
      <>
        <Tooltip title="Chỉnh sửa lịch khám">
          <Button
            type="default"
            size="small"
            onClick={() => handleEditAppointment(record)}
          >
            <EditOutlined />
          </Button>
        </Tooltip>
        <Popconfirm
          icon={<DeleteOutlined style={{ color: "red" }} />}
          title="Hủy lịch khám bệnh"
          description={
            <>
              <Typography.Text>Xác nhận hủy lịch ngày: </Typography.Text>{" "}
              <strong>
                {record.date} - {record.time}?
              </strong>
            </>
          }
          onConfirm={() => handleCancelAppmt(record)}
          okText="Xác nhận"
          cancelText="Không"
        >
          <Tooltip title="Hủy lịch khám">
            <Button type="default" danger size="small">
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Popconfirm>
      </>
    ) : (
      <Tooltip title="Chỉ có thể hủy/thay đổi trước 2 giờ">
        <Button type="text" icon={<InfoCircleOutlined />} />
      </Tooltip>
    );
  };

  const columns = [
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (createdAt) => {
        return dayjs(createdAt).format("HH:mm:ss DD/MM/YYYY");
      },
    },
    {
      title: "Ngày khám",
      dataIndex: "date",
      width: 120,
      key: "date",
      render: (text) => {
        return dayjs(text, "DD/MM/YYYY").format("DD/MM/YYYY");
      },
    },
    {
      width: 120,
      title: "Giờ dự kiến",
      dataIndex: "time",
      align: "center",
      key: "time",
      render: (text) => {
        return dayjs(text, "HH:mm").format("HH:mm");
      },
    },
    {
      title: "Chuyên khoa",
      dataIndex: "specialty",
      key: "specialty",
      render: (key) => {
        return SpecialtiesMap[key];
      },
    },
    {
      width: 150,
      title: "Bác sĩ",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctor) => {
        return doctor?.fullName || "Chưa xác định";
      },
    },
    {
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      key: "status",
      render: (key) => {
        return (
          <Tag color={STATUS_BOOKING_COLOR[key]}>{STATUS_BOOKING_STR[key]}</Tag>
        );
      },
    },
    {
      title: "Hành động",
      width: 150,
      key: "action",
      align: "center",
      render: (text, record) => {
        return <Flex gap={10} justify="center">{hasPermissionEdit(record)}</Flex>;
      },
    },
  ];

  useEffect(() => {
    const initData = async () => {
      // Replace this with the actual API call to fetch appointments
      const { appointments } = await getListAppointment({
        patientId: selectedPatient?._id,
        status: STATUS_BOOKING.booked,
      });
      setAppointments(appointments);
    };
    if (visible && selectedPatient?._id) {
      initData();
    }
  }, [selectedPatient?._id, visible, reload, reloadSchedule]);

  const table = (
    <Table
      scroll={{ y: 300 }}
      rowKey="_id"
      columns={columns}
      dataSource={appointments}
      style={{ marginTop: "20px" }}
    />
  );
  if (isPage) {
    return table;
  }
  return (
    <Modal
      width={1000}
      title={`Lịch hẹn khám bệnh: ${
        selectedPatient?.fullName || "Chưa xác định"
      } - ${selectedPatient?.phone} `}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      {table}
    </Modal>
  );
};

export default ViewScheduleModal;
