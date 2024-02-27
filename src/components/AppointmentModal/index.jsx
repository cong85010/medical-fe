import React from "react";
import { Modal, Descriptions, Form, Input, DatePicker, Select } from "antd";
import SpaceDiv from "../SpaceDiv";

const { Option } = Select;

const AppointmentModal = ({ visible, onCancel, onOk, selectedRecord }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
    });
  };

  return (
    <Modal
      title="Đặt lịch khám bệnh"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Đặt lịch"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{selectedRecord?.id}</Descriptions.Item>
          <Descriptions.Item label="Tên bệnh nhân">
            {selectedRecord?.patientName}
          </Descriptions.Item>
          <Descriptions.Item label="Chuẩn đoán">
            {selectedRecord?.diagnosis}
          </Descriptions.Item>
        </Descriptions>
        <SpaceDiv height={20} />
        <Form.Item
          name="appointmentDate"
          label="Ngày khám"
          rules={[{ required: true, message: "Vui lòng chọn ngày khám!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="serviceType"
          label="Loại dịch vụ"
          rules={[{ required: true, message: "Vui lòng chọn loại dịch vụ!" }]}
        >
          <Select placeholder="Chọn loại dịch vụ">
            <Option value="normal">Khám Thường</Option>
            <Option value="service">Khám Dịch vụ</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^[0-9]+$/,
              message: "Số điện thoại chỉ được chứa chữ số!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* Thêm các trường khác nếu cần */}
      </Form>
    </Modal>
  );
};

export default AppointmentModal;
