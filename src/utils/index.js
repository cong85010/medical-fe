import dayjs from "dayjs";

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
  booked: "booked",
  rejected: "rejected",
  cancelled: "cancelled",
  actived: "actived",
};

export const STATUS_BOOKING_STR = {
  booked: "Đã đặt",
  rejected: "Từ chối",
  cancelled: "Đã hủy",
  actived: "Đã xử lý",
};

export const STATUS_BOOKING_COLOR = {
  booked: "blue",
  rejected: "red",
  cancelled: "red",
  actived: "green",
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
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
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

export const FORMAT_DATE = "DD/MM/YYYY";
export const FORMAT_TIME = "HH:mm";

export const getToday = () => {
  return dayjs().format(FORMAT_DATE);
};

export const formatedDate = (date) => {
  return dayjs(date, FORMAT_DATE).format(FORMAT_DATE);
};

export const formatedTime = (date) => {
  return dayjs(date, FORMAT_TIME).format(FORMAT_TIME);
};
