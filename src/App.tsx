import React, { FC, useEffect, useState } from 'react';
import dayjs from "dayjs";
import './css/App.css'
import benzel from "../src/images/app/grafik 1.png"
import Vector from '../src/images/app/Vector.png'
import Karte from '../src/images/app/map.png'

const App: FC = () => {
    // Daten und Eingabe werden deklariert
    const [data, setData] = useState<any>(null);
    const [eingabe, setEingabe] = useState<string>("");
    const [test, setTest] = useState<boolean>(false);
    const [warnung, setWarnung] = useState<boolean>(false);
    const now: dayjs.Dayjs = dayjs();
    const exampleDate = dayjs('2023-06-25'); //todo: exampleDate muss durch now ersetzt werden


    //Zeit nach der die Ausgabe beendet wird
    const falsch = 1;
    const normal = 10000; // 10 seconds
    const lang = 15000; // 15 seconds


    // Array mit Übersetzungen zu den Treffpunkten wird deklariert
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
    }

    const days: Record<string, string> = {
        Mon: "Mo, Mon",
        Tue: "Di, Tue",
        Wed: "Mi, Wed",
        Thu: "Do, Thue",
        Fri: "Fr, Fri",
        Sat: "Sa, Sat",
        Sun: "So, Sun"
    }

    const fetchData = async () => {
        try {
            if (eingabe.trim() !== "") { // Überprüfung, ob Eingabe leer ist
                const ausgabe = await fetch(`https://supporter.kulturkosmos.de/api/self-service/shifts/${eingabe}`);
                if (!ausgabe.ok) {
                    throw new Error('Fehler');
                }
                const jsonData = await ausgabe.json();
                setData(jsonData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClick = () => {
        fetchData();
        setTest(true);
    };

    // Neu laden der Seite todo: Aktivieren wenn fertig :D ÄNDERN

    useEffect(() => {
        if (!data) {
            return;
        }

        if (data.data === null) {
            console.log("Kein Ergebniss bei der Abfrage");
            const timer = setTimeout(() => {
                setTest(false);
                window.location.reload();  //todo: dass muss anders auch gehen!!!
            }, falsch);
            return () => clearTimeout(timer);
        }

        const timeoutDuration = test && !warnung ? normal : lang;

        const timer = setTimeout(() => {
            setTest(false);
        }, timeoutDuration);

        return () => clearTimeout(timer);
    }, [test, data, warnung]);


    return (
        <div>
            <div className={"grundflaeche"}>
                <div className={!test ? "box" : "box boxleft"}>
                    {!test ? (
                        <>
                            <h2>Supporter Schichtauskunft</h2>
                            <h3>Supporter Shiftinformation</h3>
                            <h4 className={"deutsch"}>Bitte halte dein Bändsel unter den Scanner</h4>
                            <h5 className={"englisch"}>Please hold your wristband under the scanner</h5>
                            <img src={benzel} alt="benzel" className="benzel" />
                        </>
                    ) :  (
                        <>
                            {warnung && (
                                <div className={"scroll-container"}>
                                    <div className={"warnung"}>
                                        <div className={"warnung-text"}> Irgend was mit Warnung! ... Hallo Volkram, guten Morgen!</div>
                                    </div>
                                </div>
                            )}
                            <h2>Supporter Schichtauskunft</h2>
                            <h3>Supporter Shiftinformation</h3>
                            <h4 className={"deutsch-ausgabe"}>Deine Schichten</h4>
                            <h5 className={"englisch-ausgabe"}>Your Shifts</h5>

                            {/* Sortierung nur, wenn Daten vorhanden sind */}
                            {data && data.data && data.data.length > 0 && (
                                <>
                                    {data.data
                                        .filter((entry: any) => dayjs(entry.startAt).isAfter(exampleDate) || dayjs(entry.startAt).isSame(exampleDate, 'day'))
                                        .sort((a: any, b: any) => dayjs(a.startAt).diff(exampleDate) - dayjs(b.startAt).diff(exampleDate))
                                        // Ausgabe von index 0 dann die ersten 3 -> 0, 1, 2
                                        .slice(0, 3)
                                        .map((entry: any, index: number) => (
                                            <div className={"ausgabeabfrage"} key={index}>
                                                <p className={"index"}>{index + 1}</p>
                                                <p className={"days"}>{days[dayjs(entry.startAt).format('ddd')]} // {dayjs(entry.startAt).format('DD.MM - HH:mm')}</p>
                                                <p className={"place"}> <img src={Vector} alt="Vector" className="Vector" />{waitingSpot[entry.waitingSpot]}</p>
                                                <br />
                                            </div>
                                        ))
                                    }
                                </>
                            )}
                        </>

                    )}
                </div>
                <img src={Karte} alt={"Karte"} className={`Karte${test ? ' in' : ''}`}  />
            </div>

            <div className={"wip"}>
                <input
                    type="text"
                    placeholder="ID"
                    value={eingabe}
                    onChange={(e) => setEingabe(e.target.value)}
                />
                <button onClick={handleClick}>Abfragen</button>
                <button onClick={() => window.location.reload()}>Reset</button>
                <button onClick={() => setEingabe("0492131A757780")}>0492131A757780</button>
                <button onClick={() => setEingabe("04ABE51A757780")}>04ABE51A757780</button>
                <button onClick={() => setEingabe("048DCC1A757780")}>048DCC1A757780</button>
                <button onClick={() => setEingabe("04E0FD1A757780")} style={{ backgroundColor: 'green' }}>04E0FD1A757780</button>
                <button onClick={() => setEingabe("049E0D1A757784")}>049E0D1A757784</button>
                <button onClick={() => setEingabe("0433541A757780")}>0433541A757780</button>
                <button onClick={() => setEingabe("04BB2B6ABE6F80")}>04BB2B6ABE6F80</button>
                <button onClick={() => setEingabe("04E0dwedefregfrfgrfgFD1A757780")} style={{ backgroundColor: 'red' }}>04E0FD1A757780</button>

                <button onClick={() => setWarnung(true)}>Warnung An</button>
                <button onClick={() => setWarnung(false)}>Warnung Aus</button>
            </div>
        </div>
    );
};

export default App;
