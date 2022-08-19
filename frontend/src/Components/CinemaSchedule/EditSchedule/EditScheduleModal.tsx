import {
  Button,
  Modal,
  Typography,
  Divider,
  Empty,
  Row,
  Form,
  Input,
  Col,
  Select,
  Switch,
  Space,
  Alert,
  message,
  Popconfirm,
  Tag,
  Table,
  Dropdown,
  Menu,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  CloseOutlined,
  SaveOutlined,
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { EditScheduleSkeleton } from "./EditScheduleSkeleton";

// import { getUser, updateUser } from "@/lib/frontend/http_calls/admin";

import { useAsyncEffect } from "use-async-effect";
import "./edit.schedule.css";
import useOnFetch from "../../../hooks/useOnFetch";
import {
  deleteScheduleShowTimeById,
  getScheduleById,
  updateScheduleShowtimeById,
  updateScheduleSpeakerById,
  deleteScheduleSpeakerById
} from "../../../helpers/httpCalls";
import { DynamicPopConfirm } from "../../global/DynamicPopConfirm";
import { AddShowTimeModal } from "./AddShowtimeModal/AddShowTimeModal";
import { AddSpeakerModal } from "./AddShowtimeModal/AddSpeakerModal";

const { Option } = Select;
const { Text, Title } = Typography;
type Props = {
  id: string;
  visible: boolean;
  onCancel: any;
  onUpdateSuccess: any;
};
export const EditScheduleModal = (props: Props) => {
  const modal = useOnFetch();
  async function populateData() {
    await modal.onFetch(async () => await getScheduleById(props.id));
  }
  useAsyncEffect(async () => {
    await populateData();
  }, []);
  const [addScheduleModalVisible, setAddScheduleModalVisible] = useState(false);

  const columns = [
    {
      title: "Show Times",
      dataIndex: "time",
      render: (time: any, record: any) => (
        <>
          <Tag color={record.active ? "green" : "magenta"}>
            {moment(time).format("h:mm A")}
          </Tag>
        </>
      ),
    },
    {
      title: "Actions",
      dataIndex: ["id"],
      render: (id: any, record: any) => (
        <Dropdown
          // overlayStyle={{ zIndex: 1 }}
          overlay={
            <>
              <Menu style={{ width: 190 }}>
                <Menu.Item icon={<EditOutlined />} key="22">
                  <DynamicPopConfirm
                    title={
                      record.active
                        ? "Deactivate schedule?"
                        : "Activate Schedule?"
                    }
                    promiseFunction={async () => {
                      return await updateScheduleShowtimeById(id, {
                        active: !record.active,
                      });
                    }}
                    onError={async (error: any) => {
                      message.error(error);
                    }}
                    onSuccess={async () => {
                      await populateData();
                      await props.onUpdateSuccess();
                    }}
                  >
                    {record.active
                      ? "Deactivate schedule"
                      : "Activate Schedule"}
                  </DynamicPopConfirm>
                </Menu.Item>
                <Menu.Item icon={<DeleteOutlined />} key="10">
                  <DynamicPopConfirm
                    promiseFunction={async () => {
                      return await deleteScheduleShowTimeById(id);
                      // await loadData();
                    }}
                    onError={async (error: any) => {
                      notification["error"]({
                        message: "Error",
                        description: error,
                      });
                    }}
                    onSuccess={async () => {
                      await populateData();
                      await props.onUpdateSuccess();
                    }}
                  >
                    Delete
                  </DynamicPopConfirm>
                </Menu.Item>
              </Menu>
            </>
          }
          trigger={["hover"]}
        >
          <EllipsisOutlined style={{ cursor: "pointer", fontSize: "24px" }} />
        </Dropdown>
      ),
    },
  ];
  return (
    <div className="customModalCtx">
      {addScheduleModalVisible ? (
        <AddShowTimeModal
          id={props.id}
          visible={addScheduleModalVisible}
          onCancel={() => setAddScheduleModalVisible(false)}
          onUpdateSuccess={async () => {
            await populateData();
            setAddScheduleModalVisible(false);
            props.onUpdateSuccess();
          }}
        />
      ) : null}
      <Modal
        destroyOnClose={true}
        visible={props.visible}
        maskStyle={{
          WebkitBackdropFilter: "blur(1px)",
          backdropFilter: "blur(1px)",
          WebkitFilter: "blur(1px)",
          filter: "blur(1px)",
        }}
        title={<div style={{ padding: "10px" }}></div>}
        closeIcon={<CloseOutlined style={{ color: "white" }} />}
        className="modalParent"
        onCancel={props.onCancel}
        footer={[]}
      >
        {modal.isLoading || !modal.isSuccess ? (
          <EditScheduleSkeleton />
        ) : (
          <>
            <Row justify="start" style={{ marginBottom: "10px" }}>
              <Title level={4}>
                {" "}
                {"Edit Schedule" +
                  `(${moment(modal.result.date).format("DD/MM/YYYY")}) - ${modal.result?.event?.title}`}
              </Title>
            </Row>
            <Table
              dataSource={modal.result.showTimes}
              columns={columns}
              rowKey="id"
              loading={modal.isLoading}
              pagination={false}
            />

            <Button
              type="dashed"
              onClick={() => {
                setAddScheduleModalVisible(!addScheduleModalVisible);
              }}
              block
              icon={<PlusOutlined />}
              style={{ marginTop: "15px" }}
            >
              Add a showtime to this schedule
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};



export const EditSpeakersModal = (props: Props) => {
  const modal = useOnFetch();
  async function populateData() {
    await modal.onFetch(async () => {
      const res = await getScheduleById(props.id);
      return res
    });
 
  }
  useAsyncEffect(async () => {
    await populateData();
  }, []);
  const [addScheduleModalVisible, setAddScheduleModalVisible] = useState(false);

  const columns = [
    {
      title: "Speakers",
      dataIndex: "firstName",
      render: (firstName: any, record: any) => (
        <>
          <Tag color={"blue"}>
            {`${firstName} ${record.lastName}`}
          </Tag>
        </>
      ),
    },
    {
      title: "Actions",
      dataIndex: ["id"],
      render: (id: any, record: any) => (
        <Dropdown
          // overlayStyle={{ zIndex: 1 }}
          overlay={
            <>
              <Menu style={{ width: 190 }}>
                {/* <Menu.Item icon={<EditOutlined />} key="22">
                  <DynamicPopConfirm
                    title={
                      record.active
                        ? "Deactivate schedule?"
                        : "Activate Schedule?"
                    }
                    promiseFunction={async () => {
                      return await updateScheduleSpeakerById(id, {
                        active: !record.active,
                      });
                    }}
                    onError={async (error: any) => {
                      message.error(error);
                    }}
                    onSuccess={async () => {
                      await populateData();
                      await props.onUpdateSuccess();
                    }}
                  >
                    {record.active
                      ? "Deactivate schedule"
                      : "Activate Schedule"}
                  </DynamicPopConfirm>
                </Menu.Item> */}
                <Menu.Item icon={<DeleteOutlined />} key="10">
                  <DynamicPopConfirm
                    promiseFunction={async () => {
                      return await deleteScheduleSpeakerById(id);
                      // await loadData();
                    }}
                    onError={async (error: any) => {
                      notification["error"]({
                        message: "Error",
                        description: error,
                      });
                    }}
                    onSuccess={async () => {
                      await populateData();
                      await props.onUpdateSuccess();
                    }}
                  >
                    Delete
                  </DynamicPopConfirm>
                </Menu.Item>
              </Menu>
            </>
          }
          trigger={["hover"]}
        >
          <EllipsisOutlined style={{ cursor: "pointer", fontSize: "24px" }} />
        </Dropdown>
      ),
    },
  ];
  return (
    <div className="customModalCtx">
      {addScheduleModalVisible ? (
        <AddSpeakerModal
          id={props.id}
          visible={addScheduleModalVisible}
          onCancel={() => setAddScheduleModalVisible(false)}
          onUpdateSuccess={async () => {
            await populateData();
            setAddScheduleModalVisible(false);
            props.onUpdateSuccess();
          }}
        />
      ) : null}
      <Modal
        destroyOnClose={true}
        visible={props.visible}
        maskStyle={{
          WebkitBackdropFilter: "blur(1px)",
          backdropFilter: "blur(1px)",
          WebkitFilter: "blur(1px)",
          filter: "blur(1px)",
        }}
        title={<div style={{ padding: "10px" }}></div>}
        closeIcon={<CloseOutlined style={{ color: "white" }} />}
        className="modalParent"
        onCancel={props.onCancel}
        footer={[]}
      >
        {modal.isLoading || !modal.isSuccess ? (
          <EditScheduleSkeleton />
        ) : (
          <>
            <Row justify="start" style={{ marginBottom: "10px" }}>
              <Title level={4}>
                {" "}
                {"Edit Speaker" +
                  `(${moment(modal.result.date).format("DD/MM/YYYY")}) - ${modal.result?.event?.title}`}
              </Title>
            </Row>
            <Table
              dataSource={modal.result.speakers}
              columns={columns}
              rowKey="id"
              loading={modal.isLoading}
              pagination={false}
            />

            <Button
              type="dashed"
              onClick={() => {
                setAddScheduleModalVisible(!addScheduleModalVisible);
              }}
              block
              icon={<PlusOutlined />}
              style={{ marginTop: "15px" }}
            >
              Add a speaker to this schedule
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};