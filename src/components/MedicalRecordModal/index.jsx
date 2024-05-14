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
} from "antd";
import { useCallback, useEffect, useState } from "react";
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
import { STATUS_BOOKING, beforeUpload, getBase64 } from "src/utils";
import { getListMedicine } from "src/api/medicine";
import { DebounceSelect } from "../DeboundSelect";
import { updateStatusAppointment } from "src/api/appointment";
import {
  createMedicalRecord,
  updateMedicalRecord,
} from "src/api/medicalRecord";
import { uploadFile, uploadFiles } from "src/api/upload";
import { getUsagesTable } from "src/utils/utilJsx";

const MedicalRecordModal = ({
  appointmentId,
  patientId,
  doctorId,
  visible,
  onCreated,
  onCancel,
  medicalRecord,
}) => {
  const [loading, setLoading] = useState(false);
  const [medicinesAdded, setMedicinesAdded] = useState([]);
  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [outOfPill, setOutOfPill] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [optionMedicines, setOptionMedicines] = useState([]);

  const fetchMedicienList = useCallback(async (param) => {
    try {
      const { medicines } = await getListMedicine({
        searchKey: param || "",
      });

      const newData = medicines?.map((item) => {
        return {
          label: `${item.name || "Chưa xác định"} - SL: ${item.quantity}`,
          ...item,
          value: item._id,
        };
      });

      console.log("====================================");
      console.log(newData);
      console.log("====================================");

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
      render: (usage, record) => {
        return getUsagesTable(usage);
      },
    },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "center",
    },
    {
      align: "center",
      width: 50,
      title: <Tooltip title="Tình trạng">TT</Tooltip>,
      dataIndex: "outOfPill",
      key: "outOfPill",
      render: (outOfPill, record) => {
        return (
          <Tooltip title={outOfPill ? "Tạm hết thuốc" : "Còn hàng"}>
            <Tag color={outOfPill ? "red" : "blue"}>
              {outOfPill ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            </Tag>
          </Tooltip>
        );
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
    form.validateFields().then(async (values) => {
      if (medicalRecord) {
        const filesNeedAdd = fileList.filter((file) => !file?.isAdded);
        let files = medicalRecord.files;
        if (filesNeedAdd.length > 0) {
          const { fileURLs } = await uploadFiles(filesNeedAdd);
          files = files.concat(fileURLs);
        }
        //update
        const { medicalRecord: newRecord } = await updateMedicalRecord({
          ...medicalRecord,
          result: values.result,
          files: files,
          medicines: medicinesAdded,
          note: values.note,
          patientId: patientId,
          doctorId: doctorId,
          outOfPill,
        });

        onCreatedFinished(newRecord);
      } else {
        let files = [];
        if (fileList.length > 0) {
          const { fileURLs } = await uploadFiles(fileList);
          files = fileURLs;
        }

        const { medicalRecord } = await createMedicalRecord({
          result: values.result,
          files: files,
          medicines: medicinesAdded,
          note: values.note,
          patientId: patientId,
          doctorId: doctorId,
          appointmentId: appointmentId,
          outOfPill,
        });

        onCreatedFinished(medicalRecord);
      }

      notification.success({
        message: "Thành công",
        description: "Lưu kết quả khám bệnh thành công",
      });
    });
  };

  const props = {
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);

      if (medicalRecord) {
        const fileIdx = medicalRecord.files.findIndex(
          (item) => item === file.name
        );

        if (fileIdx !== -1) {
          medicalRecord.files.splice(fileIdx, 1);
        }
      }
    },
    beforeUpload: (file) => {
      const notShowError =
        file.type.includes("image") ||
        file.type.includes("document") ||
        file.type.includes("pdf");
      if (!notShowError) {
        message.error(`${file.name} is not a png file`);
        return;
      }

      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const onCreatedFinished = (result) => {
    form.resetFields();
    setMedicine(null);
    setFileList([]);
    setMedicinesAdded([]);
    clearsMedicine();
    onCreated(result);
  };

  const clearsMedicine = () => {
    setQuantity(0);
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

  return (
    <Modal
      title="Điền kết quả khám bệnh"
      open={visible}
      onOk={handleOK}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Hủy"
      centered
      width={600}
      destroyOnClose
      styles={{
        content: { height: "95vh", overflowY: "scroll" },
      }}
    >
      <Form
        form={form}
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 4 }}
        labelAlign="left"
      >
        <Form.Item
          label="Kết quả"
          name="result"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập kết quả khám bệnh",
            },
          ]}
        >
          <Input.TextArea required placeholder="Nhập nhập kết quả khám bệnh" />
        </Form.Item>
        <Form.Item label="Hình ảnh" name="image">
          {/* <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: "100%",
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload> */}

          <Upload {...props} fileList={fileList}>
            <Button icon={<UploadOutlined />}>Đính kèm</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Lưu ý" name="note">
          <Input.TextArea placeholder="Lưu ý cho bệnh nhân" />
        </Form.Item>
        <Form.Item label="Đơn thuốc">
          <Flex justify="space-between">
            <Select
              style={{ width: 270 }}
              placeholder="Chọn thuốc"
              options={optionMedicines}
              onChange={(value, item) => {
                setMedicine(item);
              }}
              value={medicine?._id || ""}
              disabled={!isCreate}
            />
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
            <Tooltip title="Làm mới">
              <Button onClick={clearsMedicine} icon={<ReloadOutlined />} />
            </Tooltip>
          </Flex>
        </Form.Item>
        <Form.Item label="Cách dùng">
          <Flex align="center" justify="space-between">
            <Typography.Text>{getUsagesTable(medicine?.usage)}</Typography.Text>
            <Divider type="vertical" />
            <Typography.Text>Hết thuốc</Typography.Text>
            <Checkbox
              min={0}
              checked={outOfPill}
              onChange={() => setOutOfPill((prev) => !prev)}
            />
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
        />
      </Form>
    </Modal>
  );
};

export default MedicalRecordModal;
