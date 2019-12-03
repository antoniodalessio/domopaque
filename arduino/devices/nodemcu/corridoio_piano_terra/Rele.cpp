#include "Rele.h"
#include "Helpers.h"

Helpers helpers;

Rele::Rele(int pin, String name, String alias, int step) {
  this->pin = pin;
  this->name = name;
  this->alias = alias;
  this->step = step;
  init();
}
void Rele::init() {
  pinMode(pin, OUTPUT);
  off();
}
int Rele::getState() {
    return !digitalRead(pin);
}
void Rele::off() {
  digitalWrite(pin, HIGH);
}
void Rele::on() {
  digitalWrite(pin, LOW);
}

void Rele::toggle() {
  if (getState() == HIGH) {
      off();
    }else{
      on();
    }
}

/*String Rele::stringJson() {
  String str = "";
  str += "{";
  str += helpers.jsonKeyValue("name", name, false);
  str += helpers.jsonKeyValue("alias", name, false);
  str += " \"range\": [],";
  str += helpers.jsonKeyValue("step", String(step), false);
  str += helpers.jsonKeyValue("value", String(!digitalRead(pin)), true);
  return str;
}*/
