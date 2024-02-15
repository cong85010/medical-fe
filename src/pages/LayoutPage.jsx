import React, { useCallback, useMemo, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  BellOutlined,
  LogoutOutlined,
  GroupOutlined,
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
} from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { TYPE_EMPLOYEE } from "src/utils/constant";
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

const LayoutPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

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
    const type = "doctor";
    const menuItems = [];

    if (type === TYPE_EMPLOYEE.admin) {
      menuItems.push({
        key: "users",
        icon: <UserOutlined />,
        label: "Người dùng",
        link: "/users",
      });
    }

    if (type === TYPE_EMPLOYEE.doctor) {
      menuItems.push({
        key: "calendar",
        icon: <UserOutlined />,
        label: "Lịch biểu",
        link: "/calendar",
      });

      menuItems.push({
        key: "examination",
        icon: <GroupOutlined />,
        label: "Khám bệnh",
        link: "/examination",
      });
    }

    menuItems.push({
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      link: "/logout",
    });
    return menuItems;
  }, []);

  console.log("====================================");
  console.log(menuSidebars);
  console.log("====================================");

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
          style={{ fontWeight: "bold", textAlign: "center" }}
        >
          MEDICAL
        </Typography.Title>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={selectedMenu()}
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
            <Flex style={{ marginRight: 20 }} align="center" gap={20}>
              <Popover
                content={contentNoti}
                title="Thông báo"
                placement="bottomRight"
                trigger="click"
              >
                <Button type="text" icon={<BellOutlined size={2} />} />
              </Popover>
              <Dropdown
                menu={{
                  items,
                }}
                placement="bottomRight"
                arrow
                trigger="click"
              >
                <Button icon={<UserOutlined />}>user</Button>
              </Dropdown>
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
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutPage;
