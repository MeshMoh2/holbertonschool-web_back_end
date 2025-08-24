// ES6_classes/100-evcar.js
import Car from './10-car.js';

export default class EVCar extends Car {
  constructor(brand, motor, color, range) {
    super(brand, motor, color);
    this._range = range;
  }

  // Ensure cloning an EVCar returns a Car instance (not EVCar)
  static get [Symbol.species]() {
    return Car;
  }
}

