// 
// COSTANTS
// 

const apiEndpoint: string = '/api/v0/last-entry-data';

document.addEventListener('DOMContentLoaded', async () => {
    const airQualityData = await requestAirQualityData(apiEndpoint);
    // console.log(airQualityData);
    popolateDisplayWithData(airQualityData);
    setInterval( async () => {
        const airQualityData = await requestAirQualityData(apiEndpoint);
        // console.log(airQualityData);
        popolateDisplayWithData(airQualityData);
        // console.log('in interval');
    }, 1000 * 10); // every 10 seconds

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
    const temperatureElement = document.getElementById('temperature') as Element;
    const humidityElement = document.getElementById('humidity') as Element;
    const pm0Element = document.getElementById('pm1') as Element;
    const pm2_5Element = document.getElementById('pm2_5') as Element;
    const pm10Element = document.getElementById('pm10') as Element;
    const co2Element = document.getElementById('co2') as Element;
    const vocElement = document.getElementById('voc') as Element;
    const dateTimeElement = document.getElementById('time_last_refresh') as Element;
    const overallScoreElement = document.getElementById('overall_score') as Element;

    const { temperature, humidity, pm1, pm2_5, pm10, co2, voc, dateTimeEntry } = airQualityData;
    temperatureElement.innerHTML = `${temperature} °C`;
    humidityElement.textContent = `${humidity} %`;
    pm0Element.textContent = `${pm1} µg/m³`;
    pm2_5Element.textContent = `${pm2_5} µg/m³`;
    pm10Element.textContent = `${pm10} µg/m³`;
    co2Element.textContent = `${co2} ppm`;
    // vocElement.textContent = `${voc}`;
    vocElement.textContent = `(wip)`;
    // dateTimeElement.textContent = `${dateTimeEntry}`;
}