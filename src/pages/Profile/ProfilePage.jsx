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
  getSourceImage,
} from "src/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "src/api/user";
import dayjs from "dayjs";
import { reLoginAuth } from "src/redux/slices/authSlice";
import { uploadFiles } from "src/api/upload";
import { Link } from "react-router-dom";

const { Option } = Select;
const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);

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

  const props = {
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: async (file) => {
      try {
        const notShowError = file.type.includes("image");
        if (!notShowError) {
          message.error(`${file.name} is not a png file`);
          return;
        }
        // only 2mb
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          notification.error({
            message: "Kích thước ảnh phải nhỏ hơn 2MB",
          });
          return;
        }

        let photo = imageUrl;
        const { fileURLs } = await uploadFiles([file]);
        photo = fileURLs[0];
        setImageUrl(photo);
        return false;
      } catch (error) {
        console.log("====================================");
        console.log("error", error);
        console.log("====================================");
      }
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title
        title="Cập nhật tài khoản"
        styleContainer={{
          justifyContent: "space-between",
        }}
        right={<Link to="/change-pass">Đổi mật khẩu</Link>}
      />
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
              showUploadList={false}
              className="avatar-uploader"
              accept="image/png,image/jpeg,image/jpg"
              {...props}
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {imageUrl ? (
                <img
                  src={getSourceImage(imageUrl)}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
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
