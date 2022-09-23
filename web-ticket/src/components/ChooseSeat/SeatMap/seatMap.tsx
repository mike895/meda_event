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
      if (e.columnType === "PADDING") {
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
      className="cool-scroll"
      style={{
        // padding: "15px 20px",
        // backgroundColor:'red',
        // display: "flex",
        // width: "100%",
        // alignItems: "center",
        // justifyContent: "center",
        // flexDirection: "column",
        overflowX: "scroll",
      }}
    >
      <div
        style={
          {
            // width: "100%",
            // padding: "15px 0px",
            // display: "flex",
            // alignItems: "flex-end",
            // justifyContent: "center",
            // backgroundColor:'red',
            // paddingRight: "30px",
          }
        }
      >
        {/* <div
          style={{
            height: "100%",
            // justifyContent: "flex-end",
            flexDirection: "column-reverse",
            display: "flex",
            // marginBottom: 160,
          }}
          // className={styles["scroll-offset"]}
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
        </div> */}
       
      </div>

      <div
        className="cool-scroll"
        // style={{
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "flex-end",
        // alignItems: "center",
        // overflowX: "auto",
        // width: "100%",
        // }}
      >
        <div
          style={{
            // width: getScreenLen() - 30,
            width: "40%",
            minWidth: "200px",
            height: 35,
            margin: "auto",
            marginTop: "40px",
            backgroundColor: "#EDF2F8",
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            color: "black",
          }}
          className={styles["screen"]}
        >
          Stage
        </div>
        <Space
          size={"large"}
          style={{
            display: "flex",
            justifyContent: "center",
            width: getScreenLen() - 30,
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

const margin = (seat: any) => {
  if (
    // seat.includes("D") ||
    seat.includes("H") ||
    // seat.includes("L") ||
    seat.includes("P")
    // seat.includes("T")
  )
    return "1";
};
