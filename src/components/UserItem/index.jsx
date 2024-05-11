import { Avatar, Card, Space, Typography } from "antd";
import CPhone from "../Phone";
import {
  FORMAT_DATE_MONGO,
  birthdayAndAge,
  formatedDate,
  getSourceImage,
  getSpecialtyName,
} from "src/utils";
const { Meta } = Card;

const UserItem = ({
  user,
  width = 200,
  showBirthDay = false,
  showSpecialty,
}) => {
  const getAvatarContent = () => {
    if (user.photo) {
      return <Avatar src={getSourceImage(user.photo)} />;
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
        description={
          <Space>
            <CPhone phone={user.phone} />
            {showBirthDay && (
              <Typography.Text style={{ fontSize: 12 }}>
                {formatedDate(user.birthday, FORMAT_DATE_MONGO)}
              </Typography.Text>
            )}
            {showSpecialty && (
              <Typography.Text style={{ fontSize: 12 }}>
                {getSpecialtyName(user.specialty)}
              </Typography.Text>
            )}
          </Space>
        }
      />
    </Card>
  );
};

export default UserItem;
