import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { register } from "src/api/auth";
import { useDispatch } from "react-redux";
import { registerAuth } from "src/redux/slices/authSlice";
import { TYPE_EMPLOYEE } from "src/utils";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    //Trim values
    values.phone = values.phone.trim();
    values.password = values.password.trim();
    const { user } = await dispatch(registerAuth(values)).unwrap();

    switch (user?.userType) {
      case TYPE_EMPLOYEE.admin:
        navigate("/users");
        break;
      case TYPE_EMPLOYEE.doctor:
        navigate("/calendar");
        break;
      case TYPE_EMPLOYEE.administrative:
        navigate("/profile-medical");
        break;
      case TYPE_EMPLOYEE.sales:
        navigate("/sales");
        break;
      case TYPE_EMPLOYEE.user:
        navigate("/profile");
        break;
      default:
        navigate("/login");
        break;
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url('background.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        style={{
          width: "450px",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Đăng ký
        </Typography.Title>
        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Nhập số điện thoại!",
            },
            {
              pattern: new RegExp(/^\d{10,12}$/),
              message: "Số điện thoại không hợp lệ!",
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            size="large"
            placeholder="Số điện thoại"
          />
        </Form.Item>
        <Form.Item
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
            size="large"
            style={{ marginBottom: 10 }}
          >
            Đăng ký
          </Button>
          Hoặc <Link to="/login">Đăng nhập</Link>
        </Form.Item>
      </Form>
    </Flex>
  );
};
export default RegisterPage;
