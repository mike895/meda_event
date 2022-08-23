import { Row, Skeleton } from "antd";
function LandingSkeleton() {
  return (
    <>
      <Row justify="center" style={{ margin: "25px 0px" }}>
        {[...Array(5)].map((e, index) => (
          <Skeleton.Button
            key={index}
            style={{
              width: 70,
              height: 75,
              borderRadius: 5,
              margin: 10,
            }}
            active
          />
        ))}
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
        {[...Array(5)].map((e, index) => (
          <Skeleton.Button
            key={index}
            style={{
              width: 200,
              height: 300,
              borderRadius: 5,
              margin: 10,
            }}
            active
          />
        ))}{" "}
      </Row>
    </>
  );
}

export default LandingSkeleton;
