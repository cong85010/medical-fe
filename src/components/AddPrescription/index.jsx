import { Form, message, Modal, Switch, Select, Input } from "antd";
import { useEffect, useState } from "react";

export default function AddMedicine({
  visible,
  onClose,
  onCreate
}) {
  const [name, setName] = useState();
  const [session, setSession] = useState([]);
  const [quantity, setQuantity] = useState();

  useEffect(() => {
    axiosAuth({
      url: "/medical/pills",
      method: "get",
    }).then((response) => {
      setPills(response.data.data || []);
    });
  }, []);
  const handleAdMedicines = (values) => {
    if (onlyCreate) {
      axiosAuth({
        url: "/medical/add-medicine",
        method: "post",
        data: {
          ...values,
          medicalResultID,
        },
      })
        .then((res) => {
          message.success("Tạo thành công");
          console.log(res.data);
        })
        .catch((error) => {
          message.error("Có lỗi xảy ra");
          console.log(error);
        });
    } else {
      setTags([...tags, values.name]);
      setMedicines([...medicines, values]);
    }
    close();
  };

  return (
    <Modal
      destroyOnClose
      centered
      title="Thêm thuốc"
      open={visible}
      onCancel={close}
      footer={null}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
        onFinish={handleAdMedicines}
        style={{ marginRight: "50px" }}
        initialValues={{
          dosage: {
            morning: 1,
            afternoon: 1,
            night: 1,
          },
        }}
      >
        <Form.Item
          label="Tên thuốc"
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn thuốc",
            },
          ]}
        >
          <Select
            options={pills?.map((e) => {
              return { key: e.name, value: e.name };
            })}
          />
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng",
            },
            {
              min: 0,
              message: "Vui lòng nhập số lượng",
            },
          ]}
        >
          <Input type="number" placeHolder="Số lượng" />
        </Form.Item>

        <Form.Item
          name={["dosage", "ifAfter"]}
          label="Sau khi ăn"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item label="Liều uống sáng" name={["dosage", "morning"]}>
          <CInput type="number" placeHolder="Số liều buổi sáng" min={0} />
        </Form.Item>
        <Form.Item label="Liều uống trưa" name={["dosage", "afternoon"]}>
          <CInput type="number" placeHolder="Số liều buổi trưa" min={0} />
        </Form.Item>
        <Form.Item label="Liều uống tối" name={["dosage", "night"]}>
          <CInput type="number" placeHolder="Số liều buổi tối" min={0} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <CButton type="primary" htmlType="submit">
            Tạo thuốc
          </CButton>
        </Form.Item>
      </Form>
    </Modal>
  );
}
