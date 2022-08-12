import { Col, Layout, Menu, Row } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import styles from "./navbar.admin.module.css";
import { Link } from "react-router-dom";
import NavbarProfile from "./NavbarProfile";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
export default function NavbarAdmin({
  collapsed,
  toggle,
}: {
  collapsed: boolean;
  toggle: any;
}) {
  return (
    <Header style={{ padding: 0 }}>
      <Row>
        <div style={{color:"grey"}}>
          {collapsed ? (
            <MenuUnfoldOutlined className={styles.trigger} onClick={toggle} />
          ) : (
            <MenuFoldOutlined className={styles.trigger} onClick={toggle} />
          )}
        </div>

        <Col flex="auto">
          <Menu theme="dark" mode="horizontal" >
            <Menu.Item>
              <Link to="/">{("Dashboard")}</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col flex="none">
          <NavbarProfile />
        </Col>
      </Row>
    </Header>
  );
}
