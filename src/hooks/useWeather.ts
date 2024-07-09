import axios from "axios";
import { SearchType } from "../types";
import { z } from "zod";
import { useMemo, useState } from "react";

const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_min: z.number(),
        temp_max: z.number(),
    }),
});

export type Weather = z.infer<typeof Weather>;

const initialState: Weather = {
    name: "",
    main: {
        temp: 0,
        temp_min: 0,
        temp_max: 0,
    },
};

export default function useWeather() {
    const [weather, setWeather] = useState<Weather>(initialState);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const fetchWeather = async (search: SearchType) => {
        setLoading(true);

        setWeather(initialState);

        const appId = import.meta.env.VITE_API_KEY;
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;

        try {
            const { data } = await axios.get(geoUrl);

            if (data.length === 0) {
                setNotFound(true);
                return;
            }

            setNotFound(false);

            const lat = data[0].lat;
            const lon = data[0].lon;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

            const { data: weatherResult } = await axios.get(weatherUrl);
            const result = Weather.safeParse(weatherResult);
            if (result.success) {
                setWeather(result.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const hasWeatherData = useMemo(() => {
        return weather.name !== "";
    }, [weather]);

    return {
        weather,
        fetchWeather,
        hasWeatherData,
        loading,
        notFound,
    };
}
