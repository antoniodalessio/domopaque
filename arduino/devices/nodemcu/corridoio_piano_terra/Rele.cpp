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
