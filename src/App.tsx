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
    const [uid, setUid] = useState<string>("");

    console.log(data);

    const handleScan = async (data: string) => {
        if (data !== "") {
            setUid(data);
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
    const lang = 18000; // 18 seconds

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
                const testResponse = await fetch('https://supporter.kulturkosmos.de/api/self-service/special-information');
                const jsonTest = await testResponse.json();

                if (jsonTest.data && jsonTest.data.text) {
                    console.log(jsonTest.data.text);
                    setWarnung(true);
                    setWarnungText(jsonTest.data.text);
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
            }, 3000); // 3 seconds

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









//todo Alt -> noch mal vergleichen, dann Löschen!


// import React, { FC, useEffect, useState} from 'react';
// import dayjs from "dayjs";
// import './css/App.css'
// import benzel from "../src/images/app/grafik 1.png"
// import Vector from '../src/images/app/Vector.png'
// import Karte from '../src/images/app/map.png'
// import BarcodeReader from 'react-barcode-reader';
//
// const App: FC = () => {
//     // Daten und Eingabe werden deklariert
//     const [data, setData] = useState<any>(null);
//     const [eingabe, setEingabe] = useState<string>("");
//     const [abfrage, setAbfrage] = useState<boolean>(false);
//     const [warnung, setWarnung] = useState<boolean>(false);
//     const [warnungText, setWarnungText] = useState<any>(null);
//     const now: dayjs.Dayjs = dayjs();
//     const exampleDate = dayjs('2023.01.01'); //todo: exampleDate muss durch now ersetzt werden
//
//     // console.log(data);
//     console.log(warnungText);
//
//     //todo: weiter mit fetchData siehe Auskommentierter code
//     const [noData, setNoData] = useState<boolean>();
//     console.log(noData);
//
//     const [uid, setUid] = useState<string>("");
//     console.log(uid);
//
//     //Verarbeitung der eingabe des NFC-Scanners
//     const handleScan = async (data: any) => {
//         if (data !== "") {
//             setUid(data);
//             setEingabe(data);
//             await fetchData(); // Warte auf die Datenabfrage, bevor du fortfährst
//             setAbfrage(true);
//         } else {
//             alert("Leer nicht möglich");
//         }
//     }
//     const handleError = (err: any) => {
//         console.error(err);
//     }
//
//
//     //Zeit nach der die Ausgabe beendet wird
//     const normal = 10000; // 10 seconds
//     const lang = 18000; // 18 seconds
//
//
//     // Array mit Übersetzungen zu den Treffpunkten wird deklariert
//     const waitingSpot: Record<string, string> = {
//         bike: "Fahrrad",
//         bottle: "Flasche",
//         island: "Insel",
//         keys: "Schlüssel",
//         kitchen: "Küche",
//         mic: "Mikro",
//         mobile: "Mobile Zellen",
//         sofa: "Sofa",
//         star: "Stern",
//         sun: "Sonne",
//         tent: "Zelt",
//         tree: "Baum",
//         turtle: "Taube",
//         window: "bitte erfragen"
//     }
//
//     const days: Record<string, string> = {
//         Mon: "Mo, Mon",
//         Tue: "Di, Tue",
//         Wed: "Mi, Wed",
//         Thu: "Do, Thue",
//         Fri: "Fr, Fri",
//         Sat: "Sa, Sat",
//         Sun: "So, Sun"
//     }
//
//
//     // const fetchData = async () => {
//     //     try {
//     //         if (eingabe.trim() !== "") { // Überprüfung, ob Eingabe leer ist
//     //             const ausgabe = await fetch(`https://supporter.kulturkosmos.de/api/self-service/shifts/${eingabe}`);
//     //             if (!ausgabe.ok) {
//     //                 throw new Error('Fehler');
//     //             }
//     //             const jsonData = await ausgabe.json();
//     //             const test = await fetch('https://supporter.kulturkosmos.de/api/self-service/special-information');
//     //             const jsonTest = await test.json()
//     //             if(jsonTest.data.text !== null){
//     //                 setWarnung(true);
//     //                 setWarnungText(jsonTest.data.text)
//     //             }
//     //             console.log(jsonTest.data.text);
//     //
//     //             //todo: Der Block hier ist nur zum testen
//     //
//     //             // console.log(jsonData.data);
//     //             // console.log(jsonData.data === null); //todo: Hier weiter!!!!!
//     //             if(jsonData.data === null){
//     //                 // console.log("Keine Daten");
//     //                 setNoData(false);
//     //                 // console.log("Keine Daten:" + noData);
//     //             } else {
//     //                 // console.log("Hier sind die Daten:" + jsonData.data);
//     //                 setData(true);
//     //                 // console.log("Hier gibt es Daten" + noData)
//     //             }
//     //             setData(jsonData);
//     //         }
//     //     } catch (error) {
//     //         console.error('Error fetching data:', error);
//     //     }
//     // };
//
//
//
//     const fetchData = async () => {
//         try {
//             const trimmedInput = eingabe.trim();
//             if (trimmedInput !== "") {
//                 const ausgabeResponse = await fetch(`https://supporter.kulturkosmos.de/api/self-service/shifts/${trimmedInput}`);
//
//                 if (!ausgabeResponse.ok) {
//                     throw new Error('Fehler beim Abrufen der Schichtdaten');
//                 }
//
//                 const jsonData = await ausgabeResponse.json();
//                 const testResponse = await fetch('https://supporter.kulturkosmos.de/api/self-service/special-information');
//                 const jsonTest = await testResponse.json();
//
//                 if (jsonTest.data.text) {
//                     setWarnung(true);
//                     setWarnungText(jsonTest.data.text);
//                 }
//
//                 console.log(jsonTest.data.text !== null);
//
//                 if (jsonData.data === null) {
//                     setNoData(true);
//                 } else {
//                     setData(jsonData);
//                 }
//             }
//         } catch (error) {
//             console.error('Fehler beim Abrufen der Daten:', error);
//         }
//     };
//
//
//
//
//
//     const handleClick = () => {
//         if(eingabe !== ""){
//             fetchData();
//             setAbfrage(true);
//         }else {
//             alert("Leer nicht möglich")
//         }
//
//     };
//
//     // Neu laden der Seite todo: Aktivieren wenn fertig :D ÄNDERN
//     useEffect(() => {
//         if (!data || data.data === null) {
//             // console.log("Kein Ergebnis bei der Abfrage");
//             const timer = setTimeout(() => {
//                 setAbfrage(false);
//             }, 1000); // Timeout von 1 Sekunde
//             return () => clearTimeout(timer);
//         }
//
//         const timeoutDauer = abfrage && !warnung ? normal : lang;
//         const timer = setTimeout(() => {
//             setAbfrage(false);
//         }, timeoutDauer);
//
//         return () => clearTimeout(timer);
//     }, [abfrage, data, warnung, normal, lang]);


// useEffect(() => {
//     if (abfrage) {
//         const timeoutDauer = warnung ? lang : normal;
//         const timer = setTimeout(() => {
//             setAbfrage(false);
//             setWarnung(false);
//         }, timeoutDauer);
//
//         return () => clearTimeout(timer);
//     }
// }, [abfrage, warnung, normal, lang]);




//
//     return (
//         <div>
//             <div className={"grundflaeche"}>
//                 <div className={!abfrage ? "box" : "box boxleft"}>
//                     {!abfrage ? (
//                         <>
//                             <h2>Supporter Schichtauskunft</h2>
//                             <h3>Supporter Shiftinformation</h3>
//                             <h4 className={"deutsch"}>Bitte halte dein Bändsel unter den Scanner</h4>
//                             <h5 className={"englisch"}>Please hold your wristband under the scanner</h5>
//                             <img src={benzel} alt="benzel" className="benzel" />
//                         </>
//                     ) :  (
//                         <>
//                             {warnung && (
//                                 <div className={"scroll-container"}>
//                                     <div className={"warnung"}>
//                                         <div className={"warnung-text"}>{warnungText}</div>
//                                     </div>
//                                 </div>
//                             )}
//                             <h2>Supporter Schichtauskunft</h2>
//                             <h3>Supporter Shiftinformation</h3>
//                             <h4 className={"deutsch-ausgabe"}>Deine Schichten</h4>
//                             <h5 className={"englisch-ausgabe"}>Your Shifts</h5>
//
//                             {/* Sortierung nur, wenn Daten vorhanden sind */}
//                             {data && data.data && data.data.length > 0 && (
//                                 <>
//                                     {data.data
//                                         //Filtern nach Datum
//                                         .filter((entry: any) => dayjs(entry.startAt).isAfter(exampleDate) || dayjs(entry.startAt).isSame(exampleDate, 'day'))
//                                         //Sortieren
//                                         .sort((a: any, b: any) => dayjs(a.startAt).diff(exampleDate) - dayjs(b.startAt).diff(exampleDate))
//                                         // Ausgabe von index 0 dann die ersten 3 -> 0, 1, 2
//                                         .slice(0, 3)
//
//                                         .map((entry: any, index: number) => (
//                                             <div className={"ausgabeabfrage"} key={index}>
//                                                 <p className={"index"}>{index + 1}</p>
//                                                 {/*Anzeige des Wochentags und des Datums im gewünschten Format*/}
//                                                 <p className={"days"}><strong>{days[dayjs(entry.startAt).format('ddd')]}</strong> // {dayjs(entry.startAt).format('DD.MM - HH:mm')}</p>
//                                                 {/*Anzeigen des Vectors*/}
//                                                 <p className={"vector"}> <img src={Vector} alt="Vector" className="Vector" /></p>
//                                                 {/*Anzeige des Wartebereichs*/}
//                                                 <p className={"place"}>{waitingSpot[entry.waitingSpot]}</p>
//                                                 <br />
//                                             </div>
//                                         ))
//                                     }
//                                 </>
//                             )}
//                         </>
//
//                     )}
//                 </div>
//                 <img src={Karte} alt={"Karte"} className={`Karte${abfrage ? ' in' : ''}`}  />
//             </div>
//
//             <div className={"wip"}>
//                 {/*<input*/}
//                 {/*    type="text"*/}
//                 {/*    placeholder="ID"*/}
//                 {/*    value={eingabe}*/}
//                 {/*    onChange={(e) => setEingabe(e.target.value)}*/}
//                 {/*/>*/}
//                 {/*<button onClick={handleClick}>Abfragen</button>*/}
//                 {/*<button onClick={() => window.location.reload()}>Reset</button>*/}
//                 {/*<button onClick={() => setEingabe("0492131A757780")}>0492131A757780</button>*/}
//                 {/*<button onClick={() => setEingabe("04ABE51A757780")}>04ABE51A757780</button>*/}
//                 {/*<button onClick={() => setEingabe("048DCC1A757780")}>048DCC1A757780</button>*/}
//                 {/*<button onClick={() => setEingabe("04E0FD1A757780")} style={{ backgroundColor: 'green' }}>04E0FD1A757780</button>*/}
//                 {/*<button onClick={() => setEingabe("049E0D1A757784")}>049E0D1A757784</button>*/}
//                 {/*<button onClick={() => setEingabe("0433541A757780")}>0433541A757780</button>*/}
//                 {/*<button onClick={() => setEingabe("04BB2B6ABE6F80")}>04BB2B6ABE6F80</button>*/}
//                 {/*<button onClick={() => setEingabe("04E0dwedefregfrfgrfgFD1A757780")} style={{ backgroundColor: 'red' }}>04E0FD1A757780</button>*/}
//
//                 {/*<button onClick={() => setWarnung(true)}>Warnung An</button>*/}
//                 {/*<button onClick={() => setWarnung(false)}>Warnung Aus</button>*/}
//
//
//
//                 <BarcodeReader
//                     onError={handleError}
//                     onScan={handleScan}
//                 />
//                 {/*{uid && <p>Barcode detected: {uid}</p>}*/}
//             </div>
//         </div>
//     );
// };
//
// export default App;

