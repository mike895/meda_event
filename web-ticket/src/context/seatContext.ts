import React from "react";

export const SeatSelectionContext = React.createContext({
    toggleSelect:(seat:any):boolean|any=>{
    },
    isSeatSelected:(seat:any):boolean|any=>{
    },
    selectedSeats:[],
    regularTicketPrice:0,
    // vipTicketPrice:0,
    totalPrice:0
})
export const SeatSelectionProvider = SeatSelectionContext.Provider;