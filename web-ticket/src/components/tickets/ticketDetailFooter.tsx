import { Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

export default function TicketDetailFooter({ ticket, ticketSeat }: any) {
  return (
    <>
      <Row style={{ fontSize: 16, width: "70%" }}>
        <Col span={12}>
          <Typography.Text style={{ color: "#595959" }}>
            Ticket Status
          </Typography.Text>
        </Col>
        <Col>
          <Typography.Text>{ticketSeat?.ticketStatus}</Typography.Text>
        </Col>
      </Row>
      <Row style={{ fontSize: 16, width: "70%" }}>
        <Col span={12}>
          <Typography.Text style={{ color: "#595959" }}>Date</Typography.Text>
        </Col>
        <Col>
          <Typography.Text>
            {`${dayjs(ticket.showTime.EventSchedule.date).format(
              "MMM"
            )} ${dayjs(ticket.showTime.EventSchedule.date).format(
              "D"
            )}, ${dayjs(ticket.showTime.EventSchedule.date).format(
              "YYYY"
            )}`}
          </Typography.Text>
        </Col>
      </Row>
      <Row style={{ fontSize: 16, width: "70%" }}>
        <Col span={12}>
          <Typography.Text style={{ color: "#595959" }}>Time</Typography.Text>
        </Col>
        <Col>
          <Typography.Text>
            {dayjs(ticket.showTime.time).format("h:mm A")}
          </Typography.Text>
        </Col>
      </Row>
      <Row style={{ fontSize: 16, width: "70%" }}>
        <Col span={12}>
          <Typography.Text style={{ color: "#595959" }}>
            Reference Number
          </Typography.Text>
        </Col>
        <Col>
          <Typography.Text>{ticket?.referenceNumber}</Typography.Text>
        </Col>
      </Row>
      {ticket.paymentMethod ? (
        <Row style={{ fontSize: 16, width: "70%" }}>
          <Col span={12}>
            <Typography.Text style={{ color: "#595959" }}>
              Payment Method
            </Typography.Text>
          </Col>

          <Col>
            <Typography.Text>{ticket?.paymentMethod || "-"}</Typography.Text>
          </Col>
        </Row>
      ) : null}
    </>
  );
}
