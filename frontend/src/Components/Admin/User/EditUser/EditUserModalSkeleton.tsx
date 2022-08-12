// @flow
import { Col, Row, Skeleton, Space } from "antd";
import * as React from "react";
type Props = {};
export const EditUserModalSkeleton = (props: Props) => {
  return (
    <>
      <Row justify="start" style={{ marginBottom: "10px" }}>
        <Skeleton.Input style={{ width: 100 }} active={true} size={"default"} />
      </Row>
      <Row>
        <Col span={12}>
        <Skeleton paragraph={{ rows: 0 }} />
          <Skeleton.Input
            style={{ width: 200 }}
            active={true}
            size={"default"}
          />
        </Col>
        <Col span={12}>
        <Skeleton paragraph={{ rows: 0 }} />
          <Skeleton.Input
            style={{ width: 200 }}
            active={true}
            size={"default"}
          />
        </Col>
      </Row>
      <Row style={{marginTop:"20px"}}>
        <Col span={12}>
        <Skeleton paragraph={{ rows: 0 }} />
          <Skeleton.Input
            style={{ width: 200 }}
            active={true}
            size={"default"}
          />
        </Col>
        <Col span={12}>
        <Skeleton paragraph={{ rows: 0 }} />
          <Skeleton.Input
            style={{ width: 200 }}
            active={true}
            size={"default"}
          />
        </Col>
      </Row>
      
      <Row justify="start" style={{ marginBottom: "10px" ,marginTop: "25px" }}>
      <Skeleton.Button active={true} size={"default"} shape="square" style={{width:500}} />
      </Row>
    </>
  );
};
