import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  List,
  Avatar,
  Divider,
  Card,
  Flex,
  Space,
} from "antd";
import { MessageBox, ChatList, MessageList, Navbar } from "react-chat-elements";
import SpaceDiv from "src/components/SpaceDiv";
import { MenuOutlined, SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const userList = [
  {
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
    alt: "Reactjs",
    title: "Facebook",
    subtitle: "What are you doing?",
    date: new Date(),
    unread: 0,
  },
  // Add more users as needed
];

const UserList = ({ onSelectUser }) => {
  return (
    <ChatList className="chat-list chat-list-custom" dataSource={userList} />
  );
};

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
  const [messages, setMessages] = useState([
    {
      position: "left",
      type: "text",
      title: "Kursat",
      text: "Give me a message list example !",
    },
    {
      position: "right",
      type: "text",
      title: "Emre",
      text: "That's all.",
    },
  ]);

 
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (text) => {
    const newMessage = {
      position: "right",
      type: "text",
      text: "text",
      date: new Date(),
    };
    setMessages([...messages, newMessage]);
    // Here you can implement sending message to server or external API
  };

  return (
    <Card styles={{ body: { padding: 0 } }}>
      <Row gutter={[16, 16]}>
        <Col span={6} style={{ paddingRight: 10 }}>
          <UserList onSelectUser={setSelectedUser} />
        </Col>
        <Col
          span={18}
          style={{
            borderLeft: "1px solid #f2f2f2",
            height: "80vh",
            backgroundColor: "#f4f4f4",
            padding: 0,
          }}
        >
          <Flex
            justify="space-between"
            align="center"
            style={{
              padding: 10,
              background: "#fff",
              height: 70,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Card.Meta
              avatar={
                <Avatar
                  src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                  alt="Reactjs"
                />
              }
              title="Facebook"
            />
            <Button
              onClick={() => console.log("Menu Clicked")}
              type="text"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MenuOutlined />
            </Button>
          </Flex>
          <SpaceDiv height={10} />
          <Flex
            vertical
            justify="space-between"
            style={{
              height: "calc(100% - 80px)",
              minWidth: 500,
            }}
          >
            <MessageList
              className="message-list message-list-custom"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={messages}
            />
            <Space.Compact style={{ width: "100%", padding: 10 }}>
              <Input size="large" defaultValue="Combine input and button" />
              <Button
                size="large"
                type="primary"
                onClick={handleSendMessage}
                icon={<SendOutlined />}
              >
                Gửi
              </Button>
            </Space.Compact>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};

export default ChatPage;
