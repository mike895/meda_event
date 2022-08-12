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
  DatePicker,
} from "antd";
import _ from "lodash";
import { ColumnsType } from "antd/lib/table";
import Highlighter from "react-highlight-words";
import React, { useEffect, useState } from "react";
// import RoleFacilityDetailModal from "./roledDetailModal";
import moment from "moment";
import { EditTwoTone, EditFilled, EditOutlined } from "@ant-design/icons";
// import { EditUserModal } from "@/components/Admin/manage-users/editUserModal";
import { useAsyncEffect } from "use-async-effect";
import { Typography } from "antd";
import {
  getAllCinemaHalls,
  getAllMovies,
  getAllRedeemerUsers,
  getAllTickets,
} from "../../helpers/httpCalls";
import { Ticket } from "../../types/Ticket";
import { EditTicketModal } from "../../Components/Finance/TicketsList/EditTicketModal";
import useColumnFilters, { ColumnDataType } from "../../hooks/useColumnFilters";
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
export default function TicketsList() {
  const [ticketsList, setTicketsList] = useState<Array<Ticket>>([]);
  const [cinemaList, setCinemaList] = useState<{ name: string }[]>([]);
  const [redeemerList, setRedeemerList] = useState<
    { firstName: string; lastName: string; id: string }[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<any>("");
  const [tableLoading, setTableLoading] = useState(false);
  let searchInput: any;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editUserModalProps, setEditUserModalProps] = useState<string>("");
  const showIssueReceiptModal = (id: string) => {
    setEditUserModalProps(id);
    setIsModalVisible(true);
  };
  const handleCancelEditUserModal = () => {
    setIsModalVisible(false);
  };
  const columnFilters = useColumnFilters();
  const columns = [
    {
      title: "Date Bought",         
      dataIndex: [`movieTicket`, "createdAt"],
      sorter: {
        compare: (a: any, b: any) =>
          moment(a.movieTicket.createdAt).unix() -
          moment(b.movieTicket.createdAt).unix(),
      },
      ellipsis: {
        showTitle: false,
      },
      ...columnFilters(
        [`movieTicket`, "createdAt"],
        "Date Added",
        ColumnDataType.DATE_RANGE
      ),
      defaultSortOrder: "descend",
    },
    {
      title: "Movie",
      ...columnFilters(
        [`movieTicket`, "showTime", `CinemaMovieSchedule`, `movie`, `title`],
        "Movie",
        ColumnDataType.Text
      ),
      dataIndex: [
        `movieTicket`,
        "showTime",
        `CinemaMovieSchedule`,
        `movie`,
        `title`,
      ],
      sorter: {
        compare: (a: any, b: any) =>
          a.movieTicket.showTime.CinemaMovieSchedule.movie.title.localeCompare(
            b.movieTicket.showTime.CinemaMovieSchedule.movie.title
          ),
      },
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Cinema Hall",
      filterSearch: true,
      filters: cinemaList.map((e) => {
        return { text: e.name, value: e.name };
      }),
      onFilter: (value: any, record: any) => {
        return record.movieTicket.showTime.cinemaHall.name == value;
      },
      dataIndex: [`movieTicket`, "showTime", `cinemaHall`, `name`],
      sorter: {
        compare: (a: any, b: any) =>
          a.movieTicket.showTime.cinemaHall.name.localeCompare(
            b.movieTicket.showTime.cinemaHall.name
          ),
      },
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Redeemer",
      dataIndex: [`redeemdBy`],
      sorter: {
        compare: (a: any, b: any) => {
          if (!(a.redeemdBy && b.redeemdBy)) return false;
          return `${a.redeemdBy.firstName} ${a.redeemdBy.lastName}`.localeCompare(
            `${a.redeemdBy.firstName} ${a.redeemdBy.lastName}`
          );
        },
      },
      filterSearch: true,
      filters: [
        ...redeemerList.map((e) => {
          return { text: `${e.firstName} ${e.lastName}`, value: e.id };
        }),
        { text: "Unredeemed", value: null },
      ],
      onFilter: (value: any, record: any) => {
        if (value == record.redeemdBy) {
          return true;
          //Checking for unredeemed tickets
        }
        if (record.redeemdBy) return record.redeemdBy.id === value;
        return false;
        // return record.redeemdBy.id === value;
      },
      ellipsis: {
        showTitle: false,
      },
      render: (e: any) => {
        if (e) return `${e.firstName} ${e.lastName}`;
        return <Tag color={"magenta"}>
           Unredeemed
      </Tag>
      },
    },

    {
      title: "Receipt",
      dataIndex: "receiptStatus",
      render: (status: string) => (
        <>
          <Tag color={status === "ISSUED" ? "green" : "red"}>
            {`${status === "ISSUED" ? "ISSUED" : "NOT ISSUED"}`}
          </Tag>
        </>
      ),
      filterSearch: true,
      filters: [
        { text: "Issued", value: "ISSUED" },
        { text: "Not Issued ", value: "NOTISSUED" },
      ],
      onFilter: (value: any, record: any) => {
        return record["receiptStatus"] == value;
      },
    },
    {
      title: "Actions",
      dataIndex: "ticketKey",
      fixed: "right",
      render: (id: string) => {
        return (
          <Tooltip placement="top" title={"Edit Ticket Receipt Status"}>
            <Button
              type="text"
              icon={<EditTwoTone />}
              onClick={() => {
                showIssueReceiptModal(id);
              }}
            ></Button>
          </Tooltip>
        );
      },
    },
  ];
  const loadTickets = async () => {
    setTableLoading(true);
    const res = await getAllTickets();
    if (res.error) {
      setTicketsList([]);
      message.error("Error Loading data please refresh the page.");
    } else {
      setTicketsList(res);
    }
    setTableLoading(false);
  };
  const loadFilterData = async () => {
    let res = await getAllCinemaHalls();
    if (res.error) {
      setCinemaList([]);
    } else {
      setCinemaList(res);
    }
    let res1 = await getAllRedeemerUsers();
    if (res1.error) {
      setRedeemerList([]);
    } else {
      setRedeemerList(res1);
    }
  };
  useAsyncEffect(async () => {
    await loadFilterData();
    await loadTickets();
  }, []);

  return (
    <>
      {isModalVisible ? (
        <EditTicketModal
          id={editUserModalProps}
          visible={isModalVisible}
          onCancel={handleCancelEditUserModal}
          onUpdateSuccess={loadTickets}
        />
      ) : null}
      <Row justify="start" style={{ paddingBottom: "10px" }}>
        <Title level={4}>Tickets List</Title>
      </Row>

      <Table
        loading={tableLoading}
        dataSource={ticketsList}
        columns={columns as any}
        bordered
        rowKey="ticketKey"
        scroll={{ x: "max-content", y: 640 }}
      ></Table>
    </>
  );
}
