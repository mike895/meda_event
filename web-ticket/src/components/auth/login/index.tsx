import { Space, Row, Typography, Button, message, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useAuth } from "../../../context/authContext";
import { registerUser, requestOTP, verifyOTP } from "../../../utils/auth_http_calls";
import EnterOTP from "../enterOTP/enterOTP";



function Login() {
  const [otp, setOtp] = useState("");
  const [authRequestId, setAuthRequestId] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [step, setStep] = useState(0);
  const time = new Date();
  const { currentUser, loading, toggleAuthModal, authModalProps,login} = useAuth();
  
  time.setSeconds(time.getSeconds() + 600);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [phone, setPhone] = useState(authModalProps.props.phoneNumber);
  useEffect(() => {
    setOtp("");
  }, []);
  const steps = [
    <>
      <Row style={{ flexDirection: "column" }}>
        <Typography.Title
          level={5}
          style={{
            marginRight: 10,
            marginBottom: 5,
            // marginTop: 30,
            fontWeight: "bold",
          }}
        >
          {"Mobile Number"}
        </Typography.Title>
        <PhoneInput
          countrySelectProps={{
            disabled: true,
          }}
          placeholder="Enter mobile number"
          countries={["ET"]}
          defaultCountry={"ET"}
          value={phone}
          international
          countryCallingCodeEditable={false}
          onChange={(e) => {
            setPhone(e as any);
          }}
          style={{
            margin: "5px 0px",
          }}
        />
      </Row>
      <Button
        block
        type="primary"
        size="large"
        loading={loading1}
        onClick={async () => {
          if (!isValidPhoneNumber(phone)) {
            return message.error("Please enter a valid phone number");
          }
          async function logic() {
            const res = await requestOTP({ phoneNumber: phone });
            if (res.error) {
              return message.error(res.error || "Unknown error");
            }
            setAuthRequestId(res.authRequestId);
            setStep(1);
          }
          setLoading1(true);
          await logic();
          setLoading1(false);
        }}
      >
        Continue
      </Button>
    </>,
    <>
      <Row style={{ flexDirection: "column", alignItems: "self-start" }}>
        <Typography.Title level={4}>
          Enter the code sent to {phone}
        </Typography.Title>
      </Row>
      <Row style={{ flexDirection: "column", alignItems: "center" }}>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          isInputNum={true}
          inputStyle="inputStyle"
          separator={<span>-</span>}
        />
      </Row>
      <div
        style={{
          fontSize: 18,
          fontWeight: "bold",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
        }}
      >
        Expires In:
        <span style={{ marginLeft: 5 }}>
          {" "}
          <EnterOTP onExpire={() => setStep(0)} expiryTimestamp={time} />
        </span>
      </div>
      <Button
        block
        type="primary"
        size="large"
        loading={loading2}
        onClick={async () => {
          if (otp.length < 6) {
            return message.error("Invalid OTP");
          }
          async function logic() {
            const res = await verifyOTP({ authRequestId, otp });
            if (res.error) {
              return message.error(res.error);
            }
            if (res.isNewUser === true) {
              setStep(0);
              return message.error("You need to register first");
            }
            const { bearerToken } = res;
            setRegistrationToken(bearerToken);
            await login({ token: bearerToken });
            toggleAuthModal(false, null);
          }
          setLoading2(true);
          await logic();
          setLoading2(false);
        }}
      >
        Submit
      </Button>
    </>,
  ];
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {steps[step]}
    </Space>
  );
}

export default Login;
