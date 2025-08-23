# Ovine Behavior Monitoring with ESP8266 Web Server

This repository contains the full project developed for a Scientific Initiation research project at the "Luiz de Queiroz" College of Agriculture (ESALQ/USP), focused on the behavioral analysis of sheep using a custom-built, low-cost IoT device.

The core of the project is a wearable device, built with an **ESP8266 microcontroller** and an **MPU6050 accelerometer/gyroscope**, designed to be attached to a sheep's halter. It collects and logs motion data, hosting its own web server to provide a real-time interface for visualizing sensor data and downloading it for further analysis with machine learning tools.

## Key Features

-   **Real-time Data Monitoring**: A web interface displays live data from the accelerometer and gyroscope.
-   **On-Device Data Logging**: Sensor readings are saved locally to the ESP8266's filesystem in CSV format at a 10 Hz frequency.
-   **3D Sensor Visualization**: The web UI includes a 3D cube that rotates in real-time, reflecting the sensor's physical orientation.
-   **Two Operational Modes**: The firmware is available in two distinct versions for maximum flexibility:
    -   **Online Mode (Wi-Fi Client)**: Connects to an existing Wi-Fi network for easy access within a local area network.
    -   **Offline Mode (Access Point)**: Creates its own Wi-Fi hotspot, allowing direct connection to the device in the field where no other network is available.
-   **Low-Cost Hardware**: Built with accessible and affordable electronic components like the ESP8266 and MPU6050.

## Repository Structure

```
.
├── Project_Dependencies/
│   ├── ESPAsyncTCP-master.zip
│   ├── ESPAsyncWebServer-master.zip
│   └── arduino-littlefs-upload-1.5.4.vsix
│
├── Web_Server_Ovinos_Wifi_Online/
│   ├── Web_Server_Ovinos_Wifi_Online.ino
│   └── data/
│       ├── index.html
│       ├── style.css
│       └── script.js
│
├── Web_Server_Ovinos_Wifi_Offline/
│   ├── Web_Server_Ovinos_Wifi_Offline.ino
│   └── data/
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       ├── three.min.js
│       └── fontawesome.css
│
└── README.md
```

## Hardware Requirements

To build the monitoring device, you will need the following components:
* An ESP8266-based board (e.g., NodeMCU ESP-12E).
* MPU6050 3-axis Accelerometer and Gyroscope module.
* Jumper wires for connections.
* A power source (e.g., a 3.7V LiPo battery or a USB power bank).
* (Optional) A breadboard for prototyping.

## Software Setup and Installation Guide

This guide will walk you through setting up the Arduino IDE and flashing the firmware and web files to the ESP8266.

### Step 1: Configure the Arduino IDE for ESP8266

**Why?** The Arduino IDE needs to be taught how to compile and upload code for the ESP8266, which is not a standard Arduino board.

1.  **Install Arduino IDE**: If you haven't already, [download and install the Arduino IDE](https://www.arduino.cc/en/software).

2.  **Add ESP8266 Board Manager**:
    * Open the Arduino IDE and go to `File` > `Preferences`.
    * In the "Additional Board Manager URLs" field, add the following URL:
        ```
        [http://arduino.esp8266.com/stable/package_esp8266com_index.json](http://arduino.esp8266.com/stable/package_esp8266com_index.json)
        ```
    * Go to `Tools` > `Board` > `Boards Manager...`, search for "esp8266", and install the package by the "ESP8266 Community".

3.  **Select Your Board**:
    * Go to `Tools` > `Board` > `ESP8266 Boards` and select your specific ESP8266 board (e.g., "NodeMCU 1.0 (ESP-12E Module)").
    * Connect your ESP8266 to your computer and select the correct COM Port under `Tools` > `Port`.

### Step 2: Install Project Libraries

**Why?** This project uses special libraries to create an efficient, asynchronous web server, which is not included with the Arduino IDE by default. The correct versions are provided in this repository to ensure compatibility.

1.  **Locate the library files** in the `Project_Dependencies/` folder of this repository.
2.  **Install the libraries**:
    * In the Arduino IDE, go to `Sketch` > `Include Library` > `Add .ZIP Library...`.
    * Navigate to the `Project_Dependencies/` folder and select `ESPAsyncTCP-master.zip`. Click "Open".
    * Repeat the process for `ESPAsyncWebServer-master.zip`.
3.  Restart the Arduino IDE to ensure the libraries are loaded.

### Step 3: Install the Filesystem Uploader Tool

**Why is this tool necessary?** The ESP8266 has a separate memory space for storing files, called LittleFS. The standard "Upload" button in the IDE only sends your code (`.ino`). We need this special tool to upload all the web interface files (HTML, CSS, JavaScript) to that memory, so the web server can find and display them.

Choose the method that fits your development environment.

**Method A: For Standard Arduino IDE Users (Recommended)**

1.  Go to the [ESP8266 LittleFS Filesystem Uploader GitHub page](https://github.com/earlephilhower/arduino-esp8266-littlefs-plugin/releases).
2.  Download the latest `ESP8266LittleFS-X.X.X.zip` file.
3.  Navigate to your Arduino sketch folder (you can find the path in `File` > `Preferences`).
4.  If it doesn't exist, create a folder named `tools` inside the sketch folder.
5.  Unzip the downloaded file into the `tools` directory. The final path should look like:  
    `C:\Users\<YourUser>\Documents\Arduino\tools\ESP8266LittleFS\tool\esp8266littlefs.jar`
6.  Restart the Arduino IDE. You should now see an option called **"ESP8266 LittleFS Data Upload"** under the `Tools` menu.

**Method B: For Visual Studio Code (VS Code) + PlatformIO Users**

1.  Navigate to the `Project_Dependencies/` folder in this repository.
2.  In VS Code, go to the **Extensions** view (Ctrl+Shift+X).
3.  Click the `...` (More Actions) menu in the top-right corner of the Extensions view.
4.  Select **"Install from VSIX..."**.
5.  Navigate to and select the `arduino-littlefs-upload-1.5.4.vsix` file from the `Project_Dependencies` folder.
6.  After installation, you will be able to run the "Upload Filesystem Image" command from PlatformIO.

---

## How to Deploy and Use the Project

Choose the operational mode you want to use and follow the steps below.

### Part A: Deploying the "Online" Version (Wi-Fi Client)

This mode connects the device to your existing Wi-Fi network.

1.  **Configure Wi-Fi Credentials**:
    * Open the file `Web_Server_Ovinos_Wifi_Online/Web_Server_Ovinos_Wifi_Online.ino` in the Arduino IDE.
    * Modify the following lines with your network's SSID (name) and password:
        ```cpp
        const char* ssid = "YOUR_WIFI_SSID";
        const char* password = "YOUR_WIFI_PASSWORD";
        ```

2.  **Upload the Web Files**:
    * The `data` folder must be located inside the `Web_Server_Ovinos_Wifi_Online` sketch folder.
    * In the Arduino IDE, go to `Tools` > `ESP8266 LittleFS Data Upload`. This will compile and upload all files from the `data` folder to the ESP8266's filesystem.

3.  **Upload the Firmware**:
    * Click the "Upload" button (the arrow icon) in the Arduino IDE to flash the main code to the device.

4.  **Access the Web Server**:
    * After the upload is complete, open the `Serial Monitor` (`Tools` > `Serial Monitor`) with a baud rate of `115200`.
    * Press the `RST` button on your ESP8266.
    * The device will connect to your Wi-Fi and print its IP address in the Serial Monitor.
    * Enter that IP address in your web browser to access the monitoring interface.

### Part B: Deploying the "Offline" Version (Access Point)

This mode turns the device into its own Wi-Fi hotspot, ideal for use in the field.

1.  **Open the Sketch**:
    * Open the file `Web_Server_Ovinos_Wifi_Offline/Web_Server_Ovinos_Wifi_Offline.ino` in the Arduino IDE. No code modifications are necessary to run it. The default network credentials are:
        * **SSID**: `Rede_Ovinos_Monitor`
        * **Password**: `senha1234`

2.  **Upload the Web Files**:
    * Ensure the `data` folder (the one containing `three.min.js` and `fontawesome.css`) is inside the `Web_Server_Ovinos_Wifi_Offline` sketch folder.
    * Go to `Tools` > `ESP8266 LittleFS Data Upload` and wait for it to complete. This version uploads all dependencies, making it self-contained.

3.  **Upload the Firmware**:
    * Click the "Upload" button in the Arduino IDE.

4.  **Connect and Access the Web Server**:
    * After the device restarts, use your computer or smartphone to scan for Wi-Fi networks.
    * Connect to the **`Rede_Ovinos_Monitor`** network using the password **`senha1234`**.
    * Once connected, open a web browser and navigate to the static IP address **`http://192.168.4.1`**. This will load the monitoring interface directly from the device.

## Data Analysis

The primary output of the device is the `sensor_data.csv` file, which can be downloaded from the web interface. This data is intended for use in the next stage of the research: behavioral classification. The CSV file can be imported into tools like **Orange Data Mining®** or processed using **Python** with libraries such as Pandas, NumPy, and Scikit-learn to train machine learning models.

## Credits and Acknowledgements

This project was developed by **Gabriel Yamauti Gerolamo** under the guidance of **Prof. Dr. Késia Oliveira da Silva-Miranda** as part of a Scientific Initiation research project at ESALQ/USP.

Special acknowledgements to **Prof. Magno do Nascimento Amorim** and **Rivaldo Geovane Miranda de Sousa** for their valuable collaboration and support throughout the project.

The firmware and web interface were inspired and adapted from the excellent tutorials provided by **Random Nerd Tutorials**:
-   [ESP32 Web Server with MPU-6050 Accelerometer and Gyroscope](https://randomnerdtutorials.com/esp32-mpu-6050-web-server/)
-   [Install ESP8266 Filesystem Uploader in Arduino IDE 2 (LittleFS)](https://randomnerdtutorials.com/arduino-ide-2-install-esp8266-littlefs/)