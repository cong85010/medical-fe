import {
  EditOutlined,
  LockOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
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
  Avatar,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "src/api/auth";
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
  PASSWORD_DEFAULT,
  Specialties,
  TYPE_EMPLOYEE,
  TYPE_EMPLOYEE_STR,
  colorOfType,
  getSourceImage,
} from "src/utils";
const { Option } = Select;

export default function UsersPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState();
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState({
    userTypes: [
      TYPE_EMPLOYEE.doctor,
      TYPE_EMPLOYEE.administrative,
      TYPE_EMPLOYEE.sales,
    ],
    activeStatuses: [true],
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1,
  });
  const [isShowSpecialty, setIsShowSpecialty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "photo",
      width: 60,
      key: "photo",
      render: (photo) => <Avatar src={getSourceImage(photo)} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      width: 170,
      key: "fullName",
    },
    {
      title: "Ngày sinh",
      width: 170,
      ellipsis: true,
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
      width: 90,
      ellipsis: true,
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => {
        return Gender[gender];
      },
    },
    {
      width: 120,
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      width: 150,
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },

    {
      width: 180,
      title: "Chức vụ",
      key: "userType",
      filters: [
        {
          text: TYPE_EMPLOYEE_STR[TYPE_EMPLOYEE.doctor],
          value: TYPE_EMPLOYEE.doctor,
        },
        {
          text: TYPE_EMPLOYEE_STR[TYPE_EMPLOYEE.administrative],
          value: TYPE_EMPLOYEE.administrative,
        },
        {
          text: TYPE_EMPLOYEE_STR[TYPE_EMPLOYEE.sales],
          value: TYPE_EMPLOYEE.sales,
        },
        {
          text: TYPE_EMPLOYEE_STR[TYPE_EMPLOYEE.user],
          value: TYPE_EMPLOYEE.user,
        },
      ],
      filteredValue: filter.userTypes,
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
      width: 150,
      title: "Trạng thái",
      dataIndex: "activeStatus",
      key: "activeStatus",
      filters: [
        {
          text: "Đang hoạt động",
          value: true,
        },
        {
          text: "Dừng hoạt động",
          value: false,
        },
      ],
      filteredValue: filter.activeStatuses,
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
      fixed: "right",
      align: "center",
      width: 150,
      ellipsis: true,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip
            title={
              record?.activeStatus ? "Bạn muốn khóa ?" : "Bạn muốn mở khóa?"
            }
          >
            <Button
              type="text"
              onClick={() => handleStatus(record)}
              icon={
                record?.activeStatus ? <UnlockOutlined /> : <LockOutlined />
              }
            ></Button>
          </Tooltip>
          {record?.userType === TYPE_EMPLOYEE.user ? null : (
            <Tooltip title="Chỉnh sửa thông tin">
              <Button
                type="text"
                onClick={() => handleEdit(record)}
                icon={<EditOutlined />}
              ></Button>
            </Tooltip>
          )}

          <Popconfirm
            title="Khôi phục mật khẩu"
            description={
              "Mật khẩu sẽ được khôi phục về mặc định là " + PASSWORD_DEFAULT
            }
            onConfirm={() => handleResetPassword(record._id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Tooltip title="Khôi phục mật khẩu mặc định" placement="topRight">
              <Button type="text" icon={<ReloadOutlined />}></Button>
            </Tooltip>
          </Popconfirm>
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
      console.log(record);
      setSelectedUser(record);
      setIsShowSpecialty(record.userType === TYPE_EMPLOYEE.doctor);
      form.setFieldsValue({
        ...record,
        birthday: dayjs(record.birthday),
      });
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

  const handleResetPassword = async (id) => {
    try {
      const result = await resetPassword({ userId: id });
      notification.success({ message: "Khôi phục mật khẩu thành công" });
    } catch (error) {
      console.log(error);
      notification.error({ message: "Có lỗi xảy ra" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getUsers({
          searchKey: keyword,
          limit: pagination.pageSize,
          skip: pagination.pageSize * (pagination.current - 1),
          ...filter,
        });
        setUsers(result?.users);
        setPagination({
          ...pagination,
          total: result?.total,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload, pagination.page, filter]);

  const handleCancel = () => {
    setIsVisible(false);
  };

  const handleUserTypeChange = (value) => {
    setIsShowSpecialty(value === TYPE_EMPLOYEE.doctor);
  };

  const handleResearch = () => {
    setKeyword("");
    setReload(!reload);
  };

  const handleTableChange = (pagi, filters, sorter) => {
    setPagination(pagi);

    setFilter((prev) => {
      return {
        userTypes: filters.userType,
        activeStatuses: filters.activeStatus,
      };
    });
  };

  return (
    <div>
      <Title title="Quản lý người dùng" />
      <Flex gap={10} justify="space-between" style={{ marginBottom: 10 }}>
        <Flex gap={10}>
          <Tooltip title="Khôi phục">
            <Button onClick={handleResearch}>
              <ReloadOutlined />
            </Button>
          </Tooltip>
          <Input
            value={keyword}
            placeholder="Tìm kiếm"
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => setReload(!reload)}
          />
          <Button type="primary" onClick={() => setReload(!reload)}>
            <SearchOutlined />
          </Button>
        </Flex>
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={() => setIsVisible(true)}
        >
          Thêm nhân viên
        </Button>
      </Flex>
      <Table
        rowKey={"_id"}
        loading={loading}
        columns={columns}
        dataSource={users}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1300, y: 500 }}
      />
      <Modal
        open={isVisible}
        title={selectedUser ? "Cập nhật nhân viên" : "Thêm nhân viên"}
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
          initialValues={{
            gender: "male",
          }}
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
