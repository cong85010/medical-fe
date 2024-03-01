import React, { useState } from "react";
import { Select, Typography, Popover, Input, List } from "antd";
import { Specialties } from "src/utils";
import {
  ArrowDownOutlined,
  CaretDownOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { getUsers } from "src/api/user";
const { Option } = Select;

const SelectDoctorMemo = ({ onChange, specialty }) => {
  const [visible, setVisible] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [listDoctor, setListDoctor] = useState([]);

  const handleDoctorChange = (doctor) => {
    setVisible(false);
    setDoctor(doctor);
    onChange(doctor);
  };

  useEffect(() => {
    const initData = async () => {
      setDoctor(null);
      setListDoctor([]);
      const { users } = await getUsers({
        userType: "doctor",
        specialty,
      });

      setListDoctor(users);
    };
    initData();
  }, [specialty]);

  const customDropdown = (
    <List
      className="customDropdown"
      style={{ width: 472, maxWidth: "100%", height: 300, overflow: "auto" }}
      itemLayout="horizontal"
      dataSource={listDoctor}
      renderItem={(item, index) => (
        <List.Item
          className="customDropdown-item"
          onClick={() => handleDoctorChange(item)}
        >
          <List.Item.Meta title={item.fullName} description={item.userType} />
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
        id="doctorName"
        itemID="doctorName"
        value={doctor?.fullName}
        readOnly
        placeholder="Chọn bác sĩ"
        suffix={<DownOutlined style={{ color: "#c2c2c2" }} />}
      />
    </Popover>
  );
};

export const SelectDoctor = React.memo(SelectDoctorMemo);
