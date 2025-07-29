// 
// COSTANTS
// 

const apiEndpoint = {
    lastEntryData: '/api/v0/last-entry-data',
    graphsData: '/api/v0/graphs-data',
}

document.addEventListener('DOMContentLoaded', async () => {
    const airQualityData = await requestAirQualityData(apiEndpoint.lastEntryData);
    // console.log(airQualityData);
    popolateDisplayWithData(airQualityData);
    setInterval( async () => {
        const airQualityData = await requestAirQualityData(apiEndpoint.lastEntryData);
        // console.log(airQualityData);
        popolateDisplayWithData(airQualityData);
        // console.log('in interval');
    }, 1000 * 10); // {milliseconds * seconds} every 10 seconds
});

async function requestAirQualityData(apiEndpoint: string){
    const response: Response = await fetch(apiEndpoint);
    // console.log(response);
    // Check if the response is OK (status 200-299)
    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const serverData: any = await response.json(); // Extracts the JSON data

    if (!(serverData.isSuccess)) throw new Error(`I can't find the data in the api url defined. Url defined: ${apiEndpoint} .`);
    // console.log(serverData);
    const airQualityData = serverData.data;
    // console.log(airQualityData);

    return airQualityData;
}

function popolateDisplayWithData(airQualityData: any){
    const temperatureElement = document.getElementById('temperature') as HTMLSpanElement;
    const humidityElement = document.getElementById('humidity') as HTMLSpanElement;
    const pm0Element = document.getElementById('pm1') as HTMLSpanElement;
    const pm2_5Element = document.getElementById('pm2_5') as HTMLSpanElement;
    const pm10Element = document.getElementById('pm10') as HTMLSpanElement;
    const co2Element = document.getElementById('co2') as HTMLSpanElement;
    const vocElement = document.getElementById('voc') as HTMLSpanElement;
    const dateTimeElement = document.getElementById('time_last_refresh') as HTMLSpanElement;
    const overallScoreElement = document.getElementById('overall_score') as HTMLSpanElement;

    const { temperature, humidity, pm1, pm2_5, pm10, co2, voc, dateTimeEntry } = airQualityData;
    temperatureElement.textContent = `${temperature} °C`;
    humidityElement.textContent = `${humidity} %`;
    pm0Element.textContent = `${pm1} µg/m³`;
    pm2_5Element.textContent = `${pm2_5} µg/m³`;
    pm10Element.textContent = `${pm10} µg/m³`;
    co2Element.textContent = `${co2} ppm`;
    // vocElement.textContent = `${voc}`;
    vocElement.textContent = `(wip)`;
    // dateTimeElement.textContent = `${dateTimeEntry}`;
}

export = {}; // I have done this so typescript treat this file like a module and don't gobalize every variable