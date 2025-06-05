// 
// COSTANTS
// 

const apiEndpoint: string = '/api/v0/last-entry-data';

document.addEventListener('DOMContentLoaded', async () => {
    const airQualityData = await requestAirQualityData(apiEndpoint);

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