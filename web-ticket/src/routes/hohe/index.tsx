import { useEffect, useState, useRef, useCallback } from "react";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { isValidPhoneNumber } from "react-phone-number-input";
import { registerAttendant } from "../../utils/http_calls";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import Header from "../../components/global/header";
import "./index.css";
import axios from "axios";
import Header2 from "../../components/global/header2";
const reactScreenshot = require("use-react-screenshot");

type props = {
  phone: string;
  firstName: string;
  lastName: string;
  setPhone: any;
  setFirstName: any;
  setLastName: any;
};

function Hohe() {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);

  const validatePhone = (num: any) => {
    if (!isValidPhoneNumber(num, "ET")) {
      return false;
    }
    if (num.length === 12) return "+" + num;
    if (num.length === 9) return "+251" + num;
  };

  const getUser = async () => {
    let pn = localStorage.getItem("phone");

    if (pn) {
      return axios
        .get(`https://meda.et/api/attendant/hohe/${validatePhone(pn)}`)
        .then((res) => {
          if (res.data.length) {
            setUser(res.data[0]);
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Please wait...</p>
      </div>
    );

  return (
    <>
      <Header2 />
      <div className="container">
        {user.length == 0 ? (
          <SignIn setRegistered={setRegistered} setUser={setUser} />
        ) : (
          <Ticket user={user} setUser={setUser} />
        )}
      </div>
    </>
  );
}

export default Hohe;

const Ticket = ({ user, setUser }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [image, takeScreenshot] = reactScreenshot.useScreenshot();

  const download = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true, quality: 1 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${user.firstName}_${user.lastName}-hohe-meda-ticket`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  return (
    <div className="ticket">
      <div className="ticket-left">
        <CheckCircleTwoTone
          className="check-icon"
          size={70}
          twoToneColor="#1ACA53"
          style={{ fontSize: 60 }}
        />
        <h3 className="registration-complete">Registration Complete!</h3>
        <p className="ticket-left-note">
          You need to download or save the ticket and show when requested at the
          event doors.
        </p>
        <button className="download-ticket-button" onClick={() => download()}>
          Download Ticket
        </button>
        <button
          onClick={() => {
            setUser([]);
            localStorage.removeItem("phone");
          }}
          className="download-ticket-button"
          style={{
            backgroundColor: "transparent",
            color: "#f8812a",
            border: "1px solid #f8812a",
          }}
        >
          Register another person
        </button>
      </div>
      <div className="ticket-padding" ref={ref}>
        <div className="ticket-container">
          <div className="ticket-head">
            <img
              src="/images/hohe-black.png"
              style={{ width: "90px", top: "-20px" }}
              alt=""
            />
            <div className="head-title">
              <h3 className="meda-tickets-lable" style={{ marginTop: "30px" }}>
                Ticket
              </h3>
              <h2 className="ticket-heading">Hohe Awards</h2>
            </div>
          </div>
          <div className="qr-image">
            <QRCode value={user?.id} size={200} bgColor="transparent" />
          </div>
          <div className="line"></div>
          <div className="ticket-info-container">
            <div className="ticket-info-group" style={{ border: "none" }}>
              <p className="ticket-info-label">Name</p>
              <p className="ticket-info-value">{`${user.firstName} ${user.lastName}`}</p>
            </div>
            <div className="ticket-info-group">
              <p className="ticket-info-label">Item</p>
              <p className="ticket-info-value">Hohe Awards Entrance Ticket</p>
            </div>
            <div className="ticket-info-group">
              <p className="ticket-info-label">Location</p>
              <p className="ticket-info-value">Addis Ababa City Hall</p>
            </div>
            <div className="ticket-info-group">
              <p className="ticket-info-label">Type</p>
              <p className="ticket-info-value">Invitaion</p>
            </div>
            <div className="ticket-info-group">
              <p className="ticket-info-label">Time</p>
              <p className="ticket-info-value">
                11:00 - 2:00 (Ethiopian Time) <br />
                5:00 PM - 8:00 PM
              </p>
            </div>

            <div className="ticket-info-group">
              <p className="ticket-info-label">Phone</p>
              <p className="ticket-info-value">{user.phoneNumber}</p>
            </div>
          </div>
          <div className="line"></div>
          <ol style={{fontStyle:"italic"}}>
            <li>Keep this ticket private.</li>
            <li>Do not share or duplicate this ticket.</li>
            <li>The above ticket is valid for only one use.</li>
          </ol>
          <div className="line"></div>
          <p style={{ textAlign: "center", color: "#f8812a" }}>
            Digital Ticket - powered by Meda / 360Ground
          </p>
        </div>
      </div>
    </div>
  );
};

const Registration = ({ setRegistered, setUser }: any) => {
  const [error, setError] = useState({
    errorFor: "",
    errorMessage: "",
  });
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [authRequestId, setAuthRequestId] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(0);

  const sendOtp = async () => {
    const phoneNumber = validateForm(phone);
    if (phoneNumber) {
      setOtp(!otp);
      axios
        .post("https://meda.et/mauth/api/users/auth/otp/request", {
          phoneNumber,
        })
        .then((res) => {
          console.log(res);

          setAuthRequestId(res.data.authRequestId);
          setOtpExpiry(res.data.otpExpiryDate);
        })
        .catch((err) => console.log(err));
    }
  };

  const cleanInputs = () => {
    setPhone("");
    setFirstName("");
    setLastName("");
    setOtp(false);
    setOtpCode("");
    setAuthRequestId("");
    setOtpExpiry(0);
  };

  const handleRegistration = async () => {
    axios
      .post("https://meda.et/mauth/api/users/auth/otp/verify", {
        authRequestId: authRequestId,
        otp: otpCode,
      })
      .then(async (res) => {
        console.log(res);
        const result = await registerAttendant({
          firstName,
          lastName,
          phoneNumber: phone,
        });
        localStorage.setItem("phone", phone);
        if (res.data.isNewUser) {
          axios
            .post("https://meda.et/mauth/api/users/auth/otp/register", {
              authRequestId: authRequestId,
              otp: otpCode,
            })
            .then((res) => {
              cleanInputs();
              setRegistered(true);
            })
            .catch((err) => console.log(err));
        } else {
          setRegistered(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const validateForm = (num: any) => {
    if (!isValidPhoneNumber(num, "ET")) {
      setError({
        errorFor: "phone",
        errorMessage: "Please, enter a valid phone number.",
      });
      return false;
    }
    if (!firstName) {
      setError({
        errorFor: "firstName",
        errorMessage: "Please, enter your name",
      });
      return false;
    }
    if (!lastName) {
      setError({
        errorFor: "lastName",
        errorMessage: "Please, enter your last name",
      });
      return false;
    }
    if (num.length === 12) return "+" + num;
    if (num.length === 9) return "+251" + num;
    console.log(num);
  };

  useEffect(() => {
    setOtp(false);
  }, []);

  return (
    <div className="registration">
      <div className="reg-left">
        <img src="/images/hohe.png" alt="hohe logo" />
        <div className="reg-right-top">
          <h2 className="hohe-title">ሆሄ ሽልማት</h2>
          <p className="event-description">
            የሆሄ የሥነ ጽሑፍ ሽልማት ለ፬ኛ ጊዜ ነሐሴ 30 2014 ዓ.ም. <br /> ከምሽት 11፡00 - 2፡00
            ሰዓት በአዲስ አበባ ከተማ አስተዳደር ማዘጋጃ ቤት ይካሄዳል
          </p>
        </div>
        <button className="more-button">More about event</button>
      </div>

      <div className="right">
        <div className="reg-right-top">
          <h3>መገኘትዎን ያረጋግጡ</h3>
          <p>መገኘትዎን ለማረጋገጥ እና የመግቢያ ትኬትዎን ለማግኘት እባክዎ ከታች ያለውን መረጃ ይሙሉ</p>
        </div>
        <div>
          <div className="reg-phone-input">
            <label htmlFor="phone">Mobile Number</label>
            <div className="custom-input">
              <img src="/images/eth-flag.png" alt="" />
              <span>+251</span>
              <input
                type="number"
                name="phoneNumber"
                id="phone"
                value={phone}
                onChange={(e) => {
                  setError({
                    errorFor: "",
                    errorMessage: "",
                  });
                  setOtp(false);
                  setPhone(e.target.value);
                }}
              />
            </div>
            {error.errorFor === "phone" ? (
              <p className="error-line">{error.errorMessage}</p>
            ) : null}
          </div>
          <div className="reg-personal-info-input">
            <div className="reg-input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                className="reg-input"
                type="text"
                name="firstName"
                placeholder="First Name"
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setError({
                    errorFor: "",
                    errorMessage: "",
                  });
                  setFirstName(e.target.value);
                }}
              />
              {error.errorFor === "firstName" ? (
                <p className="error-line">{error.errorMessage}</p>
              ) : null}
            </div>
            <div className="reg-input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                className="reg-input"
                type="text"
                name="lastName"
                placeholder="Last Name"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setError({
                    errorFor: "",
                    errorMessage: "",
                  });
                  setLastName(e.target.value);
                }}
              />
              {error.errorFor === "lastName" ? (
                <p className="error-line">{error.errorMessage}</p>
              ) : null}
            </div>
            {otp ? (
              <div>
                <div
                  style={{
                    height: "1px",
                    width: "250px",
                    backgroundColor: "black",
                    marginTop: "10px",
                    marginBottom: "10px",
                    display: "flex",
                  }}
                />
                <div className="reg-input-group">
                  <label htmlFor="lastName">
                    Enter the code sent to your number
                  </label>
                  <input
                    className="reg-input"
                    type="text"
                    name="otp"
                    placeholder="Enter the code"
                    id="lastName"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                    }}
                  />
                </div>
                {/* {otpExpiry > 0 ? (
                  <Timer expiry={otpExpiry} resendOtp={sendOtp} />
                ) : null} */}
              </div>
            ) : null}
          </div>
          {!otp ? (
            <button onClick={sendOtp} className="reg-submit-button">
              Send code
            </button>
          ) : (
            <button onClick={handleRegistration} className="reg-submit-button">
              Register
            </button>
          )}
        </div>
        <p style={{ marginTop: "20px" }}>
          Already have a ticket? Please sign in.
        </p>
        <button
          onClick={handleRegistration}
          className="more-button"
          style={{ width: "250px", margin: 0 }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

const SignIn = ({ setRegistered, setUser }: any) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [authRequestId, setAuthRequestId] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formError, setFormError] = useState({ errorFor: "", message: "" });

  const validatePhone = (num: any) => {
    if (!isValidPhoneNumber(num, "ET")) {
      setError("Please, enter a valid phone number.");
      return false;
    }
    if (num.length === 12) return "+" + num;
    if (num.length === 9) return "+251" + num;
  };

  const validateForm = () => {
    if (!firstName)
      return setFormError({
        errorFor: "firstName",
        message: "Please, enter your name",
      });

    if (!lastName)
      return setFormError({
        errorFor: "lastName",
        message: "Please, enter your last name",
      });

    return true;
  };

  const requestOTP = () => {
    const num = validatePhone(phoneNumber);
    if (!num) return;
    axios
      .post("https://meda.et/mauth/api/users/auth/otp/request", {
        phoneNumber: num,
      })
      .then((res) => {
        if (res.data.authRequestId) {
          setAuthRequestId(res.data.authRequestId);
          setOtpExpiry(res.data.otpExpiryDate);
          setCodeSent(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Something went wrong. Try again.");
      });
  };

  const checkUser = async (num: string) => {
    const pn = validatePhone(num);
    return axios
      .get(`https://meda.et/api/attendant/hohe/${pn}`)
      .catch((err) => console.log(err));
  };

  const handleRegistraion = () => {
    if (!validateForm) return;
    let phoneNo = validatePhone(phoneNumber);
    axios
      .post("https://meda.et/api/attendant/register-hohe", {
        firstName,
        lastName,
        phoneNumber: phoneNo,
      })
      .then(async (res) => {
        const user = await checkUser(phoneNumber);
        localStorage.setItem("phone", phoneNumber);
        setUser(user?.data[0]);
      })
      .catch((err) => {
        localStorage.setItem("phone", phoneNumber);
        setUser(err.response.data.attendance[0]);
        console.log(err);
      });
  };

  const handleSignin = () => {
    axios
      .post("https://meda.et/mauth/api/users/auth/otp/verify", {
        otp: code,
        authRequestId,
      })
      .then(async (res) => {
        const user = await checkUser(phoneNumber);
        if (user?.data.length > 0) {
          console.log(user);
          setRegistered(true);
          localStorage.setItem("phone", phoneNumber);
          setUser(user?.data[0]);
        } else {
          setIsNewUser(true);
          setCodeError(true);
        }
      })
      .catch((err) => {
        setCodeError(true);
      });
  };

  return (
    <div className="registration">
      <div className="reg-left">
        <img src="/images/hohe.png" alt="hohe logo" />
        <div className="reg-right-top">
          <h2 className="hohe-title">ሆሄ ሽልማት</h2>
          <p className="event-description">
            የሆሄ የሥነ ጽሑፍ ሽልማት ለ፬ኛ ጊዜ ነሐሴ 30 2014 ዓ.ም. <br /> ከምሽት 11፡00 - 2፡00
            ሰዓት በአዲስ አበባ ከተማ አስተዳደር ማዘጋጃ ቤት ይካሄዳል
          </p>
        </div>
        <button className="more-button">More about event</button>
      </div>

      <div className="right">
        <div className="reg-right-top">
          <h3>መገኘትዎን ያረጋግጡ</h3>
          <p>መገኘትዎን ለማረጋገጥ እና የመግቢያ ትኬትዎን ለማግኘት እባክዎ ከታች ያለውን መረጃ ይሙሉ</p>
        </div>
        {!isNewUser ? (
          <div>
            <div className="reg-phone-input">
              <label htmlFor="phone">Mobile Number</label>
              <div className="custom-input">
                <img src="/images/eth-flag.png" alt="" />

                <span>+251</span>
                <input
                  type="number"
                  name="phoneNumber"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => {
                    setError("");
                    setCodeSent(false);
                    setPhoneNumber(e.target.value);
                  }}
                />
              </div>
              {error ? <p className="error-line">{error}</p> : null}
            </div>
            {codeSent ? (
              <div>
                <div className="reg-input-group">
                  <label htmlFor="lastName">
                    Enter the code sent to your number
                  </label>
                  <input
                    className="reg-input"
                    type="text"
                    name="otp"
                    placeholder="Enter the code"
                    id="lastName"
                    value={code}
                    onChange={(e) => {
                      setCodeError(false);
                      setCode(e.target.value);
                    }}
                  />
                  {codeError ? (
                    <p className="error-line">Wrong / Expired - Code</p>
                  ) : null}
                </div>

                {/* {otpExpiry > 0 ? (
                  <Timer expiry={otpExpiry} resendOtp={requestOTP} />
                ) : null} */}
              </div>
            ) : null}

            {!codeSent ? (
              <button onClick={requestOTP} className="reg-submit-button">
                Verify Phone
              </button>
            ) : (
              <button onClick={handleSignin} className="reg-submit-button">
                Sign in
              </button>
            )}
          </div>
        ) : (
          <div className="reg-personal-info-input">
            <div className="reg-input-group">
              <label htmlFor="">Phone Number: {phoneNumber}</label>
              <label htmlFor="firstName">First Name</label>
              <input
                className="reg-input"
                type="text"
                name="firstName"
                placeholder="First Name"
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setFormError({
                    errorFor: "",
                    message: "",
                  });
                  setFirstName(e.target.value);
                }}
              />
              {formError.errorFor === "firstName" ? (
                <p className="error-line">{formError.message}</p>
              ) : null}
            </div>
            <div className="reg-input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                className="reg-input"
                type="text"
                name="lastName"
                placeholder="Last Name"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setFormError({
                    errorFor: "",
                    message: "",
                  });
                  setLastName(e.target.value);
                }}
              />
              {formError.errorFor === "lastName" ? (
                <p className="error-line">{formError.message}</p>
              ) : null}
            </div>
            <button
              onClick={handleRegistraion}
              className="more-button"
              style={{ width: "250px", margin: 0, marginTop: "20px" }}
            >
              Register
            </button>
          </div>
        )}

        {/* <p style={{ marginTop: "20px" }}>
          Already have a ticket? Please sign in.
        </p> */}
      </div>
    </div>
  );
};

const Timer = ({ expiry, resendOtp }: any) => {
  const [timerDays, setTimerDays] = useState(0);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);

  let interval: any;

  const startTimer = () => {
    const countDownDate = new Date("May 30,2025").getTime();

    interval = setInterval(() => {
      const now = new Date().getTime();

      const distance = expiry - now;

      // const days = Math.floor(distance / (24 * 60 * 60 * 1000));
      // const hours = Math.floor(
      //   (distance % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
      // );
      // const minutes = Math.floor((distance % (60 * 60 * 1000)) / (1000 * 60));
      const seconds = Math.floor((distance % (60 * 1000)) / 1000);

      if (expiry < new Date().getTime()) {
        // Stop Timer
        clearInterval(interval.current);
      } else {
        // Update Timer
        // setTimerDays(days);
        // setTimerHours(hours);
        // setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    });
  };
  useEffect(() => {
    startTimer();
  });
  return (
    <button
      onClick={() => {
        if (timerSeconds === 0) {
          resendOtp();
        }
      }}
      className={timerSeconds > 0 ? "otp-button-disabled" : "otp-button"}
      style={{ margin: "auto", width: "100%" }}
      disabled={timerSeconds > 0}
    >
      Resend {timerSeconds > 0 ? timerSeconds : ""}
    </button>
  );
};
