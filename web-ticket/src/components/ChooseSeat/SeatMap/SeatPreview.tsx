import Seat from "./seat/seat";
interface Props {
  seatMap: any;
}

export default function SeatPreview({ seatMap }: Props) {
  return (
    <div
      className="cool-scroll"
      style={{
        display: "flex",
        height: "600px",
        flexDirection: "column-reverse",
        width: "100%",
        overflow: "scroll",
        alignItems: "center",
        boxSizing: "border-box",
        paddingBottom: "20px",
        bottom: 0,
        boxShadow: "inset 0 0 10px #5d5d5d54",
        borderRadius: "5px",
      }}
    >
      {seatMap.map((e: any) => {
        return (
          <div
            style={{
              display: "flex",
              margin: "auto",
              height: "100%",
            }}
          >
            {e.seats.map((i: any) => {
              // return (
              //   <>
              //     {e.columnType === "PADDING" ? (
              //       <div
              //         key={`P ${e.columnName}`}
              //         style={{
              //           flexDirection: "column",
              //           width: "20px",
              //           boxSizing: "border-box",
              //           display: "flex",
              //           flexShrink: 0,
              //         }}
              //       ></div>
              //     ) : (
              //       <Seat seat={i} key={i.seatName} />
              //     )}
              //   </>
              // );

              if (e.columnType === "PADDING") {
                return (
                  <div
                    key={`P ${e.columnName}`}
                    style={{
                      flexDirection: "column",
                      width: "20px",
                      boxSizing: "border-box",
                      display: "flex",
                      flexShrink: 0,
                    }}
                  ></div>
                );
              } else if (e.columnType === "SEATMAP") {
                return <Seat seat={i} key={i.seatName} />;
              }
            })}
            {e.columnType !== "PADDING" ? (
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
                  marginLeft: "20px",
                  width: "30px",
                }}
              ></span>
            ) : (
              <div style={{ height: "20px" }}>{""}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const margin = (seat: any) => {
  if (
    // seat.includes("D") ||
    seat.includes("H") ||
    // seat.includes("L") ||
    seat.includes("P")
    // seat.includes("T")
  )
    return "1";
};

// {seatMap.map((e: any) => {
//   return e.columnType === "PADDING" ? (
// <div
//   key={`P ${e.columnName}`}
//   style={{
// flexDirection: "column",
// width: "20px",
// boxSizing: "border-box",
// // backgroundColor: "red",
// display: "flex",
// flexShrink: 0,
//   }}
// ></div>
//   ) : e.columnType === "SEATMAP" ? (
//     <div
//       key={`R ${e.columnName}`}
//       style={
//         {
//           // display: "flex",
//           // justifyContent: "flex-end",
//           // flexDirection: "column",
//           // height: "100%",
//         }
//       }
//     >
//       {e.seats.map((i: any) => {
//         return (
//           <div
//             style={{
//               marginTop: `${margin(i.seatName) ? "20px" : "0px"}`,
//             }}
//           >
//             {/* {margin(i.seatName)} */}
//             <Seat seat={i} key={i.seatName} />
//           </div>
//         );
//       })}
//     </div>
//   ) : null;
// })}
