import { parse, format } from 'date-fns';

document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector("dialog").close();
});

document.addEventListener("click", (e) => {
    if (document.querySelector("dialog").open) {
        if (e.target === document.querySelector("dialog")) {
            document.querySelector("dialog").close();
        }
    }
});

function setBackground(data) {
    let hour = Number(data.slice(0,2));
    let body = document.querySelector("body");
    if (hour >= 6 && hour < 13) {
        body.setAttribute("id", "morning");
    } else if (hour >= 13 && hour < 20) {
        body.setAttribute("id", "afternoon");
    } else {
        body.setAttribute("id", "night");
    }
};

function clearDisplay(display) {
    while(display.lastElementChild) {
        display.removeChild(display.lastElementChild);
    };
};

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
    };
};

function createElement(elementType, text, styleClass, parent) {
    let element = document.createElement(elementType);
    element.textContent = text;
    if (styleClass) {
        element.classList.add(styleClass);
    }
    parent.appendChild(element);

    return element;
};

async function createIcon(imageName, parent) {
    let icon = document.createElement("img");
    icon.src = await getImage(imageName);
    icon.classList.add("icon");
    parent.appendChild(icon);
};

async function displayActiveCard(data) {
    const activeDisplay = document.querySelector("#weatherStats");
    clearDisplay(activeDisplay);

    //Header
    let header = createElement("div", "", "header", activeDisplay);

    await createIcon(data.get("icon"), header);

    let dateDiv = createElement("div", "", "date", header);
    let parsedDate = parse(data.get("datetime"), 'yyyy-MM-dd', new Date());
    createElement("h1", format(parsedDate, 'EEEE'), undefined, dateDiv);
    createElement("p", format(parsedDate, 'LLLL do, yyyy'), undefined, dateDiv);

    createElement("p", data.get("description"), "description", header);

    //Content
    let content = createElement("div", "", "content", activeDisplay);

    let stat = createElement("div", "", "stat", content);
    await createIcon("thermometer-low", stat);
    let tempDiv = createElement("div", "", "temp", stat);
    createElement("p", `Low: ${data.get("tempMin")}°F`, undefined, tempDiv);
    createElement("p", `High: ${data.get("tempMax")}°F`, undefined, tempDiv);

    stat = createElement("div", "", "stat", content);
    await createIcon("weather-windy", stat);
    createElement("p", `Wind: ${data.get("windspeed")}mph`, undefined, stat);

    stat = createElement("div", "", "stat", content);
    await createIcon("water-alert-outline", stat);
    createElement("p", `Chance of Rain: ${data.get("rainChance")}%`, undefined, stat);

    stat = createElement("div", "", "stat", content);
    await createIcon("cloud-outline", stat);
    createElement("p", `Cloud Coverage: ${data.get("cloudcover")}%`, undefined, stat);

    stat = createElement("div", "", "stat", content);
    await createIcon("water-percent", stat);
    createElement("p", `Humidity: ${data.get("humidity")}%`, undefined, stat);

    document.querySelector("dialog").showModal();
};

async function createWeatherDOM(data) {

    const weatherCard = createElement("div", "", "weatherCard", 
        document.querySelector("#weatherCardDisplay"));

    await createIcon(data.get("icon"), weatherCard);

    let parsedDate = parse(data.get("datetime"), 'yyyy-MM-dd', new Date());
    createElement("p", format(parsedDate, 'ccc'), "day", weatherCard);
    createElement("p", format(parsedDate, "MM/dd/yyyy"), "datetime", weatherCard);

    let tempDiv = createElement("div", "", "temp", weatherCard);
    createElement("p", `L: ${data.get("tempMin")}°F`, undefined, tempDiv);
    createElement("p", `H: ${data.get("tempMax")}°F`, undefined, tempDiv);

    createElement("p", data.get("conditions"), "conditions", weatherCard);

    weatherCard.addEventListener("click", (e) => {
        displayActiveCard(data);
    })

};

async function setDisplay(data) {
    clearDisplay(document.querySelector("#weatherCardDisplay"));
    setBackground(data.currentConditions.datetime);

    for (const day of data.days.slice(0, 7)) { //get only next 7 days
        let dayData = parseWeatherData(day);

        //need to await the creation of each day so that it displays in the correct order
        //without await, some days will load before others depending on if their icon
        //image is already imported or not
        await createWeatherDOM(dayData); 
        
    };
};

export { setDisplay };