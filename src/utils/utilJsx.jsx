import { Tag } from "antd";

export const getUsagesTable = (usage) => (
  <Tag color={usage === "before" ? "green" : "blue"}>
    {usage === "before" ? "Trước ăn" : "Sau ăn"}
  </Tag>
);
