import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Flex,
  Select,
  Table,
  Typography,
  DatePicker,
  Divider,
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Title from "src/components/Title";
import { FORMAT_DATE, formatPrice, formatedDate } from "src/utils";
import { Column, Line } from "@ant-design/charts";
import SpaceDiv from "src/components/SpaceDiv";
import { getStatistic } from "src/api/statistic";
import dayjs from "dayjs";

const { Content } = Layout;

const DATE_MODE = {
  TODAY: "today",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

const StatisticsPage = () => {
  const [date, setDate] = useState(DATE_MODE.TODAY);
  const [statistic, setStatistic] = useState({});

  const renderDate = (date) => {
    switch (date) {
      case DATE_MODE.TODAY:
        return { startDate: dayjs(), endDate: dayjs() };
      case DATE_MODE.WEEK:
        return {
          startDate: dayjs().startOf("week"),
          endDate: dayjs().endOf("week"),
        };
      case DATE_MODE.MONTH:
        return {
          startDate: dayjs().startOf("month"),
          endDate: dayjs().endOf("month"),
        };
      case DATE_MODE.YEAR:
        return {
          startDate: dayjs().startOf("year"),
          endDate: dayjs().endOf("year"),
        };
      default:
        return { startDate: dayjs(), endDate: dayjs() };
    }
  };

  useEffect(() => {
    const initData = async () => {
      const dateFilter = renderDate(date);

      const { statistic: total } = await getStatistic(dateFilter);

      setStatistic(total);
      // Fetch data from the backend here
      console.log(total);
    };

    initData();
  }, [date]);

  // Configurations for the line chart
  const lineChartConfig = {
    data: statistic?.chartMonth,
    height: 300,
    xField: "day",
    yField: "value",
    point: {
      size: 5,
      shape: "circle",
    },
    axis: {
      y: { labelFormatter: (v) => formatPrice(v) },
    },
    interaction: {
      tooltip: {
        render: (event, { title, items }) => {
          return (
            <div style={{ padding: "8px 16px" }}>
              <p>{title}</p>
              <ul>
                {items.map((item) =>
                  item.name === "value" ? (
                    <li key={item.name} style={{ color: item.color }}>
                      Doanh thu: {formatPrice(item.value)}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          );
        },
      },
    },
  };

  // Configurations for the column chart
  const columnChartConfig = {
    data: statistic?.chartYear,
    height: 300,
    xField: "month",
    yField: "value",
    columnWidthRatio: 0.6,
    label: {
      position: "top",
      text: (d) => formatPrice(d.value),
      style: {
        fill: "#000",
        fontSize: 12,
        y: -20,
      },
    },
    axis: {
      y: { labelFormatter: (v) => formatPrice(v) },
    },
    interaction: {
      tooltip: {
        render: (event, { title, items }) => {
          return (
            <div style={{ padding: "8px 16px" }}>
              <p>{title}</p>
              <ul>
                {items.map((item) =>
                  item.name === "value" ? (
                    <li key={item.name} style={{ color: item.color }}>
                      Doanh thu: {formatPrice(item.value)}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          );
        },
      },
    },
  };

  const topMedicinesColumns = [
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      align: "right",
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => formatPrice(price),
    },
    {
      align: "center",
      title: "Số lượng bán được",
      dataIndex: "total",
      key: "total",
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
      <Title title="Tổng kết thống kê" />
      <Flex align="center" gap={10}>
        <Typography.Text>Chọn ngày:</Typography.Text>
        <Select value={date} onChange={setDate} style={{ width: 200 }}>
          <Select.Option value="today">Hôm nay</Select.Option>
          <Select.Option value="week">Tuần này</Select.Option>
          <Select.Option value="month">Tháng này</Select.Option>
          <Select.Option value="year">Năm nay</Select.Option>
        </Select>
        <Typography.Text strong style={{ fontSize: 20 }}>
          {formatedDate(renderDate(date).startDate)}
          {" ~ "}
          {formatedDate(renderDate(date).endDate)}
        </Typography.Text>
      </Flex>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8}>
          <Card
            title="Tổng đơn hàng"
            bordered={false}
            style={{ height: "100%" }}
          >
            <ShoppingCartOutlined style={{ fontSize: 32, marginRight: 8 }} />
            <span style={{ fontSize: 24 }}>{statistic?.totalOrder}</span>
            <span style={{ fontSize: 16 }}> đơn hàng</span>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card
            title="Tổng doanh thu"
            bordered={false}
            style={{ height: "100%" }}
          >
            <DollarCircleOutlined style={{ fontSize: 32, marginRight: 8 }} />
            <span style={{ fontSize: 24 }}>
              {formatPrice(statistic?.totalRevenue)}
            </span>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card
            title="Tổng bệnh nhân mới"
            bordered={false}
            style={{ height: "100%" }}
          >
            <UserAddOutlined style={{ fontSize: 32, marginRight: 8 }} />
            <span style={{ fontSize: 24 }}>{statistic?.totalPatient}</span>
            <span style={{ fontSize: 16 }}> bệnh nhân</span>
          </Card>
        </Col>
      </Row>
      <SpaceDiv height={16} />
      <Card
        title="Danh sách đơn thuốc bán được nhiều nhất"
        bordered={false}
        style={{ marginTop: 24 }}
      >
        <Table
          rowKey="_id"
          columns={topMedicinesColumns}
          dataSource={statistic?.listTopMedicine}
          pagination={false}
        />
      </Card>
      <SpaceDiv height={16} />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12}>
          <Card
            title={`Biểu đồ doanh thu theo ngày trong tháng ${
              dayjs().month() + 1
            }`}
            bordered={false}
            style={{ height: 400 }}
          >
            <Line {...lineChartConfig} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Card
            title={`Biểu đồ doanh thu theo tháng trong năm ${dayjs().year()}`}
            bordered={false}
            style={{ height: 400 }}
          >
            <Column {...columnChartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
