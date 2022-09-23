import { Col, message, Popconfirm, Row, Spin, Typography } from "antd";
import { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/global/header";
import useOnFetch from "../../hooks/useOnFetch";
import { getTicketById } from "../../utils/http_calls";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
  DownloadOutlined,
  PrinterOutlined,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import "react-phone-number-input/style.css";
import MoviesPreviewScroll from "../../components/global/moviesPreviewScroll";
import TicketWarning from "../../components/tickets/ticketWarning";
import TicketSlider from "../../components/tickets/ticketSlider";
import "./index.css";
import colors from "../../constants/colors";
const reactScreenshot = require("use-react-screenshot");

const { Paragraph } = Typography;
let siteUrl = "https://meda.et";

export default function Tickets() {
  const [image, takeScreenshot] = reactScreenshot.useScreenshot();
  const itemsRef = useRef<Array<HTMLDivElement | null>>([]);
  const printRef = useRef();
  const [currentTicket, setCurrentTicket] = useState(0);
  const [allLoading, setAllLoading] = useState(false);
  const [oneLoading, setOneLoading] = useState(false);

  let { id } = useParams();
  const location = useLocation();
  const [ticket, setTicket] = useState<any>();
  const navigate = useNavigate();
  const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();

  async function loadData() {
    await onFetch(async () => await getTicketById(id), {
      errorCallback: (error: any) => {
        message.error(`${error}`);
        navigate("/404", { replace: true });
      },
      onSuccessCallback: (data: any) => {
        setTicket(data);
      },
    });
  }

  function renderStatusIcon() {
    if (ticket?.paymentStatus === "SUCCESS") {
      return (
        <CheckCircleTwoTone
          size={70}
          twoToneColor="#1ACA53"
          style={{ fontSize: 60 }}
        />
      );
    } else if (ticket?.paymentStatus === "PENDING") {
      return (
        <ClockCircleTwoTone
          size={70}
          twoToneColor="#FF7F7F"
          style={{ fontSize: 60 }}
        />
      );
    } else if (ticket?.paymentStatus === "CANCELLED") {
      return (
        <CloseCircleTwoTone
          size={70}
          twoToneColor="#FF7F7F"
          style={{ fontSize: 60 }}
        />
      );
    } else {
      return (
        <QuestionCircleTwoTone
          size={70}
          twoToneColor="#FF7F7F"
          style={{ fontSize: 60 }}
        />
      );
    }
  }

  const download = (
    image: string,
    { name = "img", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = reactScreenshot.createFileName(extension, name);
    a.click();
  };

  const captureTicket = async (ref: HTMLDivElement | null, all = false) => {
    all ? setAllLoading(true) : setOneLoading(true);
    try {
      if (all) {
        let photosB64: { image: string; name: string }[] = [];
        for (const [i, iet] of (itemsRef.current as any).entries()) {
          photosB64.push({
            name: ticket?.TicketsOnSeats[i].ticketKey,
            image: await takeScreenshot(iet),
          });
        }
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

  useEffect(() => {
    loadData();
  }, []);

  const paid = ticket?.paymentStatus === "SUCCESS" ? true : false;

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 500,
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row
              className={"container"}
              justify="center"
              style={{
                margin: "30px 0px",
                flexDirection: "row",
                display: "flex",
              }}
            >
              <Col
                md={24}
                lg={8}
                style={{
                  alignItems: "flex-end",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="ticket-status-info-col">
                  <div
                    style={{
                      flexDirection: "column",
                      textAlign: "center",
                      alignItems: "center",
                      fontSize: 30,
                      fontWeight: "bold",
                    }}
                  >
                    Meda|Ticket
                  </div>
                  <div
                    style={{
                      flexDirection: "column",
                      textAlign: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    {renderStatusIcon()}
                    <div
                      style={{
                        color: paid ? "#1ACA53" : "#FF7F7F",
                        fontSize: 24,
                        fontWeight: "bold",
                      }}
                    >
                      {paid
                        ? "Order Completed"
                        : `Payment Status: ${ticket?.paymentStatus}`}
                    </div>
                    {ticket?.showTime != null ? (
                      <div
                        style={{
                          fontSize: 16,
                        }}
                      >
                        You need to download or save the ticket and show when
                        requested at the cinema doors.
                      </div>
                    ) : null}
                  </div>
                  {ticket?.showTime != null ? (
                    <>
                      <div
                        style={{
                          marginTop: 10,
                          textAlign: "center",
                          alignItems: "center",
                          fontSize: 16,
                        }}
                      >
                        <div ref={printRef.current}>
                          <TicketWarning />
                        </div>
                        {ticket?.paymentStatus === "SUCCESS" ? (
                          <div className="action-buttons-wrapper">
                            <ActionButton
                              title={"Copy"}
                              action={"copy"}
                              ticket={ticket}
                            />
                            <ActionButton
                              title={"Download"}
                              action={"download"}
                              captureTicket={captureTicket}
                              currentTicket={currentTicket}
                              itemsRef={itemsRef}
                              oneLoading={oneLoading}
                              allLoading={allLoading}
                              ticket={ticket}
                            />
                            <ActionButton
                              title={"Print"}
                              action={"print"}
                              ticket={ticket}
                            />
                            <ActionButton
                              title={"Copy"}
                              action={"copy"}
                              ticket={ticket}
                            />
                            {/* <Button> */}
                            <Paragraph
                              copyable={{
                                text: `${siteUrl}/tickets/${ticket?.id}`,
                              }}
                              strong
                            >
                              Copy link :
                            </Paragraph>
                            {/* </Button> */}
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <Row
                        style={{ fontSize: 16, marginTop: 10 }}
                        justify="center"
                      >
                        <Col span={12}>
                          <Typography.Text style={{ color: "#595959" }}>
                            Reference Number
                          </Typography.Text>
                        </Col>
                        <Col>
                          <Typography.Text>
                            {ticket?.referenceNumber}
                          </Typography.Text>
                        </Col>
                      </Row>
                      <Row style={{ fontSize: 16 }} justify="center">
                        <Col span={12}>
                          <Typography.Text style={{ color: "#595959" }}>
                            Payment Status
                          </Typography.Text>
                        </Col>
                        <Col>
                          <Typography.Text>
                            {ticket?.paymentStatus}
                          </Typography.Text>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              </Col>

              {ticket?.paymentStatus === "SUCCESS" && ticket?.showTime != null ? (
                <TicketSlider
                  ticket={ticket}
                  oneLoading={oneLoading}
                  allLoading={allLoading}
                  currentTicket={currentTicket}
                  captureTicket={captureTicket}
                  setOneLoading={setOneLoading}
                  setAllLoading={setAllLoading}
                  setCurrentTicket={setCurrentTicket}
                  itemsRef={itemsRef}
                />
              ) : null}
            </Row>
          </>
        )}
        <MoviesPreviewScroll />
      </div>
    </>
  );
}

const ActionButton = ({
  title,
  action,
  ticket,
  captureTicket = null,
  currentTicket,
  itemsRef,
  oneLoading,
  allLoading,
}: any) => {
  const renderItem = () => {
    switch (action) {
      case "copy":
        return (
          <Paragraph
            className="action-button"
            copyable={{
              text: `${siteUrl}/tickets/${ticket?.id}`,
            }}
          >
            Copy link
          </Paragraph>
        );

      case "download":
        return (
          <Popconfirm
            className="action-button"
            onConfirm={async () => {
              await captureTicket(null, true);
            }}
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
            Download
            <DownloadOutlined
              style={{ fontSize: "25px", color: "#fff", marginLeft: "5px" }}
            />
          </Popconfirm>
        );

      case "print":
        return (
          <div className="action-button">
            Print
            <PrinterOutlined style={{ marginLeft: "5px" }} />
          </div>
        );

      default:
        break;
    }
  };

  const actionHandler = () => {};

  return (
    <div className="action-button-wrapper" onClick={actionHandler}>
      {renderItem()}
    </div>
  );
};
