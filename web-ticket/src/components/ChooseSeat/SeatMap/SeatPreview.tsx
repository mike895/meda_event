import { Col, Row, Space } from "antd";
import React, { useState } from "react";
import Seat from "./seat/seat";
import styles from "./seat.map.module.css";
import seatStyles from "./seat/seat.module.css";
interface Props {
  seatMap: any;
}

export default function SeatPreview({ seatMap }: Props) {
  return (
    <div
    className="cool-scroll"
      style={{
        display: "flex",
        height:"500px",
        flexDirection: "row-reverse",
        width:"inherit",
        overflow:"scroll",
        alignItems: "flex-start",
        // justifyContent: "center",
        // width: "100%",
      }}
    >
      {seatMap.map((e: any) => {
        return e.columnType === "PADDING" ? (
          <div
            key={`P ${e.columnName}`}
            style={{
              flexDirection: "column",
              width: "20px",
              boxSizing: "border-box",
              // backgroundColor: "red",
              display: "flex",
              flexShrink: 0,
            }}
          ></div>
        ) : e.columnType === "SEATMAP" ? (
          <div
            key={`R ${e.columnName}`}
            style={
              {
                // display: "flex",
                // justifyContent: "flex-end",
                // flexDirection: "column",
                // height: "100%",
              }
            }
          >
            {e.seats.map((i: any) => {
              return (
                <div
                  style={{
                    marginTop: `${margin(i.seatName) ? "20px" : "0px"}`,
                  }}
                >
                  {/* {margin(i.seatName)} */}
                  <Seat seat={i} key={i.seatName} />
                </div>
              );
            })}
          </div>
        ) : null;
      })}
    </div>
  );
}

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
