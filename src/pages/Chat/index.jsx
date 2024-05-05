import React, { useState } from "react";
import { Input, Button, Row, Col, List, Avatar } from "antd";
import { MessageBox, ChatList } from "react-chat-elements";

const { TextArea } = Input;

const userList = [
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
    alt: "Reactjs",
    title: "Facebook",
    subtitle: "What are you doing?",
    date: new Date(),
    unread: 0,
  },
  // Add more users as needed
];

const UserList = ({ onSelectUser }) => {
  return <ChatList className="chat-list chat-list-custom" dataSource={userList} />;
};

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (text) => {
    const newMessage = {
      position: "right",
      type: "text",
      text: text,
      date: new Date(),
    };
    setMessages([...messages, newMessage]);
    // Here you can implement sending message to server or external API
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <UserList onSelectUser={setSelectedUser} />
      </Col>
      <Col span={18}>
        {selectedUser ? (
          <div>
            <ChatList className="chat-list" dataSource={messages} />
            <TextArea rows={4} />
            <Button
              type="primary"
              onClick={() => handleSendMessage("Hello!")}
              style={{ marginTop: 10 }}
            >
              Send
            </Button>
          </div>
        ) : (
          <div>Select a user to start chatting</div>
        )}
      </Col>
    </Row>
  );
};

export default ChatPage;
