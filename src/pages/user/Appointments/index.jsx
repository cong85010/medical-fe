import {
  PlusCircleFilled,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Tooltip } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAppointmentPatient from "src/components/AddAppointmentPatient";
import Title from "src/components/Title";
import ViewScheduleModal from "src/components/ViewScheduleModal";

export default function AppointmentsPage() {
  const [viewVisibleAppointmentModal, setViewVisibleAppointmentModal] =
    useState(false);
  const patient = useSelector((state) => state.auth.user);
  const [reload, setReload] = useState(false);
  const [addVisiableAppointment, setAddVisiableAppointment] = useState(false);
  const [selectedAppointent, setSelectedAppointent] = useState(null);

  const handleViewAppointmentCancel = () => {
    setViewVisibleAppointmentModal(false);
    setSelectedAppointent(null);
  };
  const handleAddAppointmentCancel = (reset) => {
    setAddVisiableAppointment(false);

    if (!viewVisibleAppointmentModal) {
      setSelectedAppointent(null);
    }
    reset();
  };

  const handleViewAppointmentEdit = (record) => {
    setAddVisiableAppointment(true);
    setSelectedAppointent(record);
  };

  const handleAppointmentOk = async (values) => {
    try {
      setReload(!reload);
      setAddVisiableAppointment(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Title
        title="Lịch hẹn"
        right={
          <Flex justify="flex-end" style={{ flex: 1 }}>
            <Button
              type="primary"
              icon={<PlusCircleFilled />}
              onClick={() => setAddVisiableAppointment(true)}
            >
              Hẹn lịch khám
            </Button>
          </Flex>
        }
      />
      <AddAppointmentPatient
        visible={addVisiableAppointment}
        onCancel={handleAddAppointmentCancel}
        onFinish={handleAppointmentOk}
        selectedPatient={patient}
        selectedAppointent={selectedAppointent}
        isPatient
      />
      <ViewScheduleModal
        onEdit={handleViewAppointmentEdit}
        onCancel={handleViewAppointmentCancel}
        visible={true}
        selectedPatient={patient}
        reload={reload}
        isPage
      />
    </div>
  );
}
