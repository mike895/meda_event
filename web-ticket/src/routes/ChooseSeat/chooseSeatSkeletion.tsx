import {
  Row,
  Skeleton,
  Space,
  Col,
} from "antd";
import styles from "./choose.set.module.css";
export default function ChooseSeatSkeleton() {
  return (
    <>
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          height: "100%",
        }}
      >
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
            <Space direction="horizontal">
              <img
                src="/images/logo.png"
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 5,
                }}
              />
              {[1, 2,3].map((e) => (
                <Skeleton.Button key={e} active={true} size={"small"} />
              ))}
            </Space>
          </Row>
          <Row className={styles["content-container"]}>
            <Row>
              <Col
                flex={1}
                style={{ flexDirection: "column", display: "flex" }}
              >
                <Space size={"large"} style={{marginBottom:5}}>
                  <Skeleton.Button active={true} size={"small"} />
                  <Skeleton.Button active={true} size={"small"} />
                </Space>
                <Col
                  flex={1}
                  style={{ flexDirection: "column", display: "flex" }}
                >

                  <Space direction="horizontal">
                    <Space size={"large"}>
                      <Skeleton.Button active={true} size={"small"} />
                      <Skeleton.Button active={true} size={"small"} />
                    </Space>
                  </Space>
                </Col>
              </Col>
            </Row>
          </Row>
          <Row
            className={styles["content-container"]}
            style={{ margin: "25px 0px" }}
          >
            <Skeleton.Button active={true} size={"small"} style={{marginBottom:10}} />
            <Skeleton.Button
              active={true}
              style={{
                height: "30vh",
                width: "100%",
              }}
            />
          </Row>
          <Row className={styles["content-container"]} style={{marginTop:25}}>
          <Skeleton.Button
              active={true}
              style={{
                height: "30vh",
                width: "100%",
              }}
            />
          </Row>
          <Row
            className={styles["content-row"]}
            style={{ flexDirection: "column" }}
          >
            <Skeleton paragraph={{rows:0}} style={{ color: "red" }}></Skeleton>
            <Row>
                <Skeleton.Button shape="square" style={{width:300}}></Skeleton.Button>
            </Row>
          </Row>
        </div>
      </div>
    </>
  );
}

