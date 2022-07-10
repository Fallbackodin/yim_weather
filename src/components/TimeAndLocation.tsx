import React from "react";
import { weatherObject } from "../App";
import { formatToLocalTime } from "../services/WeatherService";

export interface WeatherProp {
    weather: weatherObject;
}

const TimeAndLocation: React.FC<WeatherProp> = ({
    weather: { dt, timezone, name, country },
}) => {
    return (
        <div>
            <div className="flex items-center justify-center my-6">
                <p className="text-white text-xl font-extralight">
                    {formatToLocalTime(dt, timezone!)}
                </p>
            </div>
            <div className="flex items-center justify-center my-3">
                <p className="text-white text-2xl font-bold">{`${name}, ${country}`}</p>
            </div>
        </div>
    );
};

export default TimeAndLocation;
