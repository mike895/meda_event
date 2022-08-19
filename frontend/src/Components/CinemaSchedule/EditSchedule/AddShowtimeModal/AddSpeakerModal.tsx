import {
  Button,
  Modal,
  Typography,
  Row,
  Form,
  Select,
  Space,
  message,
  Input,
  TimePicker,
  Image,
  Tooltip,
} from "antd";
import { useState } from "react";
import {
  CloseOutlined,
  PlusOutlined,
InfoCircleOutlined, InfoCircleTwoTone,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useAsyncEffect } from "use-async-effect";
import "./../edit.schedule.css";
import useOnFetch from "../../../../hooks/useOnFetch";
import {
  addSpeakerToSchedule,
  getAllCinemaHalls,
  getAllMovies,
} from "../../../../helpers/httpCalls";
import axios from 'axios'
import config from "../../../../config"



const { Option } = Select;
const { Text, Title } = Typography;
type Props = {
  id: string;
  visible: boolean;
  onCancel: any;
  onUpdateSuccess: any;
};


export const AddSpeakerModal = (props: Props) => {
  const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [cinemaHallList, setCinemaHallList] = useState<any[]>([]);
 const [imageLQPreviewUrl, setImageLQPreviewUrl] = useState("");
 const [posterImgval, setposterImg] = useState<any[]>([]);


 const uploadHandler = (e: any) => {
  const file = e.target.files[0];
  
  const formData = new FormData();
  formData.append('logo',file)
  console.log("fileee",formData)


  axios.post(`${config.MEDA_URL}/upload/`, formData)
  .then((res) => {
    console.log("yesssss",res)
    // setposterImg(res.data.name);
    posterImgval.push(res.data.name);
  })
  .catch((err) => {
    console.error(err)
  })
}



  
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
    if (!values.speakers)
      return message.error("You need to add at least 1 speaker!");
    console.log("hgfskjhkhk",values)  
    for (let i=0;i<posterImgval.length; i++){
      values.speakers[i].posterImg = posterImgval[i];

    }
    await onFetch(async () => await addSpeakerToSchedule(props.id, values), {
      errorCallback: (error: any) => message.error(`${error}`),
      onSuccessCallback: (msg: any) => {
        message.success("Speaker added.");
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
              <Title level={4}>Speakers</Title>
            </Row>
            <Form.List name="speakers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        name={[name, "firstName"]}
                        label="First Name"
                        rules={[
                          { required: true, message: "Missing Speaker" },
                        ]}
                        {...restField}
                      >
                        {/* <TimePicker format={"h:mm A"} use12Hours /> */}
                        <Input/>
                      </Form.Item>

                      <Form.Item
                        name={[name, "lastName"]}
                        label="Last Name"
                        rules={[
                          { required: true, message: "Missing Speaker" },
                        ]}
                        {...restField}
                      >
                        {/* <TimePicker format={"h:mm A"} use12Hours /> */}
                        <Input />
                      </Form.Item>


                      <Form.Item
                              label={"Poster Image Url"}
                              name="posterImg"
                              // rules={[{ required: true }]}
                            >
                  
                          <form action="#" method= "POST" encType="multipart/form-data" >
                            <input type="file" name="logo" onChange={uploadHandler} style={{width:"150px"}} required />
                          </form>

                      </Form.Item>


                      <Form.Item
                        label="Biography"
                        name={[name, "biography"]}
                        rules={[
                          {
                            required: true,
                            message: "Venue Not Selected",
                          },
                        ]}
                        style={{ width: "320px", marginTop: "5px" }}
                      >
                        <Input.TextArea  rows={4}/>
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
                      Add speaker
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
