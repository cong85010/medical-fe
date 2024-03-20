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
} from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { STATUS_BOOKING, beforeUpload, getBase64 } from "src/utils";
import { getListPrescription } from "src/api/prescription";
import { DebounceSelect } from "../DeboundSelect";
import { updateStatusAppointment } from "src/api/appointment";
import {
  createMedicalRecord,
  updateMedicalRecord,
} from "src/api/medicalRecord";
import { uploadFile, uploadFiles } from "src/api/upload";

const MedicalRecordModal = ({
  patientId,
  doctorId,
  visible,
  onCreated,
  onCancel,
  medicalRecord,
}) => {
  const [loading, setLoading] = useState(false);
  const [prescriptionsAdded, setPrescriptionsAdded] = useState([]);
  const [prescription, setPrescription] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [afterEat, setAfterEat] = useState(true);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible && medicalRecord) {
      form.setFieldsValue(medicalRecord);
      setPrescriptionsAdded(medicalRecord.prescriptions);
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
  }, [form, medicalRecord, visible]);

  const fetchPatientList = useCallback(async (param) => {
    try {
      const { prescriptions } = await getListPrescription({
        searchKey: param,
      });

      return prescriptions?.map((item) => {
        return {
          label: `${item.name || "Chưa xác định"} - Sl: ${item.quantity}`,
          name: item.name,
          quantity: item.quantity,
          value: item._id,
          _id: item._id,
        };
      });
    } catch (error) {
      console.error("Error fetching examination history:", error);
    }
  }, []);

  const handleRemovePrescription = (record) => {
    const listPrescriptions = prescriptionsAdded.filter(
      (item) => item.name !== record.name
    );
    setPrescriptionsAdded(listPrescriptions);
  };

  const columns = [
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Cách dùng",
      dataIndex: "affterEat",
      key: "affterEat",
      render: (affterEat, record) => {
        return <Space>{affterEat ? "Sau khi ăn" : "Trước khi ăn"}</Space>;
      },
    },
    {
      width: 70,
      key: "action",
      render: (affterEat, record) => {
        return (
          <Tooltip>
            <Button
              onClick={() => handleRemovePrescription(record)}
              icon={<DeleteOutlined color="red" />}
            />
          </Tooltip>
        );
      },
    },
  ];

  const handleAddMedicine = () => {
    if (prescription) {
      const addedIdx = prescriptionsAdded.findIndex(
        (item) => item._id === prescription._id
      );

      const listPrescriptions = [...prescriptionsAdded];
      if (addedIdx !== -1) {
        listPrescriptions.splice(addedIdx, 1);
      }

      const newPrescription = {
        _id: prescription._id,
        name: prescription.name,
        quantity: quantity,
        affterEat: afterEat,
      };

      listPrescriptions.unshift(newPrescription);
      setPrescriptionsAdded(listPrescriptions);
      setQuantity(quantity);
      setAfterEat(true);
      setPrescription(null);
    }
  };

  const handleOK = () => {
    form
      .validateFields()
      .then(async (values) => {
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
            prescriptions: prescriptionsAdded,
            note: values.note,
            patientId: patientId,
            doctorId: doctorId,
          });

          onCreated(newRecord);
        } else {
          let files = [];
          if (fileList.length > 0) {
            const { fileURLs } = await uploadFiles(fileList);
            files = fileURLs;
          }

          const { medicalRecord } = await createMedicalRecord({
            result: values.result,
            files: files,
            prescriptions: prescriptionsAdded,
            note: values.note,
            patientId: patientId,
            doctorId: doctorId,
          });

          onCreated(medicalRecord);
        }

        notification.success({
          message: "Thành công",
          description: "Lưu kết quả khám bệnh thành công",
        });
      })
      .catch((info) => {
        notification.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra!",
        });
        console.log("Validate Failed:", info);
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

  return (
    <Modal
      title="Điền kết quả khám bệnh"
      open={visible}
      onOk={handleOK}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      centered
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
            <DebounceSelect
              style={{ width: 190 }}
              selectId="prescription"
              placeholder="Chọn thuốc"
              fetchOptions={fetchPatientList}
              onChange={(value) => setPrescription(value)}
              initValue=""
            />
            <InputNumber
              onCHan
              style={{ width: 60 }}
              min={0}
              max={prescription ? prescription.quantity : undefined}
              placeholder="Số lượng"
              value={quantity}
              onChange={(value) => setQuantity(value)}
            />
            <Tooltip title="Sau khi ăn">
              <Checkbox
                min={0}
                placeholder="Số lượng"
                checked={afterEat}
                onChange={() => setAfterEat((prev) => !prev)}
              />
            </Tooltip>
            <Button
              type="primary"
              disabled={
                !prescription ||
                quantity === 0 ||
                quantity > prescription?.quantity
              }
              onClick={handleAddMedicine}
            >
              Thêm
            </Button>
          </Flex>
        </Form.Item>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={prescriptionsAdded}
          pagination={false}
          scroll={{ y: 220 }}
        />
      </Form>
    </Modal>
  );
};

export default MedicalRecordModal;
