import { Typography } from "antd";
import React from "react";

export default function Title({ title, styles }) {
  return (
    <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 20, ...styles}}>
      {title}
    </Typography.Title>
  );
}
