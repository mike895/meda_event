import { Row, Typography, Col, Tag, Divider } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { SeatType } from "../../constants/setType";
import { useAuth } from "../../context/authContext";
import { SeatSelectionContext } from "../../context/seatContext";
import useQuery from "../../hooks/useQuery";

function SeatsDetail({ showtime }: any) {
  const seatSelectionCtx = useContext(SeatSelectionContext);
  const [regularTicketsLen, setRegularTicketsLen] = useState(0)
  const [vipTicketsLen, setVipTicketsLen] = useState(0)
  const { currentUser, loading, toggleAuthModal, authModalProps,login} = useAuth();
//   let regularTicketsLen = 0;
//   let vipTicketsLen = 0;
  useEffect(() => {
    let rticketsLen = 0;
    let vticketsLen = 0;
    seatSelectionCtx.selectedSeats.forEach((e: any) => {
      if (e.seatType == SeatType.Regular) {
        rticketsLen += 1;
      } else {
        vticketsLen += 1;
      }
    });
    setRegularTicketsLen(rticketsLen);
    setVipTicketsLen(vticketsLen);
  }, [seatSelectionCtx.selectedSeats]);

  return (
    <>
      <Typography.Title level={4}>Summary</Typography.Title>
      <Row justify="start" style={{ height: "2em", margin: "5px 0px" }}>
        <Col flex={"150px"}>
          <Typography.Text>Cinema</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>Century Cinema</Typography.Text>
        </Col>
      </Row>
      <Row justify="start" style={{ height: "2em", margin: "5px 0px" }}>
        <Col flex={"150px"}>
          <Typography.Text>Event</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>
            {showtime?.EventSchedule?.event?.title}
          </Typography.Text>
        </Col>
      </Row>
      <Row justify="start" style={{ height: "2em", margin: "5px 0px" }}>
        <Col flex={"150px"}>
          <Typography.Text> Venue </Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>{showtime?.eventHall?.name}</Typography.Text>
        </Col>
      </Row>
      <Row justify="start" style={{ height: "2em", margin: "5px 0px" }}>
        <Col flex={"150px"}>
          <Typography.Text>Time {"&"} Date</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>
            {`${dayjs(showtime?.time).format("h:mm A")} ${dayjs(
              showtime?.EventSchedule?.date
            ).format("MMM DD, YYYY")}`}
          </Typography.Text>
        </Col>
      </Row>
      <Row justify="start" style={{ height: "2em", margin: "5px 0px" }}>
        <Col flex={"150px"}>
          <Typography.Text>Payee</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>{currentUser?.phoneNumber??"Please sign in"}</Typography.Text>
        </Col>
      </Row>
      <div
        style={{
          margin: "5px 0px",
          marginTop: 15,
          flexDirection: "column",
          alignItems: "start",
          display: "flex",
          marginBottom:15
        }}
      >
        <Typography.Text strong style={{fontSize:undefined}}>Your Selected Seats</Typography.Text>
        <Typography.Text style={{ marginBottom: 5 }}>{seatSelectionCtx.selectedSeats.length} Seats</Typography.Text>
        <Row>
          {seatSelectionCtx.selectedSeats.map((e: any) => {
            if (e.seatType == SeatType.Regular) {
              return (
                <Tag style={{ borderRadius: 5 }} key={`S ${e.id}`}>
                  {e.seatName}
                </Tag>
              );
            } else {
              return (
                <Tag key={`S ${e.id}`} color="gold" style={{ borderRadius: 5 }}>
                  {e.seatName}
                </Tag>
              );
            }
          })}
        </Row>
        <Row style={{width:350}}>
      <Divider style={{marginTop:10,marginBottom:0,}}/>
      </Row>
      </div>
      <Row justify="start" style={{ height: "1.5em", margin: "0px 0px" }}>
        <Col flex={"150px"}>
          <Typography.Text strong>Regular</Typography.Text>
        </Col>
        <Col flex={"150px"}>
          <Typography.Text strong>{regularTicketsLen==0?"-":regularTicketsLen}</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>{regularTicketsLen*seatSelectionCtx.regularTicketPrice} Birr</Typography.Text>
        </Col>
      </Row>
      {/* <Row justify="start" style={{ height: "1.5em", margin: "5px 0px" }}>
        <Col flex={"150px"}>
          <Typography.Text strong>VIP</Typography.Text>
        </Col>
        <Col flex={"150px"}>
          <Typography.Text strong>{vipTicketsLen==0?"-":vipTicketsLen}</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>{vipTicketsLen*seatSelectionCtx.vipTicketPrice} Birr</Typography.Text>
        </Col>
      </Row> */}
      <Row justify="start" style={{ height: "1.1em",marginTop:5 }}>
        <Col flex={"300px"}>
          <Typography.Text strong>Service Charge</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>0 Birr</Typography.Text>
        </Col>
      </Row>
      <Row style={{width:350}}>
      <Divider style={{marginTop:20,marginBottom:10,}}/>
      </Row>
      <Row justify="start" style={{ height: "1.1em",marginTop:5 }}>
        <Col flex={"300px"}>
          <Typography.Text strong>Total</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>{seatSelectionCtx.totalPrice} Birr</Typography.Text>
        </Col>
      </Row>
    </>
  );
}

export default SeatsDetail;
