import "./style.css";
import { parse, format } from 'date-fns';

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
    conditions.set("cloudcover", data.cloudcover); //%
    conditions.set("icon", data.icon);
    return conditions;
};

async function getImage(name) {
    try {
        const imageModule = await import(`./icons/${name}.svg`);
        const imageUrl = imageModule.default;
        return imageUrl;
    } catch (error) {
        console.error("Error loading image", error);
        return undefined;
    }
}

async function createWeatherDOM(data) {

    let weatherCard = document.createElement("div");
    weatherCard.classList.add("weatherCard")
    console.log(data);

    let icon = document.createElement("img");
    icon.src = await getImage(data.get("icon"));
    icon.classList.add("icon");
    weatherCard.appendChild(icon);

    let parsedDate = parse(data.get("datetime"), 'yyyy-MM-dd', new Date());
    let p = document.createElement("p");
    p.textContent = format(parsedDate, 'ccc');
    p.classList.add("day");
    weatherCard.appendChild(p);

    p = document.createElement("p");
    p.textContent = format(parsedDate, "MM/dd/yyyy");
    p.classList.add("datetime");
    weatherCard.appendChild(p);

    let div = document.createElement("div");
    div.classList.add("temp");
    p = document.createElement("p");
    p.textContent = `L: ${data.get("tempMin")}°F`;
    div.appendChild(p);

    p = document.createElement("p");
    p.textContent = `H: ${data.get("tempMax")}°F`;
    div.appendChild(p);
    weatherCard.append(div);

    p = document.createElement("p");
    p.textContent = data.get("conditions");
    p.classList.add("conditions");
    weatherCard.append(p);

    document.querySelector("#weatherStats").appendChild(weatherCard);
}

document.querySelector("#search").addEventListener("click", async (e) => {
    let location = document.querySelector("#location").value;
    let data = await getData(location); //wait for the response.json promise to resolve
    if (data != undefined) {
        data = parseWeatherData(data.days[0]);
        createWeatherDOM(data);
    };
}); 
