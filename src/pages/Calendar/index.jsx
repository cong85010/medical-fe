import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import AddMeetingRoomModal from "src/components/AddMeetingRoom";
import dayjs from "dayjs";
import { Avatar, Flex, List, Space } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
export default function CalendarPage() {
  const [selectedMetting, setSelectedMetting] = useState(null);
  const [visibleAddMeetingRoom, setVisibleAddMeetingRoom] = useState(false);
  const [currentEvents, setCurrentEvents] = useState([
    {
      id: "12315",
      title: "All-day event",
      timeStart: '14:32',

    },
    {
      id: "5123",
      title: "Timed event",
      date: "2022-09-28",
    },
  ]);

  const handleDateClick = (selected) => {
    const meeting = {
      dateStart: selected.startStr,
      timeStart: dayjs(selected.start).format("HH:mm"),
      dateEnd: selected.endStr,
      timeEnd: dayjs(selected.end).format("HH:mm"),
    };

    setSelectedMetting(meeting);
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

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };

  const onCancel = () => {
    setVisibleAddMeetingRoom(false);
  };
  return (
    <div>
      <Flex>
        <List
          style={{ width: "400px" }}
          itemLayout="horizontal"
          dataSource={currentEvents}
          renderItem={(event) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<ClockCircleOutlined />} />}
                title={event.title}
                description={
                  <Space direction="vertical">
                    <div>{`Start Time: ${event.timeStart}`}</div>
                    <div>{`End Time: ${event.timeEnd}`}</div>
                    {/* Add more details as needed */}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
        <div style={{ width: "100%" }}>
          <FullCalendar
            height="80vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            themeSystem="bootstrap"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            events={currentEvents}
            eventClick={handleEventClick}
            // eventsSet={(events) => setCurrentEvents(events)}
          />
        </div>
      </Flex>
      <AddMeetingRoomModal
        visible={visibleAddMeetingRoom}
        onCancel={onCancel}
        selectedMetting={selectedMetting}
      />
    </div>
  );
}
