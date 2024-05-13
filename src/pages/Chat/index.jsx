import {
  MenuOutlined,
  ReloadOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Row,
  Space,
  Tooltip,
  Typography,
  Upload,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageList } from "react-chat-elements";
import { useSelector } from "react-redux";
import { getChatsByConversationId } from "src/api/chat";
import {
  createConversation,
  getConversationsByUserId,
} from "src/api/conversation";
import { getUsers } from "src/api/user";
import { DebounceSelect } from "src/components/DeboundSelect";
import SpaceDiv from "src/components/SpaceDiv";
import {
  FORMAT_FULL_TIME,
  TYPE_EMPLOYEE,
  TYPE_EMPLOYEE_STR_SHORT,
  TYPE_SOCKET,
  formatedDate,
  getSourceImage,
  socket,
} from "src/utils";

const { TextArea } = Input;

let timeout;
let currentValue;

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

const ConversationListMemo = ({ onJoin, reload, selectedConversation }) => {
  const [userSearch, setUserSearch] = useState(null); // State to store the selected user
  const [conversations, setConversations] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [isReloadConversation, setIsReloadConversation] = useState(false);

  useEffect(() => {
    const initData = async () => {
      const { conversations: data } = await getConversationsByUserId(user._id);
      setConversations(data);

      if (data.length > 0) {
        onJoin(data[0]);
      }
    };

    if (user?._id) {
      initData();
    }
  }, [user._id, isReloadConversation, onJoin, reload]);

  const handleSelected = async (participantId) => {
    const existConversation = conversations.find((item) =>
      item.participants.some((participant) => participant._id === participantId)
    );

    if (existConversation) {
      onJoin(existConversation);
    } else {
      const { conversation } = await createConversation({
        participants: [participantId, user._id],
      });
      onJoin({ conversation }, true);
      setIsReloadConversation((prev) => !prev);
    }
  };

  async function fetchUserList(searchKey = "") {
    try {
      const result = await getUsers({
        searchKey,
        limit: 10,
        userTypes: [
          TYPE_EMPLOYEE.admin,
          TYPE_EMPLOYEE.administrative,
          TYPE_EMPLOYEE.doctor,
          TYPE_EMPLOYEE.sales,
        ],
      });

      const list = result.users.filter((item) => item._id !== user._id);

      return list?.map((item) => {
        return {
          label: `${TYPE_EMPLOYEE_STR_SHORT[item.userType]} | ${
            item.fullName || "Chưa xác định"
          } - ${item.phone || "Trống"}`,
          value: item._id,
          _id: item._id,
        };
      });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  }

  const renderTimeChatMessage = (date) => {
    // if < 1 hours return minutes
    // if < 1 day return hours
    // if < 1 week return days
    // if > 1 week return date
    // usedayjs
    // compare now and date
    const now = dayjs();
    const dateMessage = dayjs(date);
    const diff = now.diff(dateMessage, "minute");

    if (diff === 0) {
      // seconds
      const seconds = now.diff(dateMessage, "second");
      return `${seconds} giây trước`;
    }
    if (diff < 60) {
      return `${diff} phút trước`;
    }

    if (diff < 24 * 60) {
      return `${Math.floor(diff / 60)} giờ trước`;
    }

    if (diff < 7 * 24 * 60) {
      return `${Math.floor(diff / (24 * 60))} ngày trước`;
    }

    return formatedDate(date, FORMAT_FULL_TIME);
  };

  return (
    <div style={{ paddingLeft: 10, width: "100%", minWidth: 270 }}>
      <Space
        direction="vertical"
        style={{ paddingRight: 18, width: "100%", marginTop: 10 }}
      >
        <Flex align="center" justify="space-between">
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            Danh sách tin nhắn
          </Typography.Title>
          <Tooltip title="Làm mới">
            <Button
              type="text"
              onClick={() => setIsReloadConversation((prev) => !prev)}
              icon={<ReloadOutlined />}
            />
          </Tooltip>
        </Flex>
        <DebounceSelect
          allowClear
          selectId="patientId"
          placeholder="Nhắn tin đồng nghiệp..."
          fetchOptions={fetchUserList}
          initValue={userSearch?._id}
          value={userSearch}
          onChange={(selected) => {
            setUserSearch(selected);
          }}
          onSelected={handleSelected}
          style={{ width: "100%" }}
          refreshData={!!user._id}
        />
      </Space>
      <SpaceDiv height={10} />
      {conversations.length === 0 && (
        <Flex justify="center" style={{ padding: 10 }}>
          <Typography.Text type="secondary">
            Không có tin nhắn nào
          </Typography.Text>
        </Flex>
      )}
      <Flex
        vertical
        gap={10}
        style={{ height: "70vh", overflowY: "auto", paddingRight: 10 }}
      >
        {conversations.map((conversation) => {
          const participant =
            conversation.participants.find((item) => item._id !== user._id) ||
            {};

          return (
            <Card
              key={conversation._id}
              style={{ cursor: "pointer", width: "100%" }}
              hoverable
              styles={{
                body: {
                  padding: 10,
                  borderRadius: 8,
                  border:
                    conversation._id === selectedConversation?._id
                      ? "1px solid #1890ff"
                      : "1px solid #f2f2f2",
                },
              }}
              onClick={() => onJoin(conversation)}
            >
              <Flex gap={10} align="center">
                <Avatar
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  src={getSourceImage(participant.photo)}
                  alt="Reactjs"
                />
                <Flex vertical gap={5}>
                  <Typography.Text>
                    {participant.fullName || "Chưa xác định"}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {participant.phone}
                  </Typography.Text>
                </Flex>
                <Typography.Text
                  type="secondary"
                  style={{
                    position: "absolute",
                    right: 10,
                    bottom: 10,
                    fontSize: 14,
                  }}
                >
                  {renderTimeChatMessage(conversation.updatedAt)}
                </Typography.Text>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </div>
  );
};

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState({}); // State to store the selected user
  const [inputMessage, setInputMessage] = useState(""); // State to store the selected user
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [participant, setParticipant] = useState({});
  const [isReloadConversationList, setIsReloadConversationList] =
    useState(false);
  const refChat = useRef(null);

  useEffect(() => {
    socket.connect();
    function onConnect() {
      console.log("Connected");
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessage(newMessage) {
      const { sendBy, to } = newMessage;

      // Validate in conversation to add
      if (selectedConversation._id !== newMessage.conversationId) {
        return;
      }

      newMessage.position = sendBy === user._id ? "right" : "left";

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    function newConversation({ conversation }) {
      // Check have me to new conversation
      if (conversation.participants.includes(user._id)) {
        setIsReloadConversationList((prev) => !prev);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    socket.on("newConversation", newConversation);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.off("newConversation", newConversation);
    };
  }, [selectedConversation._id, user._id]);

  useEffect(() => {
    if (selectedConversation._id) {
      socket.emit("joinRoom", selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const containerChat = document.querySelector(
      ".message-list-custom .rce-mlist"
    );
    let timeout = setTimeout(() => {
      containerChat.scrollTop = containerChat.scrollHeight;
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [messages]);

  const handleSendMessage = () => {
    try {
      const data = {
        to: participant?._id,
        sendBy: user._id,
        text: inputMessage,
        type: "text",
        conversationId: selectedConversation?._id,
      };
      socket.emit(TYPE_SOCKET.message, {
        roomId: selectedConversation?._id,
        message: data,
      });

      setInputMessage("");
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const handleJoinConversation = useCallback(
    async (conversation, isNew = false) => {
      if (isNew) {
        socket.emit("newConversation", conversation);
      }
      setInputMessage("");
      setSelectedConversation(conversation);

      console.log("conversation", conversation);

      setParticipant(
        conversation.participants.find((item) => item._id !== user._id) || {}
      );
      const { chats } = await getChatsByConversationId(conversation._id);
      setMessages(chats);
    },
    [user._id]
  );

  const renderMessages = useMemo(() => {
    const photoLeft = getSourceImage(participant.photo);
    const nameLeft = participant.fullName || "Chưa xác định";

    return messages.map((message) => {
      const { sendBy } = message;
      const possiton =
        sendBy._id === user._id || sendBy === user._id ? "right" : "left";
      const isRight = possiton === "right";

      return {
        avatar: isRight ? null : photoLeft,
        title: isRight ? null : nameLeft,
        text: message.text,
        date: message.createdAt,
        position: possiton,
        type: "text",
        tintColor: isRight ? "#0084FF" : "#f4f4f4",
      };
    });
  }, [messages, participant.fullName, participant.photo, user._id]);

  return (
    <Card styles={{ body: { padding: 0 } }}>
      <Row gutter={[4, 4]}>
        <Col span={6} style={{}}>
          <ConversationListMemo
            onJoin={handleJoinConversation}
            selectedConversation={selectedConversation}
            reload={isReloadConversationList}
          />
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
                <Avatar src={getSourceImage(participant.photo)} alt="Reactjs" />
              }
              title={participant?.fullName || "Chưa xác định"}
            />
            {/* <Button
              onClick={() => console.log("Menu Clicked")}
              type="text"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MenuOutlined />
            </Button> */}
          </Flex>
          <SpaceDiv height={10} />
          <Flex
            vertical
            justify="space-between"
            style={{
              height: "calc(100% - 80px)",
              minWidth: 350,
            }}
          >
            <MessageList
              className="message-list message-list-custom"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={renderMessages}
            />
            <Space.Compact style={{ width: "100%", padding: 10 }}>
              <Input
                size="large"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onPressEnter={handleSendMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                defaultValue="Combine input and button"
              />
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
