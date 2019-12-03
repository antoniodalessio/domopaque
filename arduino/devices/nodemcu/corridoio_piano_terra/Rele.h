#include <Arduino.h>

class Rele {
  
  private:
    int pin;
    
  public:
    Rele(int pin, String name, String alias, int step);
    String name;
    String alias;
    int step;
    void init();
    int getState();
    void on();
    void off();
    void toggle();
};
