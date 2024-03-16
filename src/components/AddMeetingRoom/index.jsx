import React, { useEffect } from "react";
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
} from "antd";
import dayjs from "dayjs";
const { Option } = Select;
const formatTime = "HH:mm";

const AddMeetingRoomModal = ({
  visible,
  selectedMetting = {},
  onCancel,
  onAddMeetingRoom,
}) => {
  const [form] = Form.useForm();
  const [meetingType, setMeetingType] = React.useState("offline");

  const handleOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      onAddMeetingRoom({ ...values, meetingType });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleMeetingTypeClick = (type) => {
    setMeetingType(type);
    form.setFieldsValue({ meetingType: type });
  };

  const validateEndTime = (_, value) => {
    const timeStart = form.getFieldValue("timeStart");
    if (value && timeStart && value.isSameOrAfter(timeStart)) {
      return Promise.reject("Chọn sau thời gian bắt đầu");
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...selectedMetting,
        timeStart: dayjs(selectedMetting?.timeStart, formatTime),
        timeEnd: dayjs(selectedMetting?.timeEnd, formatTime),
      });
    }
  }, [form, visible, selectedMetting]);

  if (!visible) return <></>;

  return (
    <Modal
      title="Add Meeting Room"
      open={visible}
      onOk={handleOk}
      okText="Tạo cuộc họp"
      cancelText="Hủy"
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="subject"
          label="Chủ đề cuộc họp"
          rules={[{ required: true, message: "Nhập chủ đề cuộc họp" }]}
        >
          <Input />
        </Form.Item>

        <div style={{ marginBottom: "16px" }}>
          <Button
            type={meetingType === "online" ? "primary" : "default"}
            onClick={() => handleMeetingTypeClick("online")}
            style={{ marginRight: "8px" }}
          >
            Trực tuyến
          </Button>
          <Button
            type={meetingType === "offline" ? "primary" : "default"}
            onClick={() => handleMeetingTypeClick("offline")}
          >
            Trực tiếp
          </Button>
        </div>
        {form.getFieldValue("meetingType") === "online" && (
          <Form.Item
            name="link"
            label="Link tham gia"
            rules={[{ required: true, message: "Nhập link tham gia" }]}
          >
            <Input />
          </Form.Item>
        )}
        {meetingType === "offline" && (
          <Form.Item
            name="roomLocation"
            label="Phòng họp"
            rules={[{ required: true, message: "Nhập địa chỉ phòng" }]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item label="Meeting Time" style={{ marginBottom: "16px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="timeStart"
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
                name="timeEnd"
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
          name="participants"
          label="Participants"
          rules={[{ required: true, message: "Chọn người tham gia" }]}
        >
          <Select mode="tags" placeholder="Người tham gia">
            <Option value="participant1">Participant 1</Option>
            <Option value="participant2">Participant 2</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMeetingRoomModal;
