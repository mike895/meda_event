import { Breadcrumb, Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
  PlayCircleOutlined,
  AliyunOutlined,
  FieldTimeOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import styles from "./admin.module.css";
import React, { createElement, useState } from "react";
import NavbarAdmin from "../../Components/Navbars/Admin/NavbarAdmin";
import { Link, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function Admin(props: any) {
  console.log("Admin Dashboard reload");
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  return (
    <>
      <Layout>
        <Sider trigger={null} breakpoint="lg" collapsible collapsed={collapsed}>
          <div className={styles.logo} />
          <Menu theme="dark" mode="inline">
            <SubMenu key="users" icon={<UserOutlined />} title={"Users"}>
              <Menu.Item key="register-users">
                <Link to="user/register">{"Register"}</Link>
              </Menu.Item>
              <Menu.Item key="manage-users">
                <Link to="user/manage">{"Manage"}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="ticketRedeemers"
              icon={<UsergroupAddOutlined />}
              title={"Ticket Redeemers"}
            >
              <Menu.Item key="register-ticketRedeemers">
                <Link to="ticket-redeemer/register">{"Register"}</Link>
              </Menu.Item>
              <Menu.Item key="manage-ticketRedeemers">
                <Link to="ticket-redeemer/manage">{"Manage"}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="events"
              icon={<PlayCircleOutlined />}
              title={"Events"}
            >
              <Menu.Item key="add-events">
                <Link to="events/add">{"Add"}</Link>
              </Menu.Item>
              <Menu.Item key="manage-events">
                <Link to="events/manage">{"Manage"}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="venues"
              icon={<AliyunOutlined />}
              title={"Venues"}
            >
              <Menu.Item key="add-venues">
                <Link to="venues/add">{"Add"}</Link>
              </Menu.Item>
              <Menu.Item key="manage-venues">
                <Link to="venues/manage">{"Manage"}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="schedule"
              icon={<FieldTimeOutlined />}
              title={"Event Schedule"}
            >
              <Menu.Item key="add-schedule">
                <Link to="schedules/add">{"Create"}</Link>
              </Menu.Item>
              <Menu.Item key="manage-schedule">
                <Link to="schedules/manage">{"Manage"}</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="sales-report" icon={<BarChartOutlined />}>
              <Link to="sales-report">{"Sales Report"}</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className={styles["site-layout"]}>
          <NavbarAdmin collapsed={collapsed} toggle={toggle} />
          <Content
            className={styles["site-layout-background"]}
            style={{
              margin: "24px 16px",
              marginTop: "16px",
              padding: 24,
              minHeight: "90vh",
              overflow: "initial",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default Admin;
