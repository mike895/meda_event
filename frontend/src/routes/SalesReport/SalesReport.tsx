import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  message,
  Empty,
  Tooltip,
  Row,
  Dropdown,
  Form,
  DatePicker,
  Select,
  Col,
  Card,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  EditTwoTone,
  EditFilled,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";
// import { EditUserModal } from "@/components/Admin/manage-users/editUserModal";
import { useAsyncEffect } from "use-async-effect";
import {
  getAllCinemaHalls,
  getAllMovies,
  getAllRedeemerUsers,
  getAllTicketRedeemerUsers,
  getSalesReport,
} from "../../helpers/httpCalls";
import { Typography } from "antd";
import FilterContainer from "../../Components/SalesReport/FilterContainer";
import { FilterCtx } from "../../Context/Context";
import SalesReportSkeleton from "../../Components/SalesReport/SalesReportSkeleton";
const { Search } = Input;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
export default function SalesReport() {
  const [statList, setStatList] = useState<any>({
    tickets: {
      ticketsSold: 0,
      totalAmount: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [cinemaHallList, setCinemaHallList] = useState<any[]>([]);
  const [redeemersList, setRedeemersList] = useState<any[]>([]);
  const [filterParams, setFilterParams] = useState<any>({});
  const [form] = Form.useForm();
  const rangeConfig = {
    rules: [
      {
        type: "array" as const,
        // required: true,
        // message: "Please select a date range!",
      },
    ],
  };
  const loadFormData = async () => {
    let movies = await getAllMovies();
    let cinemaHalls = await getAllCinemaHalls();
    let redeemers = await getAllRedeemerUsers();
    if (movies.error || cinemaHalls.error || redeemers.error) {
      return message.error("Error Loading Form Data, Please refresh the page.");
    }
    setCinemaHallList(cinemaHalls);
    setMoviesList(movies);
    setRedeemersList(redeemers);
  };
  const loadStatData = async (data: any | null) => {
    setLoading(true);
    const res = await getSalesReport(data ? data : {});
    if (res.error) {
      message.error("Error Loading data please refresh the page.");
    } else {
      setStatList(res);
    }
    setLoading(false);
  };

  useAsyncEffect(async () => {
    await loadFormData();
    await loadStatData(null);
  }, []);
  const onUpdate = async () => {

    const values = form.getFieldsValue(true);
    for (let i in values) {
      if (values[i] === null || values[i].length == 0) {
        delete values[i];
      }
    }
    setFilterParams(values);
    await loadStatData(values);
  };
  return (
    <>
      <FilterCtx.Provider value={{ onUpdate: onUpdate, filters: filterParams }}>
        <Row justify="start" style={{ paddingBottom: "10px" }}>
          <Title level={4}>Sales Report</Title>
        </Row>
        <Form autoComplete="off" form={form}>
          <Space direction="horizontal" size={"small"}>
            <FilterContainer title={"Date Range"} name="scheduleRange">
              <Form.Item
                label="DatePicker"
                name="scheduleRange"
                {...rangeConfig}
              >
                <RangePicker />
              </Form.Item>
            </FilterContainer>
            <FilterContainer title={"Event"} name="movie">
              <Form.Item
                label="Event"
                name="movie"
                // rules={[
                //   {
                //     required: true,
                //     // message: "Movie Not Selected",
                //   },
                // ]}
                style={{ width: "300px", marginTop: "5px" }}
              >
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  loading={moviesList.length == 0}
                  optionFilterProp={"label"}
                  options={moviesList.map((e) => {
                    return { value: e.id, label: e.title };
                  })}
                ></Select>
              </Form.Item>
            </FilterContainer>
            <FilterContainer title={"Venue"} name="cinemaHall">
              <Form.Item
                label="Venue"
                name="cinemaHall"
                // rules={[
                //   {
                //     required: true,
                //     // message: "Movie Not Selected",
                //   },
                // ]}
                style={{ width: "300px", marginTop: "5px" }}
              >
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  loading={cinemaHallList.length == 0}
                  optionFilterProp={"label"}
                  options={cinemaHallList.map((e) => {
                    return { value: e.id, label: e.name };
                  })}
                ></Select>
              </Form.Item>
            </FilterContainer>
            <FilterContainer title={"Redeemer"} name="redeemer">
              <Form.Item
                label="Redeemer"
                name="redeemer"
                // rules={[
                //   {
                //     required: true,
                //     // message: "Movie Not Selected",
                //   },
                // ]}
                style={{ width: "300px", marginTop: "5px" }}
              >
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  loading={redeemersList.length == 0}
                  optionFilterProp={"label"}
                  options={redeemersList.map((e) => {
                    return {
                      value: e.id,
                      label: `${e.firstName} ${e.lastName}`,
                    };
                  })}
                ></Select>
              </Form.Item>
            </FilterContainer>
          </Space>
        </Form>
      </FilterCtx.Provider>
      {loading ? (
        <SalesReportSkeleton />
      ) : (
        <Row align="middle" style={{ margin: "20px 20px 20px 0px" }}>
          <Col>
            <Card
              title="Ticket Sales"
              bordered
              hoverable
              style={{ width: 300 }}
            >
              <Row gutter={5}>
                <Col style={{}}>Tickets sold:</Col>{" "}
                <Col style={{ fontWeight: "bold" }}>
                  {statList.tickets.ticketsSold}
                </Col>
              </Row>
              <Row justify="end">
                <Tag color="#108ee9">{statList.tickets.totalAmount} ETB</Tag>
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
