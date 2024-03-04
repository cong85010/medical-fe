import React, { useState } from "react";
import { Select, Typography, Popover, Input, List, Space } from "antd";
import { Gender, Specialties, TYPE_EMPLOYEE_STR, birthdayAndAge } from "src/utils";
import {
  ArrowDownOutlined,
  CaretDownOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { getUsers } from "src/api/user";
const { Option } = Select;

const SelectDoctorMemo = ({ onChange, specialty, doctor: doctorForm }) => {
  const [visible, setVisible] = useState(false);
  const [doctor, setDoctor] = useState(doctorForm || null);
  const [listDoctor, setListDoctor] = useState([]);

  const handleDoctorChange = (doctor) => {
    setVisible(false);
    setDoctor(doctor);
    onChange(doctor);
  };

  useEffect(() => {
    const initData = async () => {
      if (doctorForm) {
        setDoctor(doctorForm);
      } else {
        setDoctor(null);
      }

      setListDoctor([]);
      const { users } = await getUsers({
        userType: "doctor",
        specialty,
      });

      setListDoctor(users);
    };
    initData();
  }, [specialty, doctorForm]);

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
          <List.Item.Meta title={item.fullName} description={<Space>
           <Typography.Text>{TYPE_EMPLOYEE_STR[item.userType]}</Typography.Text>
           -
           <Typography.Text>{Gender[item?.gender]}</Typography.Text>
          </Space>} />
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
        id="doctor"
        itemID="doctor"
        value={doctor?.fullName}
        readOnly
        placeholder="Chọn bác sĩ"
        suffix={<DownOutlined style={{ color: "#c2c2c2" }} />}
      />
    </Popover>
  );
};

export const SelectDoctor = React.memo(SelectDoctorMemo);
