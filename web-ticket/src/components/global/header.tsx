import { Button, Row, Space, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import colors from "../../constants/colors";
import { useAuth } from "../../context/authContext";

function Header() {
  const { currentUser, loading, toggleAuthModal, authModalProps, login } =
    useAuth();
  return (
    <Row
      style={{
        display: "flex",
        backgroundColor: colors.PRIMARY,
        padding: "10px 15px",
      }}
      align="middle"
      justify="space-between"
    >
      <Link to="/"> 
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
      </Link>
      {currentUser != null ? (
        <Space>
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
              My Tickets
            </div>
          </Link>
          <span style={{color:"white"}}>|</span>
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
