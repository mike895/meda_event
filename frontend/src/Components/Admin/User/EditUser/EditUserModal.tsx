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
} from "antd";
import React, { useEffect, useState } from "react";
import { CloseOutlined, SaveOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";
import { EditUserModalSkeleton } from "./EditUserModalSkeleton";

// import { getUser, updateUser } from "@/lib/frontend/http_calls/admin";

import { useAsyncEffect } from "use-async-effect";
import "./edit.user.css";
import {
  getUser,
  resetPassword,
  updateUser,
} from "../../../../helpers/httpCalls";
import NumberOnlyPasswordField from "../../../global/NumberOnlyPasswordField";
const { Option } = Select;
const { Text, Title } = Typography;
type Props = {
  id: string;
  visible: boolean;
  onCancel: any;
  onUpdateSuccess: any;
};
export const EditUserModal = (props: Props) => {
  const [isModalLoading, setIsModalLoading] = useState(true);
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [password, setPassword] = useState("");
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

  const [initialFormState, setInitialFormState] = useState<{
    firstName: string;
    lastName: string;
    accountLockedOut: boolean;
    username: string | null;
    phoneNumber: String;
  }>({
    firstName: "",
    lastName: "",
    accountLockedOut: true,
    username: "",
    phoneNumber: "",
  });
  async function populateInitialData() {
    let response = await getUser(props.id);
    if (response.error) {
      setError("Internal Server Error, Please Try again.");
      setShow(true);
    } else {
      setInitialFormState({
        firstName: response.firstName,
        lastName: response.lastName,
        phoneNumber: response.phoneNumber,
        username: response.username,
        accountLockedOut: !response.accountLockedOut,
      });
    }
    setIsModalLoading(false);
  }
  async function onFinish(data: any) {
    setIsLoading(true);
    setShow(false);
    let response = await updateUser(props.id, data);
    if (response.error) {
      setError(response.error);
      setShow(true);
    } else {
      message.success(`Record Updated Successfully!`);
      props.onUpdateSuccess();
    }
    setIsLoading(false);
  }
  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOkReset = async () => {
    if (password.length < 4) {
      return message.error('Password length has to be 4')
    }
    setConfirmLoading(true);
    let res = await resetPassword({ id: props.id,password:password });
    setConfirmLoading(false);
    setVisible(false);
    if (res.error) {
      return message.error(res.error);
    }
    message.success(
      `Password for ${initialFormState.firstName} ${initialFormState.lastName} changed to ${password}`
    );
    //Empty the password field again.
    setPassword("");
  };

  const handleCancelReset = () => {
    setVisible(false);
  };
  useAsyncEffect(async () => {
    await populateInitialData();
  }, []);

  return (
    <div className="customModalCtx">
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
        {isModalLoading ? (
          <EditUserModalSkeleton />
        ) : (
          <>
            <Row justify="start" style={{ marginBottom: "10px" }}>
              <Title level={4}> {"Edit user"}</Title>{" "}
            </Row>
            <Form
              {...formItemLayout}
              layout="vertical"
              autoComplete="off"
              validateMessages={validateMessages}
              initialValues={initialFormState}
              onFinish={(data: any) => {
                onFinish({ ...data, accountLockedOut: !data.accountLockedOut });
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
              <Row justify="start" gutter={[48, 0]}>
                <Col span={12}>
                  <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last name"
                    name="lastName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="start" gutter={[48, 0]}>
                <Col span={12}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label={"Account Status"}
                    valuePropName="checked"
                    name="accountLockedOut"
                  >
                    <Switch
                      checkedChildren={
                        <span style={{ color: "white" }}>Active</span>
                      }
                      unCheckedChildren={
                        <span style={{ color: "red" }}>Disabled</span>
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Popconfirm
                  title={
                    <>
                      <Space direction="vertical">
                        <Row>{`Reset password for ${initialFormState.firstName} ${initialFormState.lastName} ?`}</Row>
                        <NumberOnlyPasswordField
                          inputProps={{
                            maxLength: 4,
                            placeholder: "Enter a new password",
                          }}
                          onChange={(val: string) => {
                            setPassword(val);
                          }}
                          value={password}
                        />
                      </Space>
                    </>
                  }
                  visible={visible}
                  onConfirm={handleOkReset}
                  okButtonProps={{ loading: confirmLoading }}
                  onCancel={handleCancelReset}
                >
                  <Button
                    type="primary"
                    size="small"
                    danger
                    onClick={showPopconfirm}
                  >
                    Reset Password
                  </Button>
                </Popconfirm>
              </Row>
              <Row style={{ margin: "5px 0px" }} justify="center">
                <Button
                  loading={isLoading}
                  block
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
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};
