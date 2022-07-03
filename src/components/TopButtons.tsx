import React from "react";
import PropTypes from "prop-types";
import { searchParams } from "../services/WeatherService";

export interface city {
    id: number;
    title: string;
}

export interface TopButtonsProp {
    setQuery: React.Dispatch<React.SetStateAction<searchParams>>;
}

const TopButtons: React.FC<TopButtonsProp> = ({ setQuery }) => {
    const cities: city[] = [
        {
            id: 1,
            title: "London",
        },
        {
            id: 2,
            title: "Sydney",
        },
        {
            id: 3,
            title: "Tokyo",
        },
        {
            id: 4,
            title: "Toronto",
        },
        {
            id: 5,
            title: "Paris",
        },
    ];

    const handleClick = (cityName: string): void => {
        setQuery({ q: cityName });
    };

    return (
        <div className="flex items-center justify-around my-6">
            {cities.map((city) => (
                <button
                    key={city.id}
                    className="text-white text-lg font-medium"
                    onClick={() => handleClick(city.title)}
                >
                    {city.title}
                </button>
            ))}
        </div>
    );
};

export default TopButtons;
