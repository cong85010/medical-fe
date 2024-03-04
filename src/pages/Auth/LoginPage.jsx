import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAuth } from "src/redux/slices/authSlice";
import { TYPE_EMPLOYEE } from "src/utils";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    //Trim values
    values.phone = values.phone.trim();
    values.password = values.password.trim();
    const { user } = await dispatch(loginAuth(values)).unwrap();

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
        navigate("/medical");
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
          Đăng nhập
        </Typography.Title>
        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Nhập số điện thoại hoặc email",
            }
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Số điện thoại/Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Nhập password!",
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
            style={{ marginBottom: 10 }}
          >
            Đăng nhập
          </Button>
          Hoặc <Link to="/register">Đăng ký ngay!</Link>
        </Form.Item>
      </Form>
    </Flex>
  );
};
export default LoginPage;
