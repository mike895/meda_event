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
import { EditEventModalSkeleton } from "./EditEventModalSkeleton";

// import { getUser, updateUser } from "@/lib/frontend/http_calls/admin";

import { useAsyncEffect } from "use-async-effect";
import "./edit.user.css";
import {
  getUser,
  searchEvent,
  resetPassword,
  updateEvent
} from "../../../../helpers/httpCalls";
import NumberOnlyPasswordField from "../../../global/NumberOnlyPasswordField";
import axios from 'axios'

const { Option } = Select;
const { Text, Title } = Typography;
type Props = {
  id: string;
  title:string;
  visible: boolean;
  onCancel: any;
  onUpdateSuccess: any;
};
export const EditEventModal = (props: Props) => {
  const [isModalLoading, setIsModalLoading] = useState(true);
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [password, setPassword] = useState("");
  const [posterImgval, setposterImg] = useState("");
  const [initialposterImgval, setinitialPosterImg] = useState("");
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
    title: string;
    synopsis: string;
    tags: string;
    eventOrganizer: string;
    posterImg: string;
    runtime: string;
    trailerLink: string;
  }>({
    title: "",
    synopsis: "",
    tags: "",
    eventOrganizer: "",
    posterImg: "",
    runtime: "",
    trailerLink: "",

  });
  async function populateInitialData() {
    console.log("proppspspspsp", props)
    let response = await searchEvent(props.id);
    console.log(response)
    if (response.error) {
      setError("Internal Server Error, Please Try again.");
      setShow(true);
    } else {
      setinitialPosterImg(response.posterImg);
      setInitialFormState({
        title: response.title,
        synopsis: response.synopsis,
        tags: response.tags,
        eventOrganizer: response.eventOrganizer,
        posterImg: response.posterImg,
        runtime: response.runtime,
        trailerLink: response.trailerLink,
      });
    }
    setIsModalLoading(false);
  }
  async function onFinish(data: any) {
    setIsLoading(true);
    setShow(false);
    let response = await updateEvent(props.id, data);
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

  // const handleOkReset = async () => {
  //   if (password.length < 4) {
  //     return message.error('Password length has to be 4')
  //   }
  //   setConfirmLoading(true);
  //   let res = await resetPassword({ id: props.id,password:password });
  //   setConfirmLoading(false);
  //   setVisible(false);
  //   if (res.error) {
  //     return message.error(res.error);
  //   }
  //   message.success(
  //     `Password for ${initialFormState.firstName} ${initialFormState.lastName} changed to ${password}`
  //   );
  //   //Empty the password field again.
  //   setPassword("");
  // };

  // const handleCancelReset = () => {
  //   setVisible(false);
  // };
  useAsyncEffect(async () => {
    await populateInitialData();
  }, []);

  const uploadHandler = (e: any) => {
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append('logo',file)
    console.log("fileee",formData)
  
  
    axios.post('http://localhost:3000/upload/', formData)
    .then((res) => {
      console.log("yesssss",res)
      setposterImg(res.data.name);
    })
    .catch((err) => {
      console.error(err)
    })
  }
  

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
          <EditEventModalSkeleton />
        ) : (
          <>
            <Row justify="start" style={{ marginBottom: "10px" }}>
              <Title level={4}> {"Edit Event"}</Title>{" "}
            </Row>
            <Form
              {...formItemLayout}
              layout="vertical"
              autoComplete="off"
              validateMessages={validateMessages}
              initialValues={initialFormState}
              onFinish={(data: any) => {
                onFinish({ ...data, posterImg: posterImgval? posterImgval : initialposterImgval });
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
                    label="Title"
                    name="title"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Synopsis"
                    name="synopsis"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="start" gutter={[48, 0]}>
                <Col span={12}>
                  <Form.Item
                    label="Tags"
                    name="tags"
                    rules={[{ required: true }]}            
                  >          
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Event Organizer"
                    name="eventOrganizer"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="start" gutter={[48, 0]}>
                <Col span={12}>
                  <Form.Item
                    label="Poster Image"
                    name="posterImg"
                    rules={[{ required: false }]}
                  >
                    {/* <Input /> */}
                    <h5>Choose file if you want to change the image </h5>
                    <form action="#" method= "POST" encType="multipart/form-data">
                      <input type="file" name="logo" onChange={uploadHandler} />
                    </form>

                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Runtime"
                    name="runtime"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Form.Item
                    label={"Trailer Link"}
                    name="trailerLink"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row style={{ marginBottom: 20 }}>
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
              </Row> */}
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
