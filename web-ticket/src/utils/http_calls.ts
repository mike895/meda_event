import Cookies from "js-cookie";
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
      console.log("====================================");
      console.log(e);
      console.log("====================================");
      return { error: "Error connecting." };
    });
  if (res.error) {
    return { error: res.error };
  }
  return res;
};
