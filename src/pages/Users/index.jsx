import {
  LockOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
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
  notification,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { changeActiveStatus, createUser, getUsers } from "src/api/user";
import SpaceDiv from "src/components/SpaceDiv";
import Title from "src/components/Title";
import { TYPE_EMPLOYEE_STR, colorOfType } from "src/utils";
const { Option } = Select;

export default function UsersPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1,
  });

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
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Kiểu tài khoản",
      key: "userType",
      dataIndex: "userType",
      render: (_, { userType }) => (
        <>
          <Tag color={colorOfType[userType]} key={userType}>
            {TYPE_EMPLOYEE_STR[userType].toUpperCase()}
          </Tag>
        </>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "activeStatus",
      key: "activeStatus",
      render: (_, { activeStatus }) => (
        <>
          <Tag color={activeStatus ? "green" : "red"} key={activeStatus}>
            {activeStatus ? "Đang hoạt động" : "Đã khóa"}
          </Tag>
        </>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip
            title={
              record?.activeStatus ? "Bạn muốn khóa ?" : "Bạn muốn mở khóa?"
            }
          >
            <Button type="text" onClick={() => handleStatus(record)}>
              {record?.activeStatus ? <UnlockOutlined /> : <LockOutlined />}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleStatus = async (record) => {
    try {
      const user = {
        _id: record._id,
        activeStatus: !record.activeStatus,
      };
      await changeActiveStatus(user);
      notification.success({
        message: `Tài khoản ${
          user.activeStatus ? "mở khóa" : "khóa"
        } thành công`,
      });
      setReload(!reload);
    } catch (error) {
      console.log(error);
      notification.error({ message: "Có lỗi xảy ra" });
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const result = await createUser(values);
        console.log(result);
        notification.success({ message: "Tạo tài khoản thành công" });
        form.resetFields();
        setIsVisible(false);
        setReload(!reload);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  useEffect(() => {
    const initData = async () => {
      const result = await getUsers();
      setUsers(result.users);
      setPagination({ ...pagination, total: result.total });
    };

    initData();
  }, [reload]);

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
      <Table columns={columns} dataSource={users} />
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
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kiểu tài khoản"
            name="userType"
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
