import React, { useEffect, useContext, useState, CSSProperties } from "react";
// antd
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Space, Row, Col, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "../../features/userSlice";
import { loginUser } from "../../helpers/httpCalls";
import { useNavigate } from "react-router-dom";
import Roles from "../../helpers/roles";

const BODY: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "90vh",
};
 
const CONTENT: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // width: "100%",
  padding: "1%",
  margin: "5%",
  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
};
const FORM_SECTION: CSSProperties = {
  padding: "0 1%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  minWidth: "400px",
};
const SUBMIT = {
  width: "100%",
};
export default function Login(props: any) {
  const [isLoading, setIsLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { user, loading } = useSelector(selectUser);
  let navigate = useNavigate();
  async function SignIn(username: string, password: string) {
    let res = await loginUser({
      username,
      password,
    });
    if (!res.error) {
      dispatch(
        login({
          ...res,
          loggedIn: true,
        })
      );
      // ROUTE BASED ON ROLE
      if (res.role === Roles.Admin) return navigate("/admin/user/manage");
      if (res.role === Roles.Finanace) return navigate("/finance");
    } else {
      setError(res?.error);
      setShow(true);
    }
  }
  const onFinish = async (values: any) => {
    console.log(values);
    setShow(false);
    setIsLoading(true);
    await SignIn(values["username"], values["password"]);
    setIsLoading(false);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div style={BODY}>
        <div style={CONTENT}>
          <div style={FORM_SECTION}>
            <Row justify="center">
              <h4 style={{ fontSize: "2.5rem" }}>{"Log in"}</h4>
            </Row>
            <Space direction="vertical" size="large" />
            {show ? (
              <Alert
                style={{ margin: "0 0 3% 0" }}
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
            <Form
              name="basic"
              size="large"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please input your Username!" },
                  ]}
                >
                  <Input
                    placeholder={"Username"}
                    prefix={<UserOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder={"Password"}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  loading={isLoading}
                  type="primary"
                  style={SUBMIT}
                  htmlType="submit"
                >
                  {"Log in"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
