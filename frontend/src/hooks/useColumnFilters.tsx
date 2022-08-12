import moment from "moment";
import React, { useState } from "react";
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
import _ from "lodash";
import Highlighter from "react-highlight-words";
export enum ColumnDataType {
  Text,
  Date,
  DATE_RANGE,
}
const { RangePicker } = DatePicker;
function useColumnFilters() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<any>("");
  // const [tableLoading, setTableLoading] = useState(false);
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
    moment(_.get(record, dataIndex, "")).isBetween(
      value[0],
      value[1],
      "day",
      "[]"
    );
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

  return getColumnSearchProps;
  //     return (
  //     <div>useColumnFilters</div>
  //   )
}

export default useColumnFilters;
