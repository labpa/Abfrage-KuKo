import React, { FC, useEffect, useState } from 'react';
import dayjs from "dayjs";
import './css/App.css';
import benzel from './images/app/benzel-supporter.png'
import Vector from '../src/images/app/Vector.png';
import Karte from './images/app/karte-supporter.png'
import BarcodeReader from 'react-barcode-reader';


const App: FC = () => {
    const [data, setData] = useState<any>(null);
    const [dataWeather, setDataWeather] = useState<any>(null);
    const [eingabe, setEingabe] = useState<string>("");
    const [abfrage, setAbfrage] = useState<boolean>(false);
    const [warnung, setWarnung] = useState<boolean>(false);
    const [warnungText, setWarnungText] = useState<string | null>(null);
    // const exampleDate = dayjs('2024-06-01');
    const exampleDate = dayjs();
    const [noData, setNoData] = useState<boolean>(false);
    const [lastScannedId, setLastScannedId] = useState<string>("");
    const [scanTimeout, setScanTimeout] = useState<NodeJS.Timeout | null>(null);

    // Zeitangabe Anzeige Abfrage
    const normal = 15000; // 15 Sekunden -> Normale Abfrage
    const lang = 20000; // 20 Sekunden -> Abfrage mit Warnung
    const kurz = 3000; // 3 Sekunden -> Abfrage Falsche ID
    const resetTime = 15000; // 15 Sekunden -> Zeit nach der eine ID wieder gescannt werden kann

    // Lookup-Tabellen
    const waitingSpot: Record<string, string> = {
        bike: "Fahrrad",
        bottle: "Flasche",
        hat: "Hut",
        island: "Insel",
        keys: "Schlüssel",
        kitchen: "Küche",
        mic: "Mikro",
        mobile: "Mobile Zellen",
        null: "bitte erfragen",
        sofa: "Sofa",
        star: "Stern",
        sun: "Sonne",
        tent: "Zelt",
        tree: "Baum",
        turtle: "Taube",
        window: "bitte erfragen"
    };

    const days: Record<string, string> = {
        Mon: "Mo, Mon",
        Tue: "Di, Tue",
        Wed: "Mi, Wed",
        Thu: "Do, Thu",
        Fri: "Fr, Fri",
        Sat: "Sa, Sat",
        Sun: "So, Sun"
    };


    const resetLastScannedId = () => {
        setLastScannedId("");
    };

    // NFC-Reader
    const handleScan = async (data: string) => {
        if (data !== "" && data !== lastScannedId) {
            setEingabe(data);
            setLastScannedId(data);
            await fetchData(data); // Warte auf die Datenabfrage, bevor du fortfährst
            setAbfrage(true);

            if (scanTimeout) {
                clearTimeout(scanTimeout);
            }
            setScanTimeout(setTimeout(resetLastScannedId, resetTime));
        }
    };

    const handleError = (err: any) => {
        console.error(err);
    };

    const fetchData = async (input: string) => {
        try {
            const trimmedInput = input.trim();
            if (trimmedInput !== "") {
                const ausgabeResponse = await fetch(`https://supporter.kulturkosmos.de/api/self-service/shifts/${trimmedInput}`);

                if (!ausgabeResponse.ok) {
                    throw new Error('Fehler beim Abrufen der Schichtdaten');
                }

                const jsonData = await ausgabeResponse.json();
                const abfrageWarnung = await fetch('https://supporter.kulturkosmos.de/api/self-service/special-information');
                const jsonWarnung = await abfrageWarnung.json();

                if (jsonWarnung.data && jsonWarnung.data.text) {
                    const textWithoutTags = jsonWarnung.data.text.replace(/<[^>]*>/g, ' ');
                    setWarnung(true);
                    setWarnungText(textWithoutTags);
                }

                if (jsonData.data === null) {
                    setNoData(true);
                    setData(false);
                    setWarnung(false);
                } else {
                    setData(jsonData);
                }
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
        }
    };


    //Wetter Daten werden Geladen
    const fetchWeatherData = async () => {
        const apiKey = '4d1adda53bf636a53408d0cd1c5ba7b4';
        const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
        const city = 'Lärz';
        const units = 'metric';

        const url = `${apiUrl}?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const abfrageWetter = await response.json();
            setDataWeather(abfrageWetter);
            return abfrageWetter;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    };

    // Funktion, die alle 20 Minuten die Daten aktualisiert
    const fetchWeatherPeriodically = () => {
        const interval = setInterval(async () => {
            try {
                await fetchWeatherData();
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }, 15 * 60 * 1000); // 15 Minuten in Millisekunden umgerechnet

        // Initialen Aufruf außerhalb des Intervals
        fetchWeatherData();

        // Rückgabe einer Funktion zum Beenden des Intervals, falls nötig
        return () => clearInterval(interval);
    };


    // useEffect Wetter
    useEffect(() => {
        fetchWeatherPeriodically();
    }, []);


    // useEffect Zeit der Abfrage
    useEffect(() => {
        if (noData) {
            const timer = setTimeout(() => {
                setNoData(false);
                setWarnung(false);
                setAbfrage(false);
            }, kurz); // 3 seconds
            return () => clearTimeout(timer);
        }

        if (abfrage) {
            const timeoutDauer = warnung ? lang : normal;
            const timer = setTimeout(() => {
                setAbfrage(false);
                setWarnung(false);
            }, timeoutDauer);
            return () => clearTimeout(timer);
        }

    }, [abfrage, warnung, normal, lang, kurz, noData]);

    return (
        <div>
            <div className={"grundflaeche"}>
                {/*<div className={`uhrzeit${abfrage ? ' left' : ''}`}>I0I00I00000</div>*/}
                <div className={!abfrage ? "box" : "box boxleft"}>
                    {!abfrage ? (
                        <>
                            <h2>Supporter:innen Schichtauskunft</h2>
                            <h3>Supporter Shiftinformation</h3>
                            <h4 className={"deutsch"}>Bitte halte dein Bändsel unter den Scanner</h4>
                            <h5 className={"englisch"}>Please hold your wristband under the scanner</h5>
                            <img src={benzel} alt="benzel" className="benzel" />
                            <div className={"wetter"}>
                                {dataWeather && dataWeather.weather && dataWeather.weather.length > 0 ? (
                                    <div className={"wetter-info"}>
                                        <p className={"location"}>{dataWeather.name}</p>
                                        <img
                                            className={"logo"}
                                            src={`https://openweathermap.org/img/wn/${dataWeather.weather[0].icon}@2x.png`}
                                            alt={""}
                                        />
                                        <p className={"weather-description"}>{dataWeather.weather[0].description}</p>
                                        <p className={"temperature"}>Temperature: {Math.round(dataWeather.main.temp)} °C</p>
                                        <p className={"feels-like"}>Feels like: {Math.round(dataWeather.main.feels_like)} °C</p>
                                        <p className={"wind-speed"}>Wind: {dataWeather.wind.speed} m/s</p>
                                    </div>
                                ) : null}
                            </div>

                        </>
                    ) : (
                        <>
                            {warnung && (
                                <div className={"scroll-container"}>
                                    <div className={"warnung"}>
                                        <div className={"warnung-text"}>{warnungText}</div>
                                    </div>
                                </div>
                            )}
                            {data ? (
                                <>
                                    <h4 className={"deutsch-ausgabe"}>Deine Schichten</h4>
                                    <h5 className={"englisch-ausgabe"}>Your Shifts</h5>
                                    {data.data && data.data.length > 0 ? (
                                        data.data
                                            .filter((entry: any) => dayjs(entry.startAt).isAfter(exampleDate) || dayjs(entry.startAt).isSame(exampleDate, 'day'))
                                            .sort((a: any, b: any) => dayjs(a.startAt).diff(exampleDate) - dayjs(b.startAt).diff(exampleDate))
                                            .slice(0, 3)
                                            .map((entry: any, index: number) => (
                                                <div className={"ausgabeabfrage"} key={index}>
                                                    <div className="main-content">
                                                        <p className={"index"}>{index + 1}</p>
                                                        <p className={"days"}><strong>{days[dayjs(entry.startAt).format('ddd')]}</strong> // {dayjs(entry.startAt).format('DD.MM - HH:mm')}</p>
                                                        <p className={"place"}><img src={Vector} alt="Vector" className="Vector" /> &nbsp; &nbsp; &nbsp;  {waitingSpot[entry.waitingSpot]}</p>
                                                    </div>
                                                    <p className="needs">{entry.description}</p>
                                                </div>
                                            ))
                                    ) : (
                                        <p></p>
                                    )}
                                </>
                            ) : (
                                noData  && (
                                    <div className={"noDataLeft"}>
                                        <h4 className={"deutsch-ausgabe-no"}>Keine Informationen</h4>
                                        <h5 className={"englisch-ausgabe-no"}>No Information</h5>
                                    </div>

                                )
                            )}
                        </>
                    )}
                </div>
                <div className={`dreieckSupportercare${abfrage ? ' left' : ''}`}></div>
                <div className={`supportercare${abfrage ? ' left' : ''}`}>Supporter:innen Care</div>
                <div className={`dreieckCheckin${abfrage ? ' left' : ''}`}></div>
                <div className={`checkin${abfrage ? ' left' : ''}`}>Supporter:innen Check-In</div>
                <img src={Karte} alt={"Karte"} className={`Karte${abfrage ? ' left' : ''}`} />

            </div>

            <div className={"barcodeReader"}>
                <BarcodeReader
                    onError={handleError}
                    onScan={handleScan}
                />
            </div>
        </div>
    );
};

export default App;