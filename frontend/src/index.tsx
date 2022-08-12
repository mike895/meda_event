import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./app/store";
import { getCurrentUserThunk } from "./features/userSlice";
import Cookies from "js-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import UnauthorizedRoute from "./routes/UnauthorizedRoute";
import RoleCheck from "./Components/Auth/RoleCheck";
import Dashboard from "./Components/Admin/Dashboard";
import Admin from "./routes/Admin";
import UnknownRouteError from "./Components/global/UnknownRouteError";
// import 'antd/dist/antd.css';
import "antd/dist/antd.min.css";
import ManageTicketRedeemer from "./routes/TicketRedeemer/ManageTicketRedeemer";
import RegisterUser from "./routes/User/RegisterUser";
import ManageUser from "./routes/User/ManageUser";
import RegisterTicketRedeemerUser from "./routes/TicketRedeemer/RegisterTicketRedeemer";
import AddMovie from "./routes/Movies/AddMovie";
import Login from "./routes/Auth/Login";
import ManageMovies from "./routes/Movies/ManageMovies";
import CinemaHallsAdd from "./routes/CinemaHalls/AddCinemaHall";
import CinemaHallsManage from "./routes/CinemaHalls/ManageCinemaHalls";
import AddMovieSchedule from "./routes/MovieSchedule/AddMovieSchedule";
import ManageMovieSchedules from "./routes/MovieSchedule/ManageMovieSchedule";
import SalesReport from "./routes/SalesReport/SalesReport";
import Roles from "./helpers/roles";
import Finance from "./routes/Finance/index";
import TicketsList from "./routes/TicketsList/TicketsList";
const AuthWrapperHOC = ({ children }: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("initial mount ran!");
    dispatch(getCurrentUserThunk());
  }, []);

  return { ...children };
};
ReactDOM.render(
  <Provider store={store}>
    <AuthWrapperHOC>
      <BrowserRouter basename="/backend">
        <Routes>
          {<Route path="/" element={<Login />}></Route>}
          <Route path="/auth/login" element={<Login />}></Route>
          <Route element={<RoleCheck role={Roles.Admin} />} path={"/"}>
            <Route path="protected-route" element={<ProtectedRoute />}></Route>
          </Route>

          <Route element={<RoleCheck role={Roles.Finanace} />} path={"/"}>
            <Route element={<Finance />} path={"/finance"}>
              <Route path="" element={<></>}></Route>
              <Route path="tickets" element={<TicketsList />}></Route>
              <Route path="sales-report" element={<SalesReport />}></Route>
            </Route>
          </Route>

          <Route element={<RoleCheck role={Roles.Admin} />} path={"/"}>
            <Route element={<Admin />} path={"/admin"}>
              <Route path="dashboard" element={<Dashboard />}></Route>
              <Route
                path="ticket-redeemer/register"
                element={<RegisterTicketRedeemerUser />}
              ></Route>
              <Route
                path="ticket-redeemer/manage"
                element={<ManageTicketRedeemer />}
              ></Route>

              <Route path="user/register" element={<RegisterUser />}></Route>
              <Route path="user/manage" element={<ManageUser />}></Route>

              <Route path="events/add" element={<AddMovie />}></Route>

              <Route path="events/manage" element={<ManageMovies />}></Route>
              <Route
                path="venues/add"
                element={<CinemaHallsAdd />}
              ></Route>
              <Route
                path="venues/manage"
                element={<CinemaHallsManage />}
              ></Route>
              <Route
                path="schedules/add"
                element={<AddMovieSchedule />}
              ></Route>
              <Route
                path="schedules/manage"
                element={<ManageMovieSchedules />}
              ></Route>
              <Route path="sales-report" element={<SalesReport />}></Route>
              <Route path="*" element={<UnknownRouteError />} />
            </Route>
          </Route>

          <Route path="unauthorized" element={<UnauthorizedRoute />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>404</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthWrapperHOC>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
