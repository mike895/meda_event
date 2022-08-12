import React from "react";
import styles from "./cinema.seat.module.css";
const Seat = ({ seatName }: { seatName: string }) => {
  return (
    <div className={styles.seat}>
      <p>{seatName}</p>
    </div>
  );
};

export default Seat;
