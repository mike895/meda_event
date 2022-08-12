import {
  Button,
  Modal,
  Typography,
  Row,
  Form,
  Select,
  Space,
  message,
  TimePicker,
} from "antd";
import { useState } from "react";
import {
  CloseOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useAsyncEffect } from "use-async-effect";
import "./../edit.schedule.css";
import useOnFetch from "../../../../hooks/useOnFetch";
import {
  addShowtimeToSchedule,
  getAllCinemaHalls,
  getAllMovies,
} from "../../../../helpers/httpCalls";


const { Option } = Select;
const { Text, Title } = Typography;
type Props = {
  id: string;
  visible: boolean;
  onCancel: any;
  onUpdateSuccess: any;
};


export const AddShowTimeModal = (props: Props) => {
  const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [cinemaHallList, setCinemaHallList] = useState<any[]>([]);
  
  const loadFormData = async () => {
    let movies = await getAllMovies();
    let cinemaHalls = await getAllCinemaHalls();
    if (movies.error || cinemaHalls.error) {
      return message.error("Error Loading Form Data, Please refresh the page.");
    }
    setCinemaHallList(cinemaHalls);
    setMoviesList(movies);
  };
  useAsyncEffect(async () => {
    await loadFormData();
  }, []);
  
  const onFinish = async (values: any) => {
    if (!values.showTimes)
      return message.error("You need to add at least 1 show time!");
    await onFetch(async () => await addShowtimeToSchedule(props.id, values), {
      errorCallback: (error: any) => message.error(`${error}`),
      onSuccessCallback: (msg: any) => {
        message.success("Showtime added.");
        props.onUpdateSuccess();
      },
    });
  };
  
  return (
    <div>
      <Modal
        destroyOnClose={true}
        className="modalParent"
        visible={props.visible}
        title={<div style={{ padding: "10px" }}></div>}
        closeIcon={<CloseOutlined style={{ color: "white" }} />}
        onCancel={props.onCancel}
        footer={[]}
      >
        <Form
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
        >
          <div style={{ padding: "10px 0px" }}>
            <Row style={{ marginBottom: "10px" }}>
              <Title level={4}>Show Times</Title>
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
                        name={[name, "movieType"]}
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
                        label="Venue"
                        name={[name, "eventHall"]}
                        rules={[
                          {
                            required: true,
                            message: "Venue Not Selected",
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
                      Add Show Time
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
      </Modal>
    </div>
  );
};
