// TODO BIG - Catch timeouts and 404's
import Cookies from "js-cookie";
import config from "../config"

let baseUrl: string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  baseUrl = config.MEDA_URL
} else {
  baseUrl = ""
}
export const loginUser = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/auth/login-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}

export const getCurrentUser = async () => {
  const res = await fetch(`${baseUrl}/api/auth/current-user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}

//!

export const registerTicketRedeemer = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/admin/register-ticket-redeemer-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}
export const resetPassword = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/admin/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 200) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}

export const getAllTicketRedeemerUsers = async () => {
  const res = await fetch(`${baseUrl}/api/admin/ticket-redeemer-user/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}
export const getTicketRedeemerUser = async (id: string) => {
  const res = await fetch(`${baseUrl}/api/admin/ticket-redeemer-user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}
export const updateTicketRedeemer = async (id: string, data: any) => {
  const res = await fetch(`${baseUrl}/api/admin/ticket-redeemer-user/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}

export const registerUser = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/admin/register-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}

export const getAllUsers = async () => {
  const res = await fetch(`${baseUrl}/api/admin/user/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}

export const getUser = async (id: string) => {
  const res = await fetch(`${baseUrl}/api/admin/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }
}

export const updateUser = async (id: string, data: any) => {
  const res = await fetch(`${baseUrl}/api/admin/user/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }
}

export const getAllRoles = async () => {
  const res = await fetch(`${baseUrl}/api/admin/roles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }
}


export const updateMovie = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/event/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}

export const addMovie = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/event/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  } else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." };
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};

// export const getMovie = async (data: any) => {
//   const res = await fetch(`${baseUrl}/api/event/searche/${data}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       "Authorization": Cookies.get("jwt_auth") || ""
//     },
//     body: JSON.stringify(data),
//   });
//   if (res.status == 201) {
//     return await res.json();
//   }
//   else if (res.status == 400) {
//     return { error: "Please make sure you've filled all the required values." }
//   }
//   else {
//     let json = await res.json();
//     if (json.error) {
//       return { error: json.error };
//     }
//     return { error: "Internal server error." }
//   }

// }

export const searchMovie = async (title: string) => {
  const res = await fetch(`${baseUrl}/api/event/search/${title}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};

export const searchEvent = async (id: string) => {
  const res = await fetch(`${baseUrl}/api/event/search2/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};

export const updateEvent = async (id: string, data: any) => {
  const res = await fetch(`${baseUrl}/api/event/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  } else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." };
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};

export const getAllMovies = async () => {
  const res = await fetch(`${baseUrl}/api/event/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};
export const addCinemaHall = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/venue/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  } else if (res.status == 400) {
    return {
      error: "Couldn't create cinema hall, Data not formatted properly.",
    };
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};
export const getAllCinemaHalls = async () => {
  const res = await fetch(`${baseUrl}/api/venue/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};
export const getCinemaHall = async (id: string) => {
  const res = await fetch(`${baseUrl}/api/venue/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};
export const addMovieSchedule = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/event-schedule/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  } else if (res.status == 400) {
    return { error: "Couldn't create schedule, Data not formatted properly." };
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};
export const getAllMovieSchedules = async () => {
  const res = await fetch(`${baseUrl}/api/event-schedule/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};
export const getAllRedeemerUsers = async () => {
  const res = await fetch(`${baseUrl}/api/redeemer-users/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};
export const getSalesReport = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/ticket/sales-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("jwt_auth") || "",
    },
    body: JSON.stringify(data),
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." };
  }
};
export const getAllTickets = async () => {
  const res = await fetch(`${baseUrl}/api/ticket/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }
}
export const getSeatTicketIssueInfoByKey = async (id: string) => {
  const res = await fetch(`${baseUrl}/api/ticket/finance/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}
export const issueReceipt = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/ticket/issue-receipt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 200) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Data not formatted properly." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }
}

export const getScheduleById = async (id: string) => {
  const res = await fetch(`${baseUrl}/api/event-schedule/schedule/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }
}



export const deleteScheduleShowTimeById = async (id: string) => {
  const res = await fetch(`${baseUrl}/api/event-schedule/schedule/showtime/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }
}

export const updateScheduleShowtimeById = async (id: string, data: any) => {
  const res = await fetch(`${baseUrl}/api/event-schedule/schedule/showtime/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}

export const addShowtimeToSchedule = async (id: string, data: any) => {
  const res = await fetch(`${baseUrl}/api/event-schedule/schedule/${id}/add-showtime`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}






/////////////////////////////////////////////////////////



export const deleteScheduleSpeakerById = async (id: string) => {
  const res = await fetch(`${baseUrl}/api/event-schedule/schedule/speaker/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
  });
  if (res.status == 200) {
    return await res.json();
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }
}

export const updateScheduleSpeakerById = async (id: string, data: any) => {
  const res = await fetch(`${baseUrl}/api/event-schedule/schedule/speaker/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}

export const addSpeakerToSchedule = async (id: string, data: any) => {
  const res = await fetch(`${baseUrl}/api/event-schedule/schedule/${id}/add-speaker`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": Cookies.get("jwt_auth") || ""
    },
    body: JSON.stringify(data),
  });
  if (res.status == 201) {
    return await res.json();
  }
  else if (res.status == 400) {
    return { error: "Please make sure you've filled all the required values." }
  }
  else {
    let json = await res.json();
    if (json.error) {
      return { error: json.error };
    }
    return { error: "Internal server error." }
  }

}



