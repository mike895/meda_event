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
} from "antd";
import { ColumnsType } from "antd/lib/table";
import Highlighter from "react-highlight-words";
import React, { useEffect, useState } from "react";
// import RoleFacilityDetailModal from "./roledDetailModal";
import moment from "moment";
import { EditTwoTone, EditFilled, EditOutlined } from "@ant-design/icons";
// import { EditUserModal } from "@/components/Admin/manage-users/editUserModal";
import { useAsyncEffect } from "use-async-effect";
import { getAllTicketRedeemerUsers } from "../../helpers/httpCalls";
import {Typography} from 'antd'
import { EditTicketRedeemerUserModal } from "../../Components/Admin/TicketRedeemer/EditTicketRedeemer/EditTicketRedeemerUserModal";

const {Title,Text} = Typography;
type User = {
  name: string;
  username: string;
  accountLockedOut: boolean;
  accessFailedCount: number;
  phoneNumber: String;
  createdAt: Date;
  registeredBy: string;
};
enum ColumnDataType {
  Text,
  Date,
}
export default function ManageTicketRedeemer() {
  const [usersList, setUsersList] = useState<Array<User>>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  let searchInput: any;

  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [editUserModalProps, setEditUserModalProps] =
    useState<string>("");


  const showEditUserModal = (id: string) => {
    setEditUserModalProps(id);
    setIsEditUserModalVisible(true);
  };
  const handleCancelEditUserModal = () => {
    setIsEditUserModalVisible(false);
  };

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
        // return leFormattedText;
      }
    },
  });

  const columns = [

    {
      title: "Name",
      ...getColumnSearchProps("name", "Name", ColumnDataType.Text),
    //   fixed: "left",
      dataIndex: `name`,
      sorter: {
        compare: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: {
        compare: (a: any, b: any) => a.username.localeCompare(b.username),
      },
      ...getColumnSearchProps("username", "Username", ColumnDataType.Text),
      ellipsis: {
        showTitle: false,
      },
      //   sortOrder:"descend"
    },
    {
      title: "Account Status",
      dataIndex: "accountLockedOut",
      render: (status: boolean) => (
        <>
          <Tag color={!status ? "green" : "red"}>
            {`${!status ? "Active" : "Disabled"}`}
          </Tag>
        </>
      ),
      filters: [
        { text: "Active", value: false },
        { text: "Disabled", value: true },
      ],
      onFilter: (value: any, record: any) => {
        return record["accountLockedOut"] == value;
      },

    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      ...getColumnSearchProps(
        "phoneNumber",
        "Phone Number",
        ColumnDataType.Text
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      sorter: {
        compare: (a: any, b: any) =>
          moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      },
      defaultSortOrder: "descend",
      ...getColumnSearchProps("createdAt", "Date Created", ColumnDataType.Date),
    },
    {
      title: "Registered By",
      dataIndex: "registeredBy",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "registeredBy",
        "Registered By",
        ColumnDataType.Text
      ),
    },

    {
      title: "Actions",
      dataIndex: "id",
      fixed: "right",
      render: (id: string) => {
        return (
          <Tooltip placement="top" title={"Edit User"}>
            <Button
              type="text"
              icon={<EditTwoTone />}
              onClick={() => {
                showEditUserModal(id);
              }}
            ></Button>
          </Tooltip>
        );
      },
    },
  ];
  const loadTicketRedeemerUsers = async () => {
    console.log("Populating table");
    setTableLoading(true);
    const res = await getAllTicketRedeemerUsers();
    if (res.error) {
      setUsersList([]);
      message.error("Error Loading data please refresh the page.");
    } else {
      setUsersList(
        res.map((element: any) => ({
          ...element,
          name: `${element.firstName} ${element.lastName}`,
          registeredBy: `${element.registeredBy?.firstName} ${element.registeredBy?.lastName}`,
        }))
      );
    }
    setTableLoading(false);
  };

  useAsyncEffect(async () => {
    await loadTicketRedeemerUsers();
  }, []);

  return (
    <>
      {isEditUserModalVisible ? (
        <EditTicketRedeemerUserModal
          id={editUserModalProps}
          visible={isEditUserModalVisible}
          onCancel={handleCancelEditUserModal}
          onUpdateSuccess={loadTicketRedeemerUsers}
        />
      ) : null}
      <Row justify="start" style={{paddingBottom:"10px"}}>
      <Title level={4}>
          Manage Ticket Validator Users
      </Title>
      </Row>

      <Table
        loading={tableLoading}
        dataSource={usersList}
        columns={columns as any}
        bordered
        rowKey="id"
        scroll={{ x: "max-content", y: 640 }}
      ></Table>
    </>
  );
}
