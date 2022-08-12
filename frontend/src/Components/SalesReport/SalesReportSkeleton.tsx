import React from "react";
import { Skeleton, Switch, Card, Avatar, Row, Col, Tag } from "antd";
export default function SalesReportSkeleton() {
  const { Meta } = Card;
  return (
    <Row align="middle" style={{ margin: "20px 20px 20px 0px" }}>
      <Col>
        <Card loading bordered hoverable style={{ width: 300 }}>
          <Row gutter={5}>
            <Col style={{}}>Tickets sold:</Col>{" "}
            <Col style={{ fontWeight: "bold" }}>256</Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
