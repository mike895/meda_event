import { CloseOutlined } from "@ant-design/icons";
import { Modal, Row, Tabs, Typography } from "antd";
import React from "react";
import CinemaColumn from "../CinemaColumn";
import CinemaPadding from "../CinemaPadding";
import { CinemaHall } from "../types";
import "./cinema.hall.preview.css";
interface ModalProps {
  data: CinemaHall;
  visible: boolean;
  onCancel: any;
}
const { TabPane } = Tabs;
const { Title } = Typography;
const CinemaHallPreviewModal = ({ data, visible, onCancel }: ModalProps) => {
  return (
    <Modal
      className="modalParent"
      visible={visible}
      width={window.screen.width}
      maskStyle={{
        WebkitBackdropFilter: "blur(1px)",
        backdropFilter: "blur(1px)",
        WebkitFilter: "blur(1px)",
        filter: "blur(1px)",
      }}
      title={<div style={{ padding: "10px" }}></div>}
      closeIcon={<CloseOutlined style={{ color: "white" }} />}
      onCancel={onCancel}
      footer={[]}
    >
      <Row>
        <Title level={5}>{data.name}</Title>
      </Row>
      <Tabs
        centered
        defaultActiveKey="REGULAR"
        type="card"
        size="middle"
        style={{ marginBottom: "15px" }}
      >
        <TabPane tab="Regular" key="Regular">
          <Row align="bottom" justify="center">
            {data.regularSeats.map((e) => {
              if (e.columnType == "SEATMAP") {
                return (
                  <CinemaColumn
                    key={`R ${e.columnName}`}
                    column={e}
                    onRemoveColumn={null}
                  />
                );
              } else if (e.columnType == "PADDING") {
                return (
                  <CinemaPadding
                    key={`P ${e.columnName}`}
                    seatMap={data.regularSeats}
                    column={e}
                    onRemoveColumn={null}
                  />
                );
              }
            })}
          </Row>
        </TabPane>
        {/* <TabPane tab="VIP" key="VIP">
        <Row align="bottom" justify="center">
            {data.vipSeats.map((e) => {
              if (e.columnType == "SEATMAP") {
                return (
                  <CinemaColumn
                    key={`R ${e.columnName}`}
                    column={e}
                    onRemoveColumn={null}
                  />
                );
              } else if (e.columnType == "PADDING") {
                return (
                  <CinemaPadding
                    key={`P ${e.columnName}`}
                    seatMap={data.vipSeats}
                    column={e}
                    onRemoveColumn={null}
                  />
                );
              }
            })}
          </Row>
        </TabPane> */}
      </Tabs>
    </Modal>
  );
};

export default CinemaHallPreviewModal;
