
const key = "CV8ZEVKQT9AYL8HWNSFFGQCEX";

async function getData(location) {
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${key}`;
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

function parseWeatherData(data) {
    let conditions = new Map();
    conditions.set("datetime", data.datetime);
    conditions.set("conditions", data.conditions);
    conditions.set("description", data.description);
    conditions.set("tempCurrent", data.temp); //Fahrenheit
    conditions.set("tempMax", data.tempmax); //Fahrenheit
    conditions.set("tempMin", data.tempmin); //Fahrenheit
    conditions.set("humidity", data.humidity); //%
    conditions.set("rainChance", data.precipprob); //%
    conditions.set("windspeed", data.windspeed); //mph
    conditions.set("cloudcover", data.cloudcover) //%
    return conditions;
};

function createWeatherDOM(data) {
    let weatherCard = document.createElement("div");
    weatherCard.classList.add("weatherCard")
    data.forEach((value, key) => {
        let p = document.createElement("p");
        p.textContent = `${key}: ${value}`;
        weatherCard.appendChild(p);
    });

    document.querySelector("#weatherStats").appendChild(weatherCard);
}

document.querySelector("#search").addEventListener("click", async (e) => {
    let location = document.querySelector("#location").value;
    let data = await getData(location); //wait for the response.json promise to resolve
    if (data != undefined) {
        console.log(data.days[0]);
        data = parseWeatherData(data.days[0]);
        createWeatherDOM(data);
    };
}); 
