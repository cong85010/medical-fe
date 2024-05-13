import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { changePassword } from "src/api/auth";
import Title from "src/components/Title";

export default function ChangePassPage() {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    if (values.oldPassword === values.password) {
      notification.error({
        message: "Mật khẩu mới không được trùng với mật khẩu cũ",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await changePassword({
        password: values.password,
        oldPassword: values.oldPassword,
        userId: user._id,
      });

      notification.success({
        message: "Cập nhật mật khẩu thành công",
      });
    } catch (err) {

      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Title title="Đổi mật khẩu" />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Form
          name="change-pass"
          onFinish={onFinish}
          disabled={loading}
          style={{ width: 500 }}
          labelCol={{ span: 6 }}
          labelAlign="left"
          initialValues={{
            oldPassword: "",
            password: "",
            confirm: "",
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
              {
                min: 6,
                message: "Password phải lớn hơn 6 ký tự!",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              {
                required: true,
                message: "Nhập password!",
              },
              {
                min: 6,
                message: "Password phải lớn hơn 6 ký tự!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Nhập xác nhận password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Password chưa khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              size="large"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
              size="large"
              style={{ marginBottom: 10 }}
              loading={loading}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
