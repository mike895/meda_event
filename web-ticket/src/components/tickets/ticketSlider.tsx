import {
  DownloadOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Col,
  Popconfirm,
  Typography,
  Button,
  Divider,
  Row,
  message,
} from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import TicketDetailFooter from "./ticketDetailFooter";
import TicketWarning from "./ticketWarning";
import colors from "../../constants/colors";
const reactScreenshot = require("use-react-screenshot");
interface Props {
  ticket: any;
}
function TicketSlider({ ticket }: Props) {
  const itemsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [image, takeScreenshot] = reactScreenshot.useScreenshot();
  const [currentTicket, setCurrentTicket] = useState(0);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: "button__bar",
    afterChange: (current: number) => setCurrentTicket(current),
  };
  const download = (
    image: string,
    { name = "img", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = reactScreenshot.createFileName(extension, name);
    a.click();
  };
  useEffect(() => {
    if (ticket != null) {
      itemsRef.current = itemsRef.current.slice(
        0,
        ticket.TicketsOnSeats.length
      );
    }
  }, [ticket]);
  const [allLoading, setAllLoading] = useState(false);
  let sliderRef: any | null = null;
  const [oneLoading, setOneLoading] = useState(false);
  const renderArrows = () => {
    return (
      <div className="slider-arrow">
        <Button
          className="arrow-btn prev"
          onClick={() => sliderRef.slickPrev()}
        >
          <LeftOutlined style={{ color: "grey" }} />
        </Button>
        <Button
          className="arrow-btn next"
          onClick={() => sliderRef.slickNext()}
        >
          <RightOutlined style={{ color: "grey" }} />
        </Button>
      </div>
    );
  };
  const captureTicket = async (ref: HTMLDivElement | null, all = false) => {
    all ? setAllLoading(true) : setOneLoading(true);
    try {
      if (all) {
        let photosB64: { image: string; name: string }[] = [];
        for (const [i, iet] of (itemsRef.current as any).entries()) {
          console.log(i);
          photosB64.push({
            name: ticket?.TicketsOnSeats[i].ticketKey,
            image: await takeScreenshot(iet),
          });
        }
        // await Promise.all(
        //   itemsRef.current.map(async (e, i) => {
        //     photosB64.push({
        //       name: ticket?.TicketsOnSeats[i].ticketKey,
        //       image: await takeScreenshot(e),
        //     });
        //   })
        // );
        photosB64.forEach((e) => download(e.image, { name: e.name }));
      } else {
        let image = await takeScreenshot(ref);
        download(image, {
          name: ticket?.TicketsOnSeats[currentTicket].ticketKey,
        });
      }
    } catch (error) {
      message.error((error as Error).message || "An error occurred");
    }
    all ? setAllLoading(false) : setOneLoading(false);
  };
  return (
    <Col
      // span={10}
      lg={12}
      xl={10}
      md={24}
      style={{ alignItems: "center", position: "relative" }}
    >
      <Typography.Text
        strong
        style={{
          fontSize: 16,
          justifyContent: "center",
          display: "flex",
          marginBottom: 5,
        }}
      >
        Ticket {currentTicket + 1} of {ticket?.TicketsOnSeats?.length}
      </Typography.Text>
      {renderArrows()}
      <Slider {...settings} ref={(c) => (sliderRef = c)}>
        {ticket?.TicketsOnSeats?.map((e: any, i: number) => {
          return (
            <div key={e.id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  flexShrink: 1,
                  marginTop: 30,
                  paddingBottom: 20,
                  background: "#F9FCFF",
                  borderRadius: 10,
                  position: "relative",
                }}
                ref={(el) => (itemsRef.current[i] = el)}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "0px",
                    marginTop: "0px",
                  }}
                >
                  <Popconfirm
                    onConfirm={async () => {
                      await captureTicket(null, true);
                    }}
                    // className={styles.deleteConfirm}
                    // overlayClassName={styles.overlay}
                    title="Download Ticket"
                    icon={<DownloadOutlined />}
                    okButtonProps={{ loading: allLoading }}
                    okText="Download All Tickets"
                    cancelText="Download This Ticket"
                    cancelButtonProps={{ type: "primary", loading: oneLoading }}
                    onCancel={async () => {
                      await captureTicket(itemsRef.current[currentTicket]);
                    }}
                  >
                    <DownloadOutlined
                      style={{ fontSize: "25px", color: colors.PRIMARY }}
                    />
                  </Popconfirm>
                </div>
                <Typography.Title
                  level={4}
                  style={{ fontWeight: "normal", marginTop: 10 }}
                >
                  Ticket : Century Cinema
                  <Divider
                    style={{
                      margin: 0,
                      marginTop: 5,
                      borderWidth: 2,
                      color: "grey",
                      paddingLeft: 10,
                    }}
                  />
                </Typography.Title>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {e.seat.seatType == "VIP" ? "[VIP]" : null}{" "}
                  {ticket.showTime?.CinemaMovieSchedule?.movie.title}
                </div>
                <div
                  style={{
                    background: "transparent",
                    padding: "16px",
                  }}
                >
                  <QRCode
                    value={e.ticketKey}
                    size={256 + 128}
                    bgColor="transparent"
                  />
                </div>
                <div style={{ width: 420 }}>
                  <Divider />
                  <Row justify="space-evenly">
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <div style={{ fontSize: 20 }}>HALL</div>
                      <div style={{ fontSize: 30 }}>
                        {ticket?.showTime?.cinemaHall?.name || "-"}
                      </div>
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <div style={{ fontSize: 20 }}>SEAT NUMBER</div>
                      <div style={{ fontSize: 30 }}>{e?.seat.seatName}</div>
                    </Col>
                  </Row>

                  <Divider />
                  <TicketDetailFooter ticket={ticket} ticketSeat={e} />
                  <Divider />
                  <TicketWarning />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </Col>
  );
}

export default TicketSlider;
