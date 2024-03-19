import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Title({
  title,
  subTitle,
  justify,
  showBack,
  right,
  styles,
  styleContainer,
}) {
  const navigate = useNavigate();
  return (
    <Flex
      gap={20}
      align="center"
      justify={justify}
      style={{ marginBottom: 20, ...styleContainer }}
    >
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
      {subTitle && (
        <Typography.Title
          level={5}
          style={{ marginTop: 0, marginBottom: 0, ...styles }}
        >
          {subTitle}
        </Typography.Title>
      )}
      {right}
    </Flex>
  );
}
