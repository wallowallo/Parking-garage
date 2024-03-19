import React from "react";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { ParkingTicket } from "../models/parkingTicket";
import { Vehicle } from "../models/vehicle";
import { AirportShuttle, TwoWheeler } from "@mui/icons-material";
interface VehicleProps {
    vehicle: Vehicle;
    level: number;
    spotNumber: number;
    timeParked: Date | null;
    parkingEnded: Date | null;
    id: number;
    endParking: (parkingTicket: ParkingTicket) => void;
}

const VehicleComponent: React.FC<VehicleProps> = ({ vehicle, id, level, parkingEnded, spotNumber, timeParked, endParking }) => {
    const isParked = timeParked !== null;
    const showInfo = false;
    const iconColor = isParked ? 'text-red-500' : 'text-green-500';
    const parkingTicket = {
        vehicle,
        spotNumber,
        level,
        timeParked,
        parkingEnded,
        id
    }

    return (
        <>
        <div className="flex flex-col items-center gap-1">
            
            {timeParked && (
                <button onClick={() => endParking(parkingTicket)} className="bg-blue-500 text-white p-1 rounded-md">End parking</button>
            )}

            {vehicle.type === 'car' && (
                <DirectionsCarIcon className={iconColor} />
            )}
            {vehicle.type === 'motorcycle' && (
                <TwoWheeler className={iconColor} />
            )}
            {vehicle.type === 'suv' && (
                <AirportShuttle className={iconColor} />
            )}

            {showInfo && (
                <>
                    {vehicle.model && (
                        <>    
                            <h2>{vehicle.make} {vehicle.model}</h2>
                            <p>Year: {vehicle.year}</p>
                            <p>Color: {vehicle.color}</p>
                        </>
                    )}
                    {!vehicle.model && (
                        <h2>Available</h2>
                    )}
                    { timeParked && (
                        <>
                            <p>Level: {level}</p>
                            <p>Spot Number: {spotNumber}</p>
                            <p>Time Parked: {timeParked.toString()}</p>
                        </>
                    )}
                </>
            )}

            {!showInfo && (
                <>
                    <h4>{vehicle.make}</h4>
                    {!vehicle.model && (
                        <h2>Available</h2>
                    )}
                </>
            )}
        </div>
        </>
    );
};

export default VehicleComponent;