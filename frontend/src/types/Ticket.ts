// Generated by https://quicktype.io

export interface Ticket {
    movieTicketId:         string;
    seatId:                string;
    ticketKey:             string;
    ticketStatus:          string;
    redeemdAt:             string;
    ticketValidatorUserId: string;
    receiptStatus:         string;
    fsNumber:              null;
    redeemdBy:             RedeemdBy;
    seat:                  Seat;
    movieTicket:           MovieTicket;
}

export interface MovieTicket {
    id:              string;
    createdAt:       string;
    medaUserId:      string;
    showTimeId:      string;
    transactionId:   string;
    referenceNumber: null | string;
    amount:          number;
    showTime:        ShowTime;
}

export interface ShowTime {
    id:                    string;
    time:                  string;
    movieType:             string;
    cinemaHallId:          string;
    cinemaMovieScheduleId: string;
    cinemaHall:            CinemaHall;
    CinemaMovieSchedule:   CinemaMovieSchedule;
}

export interface CinemaMovieSchedule {
    id:                 string;
    date:               string;
    movieId:            string;
    regularTicketPrice: number;
    vipTicketPrice:     number;
    movie:              Movie;
}

export interface Movie {
    title: string;
}

export interface CinemaHall {
    id:   string;
    name: string;
}

export interface RedeemdBy {
    id:        string;
    firstName: string;
    lastName:  string;
}

export interface Seat {
    id:           string;
    seatName:     string;
    seatColumnId: string;
    seatType:     string;
}
