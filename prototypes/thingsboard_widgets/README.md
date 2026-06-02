# ThingsBoard Prototyping
_Note:_ Both the Python script and service config files were generated using Claude AI

## Goal
The goal of this sprint is to attempt getting the following functionality out of our _Community Edition_ install of ThingsBoard:
* Ingest data from an available source into ThingsBoard
* Set up an example "Administrator" dashboard that has _at least one_ widget that showcases the data
  * A map widget showing locations of the sensors would be good

## Ingesting Data
* We will not have usable historical data to begin with since all existing BottleBot sensor data is from being _indoors_, which isn't relevant for AQI calculations
* They will only begin deploying BottleBot sensors outdoor "by the end of the summer," which will most likely be _after_ our responsibility to this project has ended
* To address this, we will need to rely on other sources of data to backfill our database and build the rest of the application off of. Some options are:
  * **PurpleAir**: [documentation](https://api.purpleair.com/#api-sensors-get-sensors-data) TBF will _eventually_ need to purchase "points" from them in order to keep using their API
  * **QuantAQ**: [documentation](https://docs.quant-aq.com/software-apis-and-libraries/quantaq-cloud-api) There are only a small handful of sensors deployed (7, I think) so I don't think they represent a huge impact on our dataset
  * **OpenAQ**: [documentation](https://docs.openaq.org/)
  * **AirNow**: [documentation](https://docs.airnowapi.org/)
* Each source of data will have their own Terms of Use that we will need to be aware and cognizant of, just in case they prohibit the act of "caching" their data in our own database (which is, essentially, what we are going to be doing).

## PurpleAir
* PurpleAir's API allows for fetching all sensor data within a rectangular region (defined by 2 opposing longitude/latitude coordinates; Northwest and Southeast). 
### Script
* A Python script (`purpleair_to_tb.py`) is configured in the underlying operating system as a service (`purpleair-poller.service`).
  * For Linux operating systems that use `systemd` for service management, the `service` file is placed in `/etc/systemd/system`.
  * Restart the service daemon so it can find the new `service` file: `sudo systemctl daemon-reload`
  * Enable the script to start on boot: `sudo systemctl enable purpleair-poller`
  * Start the script: `sudo systemctl start purpleair-poller`

**Pseudocode**
```
  * Authenticate
  * Query PurpleAir's API for all the sensors within the boundaries defined by the longitude/latitude coordinates
  * For each sensor that's returned:
      * Create a device for it in ThingsBoard (if necessary)
      * Get it's "access token"
      * Calculate the AQI
      * Send all sensor and AQI data associated with that device (based on the "access token") to ThingsBoard
```

## Widgets
### Map
* Administrators will use this widget as a way to see information on an individual sensor level, such as:
  * Physical location
  * Status (time since last "active", any anomalies in the data possibly pointing to hardware failure)
  * Source of data (BottleBot, PurpleAir, etc.)
* Plenty of energy could be put into customizing a single instance of the widget. 

## Things to Note
1. Since we are forced to use datasets owned by other entities, we/TBF will likely need to be conscious of the _owners_ Terms of Service for use of that data.
   * Some of them may request that you don't cache their data (to ensure traffic to their API) while others will _require_ that you do (to cut down on traffic to their API).
   * Some may require attribution. Is TBF okay with that?
   * Is there any legal matters that need to be reviewed before a datasource is used?
   * etc., etc.
1. Ingestion of the data will be tricky and likely involve several iterations to get correct:
   * What happens if we used another API that _also_ incorporates PurpleAir sensors? Is it safe enough to deduplicate sensors by some datapoint or do we need some sort of hashing algorithm (nothing fancy, just fast) to help.
   * Deciding what data we want to track as an individual "attribute" of a sensor (something to be individually queryable) and what stuff needs to be tracked as "telemetry" (with respect to time)
   * Deciding what data needs to be calculated prior to ingestion (possibly easier) or if it can/should be done as part of a ThingsBoard "rule chain". A good example of this would be the AQI calculation. Sure, it could be implemented in every API calling script we have, but then there's that many places to change it if we needed to, but I "rule chain" is basically a template that can be applied to multiple things, so PurpleAir, QuantAQ, OpenAQ, whatever, will all use the same formula and process.
   * I'm wondering if _our_ API will actually be querying the ThingsBoard data _directly_ or if we should create a secondary database (not server) that, essentially, get's just a tailored snapshot of the data every so often.