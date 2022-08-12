import { Row, Space, Tag } from "antd";
import React from "react";
import moment from "moment";
import _ from "lodash";
// import { getUser, updateUser } from "@/lib/frontend/http_calls/admin";

import "./edit.ticket.modal.css";

export default function TicketDetails({ initialFormState }: any) {
  function DataValPair({ name, path }: any) {
    return (
      <Row>
        <Space direction="horizontal">
          <span style={{ fontWeight: "bold" }}>{`${name} -`} </span>
          <span>{`${_.get(initialFormState, path, "")}`}</span>
        </Space>
      </Row>
    );
  }
  return (
    <div>
      {" "}
      <Space direction="vertical" size={"small"}>
        <DataValPair
          name="Movie"
          path={[
            "movieTicket",
            "showTime",
            "CinemaMovieSchedule",
            "movie",
            "title",
          ]}
        />
        <DataValPair
          name="Cinema Hall"
          path={["movieTicket", "showTime", "cinemaHall", "name"]}
        />
        <Row>
          <Space direction="horizontal">
            <span style={{ fontWeight: "bold" }}>{`Movie Date -`} </span>
            <span>{`${moment(
              _.get(
                initialFormState,
                ["movieTicket", "showTime", "CinemaMovieSchedule", "date"],
                ""
              )
            ).format("DD/MM/YYYY")}`}</span>
          </Space>
        </Row>
        <Row>
          <Space direction="horizontal">
            <span style={{ fontWeight: "bold" }}>{`Show Time -`} </span>
            <span>{`${moment(
              _.get(initialFormState, ["movieTicket", "showTime", "time"], "")
            ).format("h:mm A")}`}</span>
          </Space>
        </Row>
        <Row>
          <Space direction="horizontal">
            <span style={{ fontWeight: "bold" }}>{`Seat Name -`} </span>
            <span>
              <Tag color={"black"}>
                <div style={{fontWeight:"bold"}}> {_.get(initialFormState, ["seat", "seatName"], "")}</div>
              </Tag>
            </span>
          </Space>
        </Row>

        <Row>
          <Space direction="horizontal">
            <span style={{ fontWeight: "bold" }}>{`Hall Type -`} </span>
            <span>
              <Tag color={"blue"}>
                {_.get(initialFormState, ["seat", "seatType"], "")}
              </Tag>
            </span>
          </Space>
        </Row>
        <Row>
          <Space direction="horizontal">
            <span style={{ fontWeight: "bold" }}>{`Movie Type -`} </span>
            <span>
              <Tag color={"blue"}>
                {_.get(initialFormState, ["movieTicket", "movieType"], "") ==
                "TWO"
                  ? "2D"
                  : "3D"}
              </Tag>
            </span>
          </Space>
        </Row>
        <Row>
          <Space direction="horizontal">
            <span style={{ fontWeight: "bold" }}>{`Price -`} </span>
            <span>{`${_.get(
              initialFormState,
              [
                "movieTicket",
                "showTime",
                "CinemaMovieSchedule",
                _.get(initialFormState, ["seat", "seatType"], "") == "REGULAR"
                  ? "regularTicketPrice"
                  : "vipTicketPrice",
              ],
              ""
            )} Birr`}</span>
          </Space>
        </Row>
      </Space>
    </div>
  );
}
