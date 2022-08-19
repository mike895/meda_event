import React, { CSSProperties, useEffect, useState } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Upload,
  Layout,
  Select,
  Alert,
  Space,
  message,
  InputNumber,
  Image,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import { addMovie, registerTicketRedeemer } from "../../helpers/httpCalls";
import { InfoCircleOutlined, InfoCircleTwoTone, PlusOutlined,UploadOutlined } from "@ant-design/icons";
import Search from "antd/lib/input/Search";
import { MovieSearchResponse } from "../../types/movieDataRes";
import axios from 'axios'
import config from "../../config"


const { Title } = Typography;
const BODY: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const FORM_CONTENT: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  // width: "100%",
  margin: "5%",
};
const FORM_SECTION: CSSProperties = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  minWidth: "600px",
  borderRadius: "5px",
  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
};

export default function AddMovie() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [searching, setSearching] = useState(false);
  const [imageLQPreviewUrl, setImageLQPreviewUrl] = useState("");
  const [imageHQPreviewUrl, setImageHQPreviewUrl] = useState("");
  const [imageval, setImage] = useState("");
  const [posterImgval, setposterImg] = useState("");
  let navigate = useNavigate();

const uploadHandler = (e: any) => {
  const file = e.target.files[0];
  
  const formData = new FormData();
  formData.append('logo',file)
  console.log("fileee",formData)


  axios.post(`${config.MEDA_URL}/upload/`, formData)
  .then((res) => {
    console.log("yesssss",res)
    setposterImg(res.data.name);
  })
  .catch((err) => {
    console.error(err)
  })
}


  const onFinish = async (values: any) => {
  
    setShow(false);
    setIsLoading(true);
    console.log(values)
    let res = await addMovie({
      ...values,
      posterImg: posterImgval,
      runtime:parseFloat(values.runtime),
      tags:values.tags.split(",").map((item: string) => item.trim())
    },); 
    setIsLoading(false);
    if (res.error) {
      setError(`${res.error}`);
      setShow(true);
    } else {
      message.success("Event Added.");
      navigate("/admin/events/manage");
    }
  };


  const validateMessages = {
    required: "This felid is required!",
  };
  const [form] = Form.useForm();


  return (
    <>
      <div style={BODY}>
        <div style={FORM_CONTENT}>

          <Form
            style={FORM_SECTION}
            initialValues={{ remember: true }}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            validateMessages={validateMessages}
            form={form}
            
          >
            {show ? (
              <Alert
                style={{ margin: "0 0 3% 0" }}
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => {
                  setShow(false);
                  setError("");
                }}
              />
            ) : null}

            <Form.Item
              label={"Event Title"}
              name="title"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>


            <Form.Item
              label={"Event Description"}
              name="synopsis"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label={"Tags"}
              name="tags"
              rules={[{ required: true }]}
            >
              <Input placeholder="Add comma separated values..." />
            </Form.Item>
            <Form.Item
              label={"Event Organizer"}
              name="eventOrganizer"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
  
            <Form.Item
              name="posterImg"
              label="poster Image"
              valuePropName="posterImg"
              getValueFromEvent={(e: any) => { return "img" }}
              rules={[{ required: false }]}
            >
               
          <form action="#" method= "POST" encType="multipart/form-data">
            <input type="file" name="logo" onChange={uploadHandler} />
          </form>



            </Form.Item>


        
            <Form.Item
              label={"Runtime In Minutes"}
              name="runtime"
              rules={[{ required: true }]}
            >
              <InputNumber />
            </Form.Item>

            <Form.Item
              label={"Trailer Link Url"}
              name="trailerLink"
              rules={[{ required: true }]}
            >
              <Input  />
            </Form.Item>

            <Space direction="vertical" size="small" />
            <Form.Item>
              <Button
                icon={<PlusOutlined />}
                block
                loading={isLoading}
                type="primary"
                htmlType="submit"
              >
                {"Add"}
              </Button>
            </Form.Item>
          </Form> 
	</div>
 	</div>
    </>
  );
}
