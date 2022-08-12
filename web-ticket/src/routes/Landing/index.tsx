import { Col, message, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import Header from "../../components/global/header";
import useOnFetch from "../../hooks/useOnFetch";
import { getMovieSchedules } from "../../utils/http_calls";
import LandingSkeleton from "./landingSkeleton";
import dayjs from "dayjs";
import styles from "./landing.module.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import MovieCard from "../../components/global/moviecard";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
function Landing() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();
  async function loadData() {
    await onFetch(async () => await getMovieSchedules(), {
      errorCallback: (error: any) => message.error(`${error}`),
      onSuccessCallback: (data: any) => {
        setSchedules(data);
      },
    });
  }
  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <Header />
      <Row justify="center">
        <img
          src="/images/logo.png"
          style={{
            width: 200,
            height: 200,
          }}
        />
      </Row>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
          }}
        >
          Meda|Ticket
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: "500",
          }}
        >
          Buy Event tickets
        </div>
      </div>
      {/* {console.log('yesssss',schedules)} */}
      {isLoading ? (
        <LandingSkeleton />
      ) : (
        <>
          <Row
            justify="center"
            style={{
              margin: "15px 0px",
            }}
          >
            {schedules.map((e, i) => {
              let day = dayjs(e.date);
              return (
                <div
                  className={
                    i == index
                      ? styles["calender-active"]
                      : styles["calender-not-active"]
                  }
                  key={`k ${new Date(e.date).getDay()}`}
                  onClick={() => {
                    setIndex(i);
                  }}
                >
                  <div className={styles["top-row"]}>
                    <div className={styles["text"]}>{day.format("ddd")}</div>
                  </div>
                  <div className={styles["middle-row"]}>
                    <div className={styles["text"]}>{day.format("DD")}</div>
                  </div>
                  <div className={styles["bottom-row"]}>
                    <div className={styles["text"]}>{day.format("MMM")}</div>
                  </div>
                </div>
              );
            })}
          </Row>

          <Row
            className={"container"}
            justify="center"
            style={{
              margin: "15px 0px",
              flexDirection: "row",
              display: "flex",
            }}
          >
            {schedules.length > 0
              ? schedules[index].schedules.map((e: any) => {
                  return (
                    <ErrorBoundary key={e.id}>
                      <MovieCard
                        src={e.event.posterImg}
                        title={e.event.title}
                        runtime={`${Math.floor(e.event.runtime / 60)}h ${
                          e.event.runtime % 60
                        }min`}
                        trailerLink={e.event.trailerLink}
                        scheduleId= {e.id}
                      />
                    </ErrorBoundary>
                  );
                })
              : null}
          </Row>
        </>
      )}
    </>
  );
}

export default Landing;
