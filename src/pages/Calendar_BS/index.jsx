import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import AddMeetingRoomModal from "src/components/AddMeetingRoom";
import dayjs from "dayjs";
import {
  Avatar,
  Descriptions,
  Flex,
  List,
  Modal,
  Space,
  Tag,
  Typography,
} from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { getListAppointment } from "src/api/appointment";
import { useSelector } from "react-redux";
import {
  FORMAT_DATE,
  FORMAT_TIME,
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  TIME_PHYSICAL_EXAM,
  formatedDate,
  formatedTime,
  getSpecialtyName,
} from "src/utils";
export default function CalendarPage() {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reload, setReload] = useState(false);
  const [filterDate, setFilterDate] = useState({
    startDate: dayjs().startOf("month").format(FORMAT_DATE),
    endDate: dayjs().endOf("month").format(FORMAT_DATE),
  });

  const [visibleAddMeetingRoom, setVisibleAddMeetingRoom] = useState(false);
  const [visibleAppointmentPatient, setVisibleAppointmentPatient] =
    useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const initData = async () => {
      // Replace this with the actual API call to fetch appointments
      const { appointments } = await getListAppointment({
        doctorId: user?._id,
        status: STATUS_BOOKING.booked,
        ...filterDate,
      });
      setAppointments(appointments);
    };
    if (user?._id) {
      initData();
    }
  }, [filterDate, reload, user]);

  const onChangeDate = function (start, end) {
    setFilterDate({
      startDate: formatedDate(start, "YYYY-MM-DD"),
      endDate: formatedDate(end, "YYYY-MM-DD"),
    });
  };

  const handleDateClick = (selected) => {
    const meeting = {
      dateStart: selected.startStr,
      timeStart: dayjs(selected.start).format("HH:mm"),
      dateEnd: selected.endStr,
      timeEnd: dayjs(selected.end).format("HH:mm"),
    };

    setSelectedMeeting(meeting);
    setVisibleAddMeetingRoom(true);
    return;
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  const handleEventClick = ({ event }) => {
    setVisibleAppointmentPatient(true);
    setSelectedMeeting(event.extendedProps.appointment);
  };

  const onCancel = () => {
    setVisibleAddMeetingRoom(false);
  };

  const renderEvents = useMemo(() => {
    return appointments.map((appointment) => {
      return {
        id: appointment._id,
        title: `Khám bệnh:`,
        date: dayjs(
          `${appointment.date} ${appointment.time}`,
          "DD/MM/YYYY HH:mm"
        ).format("YYYY-MM-DD HH:mm"),
        time: appointment.time,
        disabled: true,
        appointment,
      };
    });
  }, [appointments]);

  const appointmentsFromToDay = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        dayjs(appointment.date, FORMAT_DATE).isSame(dayjs(), "day") ||
        dayjs(appointment.date, FORMAT_DATE).isAfter(dayjs(), "day")
    );
  }, [appointments]);

  return (
    <div>
      <Flex>
        <Space direction="vertical" style={{ width: 350 }}>
          <Typography.Title level={4}>Lịch hẹn</Typography.Title>
          <List
            itemLayout="horizontal"
            dataSource={appointmentsFromToDay}
            renderItem={(event) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={`KH: ${event.patientId?.fullName}`}
                  description={
                    <Space direction="vertical">
                      <Typography.Text strong>
                        {`${event.time} - ${event.date}`}
                      </Typography.Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Space>
        <div style={{ width: "100%" }}>
          <FullCalendar
            height="80vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            themeSystem="bootstrap"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            eventDateFormat={FORMAT_DATE}
            eventTimeFormat={{ hour12: false }}
            select={handleDateClick}
            events={renderEvents}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            datesSet={(dateInfo) => {
              console.log(dateInfo);
              onChangeDate(dateInfo.startStr, dateInfo.endStr);
            }}
          />
        </div>
      </Flex>
      <AddMeetingRoomModal
        visible={visibleAddMeetingRoom}
        onCancel={onCancel}
        selectedMeeting={selectedMeeting}
      />
      <Modal
        title={`Lịch khám bệnh nhân: ${selectedMeeting?.patientId?.fullName}`}
        open={visibleAppointmentPatient}
        onCancel={() => setVisibleAppointmentPatient(false)}
        footer={null}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Bệnh nhân">
            {selectedMeeting?.patientId?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Điện thoại">
            {selectedMeeting?.patientId?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày khám">
            {selectedMeeting?.date}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian" style={{ fontWeight: "bold" }}>
            {selectedMeeting?.time} ~{" "}
            {formatedTime(
              dayjs(selectedMeeting?.time, FORMAT_TIME).add(
                TIME_PHYSICAL_EXAM,
                "minute"
              )
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Chuyên khoa">
            {getSpecialtyName(selectedMeeting?.specialty)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={STATUS_BOOKING_COLOR[selectedMeeting?.status]}>
              {STATUS_BOOKING_STR[selectedMeeting?.status]}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <Space>
      <i>{eventInfo.event.title}</i>
      <b>{eventInfo.event.extendedProps.time}</b>
    </Space>
  );
}
