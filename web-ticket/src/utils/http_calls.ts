import Cookies from "js-cookie";
import axios from "axios";
export const baseUrl = process.env.REACT_APP_BASE_URL_BACKEND;

export const getMovieSchedules = async () => {
  const res = await fetch(`${baseUrl}/api/event-schedule/schedules-preview`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": Cookies.get("jwt_auth") || ""
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};

export const getScheduleById = async (id: any) => {
  const res = await fetch(`${baseUrl}/api/event-schedule/schedule/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};
export const getShowtimeWithHallById = async (id: any) => {
  const res = await fetch(
    `${baseUrl}/api/event-schedule/schedule/showtime/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};

export const buyTicket = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/ticket/create-ticket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((e) => {
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};

export const getTicketById = async (id: any) => {
  const res = await fetch(`${baseUrl}/api/ticket/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};

export const getBuyHistory = async () => {
  const res = await fetch(`${baseUrl}/api/ticket/buy-history`, {
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

// New

export const registerAttendant = async (formData: object) => {
  const res = axios(`${baseUrl}/api/attendant/register-hohe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: Cookies.get("jwt_auth") || "",
    },
    data: JSON.stringify({
      firstName: "asldjlajsdlajsd",
      lastName: "firstName",
      phoneNumber: "+251946393208",
    }),
  })
    .then((res) => console.log(res))
    .catch((err) => {
      console.log(err);
      return new Error(err);
    });
  return res;
};
