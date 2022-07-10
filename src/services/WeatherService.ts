import { DateTime } from "luxon";
import { weatherObject } from "../App";

const BASE_URL = "https://api.openweathermap.org/data/2.5/"

export interface searchParams {
    q?: string;
    lat?: number;
    lon?: number;
    exclude?: string;
    units?: string;
}

export interface forecastObject {
    title: number
    temp: number
    icon: string
}

const getWeatherData = (infoType: string, queryParams: searchParams) => {
    // Create the first part of the url without the any query information. Note that infoType specify for us what specific endpoint we want to hit
    // FIXME: in the new URL, make sure we need the "/" between the BASE_URL and infotype. This really needs to be checked when it is deployed since there seems to be an extra // between the BASE_RL and infotype
    const url: URL = new URL(BASE_URL + "/" + infoType);

    // Loop through the objects properties and value of each properties. We want to add these items to the url query. This will make the query part of the url look like ?{key}={value}&{next key}={next value}...
    for (const [key, value] of Object.entries(queryParams)) {
        url.searchParams.set(key, String(value));
    }

    url.searchParams.set("appid", process.env.REACT_APP_API_KEY as string);

    // When we finish creating the url, our url well be formatte like the following:
    // BASE_URL/infoType?{key=value&nextKey=Value...}

    return fetch(url).then((res) => res.json());
}

const formatCurrentWeather = (data: any) => {
    // We are object destructuring data. Note here that data has nested objects in it that we are also object destructuring (like coord to get lat and lon. Also refer to main, sys, and wind)
    const {
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather,
        wind: {speed}
    } = data;

    // Weather is an array of objects (actually it's an array with only 1 object)
    // Weather has multiple attributes that we don't want so we use object destructuring to only get attributes we want
    // We also rename the main attribute from weather to details
    const {main: details, icon} = weather[0];

    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, country, sunrise, sunset, details, icon, speed};
}

const formatForecastWeather = (data: any) => {
    let {timezone, daily, hourly} = data;
    // We are accessing index 1 to start since index 0 is the current day. We don't want to current day since our daily forecase will start showing information starting with the next day
    daily = daily?.slice(1, 6).map((d: any) => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        }
    });
    
    // Our starting index is 1 for the same reason as formatForecastWeather, only instead by day, it's by hour (and of course we don't want to show the weather of the current hour in our hourly forecase).
    hourly = hourly.slice(1, 6).map((d: any) => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon
        }
    });

    return {timezone, daily, hourly};
}

const getFormattedWeatherData = async (queryParams: searchParams) => {
    // This API call allows use to get information about the current weather
    const currentWeather = await getWeatherData('weather', queryParams);
    console.log(currentWeather);
    const formattedCurrentWeather: weatherObject = formatCurrentWeather(currentWeather);

    const {lat, lon} = formattedCurrentWeather;

    // This API call allows use to get information about the hourly and daily weather 
    const forecastWeather = await getWeatherData('onecall', {
        lat, lon, exclude: 'current,minutely,alerts', units: queryParams.units
    })
    const formattedForecastWeather = formatForecastWeather(forecastWeather);

    return {...formattedCurrentWeather, ...formattedForecastWeather};
}

const formatToLocalTime = (secs: number, zone: string, format: string = "cccc, dd, LLL yyyy' | Local time: 'hh:mm a") => {
    return DateTime.fromSeconds(secs).setZone(zone).toFormat(format)
};

const iconUrlFromCode = (code: string) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };
