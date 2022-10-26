import React, { useState } from 'react';

import { Container } from 'react-bootstrap';

import { Car, CarType } from 'wasm-gatsby-lib';
import AddCarButton from './AddCarButton';

import CarList from './CarList';

const CarContainer = () => {
  const [carList, setCarList] = useState<Car[]>([]);

  const handleAddCar = () => {
    const newCar = new Car('Not red', 'Better', CarType.Racing, 6);

    const carJson = newCar.to_json();

    console.log('carJson', carJson);

    const carFromJson = Car.from_json(carJson);

    console.log('carFromJson', carFromJson);

    const newCarList = [...carList, newCar];

    setCarList(newCarList);
  };

  return (
    <Container className="mt-2">
      <h1>Car List</h1>
      <hr />
      <CarList cars={carList} />
      <hr />
      <AddCarButton handleClick={handleAddCar} />
    </Container>
  );
};

export default CarContainer;
