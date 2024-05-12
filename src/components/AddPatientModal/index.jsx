import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Flex,
  notification,
  Select,
} from "antd";
import { createPatient, updateUser } from "src/api/user";
import dayjs from "dayjs";
const Option = Select.Option;
const AddPatientModal = ({ visible, onCancel, onFinish, selectedPatient }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && selectedPatient && form) {
      form.setFieldsValue({
        ...selectedPatient,
        birthday: dayjs(selectedPatient.birthday),
      });
    }
  }, [form, selectedPatient, visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        let result = {};
        if (selectedPatient) {
          result = await updateUser({ ...selectedPatient, ...values });
          notification.success({
            message: "Cập nhật bệnh nhân thành công!",
          });
        } else {
          result = await createPatient(values);
          notification.success({
            message: "Tạo bệnh nhân thành công!",
          });
        }

        form.resetFields();
        onFinish(result?.user);
      })
      .catch((errorInfo) => {
        console.log("Failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={selectedPatient ? "Cập nhật bệnh nhân" : "Thêm bệnh nhân"}
      open={visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          {
            selectedPatient ? "Cập nhật" : "Thêm"
          }
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          gender: "male",
        }}
      >
        <Form.Item
          name="fullName"
          label="Họ tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Họ tên bệnh nhân" />
        </Form.Item>
        <Flex gap={20} justify="space-between">
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: new RegExp(/^\d{10,12}$/),
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker format="DD/MM/YYYY" placeholder="Ngày sinh" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng giới tính!" }]}
          >
            <Select style={{ width: 100 }}>
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
            </Select>
          </Form.Item>
        </Flex>
        <Form.Item name="address" label="Địa chỉ">
          <Input placeholder="Địa chỉ" />
        </Form.Item>
        <Form.Item name="note" label="Lưu ý">
          <Input.TextArea placeholder="Thông tin chi tiết" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPatientModal;
