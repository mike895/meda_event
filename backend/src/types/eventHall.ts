export interface Seat {
    seatName: string;
}
export interface EventHallColumn {
    columnName: string;
    seats: Array<Seat>;
    columnOrder: number;
    columnType: 'PADDING' | 'SEATMAP';
}