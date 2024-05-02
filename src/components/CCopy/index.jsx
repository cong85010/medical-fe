import { CheckCircleOutlined, FileOutlined } from "@ant-design/icons";
import { Flex, message } from "antd";
import { useState } from "react";
import { STATUS_BOOKING } from "src/utils";

export const CCopy = ({ children, textCopy, styles }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () =>
    navigator.clipboard.writeText(textCopy).then(() => {
      message.success("Sao chép thành công");
      setCopied(true);
    });

  return (
    <Flex align="center" style={styles}>
      {children}
      <span onClick={() => handleCopy()} style={{ cursor: "pointer" }}>
        {copied ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <FileOutlined />
        )}
      </span>
    </Flex>
  );
};
