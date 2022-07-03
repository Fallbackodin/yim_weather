import { DateTime } from "luxon";

const BASE_URL = "https://api.openweathermap.org/data/2.5/"

export interface searchParams {
    q?: string;
    lat?: number;
    lon?: number;
    exclude?: string;
    units?: any;
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

    return fetch(url).then((res) => res.json()).then(data => data);
}

const formatCurrentWeather = (data: any) => {
    const {
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather,
        wind: {speed}
    } = data;

    const {main: details, icon} = weather[0];

    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, country, sunrise, sunset, details, icon, speed};
}

const formatForecastWeather = (data: any) => {
    let {timezone, daily, hourly} = data;
    daily = daily?.slice(1, 6).map((d: any) => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        }
    });
    
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
    const formattedCurrentWeather = await getWeatherData('weather', queryParams).then(data => formatCurrentWeather(data));

    const {lat, lon} = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData('onecall', {
        lat, lon, exclude: 'current,minutely,alerts', units: queryParams.units
    }).then(data => formatForecastWeather(data));

    return {...formattedCurrentWeather, ...formattedForecastWeather};
}

const formatToLocalTime = (secs: any, zone: any, format: string = "cccc, dd, LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code: any) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };
