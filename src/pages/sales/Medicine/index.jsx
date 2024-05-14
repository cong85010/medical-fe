// AppointmentPage.js
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tooltip,
  Typography,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { updateStatusAppointment } from "src/api/appointment";
import {
  createMedicine,
  deleteMedicine,
  getListMedicine,
  updateMedicine,
} from "src/api/medicine";
import Title from "src/components/Title";
import {
  FORMAT_DATE_TIME,
  STATUS_BOOKING,
  formatPrice,
  getIdxTable,
} from "src/utils";
import { getUsagesTable } from "src/utils/utilJsx";

const MedicinePage = () => {
  const [form] = Form.useForm();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [filterDate, setFilterDate] = useState(dayjs());
  const [keyword, setKeyword] = useState("");
  const [listMedicine, setListMedicine] = useState([]);
  const [listMedicineFilter, setListMedicineFilter] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const handleResearch = () => {
    setKeyword("");
    setReload(!reload);
  };

  const handleChange = ({ current }) => {
    setPagination({
      ...pagination,
      page: current,
    });
  };

  const handleSearchModal = useCallback(
    (value = "") => {
      const filterListMedicine = listMedicine.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setListMedicineFilter(
        filterListMedicine.map((item) => ({
          label: item.name,
          value: item.name,
        }))
      );
    },
    [listMedicine]
  );

  // useEffect(() => {
  //   if (showAddModal) {
  //     handleSearchModal();
  //   }
  // }, [handleSearchModal, showAddModal]);

  const handleEnterExamination = async (record) => {
    try {
      const result = await updateStatusAppointment({
        appointmentId: record._id,
        status: STATUS_BOOKING.waiting,
      });

      notification.success({
        message: `Bệnh nhân ${record.patientId.fullName} đã vào phòng chờ khám`,
      });
      setReload(!reload);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleShowEdit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setIsCreate(false);
    setShowAddModal(true);
  };

  const handleDelete = async (record) => {
    try {
      await deleteMedicine(record._id);
      message.success("Xóa thành công");
      setReload(!reload);
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 50,
      render: (text, record, index) => (
        <Typography.Text>{getIdxTable(index, pagination.page)}</Typography.Text>
      ),
    },
    {
      width: 200,
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      width: 100,
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      width: 100,
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: function (text) {
        return formatPrice(text);
      },
    },
    {
      width: 100,
      title: "Cách dùng",
      dataIndex: "usage",
      key: "usage",
      align: "center",
      render: (text) => getUsagesTable(text),
    },
    {
      width: 200,
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Paragraph ellipsis={{ rows: 2 }}>
            {text}
          </Typography.Paragraph>
        </Tooltip>
      ),
    },
    {
      width: 200,
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Paragraph ellipsis={{ rows: 3 }}>
            {text}
          </Typography.Paragraph>
        </Tooltip>
      ),
    },
    {
      width: 160,
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (text) => dayjs(text).format(FORMAT_DATE_TIME),
    },
    {
      width: 100,
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Flex gap={10}>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleShowEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            okText="Xác nhận"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record)}
          >
            <Tooltip title="Xóa">
              <Button type="primary" icon={<DeleteOutlined />} danger ghost />
            </Tooltip>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    const initData = async () => {
      setInitLoading(true);
      // Replace this with the actual API call to fetch appointments
      const { medicines } = await getListMedicine({ searchKey: keyword });
      setInitLoading(false);
      setListMedicine(medicines);
    };
    initData();
  }, [filterDate, reload]);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        console.log(values);
        const data = {
          ...values,
        };

        if (isCreate) {
          await createMedicine(data);
          notification.success({
            message: "Thêm thuốc thành công",
          });
        } else {
          await updateMedicine(data);
          notification.success({
            message: "Cập nhật thuốc thành công",
          });
        }
        form.resetFields();
        handleCancel();
        setReload(!reload);
      })
      .catch((error) => {
        message.error(error);
        console.error("Error: ", error);
      });
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setIsCreate(true);
  };

  const handleSearch = (newValue) => {
    setKeyword(newValue);
  };

  return (
    <div>
      <Title
        title="Danh sách thuốc"
        styleContainer={{
          justifyContent: "space-between",
        }}
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
        <Button type="primary" onClick={() => setShowAddModal(true)}>
          <PlusOutlined />
          Thêm thuốc
        </Button>
      </Flex>
      <Table
        rowKey={"_id"}
        className="demo-loadmore-list"
        loading={initLoading}
        columns={columns}
        dataSource={listMedicine}
      />
      <Modal
        title={isCreate ? "Thêm thuốc" : "Cập nhật thuốc"}
        open={showAddModal}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isCreate ? "Thêm" : "Cập nhật"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          initialValues={{
            usage: "after",
          }}
          labelAlign="left"
        >
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên thuốc"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên thuốc" }]}
          >
            <Input placeholder="Nhập tên thuốc" />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Giá tiền"
            name="price"
            rules={[
              {
                type: "number",
                min: 100,
                message: "Vui lòng nhập giá tiền lớn hơn 100",
              },
              { required: true, message: "Vui lòng nhập giá tiền" },
            ]}
          >
            <InputNumber min={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Cách dùng"
            name="usage"
            rules={[{ required: true, message: "Vui lòng nhập cách dùng" }]}
            valuePropName="value"
          >
            <Radio.Group>
              <Radio value="before">Trước ăn</Radio>
              <Radio value="after">Sau ăn</Radio>
              <Radio value="both">Trước / sau ăn</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Ghi chú"
            name="note"
            rules={[{ message: "Vui lòng nhập ghi chú" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicinePage;
