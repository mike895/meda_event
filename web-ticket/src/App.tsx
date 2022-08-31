import "./App.less";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./routes/Landing";
import ChooseShowtime from "./routes/ChooseShowtime";
import ChooseSeat from "./routes/ChooseSeat";
import Bot from "./routes/bot";
import { AuthProvider } from "./context/authContext";
import AuthModal from "./components/auth/authModal";
import Tickets from "./routes/Tickets";
import Custom404 from "./routes/404";
import MyTickets from "./routes/myTickets";
import Hohe from "./routes/hohe";

function App() {
  return (
    <AuthProvider>
      <AuthModal />
      <BrowserRouter basename="/">
        <Routes>
          <Route path="*" element={<Custom404 />} />
          <Route path="/" element={<Landing />}></Route>
          <Route path="/schedule/:id" element={<ChooseShowtime />}></Route>
          <Route
            path="/bot/:chatid/:scheduleId/:showTimeId/:token"
            element={<Bot />}
          ></Route>
          <Route path="/hohe" element={<Hohe />}></Route>
          <Route
            path="/schedule/:id/showtime/:st"
            element={<ChooseSeat />}
          ></Route>
          <Route path="/tickets/:id" element={<Tickets />}></Route>
          <Route path="/my-tickets" element={<MyTickets />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
