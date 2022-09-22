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
import { getScheduleById } from "../../utils/http_calls";
import styles from "./schedule.module.css";
import { ClockCircleOutlined, StarOutlined } from "@ant-design/icons";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import ShowtimeSelectButton from "../../components/chooseShowtime/showtimeSelectButton";
import dayjs from "dayjs";
import MoviesPreviewScroll from "../../components/global/moviesPreviewScroll";
import ChooseShowtimeSkeleton from "./chooseShowtimeSkeleton";
import { useAuth } from "../../context/authContext";

export default function ChooseShowtime() {
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
    await onFetch(async () => await getScheduleById(id), {
      errorCallback: (error: any) => {
        message.error(`${error}`);
        navigate("/404", { replace: true });
      },
      onSuccessCallback: (data: any) => {
        setSchedule(data);
      },
    });
  }
  useEffect(() => {
    setSelectedShowtime(null);
    loadData();
  }, [id]);
  return (
    <>
      <Header />
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          height: "100%",
        }}
      >
        {isLoading ? (
          <ChooseShowtimeSkeleton />
        ) : (
          <>
            <div
              className="container"
              style={{
                margin: "15px 0px",
                flexDirection: "column",
                display: "flex",
                flexGrow: 1,
              }}
            >
              <Row align="middle">
                <img
                  src="/images/logo.png"
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 5,
                  }}
                  alt=""
                />
                <Breadcrumb
                  separator={">"}
                  style={{ fontWeight: "bold", fontSize: 16 }}
                >
                  <Breadcrumb.Item key="home">
                    <Link to="/">Meda|Ticket</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item key={pathSnippets[2]}>
                    <Link to={`/${pathSnippets[0]}/${pathSnippets[1]}`}>
                      {schedule?.event?.title}
                    </Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Row>
              <Row className={styles["content-row"]}>
                <Col className={styles["image-col"]}>
                  <ImageCard schedule={schedule} />
                </Col>
                <Col lg={14} md={14} sm={24}>
                  <div className={styles["content-container"]}>
                    <Typography.Title level={2}>
                      {schedule?.event?.title}
                    </Typography.Title>
                    <ErrorBoundary>
                      <Row align="middle">
                        <Typography.Text
                          strong
                          style={{ marginRight: 10, marginBottom: 2 }}
                        >
                          {"Tags"}
                        </Typography.Text>
                        {schedule?.event.tags.map((e: any) => {
                          return (
                            <Tag key={`k ${e}`} color="#EDEDED">
                              <Typography.Text>{e}</Typography.Text>
                            </Tag>
                          );
                        })}
                      </Row>
                    </ErrorBoundary>
                    <Row
                      style={{ flexDirection: "column", margin: "15px 0px" }}
                    >
                      <Typography.Text
                        strong
                        style={{
                          marginRight: 10,
                          marginBottom: 5,
                          fontSize: 16,
                        }}
                      >
                        {"Synopsis"}
                      </Typography.Text>
                      <Typography.Text
                        style={{ marginRight: 10, marginBottom: 5 }}
                      >
                        {schedule?.event?.synopsis}
                      </Typography.Text>
                    </Row>
                    <Row align="middle">
                      {/* <Tag color={"yellow"} style={{ fontSize: 14 }}>
                        <StarOutlined color="gold" />{" "}
                        <strong>{schedule?.movie?.rating}</strong>
                      </Tag> */}
                      <Tag color={"yellow"} style={{ fontSize: 14 }}>
                        <ClockCircleOutlined color="gold" />{" "}
                        <strong> {schedule?.event?.runtime} mins</strong>
                      </Tag>
                      {/* <Tag color={"yellow"} style={{ fontSize: 14 }}>
                        <strong>{schedule?.movie?.contentRating}</strong>
                      </Tag> */}
                    </Row>
                  </div>
                  <div
                    className={styles["content-container"]}
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
                          if (!currentUser)
                            return message.error(
                              "You need to login to continue"
                            );

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
                </Col>
              </Row>
            </div>
          </>
        )}
        <MoviesPreviewScroll />
      </div>
    </>
  );
}
