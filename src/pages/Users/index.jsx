import { PlusCircleFilled, PlusCircleOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Table,
  Typography,
  Tag,
  Space,
  Flex,
  Button,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import React, { useState } from "react";
import SpaceDiv from "src/components/SpaceDiv";
import Title from "src/components/Title";
import { TYPE_EMPLOYEE_STR, colorOfType } from "src/utils/constant";
const { Option } = Select;
export default function UsersPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Kiểu tài khoản",
      key: "type",
      dataIndex: "type",
      render: (_, { type }) => (
        <>
          <Tag color={colorOfType[type]} key={type}>
            {type?.toUpperCase()}
          </Tag>
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        form.resetFields();
        setIsVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <div>
      <Title title="Quản lý người dùng" />
      <Flex justify="end" style={{ marginBottom: 10 }}>
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={() => setIsVisible(true)}
        >
          Thêm người dùng
        </Button>
      </Flex>
      <Table columns={columns} dataSource={data} />
      <Modal
        open={isVisible}
        title="Thêm người dùng"
        onOk={handleOk}
        okText="Thêm"
        cancelText="Hủy"
        onCancel={handleCancel}
      >
        <Form
          name="addUserForm"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập username" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Vui lòng nhập đúng format!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kiểu tài khoản"
            name="type"
            rules={[{ required: true, message: "Chọn kiểu tài khoản!" }]}
          >
            <Select>
              <Option value="doctor">Bác sĩ</Option>
              <Option value="administrative">Nhân viên hành chánh</Option>
              <Option value="sales">Nhân viên bán hàng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
