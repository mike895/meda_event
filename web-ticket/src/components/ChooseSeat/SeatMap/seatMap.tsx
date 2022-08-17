import { Col, Row, Space } from "antd";
import React, { useState } from "react";
import Seat from "./seat/seat";
import styles from "./seat.map.module.css";
import seatStyles from "./seat/seat.module.css";
interface Props {
  seatMap: any;
}
function SeatMap({ seatMap }: Props) {
  // Get the largest seat column length

  const largestSeatMapLength = seatMap.reduce(function (p: any, v: any) {
    return p.seats.length > v.seats.length ? p : v;
  }).seats.length;
  const getScreenLen = () => {
    let sum = 0;
    seatMap.forEach((e: any) => {
      if (e.columnType == "PADDING") {
        // Padding width
        sum += 45;
      } else {
        // Seat width + padding
        sum += 35 + 3 + 3;
      }
    });
    return sum;
  };
  return (
    <div
      style={{
        padding: "15px 0px",
        display: "flex",
        width: "100%",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          height: "100%",
          justifyContent: "flex-end",
          flexDirection: "column-reverse",
          display: "flex",
          marginBottom: 160,
        }}
        className={styles["scroll-offset"]}
      >
        {[...Array(largestSeatMapLength)].map((e, i) => {
          return (
            <div
              key={`keyp ${i}`}
              style={{
                margin: 3,
                width: 35,
                height: 35,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                display: "flex",
                textAlign: "center",
                color: "grey",
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          );
        })}
      </div>
      <div
        className="cool-scroll"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",

          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          {seatMap.map((e: any) => {
            return e.columnType == "PADDING" ? (
              <div
                key={`P ${e.columnName}`}
                style={{
                  flexDirection: "column",
                  width: "45px",
                  backgroundColor: "red",
                  display: "flex",
                  flexShrink: 0,
                }}
              ></div>
            ) : e.columnType == "SEATMAP" ? (
              <div
                key={`R ${e.columnName}`}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {e.seats.map((i: any) => {
                  return <Seat seat={i} key={i.seatName} />;
                })}
              </div>
            ) : null;
          })}
        </div>
        <div
          style={{
            width: getScreenLen() - 30,
            height: 40,
            marginTop: 30,
            marginLeft: 15,
            marginRight: 15,
            marginBottom: 10,
            backgroundColor: "#EDF2F8",
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            color: "grey",
          }}
          className={styles["screen"]}
        >
          Screen
        </div>
        <Space
          size={"large"}
          style={{
            display: "flex",
            justifyContent: "center",
            width: getScreenLen() -30,
            marginLeft: 15,
            marginRight: 15,
            marginBottom: 10,
            marginTop: 30,
          }}
        >
          <Space>
            Available
            <div
              className={`${seatStyles["seat"]} ${seatStyles["available-selection"]}`}
            ></div>
          </Space>
          <Space>
            Booked
            <div
              className={`${seatStyles["seat"]} ${seatStyles["booked-selection"]}`}
            ></div>
          </Space>
          <Space>
            Your Selection
            <div
              className={`${seatStyles["seat"]} ${seatStyles["selected-selection"]}`}
            ></div>
          </Space>
          <Space>
            Unavailable on Meda
            <div
              className={`${seatStyles["seat"]} ${seatStyles["unavailable"]}`}
            >
              X
            </div>
          </Space>
        </Space>
      </div>
    </div>
  );
}

export default SeatMap;
