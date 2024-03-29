import { FileOutlined } from "@ant-design/icons";
import { Image, notification } from "antd";
import dayjs from "dayjs";
import PDFViewer from "pdf-viewer-reactjs";

export const TYPE_EMPLOYEE = {
  admin: "admin",
  user: "user",
  doctor: "doctor",
  administrative: "administrative",
  sales: "sales",
};

export const TYPE_EMPLOYEE_STR = {
  admin: "Quản lý",
  user: "Người dùng",
  doctor: "Bác sĩ",
  administrative: "Nhân viên hành chánh",
  sales: "Nhân viên bán hàng",
};

export const STATUS_BOOKING = {
  finished: "finished",
  booked: "booked",
  waiting: "waiting",
  examining: "examining",
  rejected: "rejected",
  cancelled: "cancelled",
};

export const STATUS_BOOKING_STR = {
  finished: "Đã khám",
  booked: "Đã đặt",
  waiting: "Chờ khám",
  examining: "Đang khám",
  rejected: "Từ chối",
  cancelled: "Đã hủy",
};

export const STATUS_BOOKING_COLOR = {
  finished: "green",
  booked: "blue",
  examining: "cyan",
  waiting: "orange",
  rejected: "red",
  cancelled: "red",
};

export const colorOfType = {
  admin: "red",
  doctor: "green",
  administrative: "blue",
  sales: "orange",
  user: "purple",
};

export const birthdayAndAge = (date) => {
  return `${dayjs(date).format(FORMAT_DATE)}- ${dayjs().diff(
    date,
    "year"
  )} tuổi`;
};

export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  if (!isJpgOrPng) {
    notification.error({
      message: "Chỉ hỗ trợ định dạng ảnh JPG, JPEG, PNG",
    });
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    notification.error({
      message: "Kích thước ảnh phải nhỏ hơn 2MB",
    });
  }
  return isJpgOrPng && isLt2M;
};

export const Specialties = [
  {
    id: "general",
    name: "Nội trú",
    description: "Kiểm tra và điều trị các vấn đề sức khỏe tổng quát.",
  },
  {
    id: "pediatrics",
    name: "Nhi khoa",
    description:
      "Chăm sóc sức khỏe cho trẻ em và phát hiện sớm các vấn đề sức khỏe.",
  },
  {
    id: "orthopedics",
    name: "Chỉnh hình",
    description: "Chăm sóc và điều trị vấn đề về cơ bắp và xương.",
  },
  {
    id: "dermatology",
    name: "Da liễu",
    description: "Chẩn đoán và điều trị các vấn đề về da, tóc, và móng.",
  },
  {
    id: "ophthalmology",
    name: "Mắt",
    description: "Kiểm tra và chăm sóc sức khỏe của mắt và thị lực.",
  },
  {
    id: "dentistry",
    name: "Nha khoa",
    description: "Chăm sóc và điều trị vấn đề về nướu, răng, và miệng.",
  },
  {
    id: "psychiatry",
    name: "Tâm thần học",
    description: "Chẩn đoán và điều trị các vấn đề về tâm lý và tâm thần.",
  },
  {
    id: "oncology",
    name: "Ung thư",
    description: "Chẩn đoán và điều trị các loại ung thư.",
  },
  {
    id: "neurology",
    name: "Thần kinh học",
    description: "Chăm sóc và điều trị vấn đề về hệ thần kinh.",
  },
  {
    id: "other",
    name: "Chưa xác định",
    description: "Chuyên khoa không xác định hoặc đang chờ xác định.",
  },
];

export const getSpecialtyName = (id) => {
  return Specialties.find((specialty) => specialty.id === id)?.name;
};

export const SpecialtiesMap = Specialties.reduce((acc, specialty) => {
  acc[specialty.id] = specialty.name;
  return acc;
}, {});

export const Gender = {
  male: "Nam",
  female: "Nữ",
};

export function isTimeBeforeCurrentByHours(date, time, hours) {
  // Chuyển đổi thời gian cụ thể thành đối tượng dayjs
  const timeMedical = dayjs(`${date} ${time}`, "DD/MM/YYYY HH:mm");

  // Lấy thời gian hiện tại
  const currentTime = dayjs();

  // Thêm số giờ cần so sánh
  const adjustedCurrentTime = timeMedical.subtract(hours, "hour");

  // So sánh thời gian
  return currentTime.isBefore(adjustedCurrentTime);
}

export const TIME_CAN_EDIT = 2;
export const TIME_PHYSICAL_EXAM = 30;

export const FORMAT_DATE = "DD/MM/YYYY";
export const FORMAT_DATE_MONGO = "YYYY-MM-DD";
export const FORMAT_DATE_MONGO_ISO = "YYYY-MM-DDTHH:mm:ssZ";
export const FORMAT_DATE_TIME = "DD/MM/YYYY HH:mm";
export const FORMAT_TIME = "HH:mm";
export const baseURL = "http://localhost:5000";

export const getToday = () => {
  return dayjs().format(FORMAT_DATE);
};

export const formatedDate = (
  date,
  format = FORMAT_DATE,
  formatStr = FORMAT_DATE
) => {
  return dayjs(date, format).format(formatStr);
};

export const formatedTime = (date) => {
  return dayjs(date, FORMAT_TIME).format(FORMAT_TIME);
};

export const getSourceImage = (url) => {
  return `${baseURL}/uploads/${url}`;
};
