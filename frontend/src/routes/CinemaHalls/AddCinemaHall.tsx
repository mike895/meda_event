import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Tabs,
  Tooltip,
  Typography,
} from "antd";

import { type } from "os";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CinemaColumn from "../../Components/CInemaHall/CinemaColumn";
import CinemaPadding from "../../Components/CInemaHall/CinemaPadding";
import Seat from "../../Components/CInemaHall/CinemaSeat/Seat";
import CinemaSeatMapCreate from "../../Components/CInemaHall/CinemaSeatMapCreate";
import { CinemaHallColumn } from "../../Components/CInemaHall/types";
import { addCinemaHall } from "../../helpers/httpCalls";
const { Text, Link, Title } = Typography;
const { TabPane } = Tabs;
const CinemaHalls = () => {
  const [regularSeatMap, setRegularSeatMap] = useState<Array<CinemaHallColumn>>(
    []
  );
  const [vipSeatMap, setVIPSeatMap] = useState<Array<CinemaHallColumn>>([]);
  const [eventHallName, setCinemaHallName] = useState("");
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const onSave = async () => {
    if (eventHallName === "") {
      message.error(`Please enter a valid cinema hall name!`, 2.5);
      return;
    }
    setIsLoading(true);
    let res = await addCinemaHall({
      eventHallName,
      regularSeatMap,
      // vipSeatMap,
    });
    setIsLoading(false);
    if (res.error) {
      message.error(`${res.error}`, 2.5);
    } else {
      message.success("Venue Added.");
      navigate("/admin/venues/manage");
    }
  };
  return (
    <div>
      <Row justify="center">
        {" "}
        <Title level={2} style={{ margin: "0px 0px 20px 0px" }}>
          {"Add A Venue"}
        </Title>
      </Row>

      <Row align="middle">
        <Col flex="none">
          <Form form={form} layout="vertical">
            <Form.Item
              name="eventHallName"
              label="Venue Name"
              rules={[{ required: true }]}
            >
              <Input
                value={eventHallName}
                onChange={(e) => {
                  if (e.target.value) setCinemaHallName(e.target.value);
                }}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col flex="auto">
          <Row justify="end">
            <Button
              type="primary"
              loading={isLoading}
              icon={<SaveOutlined />}
              onClick={onSave}
            >
              Save
            </Button>
          </Row>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="REGULAR"
        type="card"
        size="middle"
        style={{ marginBottom: "15px" }}
        centered
      >
        <TabPane tab="New Seat Arrangement" key="Regular">
          <Row justify="center">
            <CinemaSeatMapCreate
              seatMap={regularSeatMap}
              setSeatMap={setRegularSeatMap}
            />
          </Row>
        </TabPane>
        {/* <TabPane tab="VIP" key="VIP">
        <Row justify="center">
        <CinemaSeatMapCreate
            seatMap={vipSeatMap}
            setSeatMap={setVIPSeatMap}
          />
          </Row>

        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default CinemaHalls;
