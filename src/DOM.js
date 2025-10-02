import { parse, format } from 'date-fns';

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

    createElement("p", data.get("condigions"), "conditions", weatherCard);

};

async function setDisplay(data) {
    clearDisplay(document.querySelector("#weatherCardDisplay"));

    for (const day of data.days.slice(0, 7)) { //get only next 7 days
        let dayData = parseWeatherData(day);

        //need to await the creation of each day so that it displays in the correct order
        //without await, some days will load before others depending on if their icon
        //image is already imported or not
        await createWeatherDOM(dayData); 
        
    };
};

export { setDisplay };