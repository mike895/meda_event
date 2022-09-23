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
                <a
                  href="https://bit.ly/3LAhxLN"
                  className="ch-section-desc"
                  target="_blank"
                  rel="noreferrer"
                >
                  {schedule?.schedules[0].showTimes[0].eventHall.name}
                </a>
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

              <Button
                type="primary"
                disabled={selectedShowtime === null}
                onClick={() => {
                  if (!currentUser) {
                    toggleAuthModal(true, {
                      ...authModalProps,
                    });
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
      </div>
    </>
  );
}
