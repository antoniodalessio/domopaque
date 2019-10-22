const Gpio = require('onoff').Gpio;

// const relais = new Gpio(17, 'out');
// let relaisValue = 1;
// relais.writeSync(relaisValue);

// setInterval(() => {
//   if(relaisValue == 1) {
//     relaisValue = 0;
//   }else{
//     relaisValue = 1;
//   }
//   relais.writeSync(relaisValue);
// }, 5000)

// process.on('SIGINT', _ => {
//   relais.unexport();
// });



class Actuator {
    
  private _value: any
  
  constructor() {

  }


  set value(val) {
    this._value = val;
  }

  get value() {
      return this._value
  }


}

export default Actuator;