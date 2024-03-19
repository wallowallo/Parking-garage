import React from 'react';
import { Vehicle } from '../models/vehicle';
import VehicleComponent from './Vehicle';

interface ParkingQueueProps {
    vehicles: Vehicle[];
}

const ParkingQueue: React.FC<ParkingQueueProps> = ({vehicles}) => {
    return (
        <div>
            {vehicles.length === 0 && <h1>No vehicles in queue</h1>}
            {vehicles.length > 0 && 
            <>
            <h1>Vehicles in queue</h1>
            <div className='flex flex-row gap-2'>
                {vehicles.map((vehicle, index) => 
                    <VehicleComponent endParking={() => {}} vehicle={vehicle} level={0} spotNumber={0} timeParked={null} parkingEnded={null} id={0} key={index} />
                )}
            </div>
            </>
            }
        </div>
    );
};

export default ParkingQueue;