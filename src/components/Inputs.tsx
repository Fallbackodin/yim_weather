import React, { useState } from "react";
// @ts-ignore
import { UilSearch, UilLocationPoint } from "@iconscout/react-unicons";
import { searchParams } from "../services/WeatherService";
import { toast } from "react-toastify";

export interface InputsProp {
    setQuery: React.Dispatch<React.SetStateAction<searchParams>>;
    units: string;
    setUnits: React.Dispatch<React.SetStateAction<string>>;
}

const Inputs: React.FC<InputsProp> = ({ setQuery, units, setUnits }) => {
    const [city, setCity] = useState("");
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
        console.log(city);
    };

    const handleSearchClick = () => {
        console.log(city);
        if (city !== "") {
            setQuery({ q: city });
        }
    };

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                setQuery({
                    lat,
                    lon,
                });
            });
        }
    };

    const handleUnitChange = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const selectedUnit = e.currentTarget.name;
        if (units !== selectedUnit) setUnits(selectedUnit);
    };

    return (
        <div className="flex flex-row justify-center my-6">
            <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
                <input
                    type="text"
                    placeholder="search for city..."
                    className="text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize"
                    onChange={(e) => {
                        handleInput(e);
                    }}
                />
                <UilSearch
                    size={25}
                    className="text-white cursor-pointer transition ease-out hover:scale-125"
                    onClick={handleSearchClick}
                />
                <UilLocationPoint
                    size={25}
                    className="
                    text-white
                    cursor-pointer transition ease-out hover:scale-125"
                    onClick={handleLocationClick}
                />
            </div>

            <div className="flex flex-row w-1/4 items-center justify-center">
                <button
                    name="metric"
                    className="text-xl text-white font-light transition ease-out hover:scale-125"
                    onClick={handleUnitChange}
                >
                    °C
                </button>
                <p className="text-xl text-white mx-1">|</p>
                <button
                    name="imperial"
                    className="text-xl text-white font-light transition ease-out hover:scale-125"
                    onClick={handleUnitChange}
                >
                    °F
                </button>
            </div>
        </div>
    );
};

export default Inputs;
