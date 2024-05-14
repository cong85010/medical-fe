import { FileOutlined } from "@ant-design/icons";
import { Image, Tag, notification } from "antd";
import dayjs from "dayjs";
import PDFViewer from "pdf-viewer-reactjs";
import { io } from "socket.io-client";

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

export const TYPE_EMPLOYEE_STR_SHORT = {
  admin: "Quản lý",
  user: "Người dùng",
  doctor: "Bác sĩ",
  administrative: "Hành chánh",
  sales: "Bán hàng",
};

export const STATUS_BOOKING = {
  medicined: "medicined",
  finished: "finished",
  booked: "booked",
  waiting: "waiting",
  examining: "examining",
  rejected: "rejected",
  cancelled: "cancelled",
};

export const STATUS_BOOKING_STR = {
  medicined: "Đã kê toa",
  finished: "Đã khám",
  booked: "Đã đặt",
  waiting: "Chờ khám",
  examining: "Đang khám",
  rejected: "Từ chối",
  cancelled: "Đã hủy",
};

export const STATUS_BOOKING_COLOR = {
  medicined: "lime",
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

export const STATUS_MEDICAL = {
  examined: "examined",
  medicined: "medicined",
};

export const STATUS_MEDICAL_STR = {
  examined: "Đã khám",
  medicined: "Đã kê toa",
};

export const STATUS_MEDICAL_COLOR = {
  examined: "green",
  medicined: "blue",
};

export const STATUS_ORDER = {
  pending: "pending",
  paid: "paid",
};

export const STATUS_ORDER_STR = {
  pending: "Chờ xác nhận",
  paid: "Đã thanh toán",
};

export const STATUS_ORDER_COLOR = {
  pending: "orange",
  paid: "blue",
};

export const PAYMENT_ORDER = {
  cash: "cash",
  banking: "banking",
};

export const PAYMENT_ORDER_STR = {
  cash: "Tiền mặt",
  banking: "Chuyển khoản",
};

export const PAYMENT_ORDER_COLOR = {
  cash: "green",
  banking: "orange",
};

export const STATUS_MEETING = {
  pending: "pending",
  accepted: "accepted",
  rejected: "rejected",
};

export const STATUS_MEETING_STR = {
  pending: "Chờ xác nhận",
  accepted: "Đã chấp nhận",
  rejected: "Đã từ chối",
};

export const STATUS_MEETING_COLOR = {
  pending: "orange",
  accepted: "green",
  rejected: "red",
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
    name: "Đa khoa",
    description:
      "Điều trị các bệnh mãn và cấp tính, hướng dẫn phục hồi sức khỏe",
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
export const FORMAT_FULL_TIME = "HH:mm:ss";
export const baseURL = "http://localhost:5000";
export const baseUrlSocket = "http://localhost:3000";

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

export const formatedTime = (
  date,
  format = FORMAT_TIME,
  formatTime = FORMAT_TIME
) => {
  return dayjs(date, format).format(formatTime);
};

export const getSourceImage = (url) => {
  if (!url) return "/images/default.png";
  return `${baseURL}/uploads/${url}`;
};

export const getIdxTable = (idx, page = 1, pageSize = 10) => {
  return (page - 1) * pageSize + idx + 1;
};

export const formatPrice = (price) => {
  if (!price) price = 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const ColorsCustom = {
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  primary: "#1677ff",
  secondary: "#8b5cf6",
  dark: "#1f2937",
  disable: "#d1d5db",
};

export const TYPE_CALENDAR = {
  appointment: "appointment",
  meeting: "meeting",
};

export const getURLUploads = (url) => `${baseURL}/uploads/${url}`;
export const socket = io(baseUrlSocket, {
  autoConnect: false,
});

export const TYPE_SOCKET = {
  message: "message",
  notification: "notification",
};

export const PASSWORD_DEFAULT = "123456";
