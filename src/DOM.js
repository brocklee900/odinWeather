import { parse, format } from 'date-fns';

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

function clearDisplay() {
    let display = document.querySelector("#weatherStats");
    while(display.lastElementChild) {
        display.removeChild(display.lastElementChild);
    }
}

async function setDisplay(days) {
    clearDisplay();

    for (const day of days) {
        let dayData = parseWeatherData(day);

        //need to await the creation of each day so that it displays in the correct order
        //without await, some days will load before others depending on if their icon
        //image is already imported or not
        await createWeatherDOM(dayData); 
        
    };
}

export { setDisplay };