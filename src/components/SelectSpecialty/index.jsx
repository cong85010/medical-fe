import React, { useEffect, useState } from "react";
import { Select, Typography, Popover, Input, List } from "antd";
import { Specialties, getSpecialtyName } from "src/utils";
import {
  ArrowDownOutlined,
  CaretDownOutlined,
  DownOutlined,
} from "@ant-design/icons";
const { Option } = Select;

const SelectSpecialty = ({ specialty, onChange }) => {
  const [visible, setVisible] = useState(false);

  const handleSpecialtyChange = (item) => {
    setVisible(false);
    onChange(item.id);
  };

  const customDropdown = (
    <List
      className="customDropdown"
      style={{ width: 472, maxWidth: "100%", height: 300, overflow: "auto" }}
      itemLayout="horizontal"
      dataSource={Specialties}
      renderItem={(specialty, index) => (
        <List.Item
          className="customDropdown-item"
          onClick={() => handleSpecialtyChange(specialty)}
        >
          <List.Item.Meta
            title={<b>{specialty.name}</b>}
            description={specialty.description}
          />
        </List.Item>
      )}
    />
  );

  return (
    <Popover
      overlayClassName="customDropdown-popover"
      placement="bottomLeft"
      open={visible}
      content={customDropdown}
      onOpenChange={(visible) => setVisible(visible)}
      trigger="click"
      style={{
        padding: 0,
      }}
    >
      <Input
        onClick={() => setVisible(!visible)}
        id="specialty"
        itemID="specialty"
        value={getSpecialtyName(specialty)}
        readOnly
        placeholder="Chọn chuyên khoa"
        suffix={<DownOutlined style={{ color: "#c2c2c2" }} />}
      />
    </Popover>
  );
};

export default SelectSpecialty;
