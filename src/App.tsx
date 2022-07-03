import React, { useState, useEffect } from "react";
import "./App.css";
// @ts-ignore
import UilReact from "@iconscout/react-unicons/icons/uil-react";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData, {
    forecastObject,
} from "./services/WeatherService";
import { searchParams } from "./services/WeatherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface weatherObject {
    timezone: any;
    daily: forecastObject[];
    hourly: forecastObject[];
    lat: any;
    lon: any;
    temp: any;
    feels_like: any;
    temp_min: any;
    temp_max: any;
    humidity: any;
    name: any;
    dt: number;
    country: any;
    sunrise: any;
    sunset: any;
    details: any;
    icon: any;
    speed: any;
}

function App() {
    const [query, setQuery] = useState<searchParams>({ q: "Orlando" });
    const [units, setUnits] = useState("metric");
    const [weather, setWeather] = useState<weatherObject>();

    const formatBackground = () => {
        if (!weather) return "from-cyan-700 to-blue-700";

        const threshold = units === "metric" ? 20 : 68;

        if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

        return "from-yellow-600 to-orange-700";
    };

    useEffect(() => {
        const fetchWeather = async () => {
            const message = query.q ? query.q : "current location.";

            toast.info("Fetching weather for " + message);

            const data = await getFormattedWeatherData({ ...query, units });
            toast.success(`Successfully fetched weather for ${data.name}`);
            console.log(data);
            setWeather(data);
        };

        fetchWeather();
    }, [query, units]);

    return (
        <div
            className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br ${formatBackground()} h-fit shadow-xl shadow-gray-400`}
        >
            <TopButtons setQuery={setQuery} />
            <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

            {weather && (
                <div>
                    <TimeAndLocation weather={weather} />
                    <TemperatureAndDetails weather={weather} />
                    <Forecast title="hourly forecast" items={weather.hourly} />
                    <Forecast title="daily forecast" items={weather.daily} />
                </div>
            )}

            <ToastContainer
                autoClose={5000}
                theme="colored"
                newestOnTop={true}
            />
        </div>
    );
}

export default App;
