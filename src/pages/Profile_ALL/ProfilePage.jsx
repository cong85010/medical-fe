import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Flex,
  Avatar,
  DatePicker,
  Select,
  notification,
} from "antd";
import {
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Title from "src/components/Title";
import {
  TYPE_EMPLOYEE,
  TYPE_EMPLOYEE_STR,
  beforeUpload,
  getBase64,
} from "src/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "src/api/user";
import dayjs from "dayjs";
import { reLoginAuth } from "src/redux/slices/authSlice";

const { Option } = Select;
const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user?._id) {
      form.setFieldsValue({
        gender: "male",
        ...user,
        birthday: dayjs(user.birthday),
        userTypeStr: TYPE_EMPLOYEE_STR[user.userType].toUpperCase(),
      });
      setImageUrl(user.photo);
    }
  }, [form, user]);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const result = await updateUser({ ...user, ...values, photo: imageUrl });
      notification.success({
        message: "Cập nhật tài khoản thành công!",
      });
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(reLoginAuth({ token }));
      }
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title title="Cập nhật tài khoản" />
      <Flex justify="center" align="center">
        <Form
          form={form}
          name="update-account"
          onFinish={onFinish}
          style={{ width: 500 }}
          labelCol={{ span: 6 }}
          labelAlign="left"
        >
          <Form.Item
            label="Avatar"
            name="photo"
            valuePropName="photo"
            getValueFromEvent={(e) => e.photo}
          >
            <Upload
              name="photo"
              listType="picture-circle"
              className="avatar-uploader"
              accept="image/png,image/jpeg,image/jpg"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              beforeUpload={beforeUpload}
              onChange={handleChange}
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
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
                required: user.userType !== TYPE_EMPLOYEE.user,
                message: "Vui lòng nhập email!",
              },
              { type: "email", message: "Vui lòng nhập đúng format!" },
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
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input disabled={user.userType !== TYPE_EMPLOYEE.admin} />
          </Form.Item>

          <Form.Item label="Chức vụ" name="userTypeStr">
            <Input disabled />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  );
};

export default ProfilePage;
