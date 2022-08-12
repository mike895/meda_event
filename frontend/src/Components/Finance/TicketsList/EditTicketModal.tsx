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
  InputNumber,
  Popconfirm,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { CloseOutlined, SaveOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
// import { getUser, updateUser } from "@/lib/frontend/http_calls/admin";

import { useAsyncEffect } from "use-async-effect";
import "./edit.ticket.modal.css";

import { EditTicketModalSkeleton } from "./EditTicketModalSkeleton";
import {
  getSeatTicketIssueInfoByKey,
  issueReceipt,
} from "../../../helpers/httpCalls";
import TicketDetails from "./TicketDetails";
const { Option } = Select;
const { Text, Title } = Typography;
type Props = {
  id: string;
  visible: boolean;
  onCancel: any;
  onUpdateSuccess: any;
};
export const EditTicketModal = (props: Props) => {
  const [isModalLoading, setIsModalLoading] = useState(true);
  const formItemLayout = {
    labelCol: {
      span: "auto",
    },
    wrapperCol: {
      span: 50,
    },
  };
  const validateMessages = {
    required: "This felid is required!",
  };

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormState, setInitialFormState] = useState<any>({
    receiptStatus: "ISSUED",
    fsNumber: "",
  });
  async function populateInitialData() {
    let response = await getSeatTicketIssueInfoByKey(props.id);
    if (response.error) {
      setError("Internal Server Error, Please Try again.");
      setShow(true);
    } else {
      setInitialFormState({
        receiptStatus: response.receiptStatus,
        fsNumber: response.fsNumber,
        ...response,
      });
    }
    setIsModalLoading(false);
  }
  async function onFinish(data: any) {
    setIsLoading(true);
    setShow(false);
    let response = await issueReceipt({ ...data, ticketKey: props.id });
    if (response.error) {
      setError(response.error);
      setShow(true);
    } else {
      message.success(`Record Updated Successfully!`);
      props.onUpdateSuccess();
    }
    setIsLoading(false);
  }
  useAsyncEffect(async () => {
    await populateInitialData();
  }, []);

  return (
    <div className="customModalCtx">
      <Modal
        destroyOnClose={true}
        visible={props.visible}
        confirmLoading
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
        {isModalLoading ? (
          <EditTicketModalSkeleton />
        ) : (
          <>
            <Row justify="start">
              <Title level={4}> {"Ticket Info"}</Title>
            </Row>
            <TicketDetails initialFormState={initialFormState}/>
            <Divider/>
            <Row justify="start" style={{ marginBottom: "0px" }}>
              <Title level={5}> {"Issue Receipt"}</Title>
            </Row>
            <Form
              {...formItemLayout}
              layout="vertical"
              autoComplete="off"
              validateMessages={validateMessages}
              initialValues={initialFormState}
              onFinish={(data: any) => {
                onFinish(data);
              }}
            >
              {show ? (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => {
                    setShow(false);
                    setError("");
                  }}
                />
              ) : null}
              {initialFormState.receiptStatus == "ISSUED" ? (
                <Alert
                  message={"Receipt for this ticket has already been issued"}
                  type="info"
                  showIcon
                  closable
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                />
              ) : null}
              <Row justify="start" gutter={[48, 0]}>
                <Col span={12}>
                  <Form.Item
                    label="Fs number"
                    name="fsNumber"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      disabled={initialFormState.receiptStatus == "ISSUED"}
                      stringMode
                      style={{ minWidth: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {initialFormState.receiptStatus == "ISSUED" ? null : (
                <Row style={{ margin: "5px 0px" }} justify="center">
                  <Button
                    loading={isLoading}
                    block
                    // disabled={initialFormState.receiptStatus == "ISSUED"}
                    type="primary"
                    htmlType="submit"
                    style={{ padding: "0px" }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        padding: "0px 8px",
                        borderRight: "1px solid rgba(255,255,255,0.45)",
                      }}
                    >
                      <SaveOutlined />
                    </span>
                    <span>{"SAVE"}</span>
                  </Button>
                </Row>
              )}
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};
