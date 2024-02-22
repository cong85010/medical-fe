import dayjs from "dayjs";

export const TYPE_EMPLOYEE = {
  admin: 'admin',
  user: 'user',
  doctor: 'doctor',
  administrative: 'administrative',
  sales: 'sales',
};

export const TYPE_EMPLOYEE_STR = {
  admin: "Quản lý",
  user: "Người dùng",
  doctor: "Bác sĩ",
  administrative: "Nhân viên hành chánh",
  sales: "Nhân viên bán hàng",
};

export const colorOfType = {
  admin: "red",
  doctor: "green",
  administrative: "blue",
  sales: "orange",
  user: "purple",
};

export const birthdayAndAge = (date) => {
  return `${dayjs(date).format("DD/MM/YYYY")}- ${dayjs().diff(date, "year")} tuổi`;
};