# ThingsBoard Prototyping
## Goal
The goal of this sprint is to attempt getting the following functionality out of our _Community Edition_ install of ThingsBoard:
* Ingest data from an available source into ThingsBoard
* Set up an example "Administrator" dashboard that has _at least one_ widget that showcases the data
  * A map widget showing locations of the sensors would be good

## Observations
### Backfilling Data
* We will not have usable historical data to begin with since all existing BottleBot sensor data is from being _indoors_, which isn't relevant for AQI calculations
* They will only begin deploying BottleBot sensors outdoor "by the end of the summer," which will most likely be _after_ our responsibility to this project has ended
* To address this, we will need to rely on other sources of data to backfill our database and build the rest of the application off of. Some options are:
  * **PurpleAir**: [documentation](https://api.purpleair.com/#api-sensors-get-sensors-data) TBF will _eventually_ need to purchase "points" from them in order to keep using their API
  * **QuantAQ**: [documentation](https://docs.quant-aq.com/software-apis-and-libraries/quantaq-cloud-api) There are only a small handful of sensors deployed (7, I think) so I don't think they represent a huge impact on our dataset
  * **OpenAQ**: [documentation](https://docs.openaq.org/)
  * **AirNow**: [documentation](https://docs.airnowapi.org/)
* Each source of data will have their own Terms of Use that we will need to be aware and cognizant of, just in case they prohibit the act of "caching" their data in our own database (which is, essentially, what we are going to be doing).

### Working Approach
* PurpleAir's API allows for fetching all sensor data within a rectangular region (defined by 2 opposing longitude/latitude coordinates). 
* A Python script (`purpleair_to_tb.py`) is configured in the underlying operating system as a service (`purpleair-poller.service`).
  * For Linux operating systems that use `systemd` for service management, the `service` file is placed in `/etc/systemd/system`.
  * Restart the service daemon so it can find the new `service` file: `sudo systemctl daemon-reload`
  * Enable the script to start on boot: `sudo systemctl enable purpleair-poller`
  * Start the script: `sudo systemctl start purpleair-poller`
* The script's process is:
  1. Authenticate
  1. Query PurpleAir's API for all the sensors within the boundaries defined by the longitude/latitude coordinates
  1. For each sensor that's returned:
      1. Create a device for it in ThingsBoard (if necessary)
      1. Get it's "access token"
      1. Do an AQI calculation (this _could_ be done inside of ThingsBoard, if that approach is preferred)
      1. Send all sensor data for that device (based on the "access token") to ThingsBoard