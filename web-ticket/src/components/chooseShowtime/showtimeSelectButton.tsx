import React from "react";
import styles from "./showtime.select.module.css";
import { ClockCircleOutlined } from "@ant-design/icons";
import colors from "../../constants/colors";
interface Props {
  value: string;
  disabled?: boolean;
  select: Function;
  selected: boolean;
  timeCinema:string;
  // movieType:string;
}
export default function ShowtimeSelectButton({value,select,selected,disabled=false,timeCinema}:Props) {
  return (
    <div
    onClick={()=>{
        select(value);
    }}
      className={styles["button-container"]}
      style={{
        ...(selected ? { borderColor: colors.PRIMARY, color: "black" } : {}),
        ...(disabled ? { backgroundColor: "grey" } : {}),
    }}
    >
      <div style={{ minWidth: 150 }}>
        <ClockCircleOutlined /> {timeCinema}
      </div>
      {/* <div style={{ padding: "0px 10px" }}>{movieType}</div> */}
    </div>
  );
}
