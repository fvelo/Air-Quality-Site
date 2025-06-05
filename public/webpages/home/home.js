"use strict";
// 
// COSTANTS
// 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiEndpoint = '/api/v0/last-entry-data';
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const airQualityData = yield requestAirQualityData(apiEndpoint);
}));
function requestAirQualityData(apiEndpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(apiEndpoint);
        console.log(response);
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = yield response.json(); // Extracts the JSON data
        if (!(serverData.isSuccess))
            throw new Error(`I can't find the data in the api url defined. Url defined: ${apiEndpoint} .`);
        // console.log(serverData);
        const airQualityData = serverData.data;
        // console.log(airQualityData);
        return airQualityData;
    });
}
