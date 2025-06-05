// 
// COSTANTS
// 

const apiEndpoint: string = '/api/v0/last-entry-data';

document.addEventListener('DOMContentLoaded', async () => {
    const airQualityData = await requestAirQualityData(apiEndpoint);
    popolateDisplayWithData(airQualityData);
});

async function requestAirQualityData(apiEndpoint: string){
    const response: Response = await fetch(apiEndpoint);
    console.log(response);
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
    const pm0Element = document.getElementById('pm0') as Element;
    const pm2_5Element = document.getElementById('pm2_5') as Element;
    const co2Element = document.getElementById('co2') as Element;
    const vocElement = document.getElementById('voc') as Element;
    const dateTimeElement = document.getElementById('time_last_refresh') as Element;
    const overallScoreElement = document.getElementById('overall_score') as Element;

    const { temperature, humidity, pm0, pm2_5, co2, voc, dateTimeEntry } = airQualityData;
    temperatureElement.innerHTML = temperature;
    humidityElement.textContent = humidity;
    pm0Element.textContent = pm0;
    pm2_5Element.textContent = pm2_5;
    co2Element.textContent = co2;
    vocElement.textContent = voc;
    dateTimeElement.textContent = dateTimeEntry;
}