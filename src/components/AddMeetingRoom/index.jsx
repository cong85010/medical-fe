import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  TimePicker,
  InputNumber,
  Col,
  Row,
  DatePicker,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  FORMAT_DATE,
  FORMAT_DATE_TIME,
  FORMAT_TIME,
  formatedTime,
} from "src/utils";
import { UploadOutlined } from "@ant-design/icons";
import { createMeetingRoom } from "src/api/meetingRoom";
import { uploadFiles } from "src/api/upload";
import { useSelector } from "react-redux";
const { Option } = Select;

const range = (start, end, skips = []) => {
  const result = [];
  for (let i = start; i < end; i++) {
    if (skips.includes(i)) {
      continue;
    }
    result.push(i);
  }
  return result;
};

const AddMeetingRoomModal = ({
  visible,
  selectedMeeting = {},
  onCancel,
  onAddMeetingRoom,
}) => {
  const [form] = Form.useForm();
  const [meetingType, setMeetingType] = useState("offline");
  const [fileList, setFileList] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      // Validate that the end time is after the start time
      const { date, startDate, endDate } = values;
      const startDateTime = dayjs(
        `${date.format(FORMAT_DATE)} ${startDate.format(FORMAT_TIME)}`,
        FORMAT_DATE_TIME
      );
      const endDateTime = dayjs(
        `${date.format(FORMAT_DATE)} ${endDate.format(FORMAT_TIME)}`,
        FORMAT_DATE_TIME
      );

      // If the start time is before current time, show error
      if (startDateTime.isBefore(dayjs())) {
        form.setFields([
          {
            name: "startDate",
            errors: ["Thời gian bắt đầu phải sau thời gian hiện tại"],
          },
        ]);
        return;
      }

      if (startDateTime.isAfter(endDateTime)) {
        form.setFields([
          {
            name: "endDate",
            errors: ["Thời gian kết thúc phải sau thời gian bắt đầu"],
          },
        ]);
        return;
      }

      let files = [];
      if (fileList.length > 0) {
        const { fileURLs } = await uploadFiles(fileList);
        files = fileURLs;
      }

      const meetingRoom = {
        ...values,
        startDate: startDateTime,
        endDate: endDateTime,
        files: files,
        owner: user._id,
      };

      createMeetingRoom(meetingRoom).then((response) => {
        message.success("Tạo cuộc họp thành công");
        setFileList([]);
        form.resetFields();
        onAddMeetingRoom();
      });
    });
  };

  const handleCancel = () => {
    setFileList([]);
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        date: selectedMeeting.startDate,
      });
    }
  }, [form, visible, selectedMeeting]);

  if (!visible) return <></>;

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day").add(18);
  };

  const workingHours = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18];
  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24, workingHours),
  });

  const beforeDateDisabled = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const props = {
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);

      if (medicalRecord) {
        const fileIdx = medicalRecord.files.findIndex(
          (item) => item === file.name
        );

        if (fileIdx !== -1) {
          medicalRecord.files.splice(fileIdx, 1);
        }
      }
    },
    beforeUpload: (file) => {
      const notShowError =
        file.type.includes("image") ||
        file.type.includes("document") ||
        file.type.includes("pdf");
      if (!notShowError) {
        message.error(`${file.name} is not a png file`);
        return;
      }

      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const optionsRoom = [
    { value: "room1", label: "Room 1" },
    { value: "room2", label: "Room 2" },
    { value: "room3", label: "Room 3" },
  ];

  return (
    <Modal
      title="Tạo lịch họp"
      open={visible}
      onOk={handleOk}
      okText="Tạo cuộc họp"
      cancelText="Hủy"
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          startDate: dayjs().startOf("hour").add(1, "hour"),
          endDate: dayjs().startOf("hour").add(1, "hour").add(30, "minute"),
        }}
      >
        <Form.Item
          name="subject"
          label="Chủ đề cuộc họp"
          rules={[{ required: true, message: "Nhập chủ đề cuộc họp" }]}
        >
          <Input placeholder="Chủ đề cuộc họp" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả cuộc họp"
          rules={[{ required: true, message: "Nhập mô tả cuộc họp" }]}
        >
          <Input.TextArea placeholder="Mô tả" />
        </Form.Item>
        <Form.Item label="Thời gian họp" style={{ marginBottom: "16px" }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="date"
                label="Thời gian bắt đầu"
                rules={[{ required: true, message: "Chọn thời gian bắt đầu" }]}
              >
                <DatePicker
                  placeholder="Chọn ngày họp"
                  format={FORMAT_DATE}
                  style={{ width: "100%" }}
                  disabledDate={beforeDateDisabled}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Thời gian bắt đầu"
                rules={[{ required: true, message: "Chọn thời gian bắt đầu" }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ width: "100%" }}
                  minuteStep={15}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Thời gian kết thúc"
                rules={[{ required: true, message: "Chọn thời gian kết thúc" }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ width: "100%" }}
                  minuteStep={15}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="room"
          label="Phòng họp"
          rules={[{ required: true, message: "Nhập phòng họp" }]}
        >
          <Select
            placeholder="Chọn phòng họp"
            style={{ width: "100%" }}
            options={optionsRoom}
          />
        </Form.Item>
        <Form.Item
          name="participants"
          label="Người tham gia"
          rules={[{ required: true, message: "Chọn người tham gia" }]}
        >
          <Select mode="tags" placeholder="Người tham gia">
            <Option value="participant1">Participant 1</Option>
            <Option value="participant2">Participant 2</Option>
          </Select>
        </Form.Item>
        <Form.Item name="files" label="Đính kèm">
          <Upload {...props} fileList={fileList}>
            <Button icon={<UploadOutlined />}>Đính kèm</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMeetingRoomModal;
