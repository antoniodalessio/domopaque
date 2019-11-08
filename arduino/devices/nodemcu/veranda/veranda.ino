#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include "DHT.h"
#define DHTTYPE DHT11
#define DHT11_PIN 2
#define D1 5

#ifndef STASSID
#define STASSID "Vodafone-50278807"
#define STAPSK  "adhbm3yv8j2lx3i"
#endif

const char* ssid     = STASSID;
const char* password = STAPSK;

const uint16_t port = 3005;

DHT dht(DHT11_PIN, DHTTYPE);

float Temperature;
float Humidity;

String ip;

// Magnetic sensor

int magneticSensorPin = 4;
int buttonState = 0;


const int sensorMin = 0;
const int sensorMax = 1024;
int sensorRainDropPin = A0;
int enableRainDrop = 13;



ESP8266WebServer server(port);

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


void handleTemperature() {
  float Temperature = dht.readTemperature();
  String message = "{";
  message += " \"value\":";
  message += "\"" + String(Temperature) + "\"";
  message += " }";
  server.send(200, "application/json", message);
}

void handleHumidity() {
  float h = dht.readHumidity();
  String message = "{";
  message += " \"value\":";
  message += "\"" + String(h) + "\"";
  message += " }";
  server.send(200, "application/json", message);
}

void handleRainSensor() {
  String message = "{";
  message += " \"value\":";
  message += "\"" + raindropSensor() + "\"";
  message += " }";
  server.send(200, "application/json", message);
}


void handleLightSensor() {
  String message = "{";
  message += " \"value\":";
  message += "\"" + String(lightSensor()) + "\"";
  message += " }";
  server.send(200, "application/json", message);
}


void handlePing() {

  float Temperature = dht.readTemperature();
  float h = dht.readHumidity();

  String message = "{ ";

    message += " \"deviceName\":";
    message += " \"veranda\",";

    message += " \"ip\":";
    message += "\"" + ip + "\",";

    message += " \"sensors\":[";

    message += "{\"temperature\":";
    message += "\"" + String(Temperature) + "\"},";

    message += "{\"lightSensor\":";
    message += "\"" + String(lightSensor()) + "\"},";

    message += "{\"umidity\":";
    message += "\"" + String(h) + "\"},";

    message += "{\"raindrop\":";
    message += "\"" + raindropSensor() + "\"}";
    
    message += "],";

    message += " \"actuators\":[";

    message += "]";

    message += " }";
  
  Serial.println("SERVER RESPONSE");
  server.send(200, "application/json", message);
}

void magneticSensor() {
  buttonState = digitalRead(magneticSensorPin);
  if (buttonState == HIGH) {
     Serial.println("high");
     Serial.println(buttonState);
  } else {
    Serial.println("low");
     Serial.println(buttonState);
  }
 
  delay(1000);
}

void setupRaindropSensor() {
  pinMode(enableRainDrop, OUTPUT);
}

String raindropSensor() {
  int sensorRaindDropValue = analogRead(sensorRainDropPin);
  sensorRaindDropValue = map(sensorRaindDropValue, sensorMin, sensorMax, 0, 3);
  String sensorRaindDropMsg = "";

  Serial.println(sensorRaindDropValue); 
  
  switch (sensorRaindDropValue) {
   case 0:
      Serial.println("Flood");
      sensorRaindDropMsg = "flood";
      break;
   case 1:
      Serial.println("Rain Warning");
      sensorRaindDropMsg = "rain_warning";
      break;
   case 2:
      Serial.println("Not Raining");
      sensorRaindDropMsg = "not_raining";
      break;
    case 3:
      Serial.println("very_dry_not_raining");
      sensorRaindDropMsg = "very_dry_not_raining";
      break;
    }

    Serial.println(sensorRaindDropMsg); 

    return sensorRaindDropMsg;

}

int lightSensor() {
  int light = digitalRead(D1);
  return light;
}

void setup() {
  setupRaindropSensor();

  pinMode(D1,INPUT);

  
  
  //pinMode(magneticSensorPin,INPUT_PULLUP);  
  
  Serial.begin(9600);
  setupWifi();
  dht.begin();

  server.on("/ping", handlePing);
  server.on("/temperature", handleTemperature);
  server.on("/umidity", handleHumidity);
  server.on("/rain", handleRainSensor);
  server.on("lightSensor", handleLightSensor);
  
  server.begin();
  Serial.println("SERVER BEGIN!!");
}

void loop() {
  server.handleClient();
  //magneticSensor();
}
