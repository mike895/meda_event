import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Col, Popconfirm } from "antd";
import React from "react";
import Seat from "./CinemaSeat/Seat";
import { CinemaHallColumn } from "./types";
import styles from "./cinema.column.module.css";

const CinemaColumn = ({
  column,
  onRemoveColumn,
}: {

  column: CinemaHallColumn;
  onRemoveColumn: Function | undefined | null;
}) => {
  return (
    <div
      style={{ display: "flex" }}
      key={column.columnName}
      className={styles.cinemaColumn}
    >
      {onRemoveColumn == null ? null : (
        <div
          style={{
            position: "absolute",
            // right: "-5px",
            zIndex: 200,
            // marginTop: "-5px",
          }}
        >
          <Popconfirm
            onConfirm={() => {
              onRemoveColumn(column.columnName);
            }}
            className={styles.deleteConfirm}
            overlayClassName={styles.overlay}
            title="Remove ?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <DeleteOutlined
              color="red"
              style={{ fontSize: "18px", color: "red" }}
            />
          </Popconfirm>
        </div>
      )}
      {column.seats.map((j, i) => {
        return (
          <div
            style={{
              marginLeft: `${margin(j) ? "20px" : "0"}`,
            }}
          >
            <Seat key={j.seatName} seatName={`${j.seatName}`} />
          </div>
        );
      })}
    </div>
  );
};

const margin = (seat: any) => {
  if (
    // seat.seatName.includes("D") ||
    seat.seatName.includes("H") ||
    // seat.seatName.includes("L") ||
    seat.seatName.includes("P")
    // seat.seatName.includes("T")
  )
    return true;
};

export default CinemaColumn;
