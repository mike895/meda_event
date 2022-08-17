import { message, Row, Skeleton, Space, Typography } from "antd";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import React, { useEffect, useState } from "react";
import useOnFetch from "../../../hooks/useOnFetch";
import { getMovieSchedules } from "../../../utils/http_calls";
import MovieCard from "../moviecard";
const scrollStyle = (theme: any) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
});
export default function MoviesPreviewScroll() {
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
    <div
      className={"container"}
      style={{
        alignItems: "flex-start ",
        flexDirection: "column",
      }}
    >
      {isLoading ? (
        <>
          <Skeleton paragraph={{ rows: 0 }} active />
          <Space
            direction="horizontal"
            size={"large"}
            style={{ marginBottom: 30 }}
          >
            {[1, 2, 3].map((e) => (
              <Space direction="vertical">
                <Skeleton.Image style={{ width: 200, height: 280 }} />
                <Skeleton.Button
                  block
                  active
                  size="small"
                  style={{ width: 100 }}
                ></Skeleton.Button>
                <Skeleton.Button
                  block
                  active
                  size="small"
                  style={{ width: 150 }}
                ></Skeleton.Button>
              </Space>
            ))}
          </Space>
        </>
      ) : (
        <> </>
        // <>
        //   <Typography.Title level={2}>
        //     Currently showing at century
        //   </Typography.Title>
        //   <div
        //     // justify="center"
        //     style={{
        //       margin: "15px 0px",
        //       flexDirection: "row",
        //       display: "flex",
        //       // width:"100vw",
        //       overflowX: "auto",
        //     }}
        //     className="cool-scroll"
        //   >
        //     {schedules.length > 0
        //       ? schedules[index].schedules.map((e: any) => {
        //           return (
        //             <ErrorBoundary key={e.id}>
        //               <MovieCard
        //                 preview={false}
        //                 src={e.event.posterImg}
        //                 title={e.event.title}
        //                 runtime={`${Math.floor(e.event.runtime / 60)}h ${
        //                   e.event.runtime % 60
        //                 }min`}
        //                 trailerLink={e.event.trailerLink}
        //                 scheduleId={e.id}
        //               />
        //             </ErrorBoundary>
        //           );
        //         })
        //       : null}
        //   </div>
        // </>
      )}
    </div>
  );
}
