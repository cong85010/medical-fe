import { Upload, Modal, Form, Input } from "antd";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { beforeUpload, getBase64 } from "src/utils";


const ExaminationFormModal = ({
  isExaminationModalVisible,
  handleExaminationResultOk,
  onCancel,
  diagnosis,
  setDiagnosis,
  prescription,
  setPrescription,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <Modal
      title="Examination Form"
      open={isExaminationModalVisible}
      onOk={handleExaminationResultOk}
      onCancel={onCancel}
    >
      <Form>
        <Form.Item label="Diagnosis" name="diagnosis">
          <Input.TextArea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Prescription" name="prescription">
          <Input.TextArea
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Upload Image" name="image">
          <Upload
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
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExaminationFormModal;
