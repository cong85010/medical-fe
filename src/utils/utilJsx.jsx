import { FileOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Button, Flex, Image, Tag, Tooltip, message } from "antd";
import { getSourceImage } from ".";

export const getUsagesTable = (usage) => (
  <Tag color={usage === "before" ? "green" : "blue"}>
    {usage === "before" ? "Trước ăn" : "Sau ăn"}
  </Tag>
);

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
