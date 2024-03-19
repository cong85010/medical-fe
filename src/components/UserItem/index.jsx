import { Avatar, Card, Space, Typography } from "antd";
import CPhone from "../Phone";
import { FORMAT_DATE_MONGO, birthdayAndAge, formatedDate } from "src/utils";
const { Meta } = Card;

const UserItem = ({ user, width = 200, showBirthDay = false }) => {
  const getAvatarContent = () => {
    if (user.photo) {
      return <Avatar src={user.avatarUrl} />;
    }
    return null;
  };

  console.log(user);
  return (
    <Card
      style={{ width: width }}
      styles={{
        body: {
          padding: 10,
        },
      }}
    >
      <Meta
        avatar={getAvatarContent()}
        title={user.fullName}
        description={
          <Space>
            <CPhone phone={user.phone} />
            {showBirthDay && (
              <Typography.Text style={{ fontSize: 12 }}>
                {formatedDate(user.birthday, FORMAT_DATE_MONGO)}
              </Typography.Text>
            )}
          </Space>
        }
      />
    </Card>
  );
};

export default UserItem;
