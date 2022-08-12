import { RightOutlined } from "@ant-design/icons";
import { Avatar, List, message, Row, Skeleton, Spin, Typography } from "antd";
import list from "antd/lib/list";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/global/header";
import MoviesPreviewScroll from "../../components/global/moviesPreviewScroll";
import useOnFetch from "../../hooks/useOnFetch";
import { getBuyHistory } from "../../utils/http_calls";
import styles from "./tickets.module.css";
function MyTickets() {
  const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();
  const [tickets, setTickets] = useState<Array<any>>();
  async function loadData() {
    await onFetch(async () => await getBuyHistory(), {
      errorCallback: (error: any) => {
        message.error(`${error}`);
      },
      onSuccessCallback: (data: any) => {
        setTickets(data);
      },
    });
  }
  useEffect(() => {
    loadData();
  }, []);
  const navigate = useNavigate();
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
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            height: "100%",
          }}
        >
          <Row className={styles["content-row"]} justify="center">
            <div className={styles["content-container"]}>
              <Typography.Title level={2}>My Tickets</Typography.Title>
              {error != "" ? (
                <></>
              ) : (
                <div
                  id="scrollableDiv"
                  style={{
                    height: "70vh",
                    overflow: "auto",
                    padding: "0 16px",
                    border: "1px solid rgba(140, 140, 140, 0.35)",
                    minWidth: "100%",
                  }}
                >
                  <List
                    //   loading={true}

                    itemLayout="horizontal"
                    dataSource={
                      isLoading
                        ? [
                            1, 2, 3, 1, 23, 321, 3213, 123, 21312, 3, 12, 321,
                            32222, 212,
                          ]
                        : tickets
                    }
                    renderItem={(item) => (
                      <>
                        <List.Item
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (!isLoading) navigate(`/tickets/${item?.id}`);
                          }}
                        >
                          <Skeleton
                            avatar
                            title={false}
                            loading={isLoading}
                            active
                          >
                            <List.Item.Meta
                              avatar={<Avatar src={"/images/logo.png"} />}
                              title={
                                item.showTime?.CinemaMovieSchedule?.movie
                                  ?.title || (
                                  <span style={{ color: "tomato" }}>
                                    Canceled
                                  </span>
                                )
                              }
                              description={`Bought at ${dayjs(
                                item.createdAt
                              ).format("MMM DD, YYYY")} | ${
                                item?.TicketsOnSeats?.length
                              } ${
                                item?.TicketsOnSeats?.length == 1
                                  ? "Ticket"
                                  : "Tickets"
                              } | ${item?.amount} Birr`}
                            />
                            <div>
                              <RightOutlined />
                            </div>
                          </Skeleton>
                        </List.Item>
                      </>
                    )}
                  />
                </div>
              )}
            </div>
          </Row>
        </div>
        <MoviesPreviewScroll />
      </div>
    </>
  );
}

export default MyTickets;
