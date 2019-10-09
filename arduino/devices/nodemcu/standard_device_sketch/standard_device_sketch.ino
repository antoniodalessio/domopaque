


/*
    This sketch establishes a TCP connection to a "quote of the day" service.
    It sends a "hello" message, and then prints received data.
*/

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

    message += " \"deviceName\":";
    message += " \"corridoio_piano_secondo\",";

    message += " \"ip\":";
    message += "\"" + ip + "\"";
    
    message += " }";
  
  Serial.println("SERVER RESPONSE");
  server.send(200, "application/json", message);
}

void setup() {
  Serial.begin(9600);
  setupWifi();
  dht.begin();

  server.on("/ping", handlePing);
  server.begin();
  Serial.println("SERVER BEGIN!!");
}

void loop() {
  server.handleClient();
}
