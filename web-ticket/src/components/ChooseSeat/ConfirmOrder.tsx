import { useEffect } from "react";
import "./confirmOrder.css";

const HorizontalLine = () => {
  return (
    <div
      style={{
        height: "2px",
        margin: "auto",
        width: "80%",
        marginBlock: "10px",
        backgroundColor: "#C4C9DF",
      }}
    />
  );
};

function ConfirmOrder({ onConfirm, onCloseModal, data, paymentInfo }: any) {
  // Event Title
  // Time and date
  // Venue
  // Seats and  Number of Seats
  // customer
  // phone number
  // Total price

  const eventTitle = data.EventSchedule.event.title;
  const venue = data.eventHall.name;
  const date = new Date(data.time).toDateString();
  const time = new Date(data.time).toLocaleTimeString();
  const { totalPrice, selectedSeats, user } = paymentInfo;
  const singlePrice = data.EventSchedule.regularTicketPrice;
  useEffect(() => console.log(), []);

  return (
    <div className="confirm-container">
      <div className="details">
        <div
          style={{
            // backgroundColor: " rgb(231, 242, 255)",
            paddingTop: "20px",
          }}
        >
          <div className="close-button" onClick={() => onCloseModal(false)}>
            X
          </div>
          <h2
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "30px",
              // paddingBottom: "20px",
            }}
          >
            Confirm Order
          </h2>
          <div className="details-rows-container" />
        </div>

        <div>
          <div className="detail-row">
            <p className="detail-head">Event</p>
            <p className="detail-value">{eventTitle}</p>
          </div>
          <div className="detail-row">
            <p className="detail-head">Time and Date</p>
            <p className="detail-value">
              {date} <br /> {time}
            </p>
          </div>
          <div className="detail-row" style={{ marginBottom: "15px" }}>
            <p className="detail-head">Venue</p>
            <a
              href="https://bit.ly/3LAhxLN"
              className="detail-value address-link"
              target="_blank"
              rel="noreferrer"
            >
              {venue}
            </a>
          </div>
          <HorizontalLine />

          <div className="detail-row" style={{ marginTop: "10px" }}>
            <p className="detail-head">Customer</p>
            <p className="detail-value" >
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div className="detail-row">
            <p className="detail-head">Phone</p>
            <p className="detail-value">{user.phoneNumber}</p>
          </div>

          <div className="bottom-summary">
            <div className="detail-row">
              <p className="detail-head">Single Ticket Price</p>
              <p className="detail-value">{singlePrice} Birr</p>
            </div>
            <div className="detail-row">
              <p className="detail-head">Number of Seats</p>
              <p className="detail-value">{selectedSeats} pc(s)</p>
            </div>

            <div className="detail-row">
              <p className="detail-head">Total Price</p>
              <p className="detail-value">
                {totalPrice}
                {" Birr"}
              </p>
            </div>
            <div onClick={onConfirm} className="payButton">
              <div
                style={{
                  flex: 1,
                  textAlign: "end",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {selectedSeats} Ticket(s) | {totalPrice} Birr
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  backgroundColor: "#FFEC00",
                  border: "none",
                  borderRadius: "3px",
                  height: "35px",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  fontWeight: "bold",
                  fontSize: "17px",
                }}
              >
                Pay
              </div>
            </div>
            <button
              onClick={() => onCloseModal(false)}
              style={{
                border: "none",
                margin: "auto",
                color: "#FF5858",
                display: "block",
                marginTop: "20px",
                fontWeight: "600",
                backgroundColor: "transparent",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmOrder;
