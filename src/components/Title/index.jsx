import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Title({ title, showBack, styles }) {
  const navigate = useNavigate();
  return (
    <Flex gap={20} align="center" style={{ marginBottom: 20 }}>
      {showBack && (
        <Tooltip title="Quay lại">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
        </Tooltip>
      )}
      <Typography.Title
        level={3}
        style={{ marginTop: 0, marginBottom: 0, ...styles }}
      >
        {title}
      </Typography.Title>
    </Flex>
  );
}
