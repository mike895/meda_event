import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Row, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import colors from "../../constants/colors";
import { useAuth } from "../../context/authContext";
import "./auth.modal.css";
import Login from "./login";
import Register from "./register";
function AuthModal() {
  const { currentUser, loading, toggleAuthModal, authModalProps } = useAuth();
  const { open, props } = authModalProps;

  // useEffect(() => {
  //   toggleAuthModal(true, { activeTab: "LOGIN" });
  // }, []);

  return (
    <>
      <Modal
        title={<div style={{ padding: "10px" }}></div>}
        closeIcon={<CloseOutlined style={{ color: "white" }} />}
        visible={!loading && authModalProps.open}
        footer={[]}
        className="modalParent"
        onCancel={() => toggleAuthModal(false, null)}
      >
        <Row
          style={{
            // display: "flex",
            backgroundColor: colors.PRIMARY,
            // padding: "10px 15px",
            margin: "10px 0px",
            borderRadius: 20,
          }}
          align="middle"
          justify="center"
        >
          <div
            style={{
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              fontSize: 30,
              fontWeight: "bold",
              color: "white",
            }}
          >
            meda <div style={{ marginLeft: 5, fontWeight: "300" }}>ticket</div>
          </div>
        </Row>
        <Row justify="center" style={{ margin: "15px 0px" }}>
          <Space>
            <Button
              type={props.activeTab != "REGISTER" ? "primary" : "default"}
              size="large"
              //   shape="round"
              style={{
                width: 100,
                fontWeight: "bold",
                borderRadius: 10,
                color: props.activeTab == "REGISTER" ? colors.PRIMARY : undefined,
              }}
              onClick={() =>
                toggleAuthModal(open, { ...props, activeTab: "LOGIN" })
              }
            >
              Login
            </Button>
            <Button
              type={props.activeTab == "REGISTER" ? "primary" : "default"}
              //   shape="round"
              style={{
                width: 100,
                fontWeight: "bold",
                borderRadius: 10,
                color:
                  props.activeTab != "REGISTER" ? colors.PRIMARY : undefined,
              }}
              size="large"
              onClick={() =>
                toggleAuthModal(open, { ...props, activeTab: "REGISTER" })
              }
            >
              Register
            </Button>
          </Space>
        </Row>
        {props.activeTab != "REGISTER"?<Login/>:<Register/>}
        
      </Modal>
    </>
  );
}

export default AuthModal;
