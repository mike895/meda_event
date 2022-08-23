import { Button, Row, Space, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import colors from "../../constants/colors";
import { useAuth } from "../../context/authContext";
import "./header.css";

function Header() {
  const {
    currentUser,
    loading,
    toggleAuthModal,
    authModalProps,
    login,
    logout,
  } = useAuth();
  return (
    <Row className="header-container" align="middle" justify="space-between">
      <Link to="/">
        <div className="header-brand">
          meda <div style={{ marginLeft: 5, fontWeight: "300" }}>ticket</div>
        </div>
      </Link>
      {currentUser != null ? (
        <div className="header-right">
          <Space className="right-collapsable">
            <Link to={"/my-tickets"}>
              <div
                style={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  fontSize: 16,
                  fontWeight: "500",
                  color: "white",
                }}
              >
                My Tickets <span className="separator-line">|</span>
              </div>
            </Link>

            <div
              style={{
                display: "flex",
                textAlign: "center",
                alignItems: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Welcome{" "}
              <div style={{ marginLeft: 5, fontWeight: "400" }}>
                {currentUser.firstName}
              </div>
            </div>
          </Space>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              fontSize: 15,
              fontWeight: "500",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => logout()}
          >
            Logout
          </div>
        </div>
      ) : null}
      {currentUser == null && loading == false ? (
        <div
          style={{
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            fontSize: 18,
            fontWeight: "bold",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => toggleAuthModal(true, { activeTab: "LOGIN" })}
        >
          Login | Register
        </div>
      ) : null}
    </Row>
  );
}

export default Header;
