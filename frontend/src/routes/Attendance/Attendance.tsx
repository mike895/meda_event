import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import {
  Table,
  Tag,
  Space,
  Divider,
  Button,
  Input,
  message,
  Empty,
  Tooltip,
  Row,
  Pagination,
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
import { CSVLink } from "react-csv";
import {
  getAllCinemaHalls,
  getAllMovies,
  getAllRedeemerUsers,
  getAllTickets,
  getAllAttendance,
  getAllAttendant,
} from "../../helpers/httpCalls";
import { Ticket } from "../../types/Ticket";
import { EditTicketModal } from "../../Components/Finance/TicketsList/EditTicketModal";
import useColumnFilters, { ColumnDataType } from "../../hooks/useColumnFilters";
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
export default function TicketsList() {
  const [AttendanceList, setAttendanceList] = useState<Array<any>>([]);
  const [cinemaList, setCinemaList] = useState<{ name: string }[]>([]);
  const [exportList, setexportList] = useState<{ id: string; session: string; redeemer:string; redeemedAt: string; category: string;  subCategory:  string;  memberCountry:  string;    observerCountry: string;    signatoryCountry: string;    prospectiveCountry: string;    title: string;    firstName: string;    lastName: string;    organization: string;    designation :string;    email: string;    country: string;    phoneNumber : string;  participationMode : string;    sideEvents: string;    role: string; }[]>([]);

  const [redeemerList, setRedeemerList] = useState<
    { firstName: string; lastName: string; id: string }[]
  >([]);

  const [AttendeeList, setAttendeeList] = useState<
  { id: string; category: string;  subCategory:  string;  memberCountry:  string;    observerCountry: string;    signatoryCountry: string;    prospectiveCountry: string;    title: string;    firstName: string;    lastName: string;    organization: string;    designation :string;    email: string;    country: string;    phoneNumber : string;    registrationDate: string;    participationMode : string;    sideEvents: string;    role: string; }[]
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

    // {
    //   title: "Date Bought",         
    //   dataIndex: [`eventTicket`, "createdAt"],
    //   sorter: {
    //     compare: (a: any, b: any) =>
    //       moment(a.eventTicket.createdAt).unix() -
    //       moment(b.eventTicket.createdAt).unix(),
    //   },
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   ...columnFilters(
    //     [`eventTicket`, "createdAt"],
    //     "Date Added",
    //     ColumnDataType.DATE_RANGE
    //   ),
    //   defaultSortOrder: "descend",
    // },


    // {
    //   title: "Event",
    //   ...columnFilters(
    //     [`eventTicket`, "showTime", `EventSchedule`, `event`, `title`],
    //     "Event",
    //     ColumnDataType.Text
    //   ),
    //   dataIndex: [
    //     `eventTicket`,
    //     "showTime",
    //     `EventSchedule`,
    //     `event`,
    //     `title`,
    //   ],
    //   sorter: {
    //     compare: (a: any, b: any) =>
    //       a.eventTicket.showTime.EventSchedule.event.title.localeCompare(
    //         b.eventTicket.showTime.EventSchedule.event.title
    //       ),
    //   },
    //   ellipsis: {
    //     showTitle: false,
    //   },
    // },


    // {
    //   title: "venue",
    //   filterSearch: true,
    //   filters: cinemaList.map((e) => {
    //     return { text: e.name, value: e.name };
    //   }),
    //   onFilter: (value: any, record: any) => {
    //     return record.eventTicket.showTime.eventHall.name == value;
    //   },
    //   dataIndex: [`eventTicket`, "showTime", `eventHall`, `name`],
    //   sorter: {
    //     compare: (a: any, b: any) =>
    //       a.eventTicket.showTime.eventHall.name.localeCompare(
    //         b.eventTicket.showTime.eventHall.name
    //       ),
    //   },
    //   ellipsis: {
    //     showTitle: false,
    //   },
    // },
    
    // {
    //   title: "Redeemer",
    //   dataIndex: [`redeemdBy`],
    //   sorter: {
    //     compare: (a: any, b: any) => {
    //       if (!(a.redeemdBy && b.redeemdBy)) return false;
    //         `${a.redeemdBy.firstName} ${a.redeemdBy.lastName}`
    //       );
    //     },
    //   },
    //   filterSearch: true,
    //   filters: [
    //     ...redeemerList.map((e) => {
    //       return { text: `${e.firstName} ${e.lastName}`, value: e.id };
    //     }),
    //     { text: "Unredeemed", value: null },
    //   ],
    //   onFilter: (value: any, record: any) => {
    //     if (value == record.redeemdBy) {
    //       return true;
    //       //Checking for unredeemed tickets
    //     }
    //     if (record.redeemdBy) return record.redeemdBy.id === value;
    //     return false;
    //     // return record.redeemdBy.id === value;
    //   },
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (e: any) => {
    //     if (e) return `${e.firstName} ${e.lastName}`;
    //     return <Tag color={"magenta"}>
    //        Unredeemed
    //   </Tag>
    //   },
    // },

    // {
    //   title: "Category",
    //   dataIndex: "category",
    //   render: (status: string) => (
    //     <>
    //       <Tag color={"red"}>
    //         {status}
    //       </Tag>
    //     </>
    //   ),
    //   filterSearch: true,
    //   filters: [
    //   //   { text: "Issued", value: "ISSUED" },
    //   //   { text: "Not Issued ", value: "NOTISSUED" },
    //   ],
    //   onFilter: (value: any, record: any) => {
    //     // return record["receiptStatus"] == value;
    //   },
    // },



// {
    //   title: "Redeemer",
    //   dataIndex: [`redeemdBy`],
    //   sorter: {
    //     compare: (a: any, b: any) => {
    //       if (!(a.redeemdBy && b.redeemdBy)) return false;
    //         `${a.redeemdBy.firstName} ${a.redeemdBy.lastName}`
    //       );
    //     },
    //   },
    //   filterSearch: true,
    //   filters: [
    //     ...redeemerList.map((e) => {
    //       return { text: `${e.firstName} ${e.lastName}`, value: e.id };
    //     }),
    //     { text: "Unredeemed", value: null },
    //   ],
    //   onFilter: (value: any, record: any) => {
    //     if (value == record.redeemdBy) {
    //       return true;
    //       //Checking for unredeemed tickets
    //     }
    //     if (record.redeemdBy) return record.redeemdBy.id === value;
    //     return false;
    //     // return record.redeemdBy.id === value;
    //   },
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (e: any) => {
    //     if (e) return `${e.firstName} ${e.lastName}`;
    //     return <Tag color={"magenta"}>
    //        Unredeemed
    //   </Tag>
    //   },
    // },





    {
      title: "Session",
      dataIndex: "sessionEvent",
      render: (status: string) => (
        <>
          <Tag color={status =="session1"?"blue":status=="session2"?"magenta":status=="session3"?"orange":"green"}>
            {status}
          </Tag>
        </>
      ),
      filterSearch: true,
      filters: [
        { text: "Session 1", value: "session1" },
        { text: "Session 2 ", value: "session2" },
        { text: "Session 3", value: "session3" },
        { text: "Session 4 ", value: "session4" },
      ],
      onFilter: (value: any, record: any) => {
        return record["sessionEvent"] == value;
      },
    },

    {
      title: "Checked At",
      dataIndex: "redeemdAt",
      render: (status: string) => (
        <>
          <Tag >
            {new Date(status).toLocaleString()}
          </Tag>
        </>
      ),
      filterSearch: true,
   
      onFilter: (value: any, record: any) => {
        return record["sessionEvent"] == value;
      },
    },


    {
      title: "Redeemer",
      dataIndex: [`redeemdBy`],
      sorter: {
        compare: (a: any, b: any) => {
          if (!(a.redeemdBy && b.redeemdBy)) return false;
          return `${a.redeemdBy.firstName} ${a.redeemdBy.lastName}`.localeCompare(
            `${b.redeemdBy.firstName} ${b.redeemdBy.lastName}`
          );
        },
      },
      filterSearch: true,
      filters: [
        ...redeemerList.map((e) => {
          return { text: `${e.firstName} ${e.lastName}`, value: e.id };
        }),
        // { text: "Unredeemed", value: null },
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
      title: "Category",
      dataIndex: [`attendant`],
      // sorter: {
      //   compare: (a: any, b: any) => {
      //     if (!(a.attendant && b.attendant)) return false;
      //     return `${a.attendant.category}`.localeCompare(
      //       `${b.attendant.category}`
      //     );
      //   },
      // },
      // filterSearch: true,
      // filters: [
      //   ...AttendeeList.map((e) => {
      //     return { text: `${e.category}`, value: e.id };
      //   }),
      //   // { text: "Unredeemed", value: null },
      // ],
      // onFilter: (value: any, record: any) => {
      //   if (value == record.attendant) {
      //     return true;
      //     //Checking for unredeemed tickets
      //   }
      //   if (record.attendant) return record.attendant.id === value;
      //   return false;
      //   // return record.redeemdBy.id === value;
      // },
      // ellipsis: {
      //   showTitle: false,
      // },
      render: (e: any) => {
        if (e) return `${e.category}`;
        return <Tag color={"magenta"}>
               Null
          </Tag>
       
      },
    },


    {
      title: "Title",
      dataIndex: [`attendant`],
      // sorter: {
      //   compare: (a: any, b: any) => {
      //     if (!(a.attendant && b.attendant)) return false;
      //     return `${a.attendant.title}`.localeCompare(
      //       `${a.attendant.title}`
      //     );
      //   },
      // },
      // filterSearch: true,
      // filters: [
      //   ...AttendeeList.map((e) => {
      //     return { text: `${e.title}`, value: e.id };
      //   }),
      //   // { text: "Unredeemed", value: null },
      // ],
      // onFilter: (value: any, record: any) => {
      //   if (value == record.attendant) {
      //     return true;
      //     //Checking for unredeemed tickets
      //   }
      //   if (record.attendant) return record.attendant.id === value;
      //   return false;
      //   // return record.redeemdBy.id === value;
      // },
      // ellipsis: {
      //   showTitle: false,
      // },
      render: (e: any) => {
        if (e) return `${e.title}`;
        return <Tag color={"magenta"}>
               Null
          </Tag>
       
      },
    },


    
    {
      title: "Name",
      dataIndex: [`attendant`],
      sorter: {
        compare: (a: any, b: any) => {
          if (!(a.attendant && b.attendant)) return false;
          return `${a.attendant.firstName} ${a.attendant.lastName}`.localeCompare(
            `${a.attendant.firstName} ${a.attendant.lastName}`
          );
        },
      },
      filterSearch: true,
      filters: [
        ...AttendeeList.map((e) => {
          return { text: `${e.firstName} ${e.lastName}`, value: e.id };
        }),
        // { text: "Unredeemed", value: null },
      ],
      onFilter: (value: any, record: any) => {
        if (value == record.attendant.id) {
          return true;
          //Checking for unredeemed tickets
        }
        if (record.attendant) return record.attendantId === value;
        return false;
        // return record.redeemdBy.id === value;
      },
      ellipsis: {
        showTitle: false,
      },
      render: (e: any) => {
        if (e) return `${e.firstName} ${e.lastName}`;
        return <Tag color={"magenta"}>
               Null
          </Tag>
       
      },
    },


/*

    
    {
      title: "Last Name",
      dataIndex: [`attendant`],
      // sorter: {
      //   compare: (a: any, b: any) => {
      //     if (!(a.attendant && b.attendant)) return false;
      //     return `${a.attendant.lastName}`.localeCompare(
      //       `${a.attendant.lastName}`
      //     );
      //   },
      // },
      // filterSearch: true,
      // filters: [
      //   ...AttendeeList.map((e) => {
      //     return { text: `${e.lastName}`, value: e.id };
      //   }),
      //   // { text: "Unredeemed", value: null },
      // ],
      // onFilter: (value: any, record: any) => {
      //   if (value == record.attendant) {
      //     return true;
      //     //Checking for unredeemed tickets
      //   }
      //   if (record.attendant) return record.attendant.id === value;
      //   return false;
      //   // return record.redeemdBy.id === value;
      // },
      // ellipsis: {
      //   showTitle: false,
      // },
      render: (e: any) => {
        if (e) return `${e.lastName}`;
        return <Tag color={"magenta"}>
               Null
          </Tag>
       
      },
    },


*/

    
    {
      title: "Organization",
      dataIndex: [`attendant`],
      // sorter: {
      //   compare: (a: any, b: any) => {
      //     if (!(a.attendant && b.attendant)) return false;
      //     return `${a.attendant.organization}`.localeCompare(
      //       `${a.attendant.organization}`
      //     );
      //   },
      // },
      // filterSearch: true,
      // filters: [
      //   ...AttendeeList.map((e) => {
      //     return { text: `${e.organization}`, value: e.id };
      //   }),
      //   // { text: "Unredeemed", value: null },
      // ],
      // onFilter: (value: any, record: any) => {
      //   if (value == record.attendant) {
      //     return true;
      //     //Checking for unredeemed tickets
      //   }
      //   if (record.attendant) return record.attendant.id === value;
      //   return false;
      //   // return record.redeemdBy.id === value;
      // },
      // ellipsis: {
      //   showTitle: false,
      // },
      render: (e: any) => {
        if (e) return `${e.organization}`;
        return <Tag color={"magenta"}>
               Null
          </Tag>
       
      },
    },




    
    {
      title: "Designation",
      dataIndex: [`attendant`],
      // sorter: {
      //   compare: (a: any, b: any) => {
      //     if (!(a.attendant && b.attendant)) return false;
      //     return `${a.attendant.designation}`.localeCompare(
      //       `${a.attendant.designation}`
      //     );
      //   },
      // },
      // filterSearch: true,
      // filters: [
      //   ...AttendeeList.map((e) => {
      //     return { text: `${e.designation}`, value: e.id };
      //   }),
      //   // { text: "Unredeemed", value: null },
      // ],
      // onFilter: (value: any, record: any) => {
      //   if (value == record.attendant) {
      //     return true;
      //     //Checking for unredeemed tickets
      //   }
      //   if (record.attendant) return record.attendant.id === value;
      //   return false;
      //   // return record.redeemdBy.id === value;
      // },
      // ellipsis: {
      //   showTitle: false,
      // },
      render: (e: any) => {
        if (e) return `${e.designation}`;
        return <Tag color={"magenta"}>
               Null
          </Tag>
       
      },
    },




    
    {
      title: "Country",
      dataIndex: [`attendant`],
      // sorter: {
      //   compare: (a: any, b: any) => {
      //     if (!(a.attendant && b.attendant)) return false;
      //     return `${a.attendant.country}`.localeCompare(
      //       `${a.attendant.country}`
      //     );
      //   },
      // },
      // filterSearch: true,
      // filters: [
      //   ...AttendeeList.map((e) => {
      //     return { text: `${e.country}`, value: e.id };
      //   }),
      //   // { text: "Unredeemed", value: null },
      // ],
      // onFilter: (value: any, record: any) => {
      //   if (value == record.attendant) {
      //     return true;
      //     //Checking for unredeemed tickets
      //   }
      //   if (record.attendant) return record.attendant.id === value;
      //   return false;
      //   // return record.redeemdBy.id === value;
      // },
      // ellipsis: {
      //   showTitle: false,
      // },
      render: (e: any) => {
        if (e) return `${e.country}`;
        return <Tag color={"magenta"}>
               Null
          </Tag>
       
      },
    },




    
    {
      title: "Participation Mode",
      dataIndex: [`attendant`],
      // sorter: {
      //   compare: (a: any, b: any) => {
      //     if (!(a.attendant && b.attendant)) return false;
      //     return `${a.attendant.participationMode}`.localeCompare(
      //       `${a.attendant.participationMode}`
      //     );
      //   },
      // },
      // filterSearch: true,
      // filters: [
      //   ...AttendeeList.map((e) => {
      //     return { text: `${e.participationMode}`, value: e.id };
      //   }),
      //   // { text: "Unredeemed", value: null },
      // ],
      // onFilter: (value: any, record: any) => {
      //   if (value == record.attendant) {
      //     return true;
      //     //Checking for unredeemed tickets
      //   }
      //   if (record.attendant) return record.attendant.id === value;
      //   return false;
      //   // return record.redeemdBy.id === value;
      // },
      // ellipsis: {
      //   showTitle: false,
      // },
      render: (e: any) => {
        if (e) return `${e.participationMode}`;
        return <Tag color={"magenta"}>
               Null
          </Tag>
       
      },
    },

    
    {
      title: "Role",
      dataIndex: [`attendant`],
      // sorter: {
      //   compare: (a: any, b: any) => {
      //     if (!(a.attendant && b.attendant)) return false;
      //     return `${a.attendant.role}`.localeCompare(
      //       `${b.attendant.role}`
      //     );
      //   },
      // },
      // filterSearch: true,
      // filters: [
      //   ...AttendeeList.map((e) => {
      //     return { text: `${e.role}`, value: e.id };
      //   }),
      //   // { text: "Unredeemed", value: null },
      // ],
      // onFilter: (value: any, record: any) => {
      //   if (value == record.attendant) {
      //     return true;
      //     //Checking for unredeemed tickets
      //   }
      //   if (record.attendant) return record.attendant.id === value;
      //   return false;
      //   // return record.redeemdBy.id === value;
      // },
      // ellipsis: {
      //   showTitle: false,
      // },
      render: (e: any) => {
        if (e) return `${e.role}`;
        return <Tag color={"magenta"}>
               Null
          </Tag>
       
      },
    },



    // {
    //   title: "Actions",
    //   dataIndex: "id",
    //   fixed: "right",
    //   render: (id: string) => {
    //     return (
    //       <Tooltip placement="top" title={"Edit Ticket Receipt Status"}>
    //         <Button
    //           type="text"
    //           icon={<EditTwoTone />}
    //           onClick={() => {
    //             showIssueReceiptModal(id);
    //           }}
    //         ></Button>
    //       </Tooltip>
    //     );
    //   },
    // },

  ];


  const loadTickets = async () => {
    setTableLoading(true);
    const res = await getAllAttendance();
    // console.log(res)
    if (res.error) {
      setAttendanceList([]);
      message.error("Error Loading data please refresh the page.");
    } else {
      setAttendanceList(res);
    }
    setTableLoading(false);
  };
  
  const loadFilterData = async () => {

    let res = await getAllAttendant();

    if (res.error) {
      setAttendeeList([]);
    } else {
      setAttendeeList(res);
    }

    let res1 = await getAllRedeemerUsers();
    if (res1.error) {
      setRedeemerList([]);
    } else {
      setRedeemerList(res1);
    }
  };

  const exportData = async () => {   
    AttendanceList.map((e) => {
     redeemerList.map((k) => { 
      AttendeeList.map((q) => {
        const isFound = exportList.some(element => {
          if (element.id === e.id) {
            return true;
          }
      
          return false;
        })
          if(e.attendantId === q.id && e.ticketValidatorUserId === k.id && !isFound){
            exportList.push({id: e.id, session: e.sessionEvent, redeemer:k.firstName + k.lastName, redeemedAt: e.redeemdAt, category: q.category,  subCategory:  q.subCategory,  memberCountry:  q.memberCountry,    observerCountry: q.observerCountry,    signatoryCountry: q.signatoryCountry,    prospectiveCountry: q.prospectiveCountry,    title: q.title,  firstName: q.firstName,    lastName: q.lastName,    organization: q.organization,    designation :q.designation,    email: q.email,    country: q.country,    phoneNumber : q.phoneNumber,  participationMode : q.participationMode,    sideEvents: q.sideEvents,  role: q.role})
          }
        })
      })
    })

    // console.log("finally",exportList)
  };

    useEffect(() => {
      // console.log("flush",exportList);
      exportData();
    });

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
        <Title level={4}>Attendance List</Title>
      </Row>

      <Table
        loading={tableLoading}
        dataSource={AttendanceList}
        columns={columns as any}
        bordered
        rowKey="id"    
        pagination={{ defaultPageSize: 50, showSizeChanger: true, pageSizeOptions: ['50', '100']}}
        scroll={{ x: "max-content", y: 640 }}
      >
      </Table>
        <Divider orientation="center" plain >    
          <Space direction={"vertical"} align={"start"} > 
            <Title style={{color:'blue'}} level={5}>Session 1: Unlocking Mini-Grids in Africa </Title> 
            <Title style={{color:'magenta'}} level={5}>Session 2: Solar Pumps and Other Agricultural Applications</Title>
            <Title style={{color:'orange'}} level={5}>Session 3: Manufacturing in Africa</Title>
            <Title style={{color:'green'}} level={5}>Session 4: Electric Vehicles </Title>
          </Space>
        </Divider>
    <Button > <CSVLink  filename={"Attendance.csv"} data={exportList} onClick={() => { /*console.log("qwsdfghj",exportList);*/ message.success(" file is downloading")}}>Export to CSV </CSVLink></Button>
    </>
  );
}
