import {
  Breadcrumb,
  Button,
  Col,
  Input,
  message,
  Rate,
  Row,
  Space,
  Tag,
  Typography,
  Card,
} from "antd";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import React, { useEffect, useState } from "react";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ImageCard from "../../components/chooseShowtime/imageCard";
import Header from "../../components/global/header";
import useOnFetch from "../../hooks/useOnFetch";
import { getMovieSchedules, getScheduleById } from "../../utils/http_calls";
import styles from "./schedule.module.css";
import { ClockCircleOutlined, StarOutlined } from "@ant-design/icons";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import ShowtimeSelectButton from "../../components/chooseShowtime/showtimeSelectButton";
import dayjs from "dayjs";
import MoviesPreviewScroll from "../../components/global/moviesPreviewScroll";
import ChooseShowtimeSkeleton from "../ChooseShowtime/chooseShowtimeSkeleton";
import { useAuth } from "../../context/authContext";
import "./Index.css";

type Seats = {
  name: string;
};

export default function Chebelew() {
  const { Meta } = Card;
  let { id } = useParams();
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const [schedule, setSchedule] = useState<any>();
  const navigate = useNavigate();
  const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();
  // const [phone, setPhone] = useState("");
  const { currentUser, loading, toggleAuthModal, authModalProps } = useAuth();
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  async function loadData() {
    await onFetch(async () => await getMovieSchedules(), {
      errorCallback: (error: any) => {
        message.error(`${error}`);
        navigate("/404", { replace: true });
      },
      onSuccessCallback: (data: any) => {
        setSchedule(data[0]);
        console.log(data[0]);
        setSelectedShowtime(data[0].schedules[0].showTimes[0].id);
      },
    });
  }
  useEffect(() => {
    setSelectedShowtime(null);
    loadData();
  }, [id]);

  if (isLoading)
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
        }}
      >
        Loading...
      </div>
    );
  if (error)
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
        }}
      >
        {error}
      </div>
    );

  return (
    <>
      <Header />
      <div className="ch-container">
        <div className="ch-back-img-wrapper">
          <img
            className="ch-back-img"
            src={`${process.env.REACT_APP_BASE_URL_BACKEND}/images/${schedule?.schedules[0].event.posterImg}`}
            alt=""
          />
          {/* <img className="ch-back-img" src="/images/chebelewbg.png" alt="" /> */}
        </div>
        <div className="ch-top">
          <div className="ch-top-left">
            <img
              className="chebelew"
              src="/images/chebelew-card-img.png"
              alt=""
            />
          </div>
          <div className="ch-top-right">
            <h2 className="ch-title">{schedule?.schedules[0].event.title}</h2>
            <div className="ch-section">
              <h3 className="ch-section-title">Organizer </h3>
              <p className="ch-section-desc">
                {schedule?.schedules[0].event.eventOrganizer}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "50px" }}>
              <div className="ch-section">
                <h3 className="ch-section-title">Address</h3>
                <p className="ch-section-desc">
                  {schedule?.schedules[0].showTimes[0].eventHall.name}
                </p>
              </div>
              <div className="ch-section">
                <h3 className="ch-section-title">Date</h3>
                <p className="ch-section-desc">
                  {new Date(
                    schedule?.schedules[0].showTimes[0].time
                  ).toDateString()}
                </p>
              </div>
              <div className="ch-section">
                <h3 className="ch-section-title">Time</h3>
                <p className="ch-section-desc">
                  {new Date(
                    schedule?.schedules[0].showTimes[0].time
                  ).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="ch-section">
              <h3 className="ch-section-title">Synopsis</h3>
              <p className="ch-section-desc">
                {schedule?.schedules[0].event.synopsis}
              </p>
              {/* <a href="#register" className="ch-show-more">
                Buy Ticket
              </a> */}
              <Button
                type="primary"
                disabled={selectedShowtime === null}
                onClick={() => {
                  if (!currentUser) {
                    toggleAuthModal(true);
                    return message.error("You need to login to continue");
                  }

                  if (!isValidPhoneNumber(currentUser?.phoneNumber)) {
                    message.error("Please enter a valid phone number");
                  } else {
                    navigate({
                      pathname: `schedule/${schedule.schedules[0].id}/showtime/${selectedShowtime}`,
                    });
                  }
                }}
                style={{
                  borderRadius: 5,
                  fontWeight: "600",
                  minHeight: 40,
                  fontSize: 16,
                  paddingLeft: "40px",
                  paddingRight: "40px",
                }}
              >
                Buy Ticket
              </Button>
            </div>
          </div>
          <span className="scrollDown"></span>
        </div>

        {/* <div id="register" className="ch-bottom"></div> */}
        {/* <div id="register" className="ch-bottom">
          <div className="ch-form">
            <div
              // className={styles["content-container"]}
              style={{ margin: "25px 0px" }}
            >
              <Space direction="horizontal">
                {schedule?.speakers?.map((e: any) => {
                  return (
                    <Card
                      key={e.id}
                      hoverable
                      // style={{ width: 700, wordWrap: 'break-word'}}
                      style={{ width: 300, height: 750 }}
                      cover={
                        <img
                          alt="Speaker_image"
                          src={`${process.env.REACT_APP_BASE_URL_BACKEND}/images/${e.posterImg}`}
                        />
                      }
                    >
                      <Meta
                        title={e.firstName + " " + e.lastName}
                        description={e.biography}
                      />
                    </Card>
                  );
                })}
              </Space>
              <div style={{ margin: "25px 0px" }}> </div>
              <Typography.Title level={2}>Buy Ticket</Typography.Title>
              <Row style={{ flexDirection: "column", maxWidth: 500 }}>
                <Typography.Title
                  level={4}
                  style={{
                    marginRight: 10,
                    marginBottom: 5,
                    // marginTop: 30,
                    fontWeight: "bold",
                  }}
                >
                  {"Mobile Number"}
                </Typography.Title>
                <PhoneInput
                  countrySelectProps={{
                    disabled: true,
                  }}
                  disabled
                  placeholder="Enter phone number"
                  countries={["ET"]}
                  defaultCountry={"ET"}
                  value={currentUser?.phoneNumber}
                  international
                  countryCallingCodeEditable={false}
                  onChange={(e) => {
                    // setPhone(e as any);
                  }}
                  style={{
                    margin: "5px 0px",
                  }}
                />
                <Typography.Title
                  level={4}
                  style={{
                    marginRight: 10,
                    marginBottom: 5,
                    marginTop: 30,
                    fontWeight: "bold",
                  }}
                >
                  {"Showtime"}
                </Typography.Title>
                <Typography.Text
                  style={{
                    marginRight: 10,
                    marginBottom: 5,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  {"Select your preferred showtime"}
                </Typography.Text>
                <Space direction="vertical">
                  {schedule?.showTimes?.map((e: any) => {
                    return (
                      <ShowtimeSelectButton
                        key={e.id}
                        value={e.id}
                        select={setSelectedShowtime}
                        selected={e.id === selectedShowtime}
                        timeCinema={`${dayjs(e.time).format("h:mm A")} (${
                          e.eventHall.name
                        })`}
                        // movieType={e.movieType === "THREE" ? "3D" : "2D"}
                        disabled={!e.active}
                      />
                    );
                  })}
                </Space>
              </Row>
              <Row
                style={{
                  flexDirection: "column",
                  maxWidth: 500,
                  marginTop: 30,
                }}
              >
                <Button
                  type="primary"
                  disabled={selectedShowtime === null}
                  onClick={() => {
                    if (!currentUser) {
                      toggleAuthModal(true);
                      return message.error("You need to login to continue");
                    }

                    if (!isValidPhoneNumber(currentUser?.phoneNumber)) {
                      message.error("Please enter a valid phone number");
                    } else {
                      navigate({
                        pathname: `showtime/${selectedShowtime}`,
                      });
                    }
                  }}
                  style={{
                    borderRadius: 5,
                    fontWeight: "600",
                    minHeight: 40,
                    fontSize: 16,
                  }}
                >
                  Continue to seat selection
                </Button>
              </Row>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}

/* Trial one


const Seat = ({ name }: Seats) => {
  return (
    <div
      style={{
        padding: "5px",
        backgroundColor: "#faad14",
        color: "white",
        borderRadius: "5px",
        margin: "5px",
        cursor: "pointer",
      }}
    >
      {name}
    </div>
  );
};



const [currentBlocks, setCurrentBlocks] = useState(1);
  const [currentZones, setCurrentZones] = useState(1);
  const [seats, setSeats] = useState([
    [
      [
        [
          { block: 1, zone: 1, seatName: "A1" },
          { block: 1, zone: 1, seatName: "A2" },
          { block: 1, zone: 1, seatName: "A3" },
        ],
      ],
    ],
  ]);
  let keys = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
  ];

  const addBlock = () => {
    setCurrentBlocks((prev) => prev + 1);
    setSeats([
      ...seats,
      [
        [
          [
            { block: currentBlocks, zone: currentZones, seatName: "A1" },
            { block: currentBlocks, zone: currentZones, seatName: "A2" },
            { block: currentBlocks, zone: currentZones, seatName: "A3" },
          ],
        ],
      ],
    ]);
  };

  const addZone = () => {
    setCurrentZones((prev) => prev + 1);
    setSeats([
      ...seats,
      [
        [
          [
            { block: currentBlocks, zone: currentZones, seatName: "A1" },
            { block: currentBlocks, zone: currentZones, seatName: "A2" },
            { block: currentBlocks, zone: currentZones, seatName: "A3" },
          ],
        ],
      ],
    ]);
  };

  return (
    <>
      <Button onClick={() => addBlock()}>Add Block</Button>
      <Button onClick={() => addBlock()}>Add Seats</Button>
      <div
        className="seatMap"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
        }}
      >
        {seats.map((blocks) => (
          <div
            className="block"
            style={{ display: "flex", marginBottom: "30px" }}
          >
            {blocks.map((zones) => (
              <div
                className="zone"
                style={{ display: "flex", flexDirection: "column-reverse" }}
              >
                {zones.map((zoneRow) => (
                  <div
                    className="seat-row"
                    style={{
                      backgroundColor: "red",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "3px",
                    }}
                  >
                    {zoneRow.map((i, index) => (
                      <Seat name={i.seatName} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
*/
