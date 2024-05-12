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
  Space,
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
import {
  createAppointment,
  getListTimeByDate,
  updateAppointment,
} from "src/api/appointment";
import SelectSpecialty from "../SelectSpecialty";
import { SelectDoctor } from "../SelectDoctor";
import {
  FORMAT_DATE,
  formatedDate,
  formatedTime,
  getSpecialtyName,
} from "src/utils";
import { formatDate } from "@fullcalendar/core";

export default function AddAppointmentPatient({
  visible,
  onCancel,
  onFinish,
  selectedPatient: patient,
  selectedAppointent = {},
  isPatient = false,
}) {
  const [form] = Form.useForm();
  const [isCreatePatientModal, setIsCreatePatientModal] = useState(false);

  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [listTimeSlots, setListTimeSlots] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getListTimeByDate(
        dayjs(form.getFieldValue("date")).format(FORMAT_DATE),
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
      if (selectedAppointent?.patientId) {
        // setSelectedHour(selectedAppointent.time);
        form.setFieldsValue({
          ...selectedAppointent,
          patientId: selectedAppointent?.patientId._id,
          date: dayjs(selectedAppointent.date, FORMAT_DATE),
          doctor: selectedAppointent.doctorId,
        });
        setRefreshData((prev) => !prev);
      } else {
        form.setFieldsValue({
          patientId: patient._id,
        });
      }
    }
  }, [form, patient, selectedAppointent, visible]);

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

        if (selectedAppointent?._id) {
          const result = await updateAppointment({
            ...selectedAppointent,
            patientId: isPatient ? patient._id : values.patientId,
            doctorId: values.doctor._id,
            specialty: values.specialty,
            time: selectedHour,
            date: dayjs(values.date).format(FORMAT_DATE),
            status: "booked",
          });
          form.resetFields();
          setSelectedHour(null);
          notification.success({
            message: "Cập nhật lịch khám thành công",
          });
          onFinish(result);
        } else {
          const result = await createAppointment({
            patientId: isPatient ? patient._id : values.patientId,
            doctorId: values.doctor._id,
            specialty: values.specialty,
            time: selectedHour,
            date: dayjs(values.date).format(FORMAT_DATE),
            status: "booked",
          });
          form.resetFields();
          setSelectedHour(null);
          notification.success({
            message: "Đặt lịch khám thành công",
          });
          onFinish(result);
        }
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
    onCancel(() => form.resetFields());
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
          ).format(FORMAT_DATE)}`,
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
        title={
          selectedAppointent?._id
            ? `Cập nhật lịch khám: ${formatedTime(
                selectedAppointent.time
              )} - ${formatedDate(
                selectedAppointent.date
              )} - ${getSpecialtyName(selectedAppointent.specialty)}`
            : "Đặt lịch khám"
        }
        open={visible}
        onOk={handleAppointmentOk}
        onCancel={onCancelModal}
        okText={selectedAppointent?._id ? "Cập nhật" : "Đặt lịch"}
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
          {!isPatient && (
            <Form.Item
              name="patientId"
              label="Bệnh nhân"
              rules={[{ required: true, message: "Vui lòng chọn bệnh nhân!" }]}
              fieldId="patientId"
            >
              <DebounceSelect
                disabled={selectedAppointent?.patientId}
                selectId="patientId"
                placeholder="Chọn bệnh nhân"
                fetchOptions={fetchPatientList}
                initValue={selectedAppointent?.patientId?._id || patient?._id}
                style={{ width: "100%" }}
              />
            </Form.Item>
          )}
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
            <SelectSpecialty
              onChange={(item) => {
                setSpecialty(item);
                form.setFieldValue("doctor", null);
                setDoctorId("");
                setRefreshData(!refreshData);
              }}
            />
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
                format={FORMAT_DATE}
                onChange={handleChangeDate}
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item
              label="Thời gian dự kiến"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Space>
                {selectedAppointent?.time && (
                  <Typography.Text strong>
                    {selectedAppointent?.time} cũ | mới
                  </Typography.Text>
                )}

                <Typography.Text strong>{selectedHour}</Typography.Text>
              </Space>
            </Form.Item>
            {/* <Form.Item
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
            </Form.Item> */}
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
