import {
  EditOutlined,
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
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  changeActiveStatus,
  createUser,
  getUsers,
  updateUser,
} from "src/api/user";
import SelectSpecialty from "src/components/SelectSpecialty";
import SpaceDiv from "src/components/SpaceDiv";
import Title from "src/components/Title";
import {
  Gender,
  Specialties,
  TYPE_EMPLOYEE,
  TYPE_EMPLOYEE_STR,
  colorOfType,
} from "src/utils";
const { Option } = Select;

export default function UsersPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState();
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1,
  });
  const [isShowSpecialty, setIsShowSpecialty] = useState(false);

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (birthday) => (
        <Typography.Text>
          {dayjs(birthday).format("DD/MM/YYYY")} -{" "}
          {dayjs().diff(birthday, "year")} tuổi
        </Typography.Text>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => {
        return Gender[gender];
      },
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Chức vụ",
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
          <Tooltip title="Chỉnh sửa thông tin">
            <Button type="text" onClick={() => handleEdit(record)}>
              <EditOutlined />
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

  const handleEdit = async (record) => {
    try {
      setSelectedUser(record);
      setIsShowSpecialty(record.userType === TYPE_EMPLOYEE.doctor);
      form.setFieldsValue(record);
      setIsVisible(true);
    } catch (error) {
      console.log(error);
      notification.error({ message: "Có lỗi xảy ra" });
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (values.userType === TYPE_EMPLOYEE.doctor && !values?.specialty) {
          form.validateFields(["specialty"]);
          return;
        }

        if (selectedUser) {
          const result = await updateUser({ ...values, _id: selectedUser._id });
          notification.success({ message: "Cập nhật tài khoản thành công" });
        } else {
          const result = await createUser(values);
          notification.success({ message: "Tạo tài khoản thành công" });
        }
        form.resetFields();
        setIsVisible(false);
        setSelectedUser(null);
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

  const handleUserTypeChange = (value) => {
    setIsShowSpecialty(value === TYPE_EMPLOYEE.doctor);
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
        okText={selectedUser ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          name="addUserForm"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập đúng format!",
              },
            ]}
          >
            <Input />
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
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Địa chỉ" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: new RegExp(/^\d{10,12}$/),
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Chức vụ"
            name="userType"
            rules={[{ required: true, message: "Chọn Chức vụ!" }]}
          >
            <Select onChange={handleUserTypeChange}>
              <Option value="doctor">Bác sĩ</Option>
              <Option value="administrative">Nhân viên hành chánh</Option>
              <Option value="sales">Nhân viên bán hàng</Option>
            </Select>
          </Form.Item>
          {isShowSpecialty && (
            <Form.Item
              label="Specialty"
              name="specialty"
              valuePropName="specialty"
              rules={[{ required: true, message: "Chuyên khoa" }]}
            >
              <SelectSpecialty />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
