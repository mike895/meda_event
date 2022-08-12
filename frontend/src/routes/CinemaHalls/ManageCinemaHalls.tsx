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
} from "antd";
import { ColumnsType } from "antd/lib/table";
import Highlighter from "react-highlight-words";
import React, { useEffect, useState } from "react";
// import RoleFacilityDetailModal from "./roledDetailModal";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
// import { EditUserModal } from "@/components/Admin/manage-users/editUserModal";
import { useAsyncEffect } from "use-async-effect";
import { Typography } from "antd";
import { EditTicketRedeemerUserModal } from "../../Components/Admin/TicketRedeemer/EditTicketRedeemer/EditTicketRedeemerUserModal";
import { getAllCinemaHalls, getAllMovies } from "../../helpers/httpCalls";
import { CinemaHall } from "../../Components/CInemaHall/types";
import CinemaHallPreviewModal from "../../Components/CInemaHall/CinemaHallPreviewModal/CinemaHallPreviewModal";

const { Title, Text } = Typography;
type CinemaHallBasic = {
  name: string;
};
enum ColumnDataType {
  Text,
  Date,
}
export default function ManageMovies() {
  const [CinemaHallsList, setCinemaHallsList] = useState<
    Array<CinemaHallBasic>
  >([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalProps, setDetailModalProps] = useState<CinemaHall>({
    id: "",
    name: "",
    regularSeats: [],
    vipSeats: [],
  });

  let searchInput: any;

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText("");
  };

  const filterRegularText = (value: any, record: any, dataIndex: any) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : "";
  const filterDateText = (value: any, record: any, dataIndex: any) =>
    record[dataIndex]
      ? moment(record[dataIndex]).format("DD/MM/YYYY").includes(value)
      : "";
  const getColumnSearchProps = (
    dataIndex: string,
    columnName: string,
    dataType: ColumnDataType
  ) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: any;
      selectedKeys: any;
      confirm: any;
      clearFilters: any;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`${"Search"} ${columnName}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {"Search"}
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {"Reset"}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            {"Filter"}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) => {
      switch (dataType) {
        case ColumnDataType.Text:
          return filterRegularText(value, record, dataIndex);
        case ColumnDataType.Date:
          return filterDateText(value, record, dataIndex);
        default:
          break;
      }
    },
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput?.select(), 100);
      }
    },
    render: (text: any) => {
      let leFormattedText;
      switch (dataType) {
        case ColumnDataType.Text:
          leFormattedText = text;
          break;
        case ColumnDataType.Date:
          leFormattedText = `${moment(text).format("DD/MM/YYYY")}`;
          break;
        default:
          break;
      }
      if (searchedColumn === dataIndex) {
        return (
          <Tooltip
            placement="top"
            title={leFormattedText ? leFormattedText.toString() : ""}
          >
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={
                leFormattedText ? leFormattedText.toString() : ""
              }
            />
          </Tooltip>
        );
      } else {
        return (
          <Tooltip placement="top" title={leFormattedText}>
            {leFormattedText}
          </Tooltip>
        );
      }
    },
  });

  const showDetailsModal = (data: CinemaHall) => {
    setDetailModalProps(data);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Venue Name",
      ...getColumnSearchProps("name", "Cinema Hall Name", ColumnDataType.Text),
      dataIndex: `name`,
      sorter: {
        compare: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      ellipsis: {
        showTitle: false,
      },
    },

    {
      title: "Actions",
      dataIndex: "id",
      width: 100,
      render: (id: string,record:any) => {
        return (
          <Tooltip placement="top" title={"Preview venue"}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                showDetailsModal(record);
              }}
            ></Button>
          </Tooltip>
        );
      },
    },
  ];
  const loadData = async () => {
    setTableLoading(true);
    const res = await getAllCinemaHalls();
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
      <CinemaHallPreviewModal
        data={detailModalProps}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
      <Row justify="start" style={{ paddingBottom: "10px" }}>
        <Title level={4}>Manage Venues</Title>
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
