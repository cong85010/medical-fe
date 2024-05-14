import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  message,
  notification,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getListMedicine } from "src/api/medicine";
import { createOrder } from "src/api/order";
import {
  ColorsCustom,
  FORMAT_DATE,
  STATUS_ORDER,
  formatPrice,
} from "src/utils";
import SpaceDiv from "../SpaceDiv";
import { getUsers } from "src/api/user";
import { DebounceSelect } from "../DeboundSelect";
import dayjs from "dayjs";
import AddPatientModal from "../AddPatientModal";
import { getUsagesTable } from "src/utils/utilJsx";

const PrescriptionSalesModal = ({
  medicalRecordId,
  salesId,
  patientId,
  visible,
  onCreated,
  onCancel,
  medicalRecord,
  medicinesImport,
  showPatients = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [medicinesAdded, setMedicinesAdded] = useState([]);
  const [patient, setPatient] = useState(null);
  const [medicine, setMedicine] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [outOfPill, setOutOfPill] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [optionMedicines, setOptionMedicines] = useState([]);
  const [visiblePatientModal, setVisiblePatientModal] = useState(false);

  useEffect(() => {
    if (medicinesImport) {
      setMedicinesAdded(medicinesImport);
    }
  }, [medicinesImport]);

  const handleAddPatientCancel = () => {
    setVisiblePatientModal(false);
  };

  const handleCreatedPatientModal = (result) => {
    setVisiblePatientModal(false);
  };

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
          ...item,
          value: item._id,
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
        form.setFieldsValue({
          paymentMethod: medicalRecord?.paymentMethod || "cash",
        });
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
      dataIndex: "usage",
      key: "usage",
      align: "center",
      render: (usage) => getUsagesTable(usage),
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
      render: (_, record) => {
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
        usage: medicine.usage,
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

        if (!values.paymentMethod) {
          message.error("Chọn phương thức thanh toán");
          return;
        }

        const data = {
          medicines: medicinesAdded,
          totalPrice: getTotalPrice,
          note: values.note,
          paymentMethod: values.paymentMethod,
          medicalRecordId,
          salesId,
          patientId: medicalRecord?.patientId || patientId || patient?.value,
          status: STATUS_ORDER.paid,
        };

        await createOrder(data);
        notification.success({
          message: "Thành công",
          description: "Tạo đơn thuốc thành công",
        });
        handleCancel();
        onCreated();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const clearsMedicine = () => {
    setQuantity(0);
    setOutOfPill(false);
    setMedicine({});
    setIsCreate(true);
  };
  const handleCancel = function () {
    form.resetFields();
    setMedicine({});
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

  async function fetchPatientList(searchKey = "") {
    try {
      const result = await getUsers({ searchKey, userType: "user", limit: 10 });

      return result?.users?.map((item) => {
        return {
          label: `${item.fullName || "Chưa xác định"} - ${item.phone} - ${dayjs(
            item.birthday
          ).format(FORMAT_DATE)}`,
          value: item._id,
          _id: item._id,
        };
      });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  }

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
        {showPatients && (
          <Form.Item label="Bệnh nhân" name="patientId">
            <DebounceSelect
              refreshData={visiblePatientModal}
              allowClear
              selectId="patientId"
              placeholder="Chọn bệnh nhân"
              fetchOptions={fetchPatientList}
              initValue={patient?._id}
              onChange={(selected) => {
                console.log(selected);
                setPatient(selected);
              }}
              style={{ width: "100%" }}
              childrenRight={
                <Button
                  type="primary"
                  onClick={() => setVisiblePatientModal(true)}
                >
                  Thêm bệnh nhân
                </Button>
              }
            />
          </Form.Item>
        )}
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
              <Typography.Text>Mua:</Typography.Text>
              <InputNumber
                style={{ width: 100, marginLeft: 10 }}
                min={0}
                placeholder="Số lượng"
                value={quantity}
                onChange={(value) => {
                  setQuantity(value);
                  setOutOfPill(value > +medicine?.quantity);
                }}
              />

              <Divider type="vertical" />
              <Typography.Text>Tối đa:</Typography.Text>
              <Tooltip title="Đơn vị tính: Viên, lọ, tuyp - ...">
                <Typography.Text strong style={{ width: 80, textAlign: "end" }}>
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
            <Typography.Text>{getUsagesTable(medicine.usage)}</Typography.Text>
            <Divider type="vertical" />
            <Typography.Text>Đơn giá:</Typography.Text>
            <Typography.Text
              style={{
                width: 80,
                textAlign: "end",
                color: ColorsCustom.primary,
                fontWeight: "500",
              }}
            >
              {formatPrice(medicine?.price || 0)}
            </Typography.Text>
            <Divider type="vertical" />
            <Typography.Text>Thành tiền:</Typography.Text>
            <Typography.Text
              style={{
                width: 100,
                textAlign: "end",
                color: ColorsCustom.primary,
                fontWeight: "bold",
              }}
            >
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
          scroll={{
            x: 300,
            y: 300,
          }}
          footer={() => (
            <Flex
              justify="flex-end"
              align="center"
              style={{ textAlign: "right", paddingRight: 70 }}
            >
              <b>Tổng tiền:</b>{" "}
              <Typography.Text
                style={{
                  color: ColorsCustom.primary,
                  width: 120,
                  textAlign: "end",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {formatPrice(getTotalPrice)}
              </Typography.Text>
            </Flex>
          )}
        />
        <SpaceDiv height={10} />
        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Thanh toán"
          name="paymentMethod"
          valuePropName="value"
          rules={[
            { required: true, message: "Vui lòng chọn phương thức thanh toán" },
          ]}
        >
          <Radio.Group name="paymentMethod">
            <Space direction="vertical">
              <Radio value="cash">Tiền mặt</Radio>
              <Radio value="banking">Chuyển khoản</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
      <AddPatientModal
        visible={visiblePatientModal}
        onCancel={handleAddPatientCancel}
        onFinish={handleCreatedPatientModal}
      />
    </Modal>
  );
};

export default PrescriptionSalesModal;
