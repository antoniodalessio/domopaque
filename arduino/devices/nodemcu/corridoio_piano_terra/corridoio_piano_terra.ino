#include <ArduinoJson.h>

#include <ESP8266WebServer.h>
#include "Switch.h"
#include "Rele.h"
//#include "Helpers.h"

//BEGIN SETUP WIFI
#ifndef STASSID
#define STASSID "Vodafone-50278807"
#define STAPSK  "adhbm3yv8j2lx3i"
#endif

#define NAME "corridoio_piano_terra";

//Helpers helpers;

const char* ssid     = STASSID;
const char* password = STAPSK;
const uint16_t port = 3005;
String ip;
const char* deviceName = NAME;

Switch switch1(4); //D2
Switch switch2(2); //D4
Rele rele1(5, "luce_giardino", "luce_giardino", 1); //D1
Rele rele2(0, "luce_porta", "luce_porta", 1); //D3


ESP8266WebServer server(port);
// END SETUP WIFI

String IpAddress2String(const IPAddress& ipAddress){
  return String(ipAddress[0]) + String(".") +\
    String(ipAddress[1]) + String(".") +\
    String(ipAddress[2]) + String(".") +\
    String(ipAddress[3]);
}

String jsonKeyValue(String key, String value, boolean final) {
  String str = "";
  str += " \"" + key + "\":";
  if (final) {
    str += " \"" + value + "\"";
  }else{
    str += " \"" + value + "\",";
  }
  return str;
}

String actuatorStringJson(String name, String alias, int step, int value) {
  String str = "";
  str += "{";
  str += jsonKeyValue("name", name, false);
  str += jsonKeyValue("alias", alias, false);
  str += " \"range\": [],";
  str += jsonKeyValue("step", String(step), false);
  str += jsonKeyValue("value", String(value), true);
  str += "}";
  return str;
}



void handlePing() {


  String message = "{ ";

    message += jsonKeyValue("deviceName", deviceName, false);
    message += jsonKeyValue("ip", ip, false);

    message += " \"sensors\":[";
    message += "],";

    message += " \"actuators\":[";

      message += actuatorStringJson(rele1.name, rele1.name, rele1.step, rele1.getState());
      message += ",";
      message += actuatorStringJson(rele2.name, rele2.name, rele2.step, rele2.getState());
      
      message += "]";
    
    message += " }";
  
  Serial.println("SERVER RESPONSE");
  server.send(200, "application/json", message);
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

void handleLuceGiardino() {
  String value = server.arg("plain");
  StaticJsonDocument<256> doc;
  deserializeJson(doc, value);

  String val = doc["value"];

  if (val == "1") {
      rele1.on();
  }else{
    rele1.off();
  }
  
  server.send(200, "application/json", "{ \"value\": \""+  val + "\"}");
}

void handleLucePorta() {
  String value = server.arg("plain");
  StaticJsonDocument<256> doc;
  deserializeJson(doc, value);

  String val = doc["value"];

  if (val == "1") {
    rele2.on();
  }else{
    rele2.off();
  }
  
  server.send(200, "application/json", "{ \"value\": \""+  val + "\"}");
}


void setup() {

  Serial.begin(9600);
  setupWifi();

  server.on("/ping", handlePing);
  server.on("/luce_giardino", HTTP_POST, handleLuceGiardino);
  server.on("/luce_porta", HTTP_POST, handleLucePorta);

  server.begin();
  Serial.println("SERVER BEGIN!!");
}


void toggleRele1() {
  rele1.toggle();
}

void toggleRele2() {
  rele2.toggle();
}

void handleSwitch() {
  switch1.onChange(toggleRele1);
  switch2.onChange(toggleRele2);
}

void loop() {
  handleSwitch();
  server.handleClient();
}
