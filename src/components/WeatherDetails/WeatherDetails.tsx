import { Weather } from "../../hooks/useWeather";
import { formatTemerature } from "../../utils";
import styles from "./WeatherDetails.module.css";

type WeatherDetailsProps = {
    weather: Weather;
};

export default function WeatherDetails({ weather }: WeatherDetailsProps) {
    return (
        <div className={styles.container}>
            <h2>Clima de: {weather.name}</h2>
            <p className={styles.current}>{formatTemerature(weather.main.temp)} °C</p>
            <div className={styles.temperatures}>
                <p>
                    Min:{" "}
                    <span>{formatTemerature(weather.main.temp_min)} °C</span>
                </p>
                <p>
                    Max:{" "}
                    <span>{formatTemerature(weather.main.temp_max)} °C</span>
                </p>
            </div>
        </div>
    );
}
