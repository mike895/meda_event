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
  Modal,
  DatePicker,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import Highlighter from "react-highlight-words";
import React, { useEffect, useState } from "react";
// import RoleFacilityDetailModal from "./roledDetailModal";
import moment from "moment";
import { EditTwoTone, EyeOutlined , UserOutlined} from "@ant-design/icons";
// import { EditUserModal } from "@/components/Admin/manage-users/editUserModal";
import { useAsyncEffect } from "use-async-effect";
import { Typography } from "antd";
import _ from "lodash";
import { EditTicketRedeemerUserModal } from "../../Components/Admin/TicketRedeemer/EditTicketRedeemer/EditTicketRedeemerUserModal";
import {
  getAllCinemaHalls,
  getAllMovies,
  getAllMovieSchedules,
} from "../../helpers/httpCalls";
import { CinemaHall } from "../../Components/CInemaHall/types";
import CinemaHallPreviewModal from "../../Components/CInemaHall/CinemaHallPreviewModal/CinemaHallPreviewModal";
import useColumnFilters, { ColumnDataType } from "../../hooks/useColumnFilters";
import { EditScheduleModal, EditSpeakersModal } from "../../Components/CinemaSchedule/EditSchedule/EditScheduleModal";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
type CinemaHallBasic = {
  name: string;
};
export default function ManageMovieSchedules() {
  const [CinemaHallsList, setCinemaHallsList] = useState<
    Array<CinemaHallBasic>
  >([]);
  const [tableLoading, setTableLoading] = useState(false);
  const columnFilters = useColumnFilters();
  const [showTimeModalVisible, setShowTimeModalVisible] = useState(false);
  const [speakersModalVisible, setSpeakersModalVisible] = useState(false);
  const [modalId, setModalId] = useState("");
  
  function showEditModal(id: string, type:string) {
    if(type=="speaker"){
      setModalId(id);
      setSpeakersModalVisible(true);
      
    }else{
      setModalId(id);
      setShowTimeModalVisible(true); 
    }
    
  }
  const columns = [
    {
      title: "Date",
      dataIndex: ["date"],
      sorter: {
        compare: (a: any, b: any) =>
          moment(a.date).unix() - moment(b.date).unix(),
      },
      defaultSortOrder: "descend",
      // ...getColumnSearchProps(["date"], "Schedule Date", ColumnDataType.DATE_RANGE),
      ...columnFilters(["date"], "Schedule Date", ColumnDataType.DATE_RANGE),
    },

    {
      title: "Title",
      ...columnFilters(["event", "title"], "Title", ColumnDataType.Text),

      dataIndex: ["event", "title"],
      sorter: {
        compare: (a: any, b: any) => a.event.title.localeCompare(b.event.title),
      },
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Time",
      dataIndex: "showTimes",
      render: (showTime: any[], record: any) => (
        <>
          {showTime.map((ex) => {
            return (
              <Tag color={ex.active ? "blue" : "magenta"} key={ex.key}>
                {moment(ex.time).format("h:mm A")}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Speakers",
      dataIndex: "speakers",
      render: (speakers: any[], record: any) => (
        <>
          {speakers.map((ex) => {
            return (
              <Tag color={ex.active ? "blue" : "magenta"} key={ex.key}>
                {`${ex.firstName} ${ex.lastName} `}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      fixed: "right",
      render: (id: string) => {
        return (
          <>
            <Tooltip placement="top" title={"Edit Showtimes"}>
              <Button
                type="text"
                icon={<EditTwoTone />}
                onClick={() => {
                  showEditModal(id, "");
                }}
                ></Button>
            </Tooltip>
            <Tooltip placement="top" title={"Edit Speakers"}>
              <Button
                type="link"
                icon={<UserOutlined  />}
                onClick={() => {
                  showEditModal(id, "speaker");
                }}
              ></Button>
            </Tooltip>
          </>
          
        );
      },
    },
  ];
  const loadData = async () => {
    setTableLoading(true);
    const res = await getAllMovieSchedules();
    if (res.error) {
      setCinemaHallsList([]);
      message.error("Error Loading data please refresh the page.");
    } else {
      setCinemaHallsList(res);
    }
    setTableLoading(false);
  };

  useAsyncEffect(async () => {
    await loadData();
  }, []);
  return (
    <>
      {showTimeModalVisible ? (
        <EditScheduleModal
          id={modalId}
          visible={showTimeModalVisible}
          onCancel={() => setShowTimeModalVisible(false)}
          onUpdateSuccess={async () => {
            await loadData();
          }}
        />
      ) : null}
      {speakersModalVisible ? (
        <EditSpeakersModal
          id={modalId}
          visible={speakersModalVisible}
          onCancel={() => setSpeakersModalVisible(false)}
          onUpdateSuccess={async () => {
            await loadData();
          }}
        />
      ) : null}
      <Row justify="start" style={{ paddingBottom: "10px" }}>
        <Title level={4}>Manage Schedules</Title>
      </Row>
      <Table
        loading={tableLoading}
        dataSource={CinemaHallsList}
        columns={columns as any}
        bordered
        rowKey="id"
        scroll={{ x: "max-content", y: 640 }}
      ></Table>
    </>
  );
}
