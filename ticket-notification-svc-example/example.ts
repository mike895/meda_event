import io from "socket.io-client";
const socket = io("http://165.227.142.142/ticket-notification", {
  path: "/w-socket/",
  auth: {
    token: `${"USDHFSHUFEWORECEWEC1RE571xx7sadasuidhsa"}`,
  },
});
socket.on("connect", () => {
  console.log("On connect @" + socket.id);
  // "G5p5..."
});
socket.on("request client meta", (data, cb) => {
  console.log("[ Client meta was requested]");
});
socket.on("connection rejected", (message) => {
  console.log(`Connection rejected reason [${message}]`);
  socket.disconnect();
});

socket.io.on("reconnect_attempt", (attempt) => {
  console.log(`attempt ${attempt}`);
});
socket.io.on("error", (error) => {
  console.log(error);
  console.log("error connecting...");
});
socket.io.on("reconnect", (attempt) => {
  console.log("Yay reconnected.");
});
socket.on("disconnect", function (reason) {
  console.log(`Managed to disconnect`);
  console.log(`reason => ${reason}`);
});
socket.on("onTicketPaymentComplete", async (ticketInfo:any) => {
    console.log("TicketInfo");
    console.log(ticketInfo)
})
// Socket client example