// ViewScheduleModal.js
import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Calendar } from "antd";
import { getListAppointment } from "src/api/appointment";
import dayjs from "dayjs";
import { STATUS_BOOKING, SpecialtiesMap } from "src/utils";

const ViewScheduleModal = ({ visible, selectedPatient, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleOk = () => {
    // Handle the logic when OK button is clicked
    console.log("Selected date:", selectedDate);
    // Add your logic here, such as fetching schedule for the selected date
    onCancel();
  };

  const columns = [
    {
      title: "Ngày khám",
      dataIndex: "date",
      key: "date",
      render: (text) => {
        return dayjs(text, "DD/MM/YYYY").format("DD/MM/YYYY");
      },
    },
    {
      title: "Giờ dự kiến",
      dataIndex: "time",
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (key) => {
        return STATUS_BOOKING[key];
      },
    },
  ];

  useEffect(() => {
    const initData = async () => {
      // Replace this with the actual API call to fetch appointments
      const { appointments } = await getListAppointment(selectedPatient._id);
      setAppointments(appointments);
    };
    if (visible && selectedPatient?._id) {
      initData();
    }
  }, [selectedPatient?._id, visible]);

  return (
    <Modal
      width={600}
      title={`Lịch hẹn khám bệnh: ${selectedPatient?.fullName || "Chưa xác định"} - ${selectedPatient?.phone} `}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Table
        scroll={{ y: 300 }}
        rowKey="_id"
        columns={columns}
        dataSource={appointments}
        style={{ marginTop: "20px" }}
      />
    </Modal>
  );
};

export default ViewScheduleModal;
