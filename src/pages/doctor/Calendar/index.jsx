import { ClockCircleOutlined, SolutionOutlined } from "@ant-design/icons";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Flex,
  List,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { deleteMeetingRoom, getListMeetingRoom } from "src/api/meetingRoom";
import AddMeetingRoomModal from "src/components/AddMeetingRoom";
import {
  FORMAT_DATE,
  FORMAT_DATE_MONGO_ISO,
  FORMAT_TIME,
  STATUS_MEETING_COLOR,
  STATUS_MEETING_STR,
  TYPE_CALENDAR,
  formatedDate,
  formatedTime,
} from "src/utils";
import { getTypeFile } from "src/utils/utilJsx";
export default function CalendarPage() {
  const [selectedMeeting, setSelectedMeeting] = useState({});
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
      const { meetings: results } = await getListMeetingRoom({
        participant: user?._id,
        owner: user?._id,
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
    setSelectedMeeting(event.extendedProps.meeting);
  };

  const onCancel = () => {
    setVisibleAddMeetingRoom(false);
  };

  const renderEvents = useMemo(() => {
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

    return meetingEvents;
  }, [meetings]);

  const filtersMeetings = useMemo(() => {
    if (activeList === 1)
      return meetings.filter((meeting) => {
        return dayjs(meeting.startDate).isSame(dayjs(), "day");
      });
    return meetings;
  }, [meetings, activeList]);

  const renderDateTime = useMemo(() => {
    if (selectedMeeting?.startDate) {
      return `${formatedDate(
        selectedMeeting.startDate,
        FORMAT_DATE_MONGO_ISO
      )} ${formatedTime(
        selectedMeeting.startDate,
        FORMAT_DATE_MONGO_ISO,
        FORMAT_TIME
      )} - ${formatedTime(
        selectedMeeting.endDate,
        FORMAT_DATE_MONGO_ISO,
        FORMAT_TIME
      )}`;
    }
    return "";
  }, [selectedMeeting]);

  const hanldeEdit = () => {
    setVisibleAppointmentPatient(false);
    setVisibleAddMeetingRoom(true);
  };

  const handleDel = async () => {
    try {
      await deleteMeetingRoom(selectedMeeting._id);
      message.success("Xóa cuộc họp thành công");
      setReload(!reload);
      setVisibleAppointmentPatient(false);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

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
                        style={{ width: "100%", padding: 5, overflow: "hidden" }}
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
                            <Button
                              type="text"
                              onClick={() => {
                                setVisibleAppointmentPatient(true);
                                setSelectedMeeting(meeting);
                              }}
                              icon={<SolutionOutlined />}
                            />
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
            selectable
            selectMirror={true}
            dayMaxEvents={true}
            eventDateFormat={FORMAT_DATE}
            eventTimeFormat={{ hour12: false }}
            select={handleDateClick}
            events={renderEvents}
            eventClick={handleEventClick}
            droppable={false}
            drop={false}
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
        title={`Cuộc họp về: ${selectedMeeting?.subject} | Phòng: ${selectedMeeting?.room} | ${renderDateTime}`}
        open={visibleAppointmentPatient}
        onCancel={() => setVisibleAppointmentPatient(false)}
        footer={null}
        width={700}
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item
            span={2}
            label="Chủ đề"
            style={{
              width: 150,
            }}
          >
            {selectedMeeting.subject}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng">
            {selectedMeeting.room}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày">
            <strong>
              {formatedDate(selectedMeeting.startDate, FORMAT_DATE_MONGO_ISO)}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Giờ bắt đầu">
            <strong>
              {formatedTime(
                selectedMeeting.startDate,
                FORMAT_DATE_MONGO_ISO,
                FORMAT_TIME
              )}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Giờ kết thúc">
            <strong>
              {formatedTime(
                selectedMeeting.endDate,
                FORMAT_DATE_MONGO_ISO,
                FORMAT_TIME
              )}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">
            {selectedMeeting.owner?.fullName}{" "}
            {selectedMeeting.owner?._id === user?._id && (
              <Tag color="blue">Bạn</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {selectedMeeting.owner?.phone}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Trạng thái">
            <Tag color={STATUS_MEETING_COLOR[selectedMeeting.status]}>
              {STATUS_MEETING_STR[selectedMeeting.status]}
            </Tag>
          </Descriptions.Item> */}
          <Descriptions.Item label="Mô tả" span={2} style={{ height: 100 }}>
            {selectedMeeting.description}
          </Descriptions.Item>
          <Descriptions.Item label="Đính kèm" span={2}>
            <Flex gap={5} align="center">
              {selectedMeeting?.files?.map((file) => getTypeFile(file))}
            </Flex>
          </Descriptions.Item>
          <Descriptions.Item label="Hành động">
            {selectedMeeting.owner?._id === user?._id &&
              dayjs(selectedMeeting.startDate).isAfter(dayjs()) && (
                <Flex gap={10}>
                  <Button onClick={hanldeEdit} type="primary">
                    Chỉnh sửa
                  </Button>
                  <Popconfirm
                    title="Xác nhận"
                    description="Xác nhận xóa cuộc họp"
                    okText="Xác nhận"
                    cancelText="Hủy"
                    onConfirm={handleDel}
                  >
                    <Button type="primary" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Flex>
              )}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <Space direction="vertical" style={{ overflow: "hidden" }}>
      <i>{eventInfo.event.title}</i>
      <b>{eventInfo.event.extendedProps.time}</b>
    </Space>
  );
}
