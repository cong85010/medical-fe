import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const AddMedicineModal = ({ visible, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSave(values);
      form.resetFields();
      setLoading(false);
    } catch (error) {
      console.error('Validation failed:', error);
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title="Thêm thuốc"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="medicineName" label="Tên thuốc" rules={[{ required: true, message: 'Vui lòng nhập tên thuốc' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="timing" label="Thời điểm uống">
          <Select>
            <Select.Option value="Trước ăn">Trước ăn</Select.Option>
            <Select.Option value="Sau ăn">Sau ăn</Select.Option>
            <Select.Option value="Sáng">Sáng</Select.Option>
            <Select.Option value="Trưa">Trưa</Select.Option>
            <Select.Option value="Chiều">Chiều</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMedicineModal;
