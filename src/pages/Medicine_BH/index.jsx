// AppointmentPage.js
import {
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
import { createMedicine, getListMedicine } from "src/api/medicine";
import Title from "src/components/Title";
import { FORMAT_DATE_TIME, STATUS_BOOKING, getIdxTable } from "src/utils";
import { getUsagesTable } from "src/utils/utilJsx";

const MedicinePage = () => {
  const [form] = Form.useForm();
  const [showAddModal, setShowAddModal] = useState(false);
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

  useEffect(() => {
    if (showAddModal) {
      handleSearchModal();
    }
  }, [handleSearchModal, showAddModal]);

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
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 80,
      render: (text, record, index) => (
        <Typography.Text strong style={{ fontSize: 17 }}>
          {getIdxTable(index, pagination.page)}
        </Typography.Text>
      ),
    },
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Cách dùng",
      dataIndex: "usage",
      key: "usage",
      align: "center",
      render: (text) => getUsagesTable(text),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (text) => dayjs(text).format(FORMAT_DATE_TIME),
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
          name: values.name[0],
        };

        await createMedicine(data);
        message.success("Thêm thuốc thành công");
        form.resetFields();
        setShowAddModal(false);
        setReload(!reload);
      })
      .catch((error) => {
        message.error(error);
        console.error("Error: ", error);
      });
  };

  const handleCancel = () => {
    setShowAddModal(false);
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
        scroll={{ x: 800, y: 500 }}
      />
      <Modal
        title="Thêm thuốc"
        open={showAddModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} labelCol={{ span: 5 }} labelAlign="left">
          <Form.Item
            label="Tên thuốc"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên thuốc" }]}
          >
            <Select
              placeholder="Tên thuốc"
              mode="tags"
              maxCount={1}
              onSearch={handleSearchModal}
              onChange={handleChange}
              options={listMedicineFilter}
            />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Cách dùng"
            name="usage"
            rules={[{ required: true, message: "Vui lòng nhập cách dùng" }]}
          >
            <Radio.Group>
              <Radio value="before">Trước ăn</Radio>
              <Radio value="after">Sau ăn</Radio>
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
