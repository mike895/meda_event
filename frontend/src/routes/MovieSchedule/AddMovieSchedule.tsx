import { InfoCircleOutlined, InfoCircleTwoTone, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  TimePicker,
  Typography,
  Image,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAsyncEffect } from "use-async-effect";
import {
  addMovieSchedule,
  getAllCinemaHalls,
  getAllMovies,
} from "../../helpers/httpCalls";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;


const AddMovieSchedule = () => {
  const [eventsList, setMoviesList] = useState<any[]>([]);
  const [cinemaHallList, setCinemaHallList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLQPreviewUrl, setImageLQPreviewUrl] = useState("");  

  let navigate = useNavigate();
  
  const rangeConfig = {
    rules: [
      {
        type: "array" as const,
        required: true,
        message: "Please select a date range!",
      },
    ],
  };

  const loadFormData = async () => {
    
    let events = await getAllMovies();
    let cinemaHalls = await getAllCinemaHalls();
    if (events.error || cinemaHalls.error) {
      return message.error("Error Loading Form Data, Please refresh the page.");
    }
    setCinemaHallList(cinemaHalls);
    setMoviesList(events);
  };
  
  const onFinish = async (values: any) => {

    if (!values.showTimes)
    return message.error("You need to add at least 1 show time!");
    setIsLoading(true);

    

    let res = await addMovieSchedule(values);
    setIsLoading(false);
    if (res.error) {
      message.error(`${res.error}`);
    } else {
      message.success("Schedule Added.");
      navigate("/admin/schedules/manage");
    }
    console.log("Received values of form:", JSON.stringify(values));
  };
  useAsyncEffect(async () => {
    await loadFormData();
  }, []);
  return (
    <>
      <Title level={2} style={{ margin: "0px 0px 20px 0px" }}>
        {"Add Event Schedule"}
      </Title>
      <Row>
        <div>
          <Form
            name="dynamic_form_nest_item"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Space direction="vertical" >
              <Text style={{ fontSize: "14px" }}>
                <span
                  style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}
                >
                  *
                </span>{" "}
                Schedule Range
              </Text>
              <Form.Item name="scheduleRange" {...rangeConfig}>
                <RangePicker />
              </Form.Item>

              <Text style={{ fontSize: "14px" }}>
                <span
                  style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}
                >
                  *
                </span>{" "}
                Event
              </Text>
              <Form.Item
                name="event"
                rules={[
                  {
                    required: true,
                    message: "Movie Not Selected",
                  },
                ]}
                style={{ width: "300px", marginTop: "5px" }}
              >
                <Select
                  showSearch
                  loading={eventsList.length == 0}
                  optionFilterProp={"label"}
                  options={eventsList.map((e) => {
                    return { value: e.id, label: e.title };
                  })}
                ></Select>
              </Form.Item>
              <Space direction="horizontal">
              <Form.Item
                name={"regularTicketPrice"}
                label="Regular Ticket Price (ETB)"
                rules={[{ required: true}]}
              >
                <InputNumber min={0}/>
              </Form.Item>
              {/* <Form.Item
                name={"vipTicketPrice"}
                label="VIP Ticket Price (ETB)"
                rules={[{ required: true}]}
              >
                <InputNumber min={0} />
              </Form.Item> */}
              </Space>
            </Space>

            <div style={{ padding: "10px 0px" }}>
              <Row style={{ marginBottom: "10px" }}>
                <Title level={4}>Event Times</Title>
              </Row>
              <Form.List name="showTimes">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          name={[name, "time"]}
                          label="Show Time"
                          rules={[
                            { required: true, message: "Missing Show Time" },
                          ]}
                          {...restField}
                        >
                          <TimePicker format={"h:mm A"} use12Hours />
                        </Form.Item>
                        {/* <Form.Item
                          name={[name, "eventType"]}
                          label="Movie Type"
                          rules={[
                            { required: true, message: "Missing Movie Type" },
                          ]}
                          {...restField}
                        >
                          <Select>
                            <Option value="2D">2D</Option>
                            <Option value="3D">3D</Option>
                          </Select>
                        </Form.Item> */}
                        <Form.Item
                          label="Event Hall"
                          name={[name, "eventHall"]}
                          rules={[
                            {
                              required: true,
                              message: "Cinema Hall Not Selected",
                            },
                          ]}
                          style={{ width: "200px", marginTop: "5px" }}
                        >
                          <Select
                            showSearch
                            loading={cinemaHallList.length == 0}
                            optionFilterProp={"label"}
                            options={cinemaHallList.map((e) => {
                              return { value: e.id, label: e.name };
                            })}
                          ></Select>
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item style={{ width: "300px" }}>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Event Time
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              
            </div>
            <div style={{ padding: "10px 0px" }}>
              <Row style={{ marginBottom: "10px" }}>
                <Title level={4}>Event Speakers</Title>
              </Row>
              <Form.List name="speakers" >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                      <Form.Item
                      style={{  display:'block', marginRight:"20px" }}
                        name={[name,"firstName"]}
                        label="First Name: "
                        rules={[{ required: true}]}
                      >
                        <Input/>
                      </Form.Item>
                      <Form.Item
                      style={{  display:'block', marginRight:"20px" }}
                        name={[name,"lastName"]}
                        label="Last Name: "
                        rules={[{ required: true}]}
                      >
                        <Input/>
                      </Form.Item>

	<Form.Item
		style={{  display:'block', marginRight:"20px" }}
              label={"Poster Image Url"}
              name={[name,"posterImg"]}
              rules={[{ required: true }]}
            >
             

              <Input
              onChange={(val)=>{
                setImageLQPreviewUrl(val.target.value);
              }}
                suffix={
                  <Tooltip overlayInnerStyle={{backgroundColor:"transparent",boxShadow:"none"}} autoAdjustOverflow={false} destroyTooltipOnHide title={<Image
                  style={{maxWidth:"700px",maxHeight:"700px"}}
                    src={imageLQPreviewUrl}
                    fallback="data:image/png;base64,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"
                  />}>
                    <InfoCircleTwoTone style={{ color: "rgba(0,0,0,.45)" }} />
                  </Tooltip>
                }
              />
            </Form.Item>



                      <Form.Item
                      style={{ width: "500px", display:'block', marginRight:"20px" }}
                        name={[name,"biography"]}
                        label="Biography: "
                        rules={[{ required: true}]}
                      >
                        <Input.TextArea rows={5}/>
                      </Form.Item>
                       
                        <MinusCircleOutlined  onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item style={{ width: "300px" }}>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Event Speaker
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Row>
    </>
  );
};

export default AddMovieSchedule;
