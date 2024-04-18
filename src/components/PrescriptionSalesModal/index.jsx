import {
  Upload,
  Modal,
  Form,
  Input,
  InputNumber,
  Table,
  Space,
  Checkbox,
  Button,
  Tooltip,
  Flex,
  notification,
  message,
  Typography,
  Divider,
  Select,
  Popconfirm,
  Tag,
  Radio,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  STATUS_BOOKING,
  beforeUpload,
  formatPrice,
  getBase64,
} from "src/utils";
import { getListMedicine } from "src/api/medicine";
import { DebounceSelect } from "../DeboundSelect";
import { updateStatusAppointment } from "src/api/appointment";
import {
  createMedicalRecord,
  updateMedicalRecord,
} from "src/api/medicalRecord";
import { uploadFile, uploadFiles } from "src/api/upload";
import SpaceDiv from "../SpaceDiv";
import { createOrder } from "src/api/order";

const PrescriptionSalesModal = ({
  medicalRecordId,
  salesId,
  visible,
  onCreated,
  onCancel,
  medicalRecord,
  medicinesImport,
}) => {
  const [loading, setLoading] = useState(false);
  const [medicinesAdded, setMedicinesAdded] = useState([]);
  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [afterEat, setAfterEat] = useState(true);
  const [outOfPill, setOutOfPill] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [optionMedicines, setOptionMedicines] = useState([]);

  useEffect(() => {
    if (medicinesImport) {
      setMedicinesAdded(medicinesImport);
    }
  }, [medicinesImport]);

  const fetchMedicienList = useCallback(async (param) => {
    try {
      const { medicines } = await getListMedicine({
        searchKey: param || "",
      });

      const newData = medicines?.map((item) => {
        return {
          label: `${item.name || "Chưa xác định"} - SL: ${
            item.quantity
          } - ${formatPrice(item?.price)}`,
          name: item.name,
          quantity: item.quantity,
          price: item?.price,
          value: item._id,
          _id: item._id,
        };
      });

      setOptionMedicines(newData);
    } catch (error) {
      console.error("Error fetching examination history:", error);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      fetchMedicienList();
      if (medicalRecord) {
        form.setFieldsValue(medicalRecord);
        setMedicinesAdded(medicalRecord.medicines);
        setFileList(
          medicalRecord.files.map((file) => {
            return {
              uid: file,
              name: file,
              status: "done",
              url: file,
              isAdded: true,
            };
          })
        );
      }
    }
  }, [fetchMedicienList, form, medicalRecord, visible]);

  const handleEdit = (record) => {
    const selected = optionMedicines.find((opt) => opt._id === record._id);
    setMedicine(selected);
    setQuantity(record.quantity);
    setAfterEat(record.affterEat);
    setOutOfPill(record.outOfPill);
    setIsCreate(false);
  };

  const handleRemoveMedicine = (record) => {
    const listMedicines = medicinesAdded.filter(
      (item) => item.name !== record.name
    );
    setMedicinesAdded(listMedicines);
  };

  const columns = [
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      width: 120,
      title: "Cách dùng",
      dataIndex: "affterEat",
      key: "affterEat",
      align: "center",
      render: (affterEat, record) => {
        return <Space>{affterEat ? "Sau khi ăn" : "Trước khi ăn"}</Space>;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "end",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "end",
      render: (price, record) => {
        return formatPrice(price);
      },
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 150,
      align: "end",
      render: (_, record) => {
        return formatPrice(record.price * record.quantity);
      },
    },
    {
      width: 80,
      key: "action",
      render: (affterEat, record) => {
        return (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <Button
                size="small"
                onClick={() => handleEdit(record)}
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip title="Xóa">
              <Popconfirm
                title="Xác nhận xóa"
                okText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => handleRemoveMedicine(record)}
              >
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined color="red" />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleAddMedicine = () => {
    if (medicine.quantity < quantity) {
      message.error("Số lượng thuốc không đủ");
      return;
    }

    if (medicine) {
      const addedIdx = medicinesAdded.findIndex(
        (item) => item._id === medicine._id
      );

      const listMedicines = [...medicinesAdded];
      if (addedIdx !== -1) {
        listMedicines.splice(addedIdx, 1);
      }

      const newMedicine = {
        _id: medicine._id,
        name: medicine.name,
        quantity: quantity,
        affterEat: afterEat,
        outOfPill: outOfPill,
        price: medicine.price,
      };

      listMedicines.unshift(newMedicine);
      setMedicinesAdded(listMedicines);
      clearsMedicine();
    }
  };

  const handleOK = () => {
    form
      .validateFields()
      .then(async (values) => {
        // Validate the values
        if (medicinesAdded.length === 0) {
          message.error("Vui lòng chọn ít nhất một loại thuốc");
          return;
        }

        const data = {
          medicines: medicinesAdded,
          totalPrice: getTotalPrice,
          note: values.note,
          paymentMethod: values.paymentMethod,
          medicalRecordId,
          salesId,
        };

        await createOrder(data);
        notification.success({
          message: "Thành công",
          description: "Tạo đơn thuốc thành công",
        });
        onCreated();
      })
      .catch((info) => {
        notification.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra!",
        });
        console.log("Validate Failed:", info);
      });
  };

  const clearsMedicine = () => {
    setQuantity(0);
    setAfterEat(false);
    setOutOfPill(false);
    setMedicine(null);
    setIsCreate(true);
  };
  const handleCancel = function () {
    form.resetFields();
    setMedicine(null);
    setFileList([]);
    setMedicinesAdded([]);
    clearsMedicine();
    onCancel();
  };

  const getTotalPrice = useMemo(() => {
    return medicinesAdded.reduce(
      (total, item) => total + item.quantity * (item.price || 0),
      0
    );
  }, [medicinesAdded]);

  return (
    <Modal
      title="Thanh toán hóa đơn thuốc"
      open={visible}
      onOk={handleOK}
      onCancel={handleCancel}
      okText="Thanh toán"
      cancelText="Hủy"
      centered
      width={800}
      styles={{
        body: { height: "80vh", overflowY: "auto" },
      }}
    >
      <Form
        form={form}
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 4 }}
        labelAlign="left"
        initialValues={{
          paymentMethod: "cash",
        }}
      >
        <Form.Item label="Chọn thuốc">
          <Flex justify="space-between">
            <Select
              style={{ width: 270 }}
              placeholder="Chọn thuốc"
              options={optionMedicines}
              onChange={(value, item) => setMedicine(item)}
              value={medicine?._id || ""}
              disabled={!isCreate}
            />
            <Flex align="center">
              <Typography.Text>Đơn giá:</Typography.Text>
              <Typography.Text style={{ width: 80, textAlign: "end" }}>
                {formatPrice(medicine?.price || 0)}
              </Typography.Text>
              <Divider type="vertical" />
              <Typography.Text>Tối đa:</Typography.Text>
              <Tooltip title="Đơn vị tính: Viên, lọ, tuyp - ...">
                <Typography.Text style={{ width: 80, textAlign: "end" }}>
                  {medicine?.quantity} đơn vị
                </Typography.Text>
              </Tooltip>
            </Flex>

            <Tooltip title="Làm mới">
              <Button onClick={clearsMedicine} icon={<ReloadOutlined />} />
            </Tooltip>
          </Flex>
        </Form.Item>
        <Form.Item label="Cách dùng">
          <Flex align="center" justify="space-between">
            <Checkbox
              min={0}
              checked={afterEat}
              onChange={() => setAfterEat((prev) => !prev)}
            />
            <Typography.Text>
              {afterEat ? "Sau khi ăn" : "Trước khi ăn"}
            </Typography.Text>
            <Divider type="vertical" />
            <Typography.Text>Mua:</Typography.Text>
            <InputNumber
              style={{ width: 100 }}
              min={0}
              placeholder="Số lượng"
              value={quantity}
              onChange={(value) => {
                setQuantity(value);
                setOutOfPill(value > +medicine?.quantity);
              }}
            />
            <Divider type="vertical" />
            <Typography.Text>Thành tiền:</Typography.Text>
            <Typography.Text style={{ width: 100, textAlign: "end" }}>
              {formatPrice((medicine?.price || 0) * quantity)}
            </Typography.Text>
            <Button
              style={{ width: 100 }}
              type="primary"
              onClick={handleAddMedicine}
              disabled={!medicine || quantity === 0}
            >
              {isCreate ? "Thêm" : "Cập nhật"}
            </Button>
          </Flex>
        </Form.Item>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={medicinesAdded}
          pagination={false}
          footer={() => (
            <Flex
              justify="flex-end"
              style={{ textAlign: "right", paddingRight: 90 }}
            >
              <b>Tổng tiền:</b>{" "}
              <Typography.Text
                strong
                style={{ color: "#123123", width: 120, textAlign: "end" }}
              >
                {formatPrice(getTotalPrice)}
              </Typography.Text>
            </Flex>
          )}
        />
        <SpaceDiv height={10} />
        <Form.Item
          label="Ghi chú"
          name="note"
          rules={[{ message: "Vui lòng nhập ghi chú" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Thanh toán"
          name="paymentMethod"
          valuePropName="value"
          value
        >
          <Radio.Group name="paymentMethod">
            <Space direction="vertical">
              <Radio value="cash">Tiền mặt</Radio>
              <Radio value="banking">Chuyển khoản</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PrescriptionSalesModal;
