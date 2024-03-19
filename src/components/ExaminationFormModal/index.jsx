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
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { STATUS_BOOKING, beforeUpload, getBase64 } from "src/utils";
import { getListPrescription } from "src/api/prescription";
import { DebounceSelect } from "../DeboundSelect";
import { updateStatusAppointment } from "src/api/appointment";
import { createMedicalRecord } from "src/api/medicalRecord";
import { uploadFile, uploadFiles } from "src/api/upload";

const ExaminationFormModal = ({
  patientId,
  doctorId,
  visible,
  onCreated,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [note, setNote] = useState("");
  const [prescriptionsAdded, setPrescriptionsAdded] = useState([]);
  const [prescription, setPrescription] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [afterEat, setAfterEat] = useState(true);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

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

  // const handleChange = (info) => {
  //   if (info.file.status === "uploading") {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === "done") {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, (url) => {
  //       setLoading(false);
  //       setImageUrl(url);
  //     });
  //   }
  // };
  // const uploadButton = (
  //   <button
  //     style={{
  //       border: 0,
  //       background: "none",
  //     }}
  //     type="button"
  //   >
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div
  //       style={{
  //         marginTop: 8,
  //       }}
  //     >
  //       Upload
  //     </div>
  //   </button>
  // );

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
  ];

  const handleAddMedicine = () => {
    if (prescription) {
      const addedIdx = prescriptionsAdded.findIndex(
        (item) => item._id === prescription._id
      );

      console.log(prescriptionsAdded);

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
        const { fileURLs } = await uploadFiles(fileList);

        const { medicalRecord } = await createMedicalRecord({
          result: values.result,
          files: fileURLs,
          prescriptions: prescriptionsAdded,
          note: values.note,
          patientId: patientId,
          doctorId: doctorId,
        });

        notification.success({
          message: "Thành công",
          description: "Lưu kết quả khám bệnh thành công",
        });
        onCreated(medicalRecord);
      })
      .catch((info) => {
        notification.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra!",
        });
        console.log("Validate Failed:", info);
      });
  };

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  const props = {
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const notShowError = file.type.includes('image') || file.type.includes('document') || file.type.includes('pdf');
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
          <Input.TextArea
            required
            placeholder="Nhập nhập kết quả khám bệnh"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
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
          <Input.TextArea
            placeholder="Lưu ý cho bệnh nhân"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
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

export default ExaminationFormModal;
