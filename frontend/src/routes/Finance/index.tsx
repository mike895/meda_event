import { Breadcrumb, Layout, Menu } from "antd";
import {
  BarChartOutlined,
  PicCenterOutlined,
} from "@ant-design/icons";
import styles from "./finance.module.css";
import React, { createElement, useState } from "react";
import NavbarAdmin from "../../Components/Navbars/Admin/NavbarAdmin";
import { Link, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function Admin(props: any) {
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
            <Menu.Item key="tickets" icon={<PicCenterOutlined />}>
              <Link to="tickets">{"Tickets"}</Link>
            </Menu.Item>
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
