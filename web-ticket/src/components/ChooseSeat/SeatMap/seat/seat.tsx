import { message } from "antd";
import React, { useContext, useState } from "react";
import { SeatSelectionContext } from "../../../../context/seatContext";
import styles from "./seat.module.css";
interface Props {
  seat: any;
}
export default function Seat({ seat }: Props) {
  const [errorClass, setErrorClass] = useState("");
  const seatSelectionCtx = useContext(SeatSelectionContext);
  const isSelected = seatSelectionCtx.isSeatSelected(seat);
  const triggerErrorAnim = () => {
    setErrorClass(styles["error-animation"]);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column",
        margin: 3,
        width: 35,
        height: 35,
        // borderRadius: 5,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        userSelect: "none",
        fontSize:12
        //make it white
      }}
      onClick={() => {
          if(seat.TicketsOnSeats.length != 0){
              triggerErrorAnim();
              return message.error("This seat is already booked")
          }
          else{
              seatSelectionCtx.toggleSelect(seat);
          }
      }}
      onAnimationEnd={() => {
        setErrorClass("");
      }}
      className={`${errorClass} ${
        seat.TicketsOnSeats.length != 0
          ? styles["booked-selection"]
          : !isSelected
          ? styles["available-selection"]
          : styles["selected-selection"]
      }`}
    >
      {isSelected?seat.seatName:null}
    </div>
  );
}
