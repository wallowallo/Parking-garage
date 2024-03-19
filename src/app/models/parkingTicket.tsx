import { Vehicle } from './vehicle';

export type ParkingTicket = {
    vehicle: Vehicle;
    spotNumber: number;
    level: number;
    timeParked: Date | null;
    parkingEnded: Date | null;
    id: number;
};