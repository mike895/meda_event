import { Col, message, Row, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/global/header";
import useOnFetch from "../../hooks/useOnFetch";
import { getTicketById } from "../../utils/http_calls";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import "react-phone-number-input/style.css";
import MoviesPreviewScroll from "../../components/global/moviesPreviewScroll";

import "./index.css";
import TicketWarning from "../../components/tickets/ticketWarning";
import TicketSlider from "../../components/tickets/ticketSlider";
const { Paragraph } = Typography;
let siteUrl = "https://meda.et";

//if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
//  siteUrl = "http://3.70.8.102:3000";
//} else {
//  siteUrl = "http://3.70.8.102";
//}

export default function Tickets() {
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
    if (ticket?.paymentStatus == "PAYED") {
      return (
        <CheckCircleTwoTone
          size={70}
          twoToneColor="#1ACA53"
          style={{ fontSize: 60 }}
        />
      );
    } else if (ticket?.paymentStatus == "PENDING") {
      return (
        <ClockCircleTwoTone
          size={70}
          twoToneColor="#FF7F7F"
          style={{ fontSize: 60 }}
        />
      );
    } else if (ticket?.paymentStatus == "CANCELED") {
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
  useEffect(() => {
    loadData();
  }, []);
  const paid = ticket?.paymentStatus == "PAYED" ? true : false;

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
                // span={8}
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
                      // display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      alignItems: "center",
                      fontSize: 30,
                      fontWeight: "bold",
                      // color: "white",
                    }}
                  >
                    Meda Ticket{" "}
                    <div style={{ fontWeight: "500" }}>Meda|Ticket</div>
                  </div>
                  <div
                    style={{
                      // display: "flex",
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
                      {`Payment Status: ${
                        paid ? "Paid" : ticket?.paymentStatus
                      } `}
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
                        { (ticket?.paymentStatus == "PAYED") ?
                  
                        <Paragraph
                          copyable={{
                            text: `${siteUrl}/tickets/${ticket?.id}`,
                          }}
                          strong
                        >
                          Copy link :
                        </Paragraph> :null
                       }
                      </div>
                      <TicketWarning />
                    </>
                  ) : (
                    <>
                      <Row style={{ fontSize: 16,marginTop:10 }} justify="center">
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
                    
              {(ticket?.paymentStatus == "PAYED") && ticket?.showTime != null ? (
                <TicketSlider ticket={ticket} />
              ) : null}
            </Row>
          </>
        )}
        <MoviesPreviewScroll />
      </div>
    </>
  );
}
