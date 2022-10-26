import React from 'react';

import { ListGroup } from 'react-bootstrap';
import { Car } from 'wasm-gatsby-lib';

interface Props {
  cars: Car[];
}

interface CarProps {
  car: Car;
}

const CarItem: React.FC<CarProps> = ({ car }) => {
  return (
    <ListGroup.Item>
      <pre>{JSON.stringify(car.to_json(), null, 2)}</pre>
    </ListGroup.Item>
  );
};

const CarList: React.FC<Props> = ({ cars }) => {
  return (
    <ListGroup variant="flush">
      {cars.map((car, idx) => (
        <CarItem key={idx} car={car} />
      ))}
    </ListGroup>
  );
};

export default CarList;
