import React, { useState, useEffect } from "react";
import "./App.css";
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
    timezone?: string;
    daily?: forecastObject[];
    hourly?: forecastObject[];
    lat: number;
    lon: number;
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    name: string;
    dt: number;
    country: string;
    sunrise: number;
    sunset: number;
    details: string;
    icon: string;
    speed: number;
}

function App() {
    const [query, setQuery] = useState<searchParams>({ q: "Orlando" });
    const [units, setUnits] = useState("metric");
    const [weather, setWeather] = useState<weatherObject>();

    const formatBackground = () => {
        let backgroundGradient = "from-cyan-700 to-blue-700";

        if (!weather) return backgroundGradient;

        const threshold = units === "metric" ? 20 : 68;

        if (weather.temp <= threshold) {
            backgroundGradient = "from-cyan-700 to-blue-700";
        } else {
            backgroundGradient = "from-yellow-600 to-orange-700";
        }

        if (!(weather.sunrise <= weather.dt && weather.dt <= weather.sunset))
            backgroundGradient = "from-gray-800 via-gray-800 to-gray-800";

        return backgroundGradient;
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
            className={`mx-auto max-w-full py-5 px-96 bg-gradient-to-br ${formatBackground()} min-h-screen h-fit shadow-xl shadow-gray-400`}
        >
            <TopButtons setQuery={setQuery} />
            <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

            {weather && (
                <div>
                    <TimeAndLocation weather={weather} />
                    <TemperatureAndDetails weather={weather} />
                    <Forecast title="hourly forecast" items={weather.hourly!} />
                    <Forecast title="daily forecast" items={weather.daily!} />
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
