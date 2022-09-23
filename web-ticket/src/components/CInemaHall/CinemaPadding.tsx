import {
  QuestionCircleOutlined,
  DeleteOutlined,
  DeleteTwoTone,
} from "@ant-design/icons";
import { Button, Col, Popconfirm } from "antd";
import React from "react";
import styles from "./cinema.padding.module.css";
import { CinemaHallColumn } from "./types";

const CinemaPadding = ({
  seatMap,
  onRemoveColumn,
  column,
}: {
  column: CinemaHallColumn;
  onRemoveColumn: Function | null | undefined;
  seatMap: CinemaHallColumn[];
}) => {
  function getLargestSeatMapLength() {
    return seatMap.reduce(function (p, v) {
      return p.seats.length > v.seats.length ? p : v;
    }).seats.length;
  }
  return (
    <div
      className={styles.seatPadding}
      style={{
        display: "block",
        height: "30px",
        zIndex: 200,
        width: "auto",
      }}
    >
      {onRemoveColumn == undefined ? null : (
        <div
          style={{
            position: "absolute",
            // right: "-5px",
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
    </div>
  );
};

export default CinemaPadding;
