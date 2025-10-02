import {setDisplay} from "./DOM";

const key = "CV8ZEVKQT9AYL8HWNSFFGQCEX";

async function getData(location) {
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${key}&iconSet=icons1`;
    let error = document.querySelector(".error");

    try {
        const response = await fetch(url);
        if (response.ok) {
            error.textContent = "";
            return response.json();
        } else if (response.status == 400) {
            error.textContent = "Bad Request. Please check your input";
            throw new Error("400 (Bad Request)");
        } else {
            throw new Error("Response not ok");
        }
    } catch (error) {
        console.log("Whoops. There was an error");
        console.error(error);
        return undefined;
    } 
}

document.querySelector("#search").addEventListener("click", async (e) => {
    let location = document.querySelector("#location").value;
    let data = await getData(location); //wait for the response.json promise to resolve
    if (data != undefined) {
        setDisplay(data);
    };
});