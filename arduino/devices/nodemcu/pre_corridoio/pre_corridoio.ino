int RELE = 5; // D1(gpio5)
int BUTTON1 = 4; //D2(gpio4)
int RELE2 = 0; //D3
int BUTTON2 = 2;//D4
int LED = 14;//D5
int LED2 = 12;//D6

int buttonState1;             // the current reading from the input pin
int lastButtonState1 = LOW;   // the previous reading from the input pin

int buttonState2;             // the current reading from the input pin
int lastButtonState2 = LOW;   // the previous reading from the input pin


unsigned long switch1lastDebounceTime = 0;  // the last time the output pin was toggled
unsigned long switch1debounceDelay = 50;    // the debounce time; increase if the output flickers

unsigned long switch2lastDebounceTime = 0;  // the last time the output pin was toggled
unsigned long switch2debounceDelay = 50;    // the debounce time; increase if the output flickers

void setup() {
 Serial.begin(9600);
 pinMode(RELE, OUTPUT);
 pinMode(BUTTON1, INPUT);
 pinMode(RELE2, OUTPUT);
 pinMode(BUTTON2, INPUT);

 pinMode(LED, OUTPUT);
 pinMode(LED2, OUTPUT);
}


void switch1() {
  
  int reading = digitalRead(BUTTON1);
  
  if (reading != lastButtonState1) {
    // reset the debouncing timer
    switch1lastDebounceTime = millis();
  }

  if ((millis() - switch1lastDebounceTime) > switch1debounceDelay) {
    if (reading != buttonState1) {
      buttonState1 = reading;
      if (buttonState1 == HIGH) {
        toggleReleay1();
      }
    }
  }
  
  lastButtonState1 = reading;
  
}

void switch2() {
  
  int reading = digitalRead(BUTTON2);
  
  if (reading != lastButtonState2) {
    // reset the debouncing timer
    switch2lastDebounceTime = millis();
  }

  if ((millis() - switch2lastDebounceTime) > switch2debounceDelay) {
    if (reading != buttonState2) {
      buttonState2 = reading;
      if (buttonState2 == HIGH) {
        toggleReleay2();
      }
    }
  }
  
  lastButtonState2 = reading;
  
}

void toggleReleay1() {
  int state = digitalRead(RELE);
  digitalWrite(RELE, !state);
  digitalWrite(LED, state);
}

void toggleReleay2() {
  int state = digitalRead(RELE2);
  digitalWrite(RELE2, !state);
  digitalWrite(LED2, state);
}

void loop() {
  delay(2000);
  Serial.println("test");
 switch1();
 switch2();
}
