import { ParkingTicket } from './parkingTicket';

export type ParkingLevel = {
    level: number;
    carSpots: ParkingTicket[];
    motorcycleSpots: ParkingTicket[];
    suvSpots: ParkingTicket[];
    [key: string]: any;
};