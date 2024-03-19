"use client";
import ParkingLevelComponent from './components/ParkingLevel';
import React, { useCallback, useEffect, useState } from 'react';
import data from './data/vehicles-data.json';
import { Vehicle } from './models/vehicle';
import { ParkingTicket } from './models/parkingTicket';
import { ParkingHouse } from './models/parkingHouse';
import ParkingQueue from './components/ParkingQueue';

export default function Home() {
  const cars: Vehicle[] = data.cars;
  const motorcycles: Vehicle[] = data.motorcycles;
  const suvs: Vehicle[] = data.suvs;
  const [vehiclesParked, setVehiclesParked] = useState<ParkingTicket[]>([]);

  const createEmptyParkingTicket = (level: number, index: number, type: string): ParkingTicket => {
    const parkingTicket = {
      vehicle: { type, make: '', model: '', year: 0, color: '' },
      spotNumber: index + 1,
      level,
      timeParked: null,
      parkingEnded: null,
      id: 0
    }
    return parkingTicket;
  }

  const createInitParkingSpots = (level: number, type: string, length: number): ParkingTicket[] =>
    Array.from({ length }).map((_, index) => createEmptyParkingTicket(level, index, type));

  const [carSpotsAvailableLevel1, setCarSpotsAvailableLevel1] = React.useState<ParkingTicket[]>(createInitParkingSpots(1, 'car', 10));
  const [motorcycleSpotsAvailableLevel1, setMotorcycleSpotsAvailableLevel1] = React.useState<ParkingTicket[]>(createInitParkingSpots(1, 'motorcycle', 10));
  const [suvSpotsAvailableLevel1, setSuvSpotsAvailableLevel1] = React.useState<ParkingTicket[]>(createInitParkingSpots(1, 'suv', 10));

  const [carSpotsAvailableLevel2, setCarSpotsAvailableLevel2] = React.useState<ParkingTicket[]>(createInitParkingSpots(2, 'car', 10));
  const [motorcycleSpotsAvailableLevel2, setMotorcycleSpotsAvailableLevel2] = React.useState<ParkingTicket[]>(createInitParkingSpots(2, 'motorcycle', 10));
  const [suvSpotsAvailableLevel2, setSuvSpotsAvailableLevel2] = React.useState<ParkingTicket[]>(createInitParkingSpots(2, 'suv', 10));

  const [carSpotsAvailableLevel3, setCarSpotsAvailableLevel3] = React.useState<ParkingTicket[]>(createInitParkingSpots(3, 'car', 10));
  const [motorcycleSpotsAvailableLevel3, setMotorcycleSpotsAvailableLevel3] = React.useState<ParkingTicket[]>(createInitParkingSpots(3, 'motorcycle', 10));
  const [suvSpotsAvailableLevel3, setSuvSpotsAvailableLevel3] = React.useState<ParkingTicket[]>(createInitParkingSpots(3, 'suv', 10));
  const [earnings, setEarnings] = useState<number[]>([]);
  const [id, setId] = useState<number>(0);

  const [parkingHouse, setParkingHouse] = useState<ParkingHouse>({
    levels: [
      {
        level: 1,
        carSpots: carSpotsAvailableLevel1,
        motorcycleSpots: motorcycleSpotsAvailableLevel1,
        suvSpots: suvSpotsAvailableLevel1
      },
      {
        level: 2,
        carSpots: carSpotsAvailableLevel2,
        motorcycleSpots: motorcycleSpotsAvailableLevel2,
        suvSpots: suvSpotsAvailableLevel2
      },
      {
        level: 3,
        carSpots: carSpotsAvailableLevel3,
        motorcycleSpots: motorcycleSpotsAvailableLevel3,
        suvSpots: suvSpotsAvailableLevel3
      }
    ]
  });

  const startNewQueue = () => {
    const newQueue = [...cars, ...motorcycles, ...suvs];
    return newQueue;
  }
  const [parkingQueueLine, setParkingQeueLine] = useState<Vehicle[]>(startNewQueue());


  const createParkingTicket = (vehicle: Vehicle, level: number, spotNumber: number, id: number): ParkingTicket => {
    const parkingTicket = {
      vehicle,
      spotNumber,
      level,
      timeParked: new Date(),
      parkingEnded: null,
      id: id
    }
    return parkingTicket;
  }

  const calculateEarnings = (numberArray: number[]): number => {
    const earnings = numberArray.reduce((acc, cur) => acc + cur, 0);
    return earnings;
  }

  const availableSpots = useCallback((type: string): ParkingTicket[] => {
    const availableSpots: ParkingTicket[] = parkingHouse.levels
      .map((level) => level[type])
      .flatMap((vehicles) => vehicles.filter((vehicle: ParkingTicket) => vehicle.timeParked === null));
    return availableSpots;
  }, [parkingHouse.levels]);

  const parkingEnded = (parkingTicket: ParkingTicket): void => {
    parkingTicket.parkingEnded = new Date();
    findParkedCarAndRemove(parkingTicket);
    setEarnings([...earnings, calculatePriceToPay(parkingTicket)]);
  }

  const findParkedCarAndRemove = (parkingTicket: ParkingTicket) => {
    const spotType = parkingTicket.vehicle.type + 'Spots';
    const arrayToSearch = parkingHouse.levels[parkingTicket.level - 1][spotType];
    const index = arrayToSearch.findIndex((vehicle: ParkingTicket) => vehicle.id === parkingTicket.id);
    const newArray = arrayToSearch.toSpliced(index, 1, createEmptyParkingTicket(parkingTicket.level, index, parkingTicket.vehicle.type));
    const newParkingLevel = { ...parkingHouse.levels[parkingTicket.level - 1], [spotType]: newArray };
    const newParkingHouse = { levels: parkingHouse.levels.toSpliced(parkingTicket.level - 1, 1, newParkingLevel) };
    setParkingHouse(newParkingHouse);
  }

  const calculatePriceToPay = (parkingTicket: ParkingTicket): number => {
    const timeParked = parkingTicket.timeParked;
    const timeEnded = parkingTicket.parkingEnded;

    if (timeEnded && timeParked) {
      const timeParkedInHours = (Number(timeEnded) - Number(timeParked)) / 1000 / 60 / 60;

      const priceFirstHour = 50;
      const priceSecondAndThirdHour = 30;
      const priceAfterThirdHour = 10;

      let toPay = 0;
      if (timeParkedInHours <= 1) {
        toPay = priceFirstHour;
      } else if (timeParkedInHours > 1 && timeParkedInHours <= 3) {
        toPay = priceFirstHour + (priceSecondAndThirdHour * (timeParkedInHours - 1));
      } else {
        toPay = priceFirstHour + (priceSecondAndThirdHour * 2) + (priceAfterThirdHour * (timeParkedInHours - 3));
      }
      return toPay;
    }
    return 0;
  }

  useEffect(() => {
    const parkVehicles = (parkingTicket: ParkingTicket, vehicleArray:ParkingTicket[]) => {
        const parkedVehicles = [...vehicleArray, parkingTicket];
        setVehiclesParked(parkedVehicles);
    }
    
    const findAvailableSpot = (array: ParkingTicket[]) => {
      const availableSpot: ParkingTicket | undefined = array.find((vehicle) => vehicle.timeParked === null);
      return availableSpot;
    }

    const parkVehicle = (vehicle: Vehicle, vehiclesParkedArray: ParkingTicket[]) => {
      const spotType = vehicle.type + 'Spots';

      const availableSpot: ParkingTicket | undefined = findAvailableSpot(availableSpots(spotType));

      
      if (availableSpot) {
        const uid = id + 1;
        setId(uid);
        const levelIndex = availableSpot.level - 1;
        const spotIndex = availableSpot.spotNumber - 1;
        const parkingTicket = createParkingTicket(
          vehicle,
          availableSpot.level,
          availableSpot.spotNumber,
          id
        );

        const newArray = parkingHouse.levels[levelIndex][spotType].toSpliced(
          spotIndex,
          1,
          parkingTicket
        );

        const newParkingLevel = { ...parkingHouse.levels[levelIndex], [spotType]: newArray };
        const newParkingHouse = { levels: parkingHouse.levels.toSpliced(levelIndex, 1, newParkingLevel) };
        setParkingHouse(newParkingHouse);

        parkVehicles(parkingTicket, vehiclesParkedArray);
      } else {
        console.log('No more spots for ', vehicle.type + 's, please wait for one to be available.');
      }
    }

    const parkCar = (car: Vehicle) => {
      const carArray = vehiclesParked.filter((parkingTicket) => parkingTicket.vehicle.type === 'car');
      parkVehicle(car, carArray);
    }

    const parkMotorcycle = (motorcycle: Vehicle) => {
      const motorcycleArray = vehiclesParked.filter((parkingTicket) => parkingTicket.vehicle.type === 'motorcycle');
      parkVehicle(motorcycle, motorcycleArray);
    }

    const parkSuv = (suv: Vehicle) => {
      const suvArray = vehiclesParked.filter((parkingTicket) => parkingTicket.vehicle.type === 'suv');
      parkVehicle(suv, suvArray);
    }


    const interval: NodeJS.Timeout = setInterval(() => {
      if (parkingQueueLine.length === 0) {
        return clearInterval(interval);
      }
      const vehicle = parkingQueueLine[0];
      const vehicleToPark = parkingQueueLine.toSpliced(0, 1);
      setParkingQeueLine(vehicleToPark);
      if (vehicle.type === 'car') {
        parkCar(vehicle);
      } else if (vehicle.type === 'motorcycle') {
        parkMotorcycle(vehicle);
      } else if (vehicle.type === 'suv') {
        parkSuv(vehicle);
      }
    }
    , 100);
    
    return () => clearInterval(interval);

  }
  , [vehiclesParked, parkingHouse.levels, cars, motorcycles, suvs, parkingHouse, parkingQueueLine, availableSpots, id]);


  return (
    <>
    <div className='w-full h-full'>
      <div className='mb-10 p-5'>
        <h1 className='mb-10 text-2xl'>City Parking Lot</h1>
          
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col gap-2'>
            <h2>Available Parking spots</h2>
            <h3>Car spots: {availableSpots('carSpots').length}</h3>
            <h3>Motorcycle spots: {availableSpots('motorcycleSpots').length}</h3>
            <h3>Suv spots: {availableSpots('suvSpots').length}</h3>
          </div>

          <div className='flex flex-col gap-2'>
            <div className='pr-10'>
              <h1 className='text-2xl'>Money Earned today:</h1>
              <h2 className='text-xl'>{calculateEarnings(earnings)} NOK</h2>
            </div>
          </div>
        </div>
      </div>


      <div className='mb-10 p-5'>
            {parkingQueueLine.length === 0 && (
              <button onClick={() => setParkingQeueLine(startNewQueue())} className='bg-blue-500 text-white p-2 rounded-md'>Start new queue</button>
            )}
            <ParkingQueue vehicles={parkingQueueLine} />
      </div>

      <div className='flex flex-col gap-4 p-5'>
        {parkingHouse.levels.map((level, index) =>
          <ParkingLevelComponent endParking={parkingEnded} key={index} level={level.level} carSpots={level.carSpots} motorcycleSpots={level.motorcycleSpots} suvSpots={level.suvSpots} />
        )}
      </div>
    </div>
    </>
  );
}
