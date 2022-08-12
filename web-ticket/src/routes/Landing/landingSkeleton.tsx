import { Row, Skeleton, Space } from "antd";
import React from "react";
import Header from "../../components/global/header";
import styles from "./landing.module.css";
function LandingSkeleton() {
  return (
    <>
      <Row justify="center" style={{ margin: "25px 0px" }}>
        {[...Array(5)].map((e) => (
          <Skeleton.Button
            style={{
              width: 70,
              height: 75,
              borderRadius: 5,
              margin: 10,
            }}
            active
          />
        ))}
      </Row>
      <Row
        className={"container"}
        justify="center"
        style={{
          margin: "15px 0px",
          flexDirection: "row",
          display: "flex",
        }}
      >
        {[...Array(5)].map((e) => (
          <Skeleton.Button
            style={{
              width: 200,
              height: 300,
              borderRadius: 5,
              margin:10
            }}
            active
          />
        ))}{" "}
      </Row>
    </>
  );
}

export default LandingSkeleton;
