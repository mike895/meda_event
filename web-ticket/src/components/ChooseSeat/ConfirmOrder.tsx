import { useEffect } from "react";
import "./confirmOrder.css";

function ConfirmOrder({ onConfirm, onCloseModal, data, paymentInfo }: any) {
  // Event Title
  // Venue
  // Time and date
  // Number of Seats
  // Total price

  const eventTitle = data.EventSchedule.event.title;
  const venue = data.eventHall.name;
  const date = new Date(data.time).toDateString();
  const time = new Date(data.time).toLocaleTimeString();
  const { totalPrice, selectedSeats } = paymentInfo;

  useEffect(() => console.log(paymentInfo), []);

  return (
    <div className="confirm-container" onClick={() => onCloseModal(false)}>
      <div className="details">
        <div className="close-button" onClick={() => onCloseModal(false)}>
          X
        </div>
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "30px",
            marginBottom: "2px",
          }}
        >
          Confirm Order
        </h2>
        <div className="details-rows-container" />

        <div>
          <div className="detail-row">
            <p className="detail-head">Event title</p>
            <p className="detail-value">{eventTitle}</p>
          </div>
          <div className="detail-row">
            <p className="detail-head">Venue</p>
            <p className="detail-value">{venue}</p>
          </div>
          <div className="detail-row">
            <p className="detail-head">Time and Date</p>
            <p className="detail-value">{date + " @ " + time}</p>
          </div>
          <div className="detail-row">
            <p className="detail-head">Number of Seats</p>
            <p className="detail-value">{selectedSeats}</p>
          </div>

          <div className="detail-row">
            <p className="detail-head">Total Price</p>
            <p className="detail-value">
              {totalPrice}
              {" Birr"}
            </p>
          </div>
        </div>
        <button className="confirm-button" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}

export default ConfirmOrder;
