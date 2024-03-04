import { PhoneOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export default function CPhone({ phone }) {
  return (
    <Link to={`tel:${phone}`} style={{ color: "#000" }}>
      {phone} <PhoneOutlined />
    </Link>
  );
}
