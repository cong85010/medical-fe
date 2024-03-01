import {
  Alert,
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Grid,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  TimePicker,
  Typography,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { DebounceSelect } from "../DeboundSelect";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import AddPatientModal from "src/components/AddPatientModal";
import dayjs from "dayjs";
import { getUsers } from "src/api/user";
import { createAppointment, getListTimeByDate } from "src/api/appointment";
import SelectSpecialty from "../SelectSpecialty";
import { SelectDoctor } from "../SelectDoctor";

const Option = Select.Option;
export default function AddAppointmentPatient({
  visible,
  onCancel,
  onFinish,
  selectedPatient: patient,
}) {
  const [form] = Form.useForm();

  const [isCreatePatientModal, setIsCreatePatientModal] = useState(false);

  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [listTimeSlots, setListTimeSlots] = useState([]);
  const [specialty, setSpecialty] = useState('');
  const [doctorId, setDoctorId] = useState('');

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getListTimeByDate(
        dayjs(form.getFieldValue("date")).format("DD/MM/YYYY"),
        doctorId || ""
      ).then(({ times }) => {
        setListTimeSlots(times);
        setLoading(false);
      });
    }
  }, [form, refreshData, doctorId, visible]);

  const handleButtonClick = (hour) => {
    setSelectedHour(hour);
  };

  useEffect(() => {
    if (patient && visible) {
      form.setFieldsValue({
        patientId: patient._id,
      });
    }
  }, [form, patient, visible]);

  const handleAppointmentOk = () => {
    if (selectedHour === null) {
      notification.error({
        message: "Vui lòng chọn thời gian khám",
      });
      return;
    }

    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        const result = await createAppointment({
          patientName: patient?.fullName,
          patientId: values.patientId,
          doctorId: values.doctor._id,
          doctorName: values.doctor.fullName,
          specialty: values.specialty,
          time: selectedHour,
          date: dayjs(values.date).format("DD/MM/YYYY"),
          status: "booked",
        });
        form.resetFields();
        setSelectedHour(null);
        notification.success({
          message: "Đặt lịch khám thành công",
        });
        onFinish(result);
      })
      .catch((errorInfo) => {
        console.log("Failed:", errorInfo);
        setRefreshData(!refreshData);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function onCancelModal() {
    form.resetFields();
    onCancel();
  }

  const handleCreatedPatientModal = async (record) => {
    form.setFieldValue("patientId", record._id);
    setIsCreatePatientModal(false);
  };

  async function fetchPatientList(searchKey = "") {
    try {
      const result = await getUsers({ searchKey, userType: "user", limit: 10 });

      return result?.users?.map((item) => {
        return {
          label: `${item.fullName || "Chưa xác định"} - ${item.phone} - ${dayjs(
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

  const disabledDate = (current) => {
    const currentDate = dayjs();
    const sevenDaysLater = currentDate.add(7, "day");
    return (
      current &&
      (current < currentDate.startOf("day") ||
        current > sevenDaysLater.endOf("day"))
    );
  };

  const handleChangeDate = (item) => {
    setSelectedHour(null);
    setRefreshData(!refreshData);
  };

  const handleChangeDoctor = (item) => {
    setDoctorId(item._id);
    setRefreshData(!refreshData);
  };

  return (
    <>
      <Modal
        title="Tạo lịch khám"
        open={visible}
        onOk={handleAppointmentOk}
        onCancel={onCancelModal}
        okText="Tạo lịch khám"
        cancelText="Hủy"
        destroyOnClose
        okButtonProps={{
          disabled: selectedHour === null,
          title: "Chọn lịch khám",
        }}
      >
        <Form
          id="appointmentForm"
          form={form}
          layout="vertical"
          name="appointmentForm"
          initialValues={{
            date: dayjs(),
            time: "08:00",
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
            />
          </Form.Item>
          <Form.Item
            label="Chọn chuyên khoa"
            name="specialty"
            valuePropName="specialty"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn chuyên khoa!",
              },
            ]}
          >
            <SelectSpecialty onChange={(item) => setSpecialty(item)}/>
          </Form.Item>
          <Form.Item
            label="Chọn bác sĩ"
            name="doctor"
            valuePropName="doctor"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn bác sĩ!",
              },
            ]}
          >
            <SelectDoctor onChange={handleChangeDoctor} specialty={specialty} />
          </Form.Item>
          <Flex gap={20}>
            <Form.Item
              name="date"
              label="Ngày khám"
              rules={[{ required: true, message: "Vui lòng chọn ngày khám!" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                onChange={handleChangeDate}
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item
              label="Thời gian dự kiến"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Typography.Text strong>{selectedHour}</Typography.Text>
            </Form.Item>
            <Form.Item
              label="Làm mới thời gian"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Button
                loading={loading}
                icon={<ReloadOutlined />}
                onClick={() => setRefreshData(!refreshData)}
              >
                Làm mới
              </Button>
            </Form.Item>
          </Flex>
          <Spin spinning={loading}>
            <Row gutter={[10, 10]}>
              {listTimeSlots.length === 0 && (
                <Alert
                  style={{ width: "100%" }}
                  type="warning"
                  message="Tạm thời hết lịch"
                  description="Hãy chọn ngày khác!"
                />
              )}
              {listTimeSlots.map((hour) => (
                <Col span={4} key={hour}>
                  <Button
                    key={hour}
                    type={selectedHour === hour ? "primary" : "default"}
                    onClick={() => handleButtonClick(hour)}
                  >
                    {hour}
                  </Button>
                </Col>
              ))}
            </Row>
          </Spin>
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
