int RELE = 5;

void setup() {
  pinMode(RELE, OUTPUT);

}

void loop() {

  delay(1000);
  digitalWrite(RELE, 1);
  delay(1000);
  digitalWrite(RELE, 0);
  
}
