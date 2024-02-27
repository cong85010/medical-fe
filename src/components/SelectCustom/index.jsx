import React, { useState } from "react";
import { Select, Typography, Popover, Input, List } from "antd";
import { Specialties } from "src/utils";
import {
  ArrowDownOutlined,
  CaretDownOutlined,
  DownOutlined,
} from "@ant-design/icons";
const { Option } = Select;

const SelectCustom = ({ onChange }) => {
  const [visible, setVisible] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const handleSpecialtyChange = (specialty) => {
    console.log(specialty);
    setVisible(false);
    setSelectedSpecialty(specialty);
    onChange(specialty.id);
  };

  const customDropdown = (
    <List
      className="customDropdown"
      style={{ width: 450, height: 300, overflow: "auto" }}
      itemLayout="horizontal"
      dataSource={Specialties}
      renderItem={(specialty, index) => (
        <List.Item
          className="customDropdown-item"
          onClick={() => handleSpecialtyChange(specialty)}
        >
          <List.Item.Meta
            title={specialty.name}
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
        value={selectedSpecialty?.name}
        readOnly
        placeholder="Chọn chuyên khoa"
        suffix={<DownOutlined style={{ color: "#c2c2c2" }} />}
      />
    </Popover>
  );
};

export default SelectCustom;
