#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include "DHT.h"
#define DHTTYPE DHT11
#define DHT11_PIN 2

#ifndef STASSID
#define STASSID "Vodafone-50278807"
#define STAPSK  "adhbm3yv8j2lx3i"
#endif

const char* ssid     = STASSID;
const char* password = STAPSK;

const char* host = "192.168.1.6/send";
const uint16_t port = 3005;

DHT dht(DHT11_PIN, DHTTYPE);

float Temperature;
float Humidity;

String ip;

// MAgnetic sensor
/*
int magneticSensorPin = 4;
int buttonState = 0;
*/

const int sensorMin = 0;
const int sensorMax = 1024;
int sensorRainDropPin = A0;
int enableRainDrop = 13;
int sensorRaindDropValue = 0;
String sensorRaindDropMsg = "not_raining";



ESP8266WebServer server(3005);

String IpAddress2String(const IPAddress& ipAddress)
{
  return String(ipAddress[0]) + String(".") +\
  String(ipAddress[1]) + String(".") +\
  String(ipAddress[2]) + String(".") +\
  String(ipAddress[3])  ;
}

void setupWifi() {
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  ip = IpAddress2String(WiFi.localIP());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(ip);
}

void handlePing() {

  float Temperature = dht.readTemperature();
  float h = dht.readHumidity();

  String message = "{ ";
    message += " \"temperature\":";
    message += "\"" + String(Temperature) + "\",";

    message += " \"umidity\":";
    message += "\"" + String(h) + "\",";

    message += " \"raindrop\":";
    message += "\"" + sensorRaindDropMsg + "\",";

    message += " \"deviceName\":";
    message += " \"corridoio_piano_primo\",";

    message += " \"ip\":";
    message += "\"" + ip + "\"";
    
    message += " }";
  
  Serial.println("SERVER RESPONSE");
  server.send(200, "application/json", message);
}

void magneticSensor() {
  /*buttonState = digitalRead(magneticSensorPin);
  if (buttonState == HIGH) {
     Serial.println("high");
     Serial.println(buttonState);
  } else {
    Serial.println("low");
     Serial.println(buttonState);
  }*/
 
  //delay(1000);
}

void setupRaindropSensor() {
  pinMode(enableRainDrop, OUTPUT);
}

void raindropSensor() {
  delay(500);
  sensorRaindDropValue = analogRead(sensorRainDropPin);
  sensorRaindDropValue = map(sensorRaindDropValue, sensorMin, sensorMax, 0, 3);

  Serial.println(sensorRaindDropValue); 
  // range value:
  switch (sensorRaindDropValue) {
   case 0:    // Sensor getting wet
      Serial.println("Flood");
      sensorRaindDropMsg = "flood";
      break;
   case 1:    // Sensor getting wet
      Serial.println("Rain Warning");
      sensorRaindDropMsg = "rain_warning";
      break;
   case 2:    // Sensor dry 
      Serial.println("Not Raining");
      sensorRaindDropMsg = "not_raining";
      break;
    }
    
    delay(1000);

}

void setup() {
  setupRaindropSensor();
  //pinMode(magneticSensorPin, INPUT);
  //pinMode(magneticSensorPin,INPUT_PULLUP);  
  
  Serial.begin(9600);
  setupWifi();
  dht.begin();

  server.on("/ping", handlePing);
  server.begin();
  Serial.println("SERVER BEGIN!!");
}

void loop() {
  server.handleClient();
  //magneticSensor();
  raindropSensor();
}
