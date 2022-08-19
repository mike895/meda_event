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
import axios from 'axios'
import config from "../../config"



const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;


const AddMovieSchedule = () => {
  const [eventsList, setMoviesList] = useState<any[]>([]);
  const [cinemaHallList, setCinemaHallList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLQPreviewUrl, setImageLQPreviewUrl] = useState("");
  const [posterImgval, setposterImg] = useState<any[]>([]);
//  const posterImgval= any[];
  let navigate = useNavigate();

const uploadHandler = (e: any) => {
  const file = e.target.files[0];

  const formData = new FormData();
  formData.append("logo", file);

  axios
    .post(`${config.MEDA_URL}/upload/`, formData)
    .then((res) => {
      posterImgval.push(res.data.name);
    })
    .catch((err) => {
      console.error(err);
    });
};

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
  for (let i = 0; i < posterImgval.length; i++) {
    values.speakers[i].posterImg = posterImgval[i];
  }

  let res = await addMovieSchedule(values);
  setIsLoading(false);
  if (res.error) {
    message.error(`${res.error}`);
  } else {
    message.success("Schedule Added.");
    navigate("/admin/schedules/manage");
  }
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
                                rules={[{ required: false }]}
                              >
                              <form action="#" method= "POST" encType="multipart/form-data">
                                <input type="file" name="logo" onChange={uploadHandler} />
                              {/* <input type="submit" value="send" /> */}
                            </form>
    
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
