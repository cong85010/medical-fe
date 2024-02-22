import { Button, DatePicker, Flex, Form, Modal, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import { DebounceSelect } from "../DeboundSelect";
import { PlusOutlined } from "@ant-design/icons";
import AddPatientModal from "src/components/AddPatientModal";
import dayjs from "dayjs";
import { getUsers } from "src/api/user";

export default function AddAppointmentPatient({
  visible,
  onCancel,
  onFinish,
  selectedPatient: patient,
}) {
  const [form] = Form.useForm();

  const [isCreatePatientModal, setIsCreatePatientModal] = useState(false);

  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    if (patient) {
      form.setFieldsValue({
        patientId: patient._id,
      });
    }
  }, [form, patient]);

  const handleAppointmentOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onFinish(false);
      })
      .catch((errorInfo) => {
        console.log("Failed:", errorInfo);
      });
  };

  function onCancelModal() {
    form.resetFields();
    onCancel();
  }

  const handleCreatedPatientModal = async (record) => {
    setRefreshData(!refreshData);
    form.setFieldValue("patientId", record._id);
    setIsCreatePatientModal(false);
  };

  async function fetchPatientList(searchKey = "") {
    try {
      const result = await getUsers({ searchKey, userType: "user", limit: 10 });

      return result?.users?.map((item) => {
        return {
          label: `${item.fullName} - ${item.phone} - ${dayjs(
            item.birthday
          ).format("DD/MM/YYYY")}`,
          value: item._id,
        };
      });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  }

  return (
    <>
      <Modal
        title="Tạo lịch khám"
        open={visible}
        onOk={handleAppointmentOk}
        onCancel={onCancelModal}
        okText="Tạo lịch khám"
        cancelText="Hủy"
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          name="appointmentForm"
          initialValues={{
            date: dayjs(),
            time: dayjs(),
          }}
        >
          <Form.Item
            name="patientId"
            label="Bệnh nhân"
            rules={[{ required: true, message: "Vui lòng chọn bệnh nhân!" }]}
            fieldId="patientId"
          >
            <DebounceSelect
              selectId="patientId"
              placeholder="Chọn bệnh nhân"
              fetchOptions={fetchPatientList}
              style={{ width: "100%" }}
              refreshData={refreshData}
              childrenRight={
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreatePatientModal(true)}
                >
                  Tạo mới
                </Button>
              }
            />
          </Form.Item>
          <Flex gap={20}>
            <Form.Item
              name="date"
              label="Ngày khám"
              rules={[{ required: true, message: "Vui lòng chọn ngày khám!" }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="time"
              label="Giờ khám"
              rules={[{ required: true, message: "Vui lòng chọn giờ khám!" }]}
            >
              <TimePicker format="HH:mm" minuteStep={5} />
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
      <AddPatientModal
        visible={isCreatePatientModal}
        onCancel={() => setIsCreatePatientModal(false)}
        onFinish={handleCreatedPatientModal}
      />
    </>
  );
}
