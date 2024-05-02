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
  Badge,
  Button,
  Card,
  Descriptions,
  Flex,
  List,
  Modal,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  ClockCircleOutlined,
  EyeOutlined,
  InfoOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getListAppointment } from "src/api/appointment";
import { useSelector } from "react-redux";
import {
  FORMAT_DATE,
  FORMAT_DATE_MONGO_ISO,
  FORMAT_TIME,
  STATUS_BOOKING,
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_STR,
  TIME_PHYSICAL_EXAM,
  TYPE_CALENDAR,
  formatedDate,
  formatedTime,
  getSpecialtyName,
} from "src/utils";
import { getListMeetingRoom } from "src/api/meetingRoom";
export default function CalendarPage() {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [activeList, setActiveList] = useState(1);
  const [reload, setReload] = useState(false);
  const [filterDate, setFilterDate] = useState({
    startDate: dayjs().startOf("month").format(FORMAT_DATE),
    endDate: dayjs().endOf("month").format(FORMAT_DATE),
  });
  const [loading, setLoading] = useState(false);

  const [visibleAddMeetingRoom, setVisibleAddMeetingRoom] = useState(false);
  const [visibleAppointmentPatient, setVisibleAppointmentPatient] =
    useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      // Replace this with the actual API call to fetch appointments
      // const { appointments } = await getListAppointment({
      //   doctorId: user?._id,
      //   status: STATUS_BOOKING.booked,
      //   ...filterDate,
      // });
      // setAppointments(appointments);
      const { meetings: results } = await getListMeetingRoom({
        participant: user?._id,
        ...filterDate,
      });
      setMeetings(results);
      setLoading(false);
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
    let startDate = selected.start;
    let endDate = selected.end;

    const meeting = {
      startDate: dayjs(startDate),
      endDate: dayjs(endDate),
    };

    setSelectedMeeting(meeting);
    setVisibleAddMeetingRoom(true);
  };

  const handleEventClick = ({ event }) => {
    setVisibleAppointmentPatient(true);
    setSelectedMeeting(event.extendedProps.appointment);
  };

  const onCancel = () => {
    setVisibleAddMeetingRoom(false);
  };

  const renderEvents = useMemo(() => {
    const appointmentEvents = appointments.map((appointment) => {
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
        type: TYPE_CALENDAR.appointment,
      };
    });

    const meetingEvents = meetings.map((meeting) => {
      return {
        id: meeting._id,
        title: `Cuộc họp: ${meeting.subject}`,
        date: dayjs(meeting.startDate).format("YYYY-MM-DD HH:mm"),
        time: `${formatedTime(
          meeting.startDate,
          FORMAT_DATE_MONGO_ISO
        )} - ${formatedTime(meeting.endDate, FORMAT_DATE_MONGO_ISO)}`,
        backgroundColor: "green",
        borderColor: "green",
        meeting: meeting,
        type: TYPE_CALENDAR.meeting,
      };
    });

    return [...appointmentEvents, ...meetingEvents];
  }, [appointments, meetings]);

  const filtersMeetings = useMemo(() => {
    if (activeList === 1)
      return meetings.filter((meeting) => {
        return dayjs(meeting.startDate).isSame(dayjs(), "day");
      });
    return meetings;
  }, [meetings, activeList]);

  return (
    <div>
      <Flex>
        <Space direction="vertical" style={{ width: 350, paddingRight: 10 }}>
          <Typography.Title level={4}>Danh sách</Typography.Title>
          <div style={{ height: "75vh", overflow: "auto" }}>
            <Space>
              <Button
                type={activeList === 0 ? "primary" : "default"}
                onClick={() => setActiveList(0)}
              >
                Tất cả
              </Button>
              <Button
                type={activeList === 1 ? "primary" : "default"}
                onClick={() => setActiveList(1)}
              >
                Hôm nay
              </Button>
            </Space>
            <List
              style={{ paddingRight: 20 }}
              itemLayout="horizontal"
              dataSource={filtersMeetings}
              renderItem={(meeting) => (
                <List.Item style={{ width: "100%" }}>
                  <Card
                    style={{ width: "100%" }}
                    styles={{ body: { padding: 10 } }}
                  >
                    <Badge.Ribbon
                      color="orange"
                      text="Cuộc họp"
                      style={{ top: -15, right: -18 }}
                    >
                      <List.Item.Meta
                        style={{ width: "100%", padding: 5 }}
                        title={`${meeting.subject}`}
                        description={
                          <Flex justify="space-between">
                            <Space direction="horizontal" size={"small"}>
                              <ClockCircleOutlined />
                              <Typography.Text style={{ fontSize: 12 }}>
                                {`
                                 ${formatedTime(
                                   meeting.startDate,
                                   FORMAT_DATE_MONGO_ISO,
                                   FORMAT_DATE
                                 )}
                                 -
                                ${formatedTime(
                                  meeting.startDate,
                                  FORMAT_DATE_MONGO_ISO
                                )} - ${formatedTime(
                                  meeting.endDate,
                                  FORMAT_DATE_MONGO_ISO
                                )}
                               
                                `}
                              </Typography.Text>
                            </Space>
                            <Button type="text" icon={<SolutionOutlined />} />
                          </Flex>
                        }
                      />
                    </Badge.Ribbon>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </Space>
        <div style={{ width: "100%" }}>
          <FullCalendar
            height="80vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            themeSystem="bootstrap"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "today",
            }}
            buttonText={{ today: "Hiện tại" }}
            loading={loading}
            initialView="dayGridMonth"
            locale="vi"
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
        onAddMeetingRoom={() => {
          setReload(!reload);
          setVisibleAddMeetingRoom(false);
        }}
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
    <Space direction="vertical">
      <i>{eventInfo.event.title}</i>
      <b>{eventInfo.event.extendedProps.time}</b>
    </Space>
  );
}
