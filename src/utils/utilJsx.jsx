import { FileOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Button, Flex, Image, Tag, Tooltip, message } from "antd";
import { getSourceImage } from ".";

export const getUsagesTable = (usage) => {
  let color = "";
  let text = "";

  switch (usage) {
    case "before":
      color = "green";
      text = "Trước ăn";
      break;
    case "after":
      color = "blue";
      text = "Sau ăn";
      break;
    case "both":
      color = "orange";
      text = "Trước / Sau ăn";
      break;
    default:
      return "";
  }

  return <Tag color={color}>{text}</Tag>;
};

export const getTypeFile = (url) => {
  const urlBE = getSourceImage(url);
  if (!url) return "";

  if (url.includes("pdf") || url.includes("docx")) {
    return (
      <Tooltip title="Tài liệu">
        <Button icon={<FilePdfOutlined />} href={urlBE} target="_blank" />
      </Tooltip>
    );
  }
  return (
    <Image
      src={urlBE}
      alt="hinhanh"
      width={50}
      height={50}
      style={{ borderRadius: 10, objectFit: "cover" }}
    />
  );
};
