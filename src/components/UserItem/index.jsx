import { Avatar, Card } from "antd";
import CPhone from "../Phone";
const { Meta } = Card;

const UserItem = ({ user, width = 200 }) => {
  const getAvatarContent = () => {
    if (user.photo) {
      return <Avatar src={user.avatarUrl} />;
    }
    return null;
  };

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
        description={<CPhone phone={user.phone} />}
      />
    </Card>
  );
};

export default UserItem;
