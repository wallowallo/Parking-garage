"use client";
import React from 'react';
import VehicleComponent from './Vehicle';
import { ParkingTicket } from '../models/parkingTicket';

interface ParkingLevelProps {
    level: number;
    carSpots: ParkingTicket[];
    motorcycleSpots: ParkingTicket[];
    suvSpots: ParkingTicket[];
    endParking: (parkingTicket: ParkingTicket) => void;
}

const ParkingLevelComponent: React.FC<ParkingLevelProps> = ({
    level,
    carSpots,
    motorcycleSpots,
    suvSpots,
    endParking
}) => {
    const availableCarSpots = carSpots.filter((car) => car.timeParked === null).length;
    const availavleMotorcycleSpots = motorcycleSpots.filter((motorcycle) => motorcycle.timeParked === null).length;
    const availavleSuvSpots = suvSpots.filter((suv) => suv.timeParked === null).length;
    return (
        <>
            <div className='flex flex-col gap-4'>
                <h2 className='text-xl underline'>Parking Level {level}</h2>
                
                <div className='flex flex-row gap-2'>
                    <p>Car Spots: {availableCarSpots}</p>
                    <p>Motorcycle Spots: {availavleMotorcycleSpots}</p>
                    <p>SUV Spots: {availavleSuvSpots}</p>
                </div>
            </div>
            
            <div className='flex gap-3 flex-col w-full h-80'>
                <div className='flex gap-3 flex-row w-full h-40'>
                    {carSpots.map((car, index) =>
                        <VehicleComponent endParking={endParking} vehicle={car.vehicle} level={car.level} spotNumber={car.spotNumber} timeParked={car.timeParked} parkingEnded={car.parkingEnded} id={car.id} key={index} />
                    )}
                </div>

                <div className='flex gap-3 flex-row w-full h-40'>
                    {motorcycleSpots.map((motorcycle, index) => 
                        <VehicleComponent endParking={endParking}  vehicle={motorcycle.vehicle} level={motorcycle.level} spotNumber={motorcycle.spotNumber} timeParked={motorcycle.timeParked} parkingEnded={motorcycle.parkingEnded} id={motorcycle.id} key={index} />
                    )}
                </div>

                <div className='flex gap-3 flex-row w-full h-40'>
                    {suvSpots.map((suv, index) => 
                        <VehicleComponent endParking={endParking} vehicle={suv.vehicle} level={suv.level} spotNumber={suv.spotNumber} timeParked={suv.timeParked} parkingEnded={suv.parkingEnded} id={suv.id} key={index} />
                    )}
                </div>
            </div>
            
        </>
    );
};

export default ParkingLevelComponent;