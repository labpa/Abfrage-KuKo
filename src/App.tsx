import React, { FC, useEffect, useState } from 'react';
import dayjs from "dayjs";
import './css/App.css';
import benzel from '../src/images/app/grafik 1.png';
import Vector from '../src/images/app/Vector.png';
import Karte from '../src/images/app/map.png';
import Pfeil from '../src/images/app/pfeil.png'
import Beschriftung from '../src/images/app/beschriftung.png'
import BarcodeReader from 'react-barcode-reader';

const App: FC = () => {
    const [data, setData] = useState<any>(null);
    const [eingabe, setEingabe] = useState<string>("");
    const [abfrage, setAbfrage] = useState<boolean>(false);
    const [warnung, setWarnung] = useState<boolean>(false);
    const [warnungText, setWarnungText] = useState<string | null>(null);
    // const now: dayjs.Dayjs = dayjs(); todo: exampleDate = now
    const exampleDate = dayjs('2023.01.01');

    const [noData, setNoData] = useState<boolean>(false);

console.log(warnungText);

    const handleScan = async (data: string) => {
        if (data !== "") {
            setEingabe(data);
            await fetchData(data); // Warte auf die Datenabfrage, bevor du fortfährst
            setAbfrage(true);
        } else {
            alert("Leer nicht möglich");
        }
    };

    const handleError = (err: any) => {
        console.error(err);
    };

    const normal = 10000; // 10 seconds
    const lang = 15000; // 15 seconds
    const short = 3000; // 3 seconds

    const waitingSpot: Record<string, string> = {
        bike: "Fahrrad",
        bottle: "Flasche",
        island: "Insel",
        keys: "Schlüssel",
        kitchen: "Küche",
        mic: "Mikro",
        mobile: "Mobile Zellen",
        sofa: "Sofa",
        star: "Stern",
        sun: "Sonne",
        tent: "Zelt",
        tree: "Baum",
        turtle: "Taube",
        window: "bitte erfragen"
    };

    //Übersetzung der Tage
    const days: Record<string, string> = {
        Mon: "Mo, Mon",
        Tue: "Di, Tue",
        Wed: "Mi, Wed",
        Thu: "Do, Thu",
        Fri: "Fr, Fri",
        Sat: "Sa, Sat",
        Sun: "So, Sun"
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


    useEffect(() => {
        if (abfrage) {
            const timeoutDauer = warnung ? lang : normal;
            const timer = setTimeout(() => {
                setAbfrage(false);
                setWarnung(false);
            }, timeoutDauer);

            return () => clearTimeout(timer);
        }
    }, [abfrage, warnung, normal, lang]);

    useEffect(() => {
        if (noData) {
            const timer = setTimeout(() => {
                setNoData(false);
                setWarnung(false);
                setAbfrage(false);
            }, short); // 3 seconds

            return () => clearTimeout(timer);
        }
    }, [noData]);

    return (
        <div>
            <div className={"grundflaeche"}>
                <div className={!abfrage ? "box" : "box boxleft"}>
                    {!abfrage ? (
                        <>
                            <h2>Supporter Schichtauskunft</h2>
                            <h3>Supporter Shiftinformation</h3>
                            <h4 className={"deutsch"}>Bitte halte dein Bändsel unter den Scanner</h4>
                            <h5 className={"englisch"}>Please hold your wristband under the scanner</h5>
                            <img src={benzel} alt="benzel" className="benzel" />
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
                            <h2>Supporter Schichtauskunft</h2>
                            <h3>Supporter Shiftinformation</h3>
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
                                                    <p className={"index"}>{index + 1}</p>
                                                    <p className={"days"}><strong>{days[dayjs(entry.startAt).format('ddd')]}</strong> // {dayjs(entry.startAt).format('DD.MM - HH:mm')}</p>
                                                    <p className={"vector"}> <img src={Vector} alt="Vector" className="Vector" /></p>
                                                    <p className={"place"}>{waitingSpot[entry.waitingSpot]}</p>
                                                    <br />
                                                </div>
                                            ))
                                    ) : (
                                        <p></p>
                                    )}
                                </>
                            ) : (
                                noData && (
                                    <>
                                        <h4 className={"deutsch-ausgabe-no"}>Keine Informationen</h4>
                                        <h5 className={"englisch-ausgabe-no"}>No Information</h5>
                                    </>
                                )
                            )}
                        </>
                    )}
                </div>
                <img src={Karte} alt={"Karte"} className={`Karte${abfrage ? ' in' : ''}`} />
                <img src={Pfeil} alt={"Pfeil"} className={`Pfeil ${abfrage ? 'ok' : ''}`}/>
                <img src={Beschriftung} alt={"Beschriftung"} className={`Beschriftung ${abfrage ? 'ko' : ''}`}/>

            </div>

            <div className={"wip"}>
                <BarcodeReader
                    onError={handleError}
                    onScan={handleScan}
                />
            </div>
        </div>
    );
};

export default App;