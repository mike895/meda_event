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
    <Col key={column.columnName} className={styles.cinemaColumn}>
      {onRemoveColumn == null ? null : (
        <div
          style={{
            position: "absolute",
            right: "-5px",
            marginTop: "-5px",
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
        return <Seat key={j.seatName} seatName={`${j.seatName}`} />;
      })}
    </Col>
  );
};

export default CinemaColumn;
