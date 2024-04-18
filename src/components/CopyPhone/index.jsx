import { CheckCircleOutlined, FileOutlined } from "@ant-design/icons";
import { Flex, message } from "antd";
import { useState } from "react";
import { STATUS_BOOKING } from "src/utils";

export const CopyPhonenumber = ({ phone }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (phone) =>
    navigator.clipboard.writeText(phone).then(() => {
      message.success("Sao chép số điện thoại thành công");
      setCopied(true);
    });

  return (
    <Flex gap={5}>
      <span>{phone}</span>
      <span onClick={() => handleCopy(phone)} style={{ cursor: "pointer" }}>
        {copied ? <CheckCircleOutlined style={{color: 'green'}} /> : <FileOutlined />}
      </span>
    </Flex>
  );
};
