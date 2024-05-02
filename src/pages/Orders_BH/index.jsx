// AppointmentPage.js
import {
  CalendarOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getListAppointmentQuery } from "src/api/appointment";
import { getListOrder } from "src/api/order";
import { CCopy } from "src/components/CCopy";
import { CopyPhonenumber } from "src/components/CopyPhone";
import PrescriptionSalesModal from "src/components/PrescriptionSalesModal";
import Title from "src/components/Title";
import UserItem from "src/components/UserItem";
import ViewOrderModal from "src/components/ViewOrderModal";
import {
  FORMAT_DATE,
  FORMAT_DATE_TIME,
  PAYMENT_ORDER_COLOR,
  PAYMENT_ORDER_STR,
  STATUS_BOOKING,
  STATUS_ORDER_COLOR,
  STATUS_ORDER_STR,
  formatedDate,
} from "src/utils";

const OrdersPage = () => {
  const [filterDate, setFilterDate] = useState(dayjs());
  const [initLoading, setInitLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [reload, setReload] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isShowViewOrder, setisShowViewOrder] = useState(false);

  const [isExaminationModalVisible, setIsExaminationModalVisible] =
    useState(false);
  useEffect(() => {
    // Simulating fetching examination history for the selected patient
    const fetchOrdersHistory = async () => {
      setInitLoading(true);
      try {
        const { orders, total } = await getListOrder({
          filterDate: formatedDate(filterDate),
          orderNumber: keyword,
          limit: pagination.pageSize,
          page: pagination.current,
        });
        setOrdersHistory(orders);
        setPagination({
          ...pagination,
          total,
        });
      } catch (error) {
        console.error("Error fetching examination history:", error);
      } finally {
        setInitLoading(false);
      }
    };

    fetchOrdersHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, pagination.current, filterDate]);

  const columnsOrders = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber, record) => (
        <CCopy phone={orderNumber} textCopy={orderNumber}>
          <Button
            onClick={() => {
              setSelectedOrder(record);
              setisShowViewOrder(true);
            }}
            type="link"
          >
            {orderNumber}
          </Button>
        </CCopy>
      ),
    },
    {
      align: "center",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (createdAt) => dayjs(createdAt).format(FORMAT_DATE_TIME),
    },
    {
      title: "Thu ngân",
      dataIndex: "salesId",
      key: "salesId",
      render: (salesId) => {
        return <UserItem user={salesId} />;
      },
    },
    {
      align: "right",
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => (
        <span style={{ fontWeight: "500" }}>
          {totalPrice.toLocaleString()} VNĐ
        </span>
      ),
    },
    {
      align: "center",
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (paymentMethod) => (
        <Tag
          style={{ fontSize: 17 }}
          color={PAYMENT_ORDER_COLOR[paymentMethod]}
        >
          {PAYMENT_ORDER_STR[paymentMethod]}
        </Tag>
      ),
    },
    {
      align: "center",
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag style={{ fontSize: 17 }} color={STATUS_ORDER_COLOR[status]}>
          {STATUS_ORDER_STR[status]}
        </Tag>
      ),
    },
    {
      align: "center",
      title: "Hóa đơn",
      dataIndex: "medicines",
      key: "medicines",
      render: (medicines, record) => {
        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedOrder(record);
                setisShowViewOrder(true);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const handleCancel = () => {
    setIsExaminationModalVisible(false);
  };

  const handleResearch = () => {
    setKeyword("");
    setReload(!reload);
  };

  const handleCreatedOrder = () => {
    handleCancel();
    setReload(!reload);
  };

  const handleChangePaging = useCallback(
    ({ current }) => {
      console.log("page, pageSize", current);
      setPagination({
        ...pagination,
        current,
      });
    },
    [pagination]
  );

  return (
    <div>
      <Title
        title="Danh sách đơn hàng"
        styleContainer={{
          justifyContent: "space-between",
        }}
        right={
          <Flex align="center" gap={10}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              Ngày: {filterDate.format(FORMAT_DATE)}
            </Typography.Title>
            <Divider type="vertical" />
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => setFilterDate(dayjs())}
            >
              Hôm nay
            </Button>
            <DatePicker
              value={filterDate}
              format={FORMAT_DATE}
              onChange={(date) => setFilterDate(date)}
            />
          </Flex>
        }
      />
      <Flex gap={10} justify="space-between" style={{ marginBottom: 10 }}>
        <Flex gap={10}>
          <Tooltip title="Khôi phục">
            <Button onClick={handleResearch}>
              <ReloadOutlined />
            </Button>
          </Tooltip>
          <Input
            value={keyword}
            placeholder="Tìm kiếm"
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => setReload(!reload)}
          />
          <Button type="primary" onClick={() => setReload(!reload)}>
            <SearchOutlined />
          </Button>
        </Flex>
        <Button
          type="primary"
          onClick={() => setIsExaminationModalVisible(true)}
        >
          Bán thuốc
        </Button>
      </Flex>

      <Table
        rowKey="_id"
        dataSource={ordersHistory}
        columns={columnsOrders}
        pagination={pagination}
        loading={initLoading}
        onChange={handleChangePaging}
      />
      <PrescriptionSalesModal
        visible={isExaminationModalVisible}
        salesId={user._id}
        // patientId={selectedPatient?.patientId?._id}
        // medicalRecord={selectedRecord}
        // medicinesImported={selectedRecord?.medicines}
        showPatients
        onCancel={handleCancel}
        onCreated={handleCreatedOrder}
      />
      <ViewOrderModal
        visible={isShowViewOrder}
        selectedOrder={selectedOrder}
        onCancel={() => {
          setisShowViewOrder(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default OrdersPage;
