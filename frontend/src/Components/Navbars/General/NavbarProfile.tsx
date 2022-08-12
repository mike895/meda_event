import { Menu, Dropdown, Button, message, Space, Tooltip } from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../../features/userSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
export default function NavbarProfile(props: any) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(selectUser);
  const location = useLocation();
  let navigate = useNavigate();
  const menu = (
    <Menu onClick={() => {}}>
      {/* <Menu.Item
        icon={<SettingOutlined />}
        onClick={() => {
          router.push("/auth/account-settings");
        }}
      >
        {t("Account settings")}
      </Menu.Item> */}
      <Menu.Item
        icon={<LogoutOutlined />}
        onClick={() => {
          dispatch(logout());
          navigate("/auth/login", { state: { from: location } });
        }}
      >
        {"Log out"}
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      {loading ? null : user ? (
        <Dropdown overlay={menu} arrow={true}>
          <Button icon={<UserOutlined />} size="large" type="link">
            <DownOutlined />
          </Button>
        </Dropdown>
      ) : (
        <Menu theme="dark" mode="horizontal">
          <Menu.Item>
            <Link to="/auth/login">{"Log in"}</Link>
          </Menu.Item>
        </Menu>
      )}
    </>
  );
}
