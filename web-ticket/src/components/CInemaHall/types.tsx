interface Seat {
  seatName: string;
  }
export interface CinemaHallColumn{
    columnName: string;
    seats: Array<Seat>;
    columnOrder: number;
    columnType: "PADDING" | "SEATMAP";
  }

export interface CinemaHall {
    id:           string;
    name:         string;
    regularSeats: CinemaHallColumnFromDatabase[];
    vipSeats:     CinemaHallColumnFromDatabase[];
}

export interface CinemaHallColumnFromDatabase {
    id:                  string;
    columnName:          string;
    columnOrder:         number;
    columnType:          "PADDING" | "SEATMAP";
    // cinemaHallVipId:     null | string;
    // cinemaHallRegularId: null | string;
    seats:               SeatElement[];
}

export interface SeatElement {
    id:           string;
    seatName:     string;
    // seatColumnId: string;
}