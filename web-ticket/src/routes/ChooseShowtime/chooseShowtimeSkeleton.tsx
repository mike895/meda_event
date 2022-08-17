import { StarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Row, Breadcrumb, Col, Typography, Tag, Space, Skeleton } from "antd";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import ImageCard from "../../components/chooseShowtime/imageCard";
import ShowtimeSelectButton from "../../components/chooseShowtime/showtimeSelectButton";
import MoviesPreviewScroll from "../../components/global/moviesPreviewScroll";
import styles from "./schedule.module.css";
function ChooseShowtimeSkeleton() {
  return (
    <>
      <div
        className="container"
        style={{
          margin: "15px 0px",
          flexDirection: "column",
          display: "flex",
          flexGrow: 1,
        }}
      >
        <Space direction="horizontal">
          <img
            src="/images/logo.png"
            style={{
              width: 50,
              height: 50,
              marginRight: 5,
            }}
          />
          {[1, 2].map((e) => (
            <Skeleton.Button key={e} active={true} size={"small"} />
          ))}
        </Space>
        <Row className={styles["content-row"]}>
          <Col className={styles["image-col"]}>
            {/* <ImageCard schedule={schedule} /> */}
            <Space direction="vertical" size={"middle"}>
              <Skeleton.Image style={{ width: 200, height: 320 }} />
              <Skeleton.Button active={true} size={"large"} block />
            </Space>
          </Col>
          <Col lg={14} md={14} sm={24}>
            <div className={styles["content-container"]}>
              <Skeleton paragraph={{ rows: 0 }} active />
              <ErrorBoundary>
                <Space direction="horizontal">
                  {[1, 2, 3].map((e) => (
                    <Skeleton.Button key={e} active />
                  ))}
                </Space>
              </ErrorBoundary>
              <Row style={{ flexDirection: "column", margin: "15px 0px" }}>
                <Skeleton paragraph={{ rows: 2 }} active />
              </Row>
              <Row align="middle">
                {" "}
                <Space direction="horizontal">
                  <Skeleton.Button
                    active={true}
                    size={"small"}
                    shape={"round"}
                  />
                  <Skeleton.Button
                    active={true}
                    size={"small"}
                    shape={"round"}
                  />
                  <Skeleton.Button
                    active={true}
                    size={"small"}
                    shape={"round"}
                  />
                </Space>
              </Row>
            </div>
            <div
              className={styles["content-container"]}
              style={{ margin: "25px 0px" }}
            >
              <Row style={{ flexDirection: "column", maxWidth: 500 }}>
                <Skeleton paragraph={{ rows: 1 }} active />
                <Space direction="vertical">
                  {[1, 2, 3, 4].map((e) => (
                    <Skeleton.Button active={true} size={"default"} block />
                  ))}
                </Space>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ChooseShowtimeSkeleton;
