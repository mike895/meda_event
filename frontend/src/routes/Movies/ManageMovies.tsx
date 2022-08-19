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
import { ColumnsType } from "antd/lib/table";
import Highlighter from "react-highlight-words";
import React, { useEffect, useState } from "react";
// import RoleFacilityDetailModal from "./roledDetailModal";
import moment from "moment";
import { EditTwoTone, EditFilled, EditOutlined } from "@ant-design/icons";
// import { EditUserModal } from "@/components/Admin/manage-users/editUserModal";
import { EditEventModal } from "../../Components/Admin/User/EditUser/EditEventModal";
import { useAsyncEffect } from "use-async-effect";
import { Typography } from "antd";
// import { EditTicketRedeemerUserModal } from "../../Components/Admin/TicketRedeemer/EditTicketRedeemer/EditTicketRedeemerUserModal";
import { getAllMovies } from "../../helpers/httpCalls";
import _ from "lodash";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
type Movie = {
  title: string;
  genre: string;
  dateAdded: boolean;
};
enum ColumnDataType {
  Text,
  Date,
  DATE_RANGE,
}
export default function ManageMovies() {
  const [moviesList, setMoviesList] = useState<Array<Event>>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<any>("");
  const [tableLoading, setTableLoading] = useState(false);

  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [editUserModalProps, setEditUserModalProps] = useState<string>("");
  const [editTitle, setTitle] = useState<string>("");

  let searchInput: any;
  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const showEditUserModal = (id: string) => {
    setEditUserModalProps(id);
    setIsEditUserModalVisible(true);
  };

const showTitle = (val: any) => {
    setTitle(val);
}


  const handleCancelEditUserModal = () => {
    setIsEditUserModalVisible(false);
  };



  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText("");
  };

  const filterRegularText = (value: any, record: any, dataIndex: any) =>
    _.get(record, dataIndex, "")
      ? _.get(record, dataIndex, "")
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      : "";
  const filterDateText = (value: any, record: any, dataIndex: any) =>
    _.get(record, dataIndex, "")
      ? moment(_.get(record, dataIndex, ""))
          .format("DD/MM/YYYY")
          .includes(value)
      : "";
  const filterDateRange = (value: any, record: any, dataIndex: any) =>
    moment(_.get(record, dataIndex, "")).isBetween(value[0], value[1]);
  const getColumnSearchProps = (
    dataIndex: string | string[],
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
        <Space direction="vertical">
          {dataType === ColumnDataType.DATE_RANGE ? (
            <RangePicker
              showNow
              ranges={{
                Today: [moment(), moment()],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              onChange={(val) => {
                setSelectedKeys(val ? [val] : []);
              }}
              value={selectedKeys[0]}
            />
          ) : (
            <Input
              ref={(node) => {
                searchInput = node;
              }}
              placeholder={`${"Search"} ${columnName}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{ marginBottom: 8, display: "block" }}
            />
          )}
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
        case ColumnDataType.DATE_RANGE:
          return filterDateRange(value, record, dataIndex);
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
        case ColumnDataType.DATE_RANGE:
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
  const columns = [
    {
      title: "Title",
      ...getColumnSearchProps("title", "Title", ColumnDataType.Text),
      //   fixed: "left",
      dataIndex: `title`,
      sorter: {
        compare: (a: any, b: any) => a.title.localeCompare(b.title),
      },
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Date Added",
      dataIndex: "addedAt",
      sorter: {
        compare: (a: any, b: any) =>
          moment(a.addedAt).unix() - moment(b.addedAt).unix(),
      },
      defaultSortOrder: "descend",
      ...getColumnSearchProps(["addedAt"], "Date Added", ColumnDataType.DATE_RANGE),
    },
    {
      title: "Added By",
      dataIndex: "addedBy",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps("addedBy", "Added By", ColumnDataType.Text),
    },

    {
      title: "Actions",
      dataIndex: "id",
      fixed: "right",
      render: (id: string ,recovery: any) => {
        return (
          <Tooltip placement="top" title={"Edit Event"}>
            <Button
              type="text"
              icon={<EditTwoTone />}
              onClick={() => {
                showEditUserModal(id);
                showTitle(recovery.title);
              }}
            ></Button>
          </Tooltip>
        );
      },
    },
  ];
  const loadMovies = async () => {
    setTableLoading(true);
    const res = await getAllMovies();
    if (res.error) {
      setMoviesList([]);
      message.error("Error Loading data please refresh the page.");
    } else {
      setMoviesList(
        res.map((element: any) => ({
          ...element,
          addedBy: `${element.addedBy?.firstName} ${element.addedBy?.lastName}`,
        }))
      );
    }
    setTableLoading(false);
  };

  useAsyncEffect(async () => {
    await loadMovies();
  }, []);

  return (
    <>
          {isEditUserModalVisible ? (
        <EditEventModal
          id={editUserModalProps}
          title={editTitle}
          visible={isEditUserModalVisible}
          onCancel={handleCancelEditUserModal}
          onUpdateSuccess={loadMovies}
        />
      ) : null}
      <Row justify="start" style={{ paddingBottom: "10px" }}>
        <Title level={4}>Manage Events</Title>
      </Row>

      <Table
        loading={tableLoading}
        dataSource={moviesList}
        columns={columns as any}
        bordered
        rowKey="id"
        scroll={{ x: "max-content", y: 640 }}
      ></Table>
    </>
  );
}
