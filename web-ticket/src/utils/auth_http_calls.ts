import Cookies from "js-cookie";
const baseUrl = process.env.REACT_APP_BASE_URL_AUTH_MICROSERVICE;

export const getCurrentUser = async () => {
  const res = await fetch(`${baseUrl}/api/users/auth/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};

export const getBotUser = async (token: any) => {
  if (!token) return null;
  const res = await fetch(`${baseUrl}/api/users/auth/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + token || "",
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log("errrrrrrrrrrrr: ", e);
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  console.log(res);
  return res;
};

export const requestOTP = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/users/auth/otp/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};

export const verifyOTP = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/users/auth/otp/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};

export const registerUser = async (data: any, token: string) => {
  const res = await fetch(`${baseUrl}/api/users/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};
