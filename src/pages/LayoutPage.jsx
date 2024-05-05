import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  BellOutlined,
  LogoutOutlined,
  GroupOutlined,
  CalendarOutlined,
  FileOutlined,
  UserSwitchOutlined,
  UsergroupAddOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Typography,
  Flex,
  Avatar,
  List,
  Popover,
  Dropdown,
  Card,
  Space,
} from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { TYPE_EMPLOYEE } from "src/utils";
import { useSelector } from "react-redux";
import Title from "src/components/Title";
import dayjs from "dayjs";
const { Header, Sider, Content } = Layout;
const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

const items = [
  {
    key: "1",
    label: (
      <Link to="/profile">
        <UserOutlined /> Thông tin
      </Link>
    ),
  },
  {
    key: "2",
    label: (
      <Link type="/logout">
        <LogoutOutlined /> Đăng xuất
      </Link>
    ),
  },
];

const Clock = () => {
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures effect runs only on mount and unmount

  return (
    <Flex align="center" justify="center">
      <Card styles={{ body: { padding: 10 } }}>
        <Title
          styleContainer={{ margin: 0 }}
          justify="center"
          title={
            <Space>
              <ClockCircleOutlined />
              {time.format("HH:mm:ss")}
            </Space>
          }
        />
      </Card>
    </Flex>
  );
};

const LayoutPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const {
    user: { phone, userType, fullName, photo },
  } = useSelector((state) => state.auth);

  const contentNoti = (
    <List
      style={{ width: 350 }}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
              />
            }
            title={<a href="https://ant.design">{item.title}</a>}
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />
        </List.Item>
      )}
    />
  );

  const menuSidebars = useMemo(() => {
    const menuItems = [];

    switch (userType) {
      case TYPE_EMPLOYEE.admin: {
        menuItems.push({
          key: "users",
          icon: <UsergroupAddOutlined />,
          label: "Người dùng",
          link: "/users",
        });
        break;
      }
      case TYPE_EMPLOYEE.doctor: {
        const menus = [
          {
            key: "calendar",
            icon: <CalendarOutlined />,
            label: "Lịch biểu",
            link: "/calendar",
          },
          {
            key: "examination",
            icon: <GroupOutlined />,
            label: "Khám bệnh",
            link: "/examination",
          },
        ];

        menuItems.push(...menus);
        break;
      }
      case TYPE_EMPLOYEE.administrative: {
        const menus = [
          {
            key: "administrative",
            icon: <UserSwitchOutlined />,
            label: "Hồ sơ bệnh án",
            link: "/profile-medical",
          },
          {
            key: "appointments-patient",
            icon: <GroupOutlined />,
            label: "Khám bệnh",
            link: "/appointments-patient",
          },
        ];

        menuItems.push(...menus);
        break;
      }
      case TYPE_EMPLOYEE.sales: {
        menuItems.push({
          key: "statistics",
          icon: <DashboardOutlined />,
          label: "Thống kê",
          link: "/statistics",
        });
        menuItems.push({
          key: "orders",
          icon: <ShoppingCartOutlined />,
          label: "Đơn hàng",
          link: "/orders",
        });
        menuItems.push({
          key: "sales",
          icon: <ShoppingOutlined />,
          label: "Kê toa",
          link: "/sales",
        });
        menuItems.push({
          key: "medicine",
          icon: <MedicineBoxOutlined />,
          label: "Thuốc",
          link: "/medicine",
        });
        break;
      }
      case TYPE_EMPLOYEE.user: {
        menuItems.push({
          key: "medical",
          icon: <FileOutlined />,
          label: "Bệnh án",
          link: "/medical",
        });
        menuItems.push({
          key: "appointment",
          icon: <CalendarOutlined />,
          label: "Lịch hẹn",
          link: "/appointment",
        });
        break;
      }
      default: {
        break;
      }
    }
    menuItems.push({
      key: "chat",
      icon: <MessageOutlined />,
      label: "Tin nhắn",
      link: "/chat",
    });
    menuItems.push({
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      link: "/logout",
    });
    return menuItems;
  }, [userType]);

  const selectedMenu = () => {
    const menu = menuSidebars.find((menu) =>
      window.location.pathname.includes(menu.link)
    );

    if (menu) {
      return [menu.key];
    }
    return [];
  };

  const onClickMenu = ({ item }) => {
    const { link } = item.props;

    if (link) {
      navigate(link);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={250}
      >
        <Typography.Title
          level={5}
          style={{
            fontWeight: "bold",
            textAlign: "center",
            height: 64,
            lineHeight: "64px",
          }}
        >
          MEDICAL
        </Typography.Title>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedMenu()}
          items={menuSidebars}
          onClick={onClickMenu}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Flex justify="space-between" align="center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Clock />

            <Flex style={{ marginRight: 20 }} align="center" gap={20}>
              <Popover
                content={contentNoti}
                title="Thông báo"
                placement="bottomRight"
                trigger="click"
              >
                <Button type="text" icon={<BellOutlined size={2} />} />
              </Popover>
              <Button
                type="text"
                style={{ paddingLeft: 30 }}
                onClick={() => navigate("/profile")}
                icon={
                  photo ? (
                    <img
                      style={{
                        borderRadius: "50%",
                        position: "absolute",
                        left: 5,
                        top: 3,
                        height: 25,
                        width: 25,
                        objectFit: "cover",
                      }}
                      src={photo}
                    />
                  ) : (
                    <UserOutlined />
                  )
                }
              >
                {fullName || phone}
              </Button>
            </Flex>
          </Flex>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutPage;
