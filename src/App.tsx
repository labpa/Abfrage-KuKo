import React, {FC, useEffect, useState} from 'react';
import dayjs from "dayjs";
import './css/App.css'
import benzel from "../src/images/app/grafik 1.png"
import Vector from '../src/images/app/Vector.png'
import Karte from '../src/images/app/map.png'


const App: FC = () => {
    //data und eingabe werden deklariert
    const [data, setData] = useState<any>(null);
    const [eingabe, setEingabe] = useState<string>("");
    const [test, setTest] = useState<boolean>(false);
    // console.log(test);

    //Array mit übersetzungen zu den Treffpunkten wird deklariert
    const waitingSpot : Record<string, string> = {
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

    const fetchData = async () => {
        try {
            if (eingabe.trim() !== "") { // Überprüfung, ob eingabe leer ist
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

    //Neu Laden der Seite todo: Aktivieren wenn fertig :D
    useEffect(() => {
        if(test === true){
            const reloadPage = setTimeout(()=> {
                window.location.reload();
            }, 10000);
            return() => clearTimeout(reloadPage);
        }

    }, [test]);


    return (
        <div>

            <div className={"grundflaeche"}> {/*Dieses DIV beinhaltet die Grundfläche*/}
                <div className={"box"}>
                    {!test ? (
                        <div className={"kleinebox"}>
                            <h2>Supporter Schichtauskunft</h2>
                            <h3>Supporter Shiftinformation</h3>
                            <h4 className={"deutsch"}>Bitte halte dein Bändsel unter den Scanner</h4>
                            <h5 className={"englisch"}>Please hold your wristband under the scanner</h5>
                            <img src={benzel} alt="benzel" className="benzel" />
                        </div>
                    ) : (
                        <div className={"alternativebox"}>
                            <h2>Supporter Schichtauskunft</h2>
                            <h3>Supporter Shiftinformation</h3>
                            <h4 className={"deutsch-ausgabe"}>Deine Schichten</h4>
                            <h5 className={"englisch-ausgabe"}>Your Shifts</h5>
                            {data && data.data
                                .sort((a: any, b: any) => dayjs(a.startAt).unix() - dayjs(b.startAt).unix())
                                .map((entry: any, index: number) => (
                                    <div className={"ausgabeabfrage"} key={index}>
                                        <p className={"index"}>{index + 1}</p>
                                        <p className={"days"}> {dayjs(entry.startAt).locale('de').format('ddd // DD.MM - HH:mm')}</p>
                                        <p className={"place"}> <img src={Vector} alt="Vector" className="Vector" />{waitingSpot[entry.waitingSpot]}</p>
                                        <br />
                                    </div>
                                ))
                            }

                            <img src={Karte} alt={"Karte"} className={"Karte"}/>
                        </div>
                    )}
                </div>
            </div>


            {/*Wird später durch NFC-Reader eingabe ersetzt*/}
            <div className={"wip"}>
                <input
                    type="text"
                    placeholder="ID"
                    value={eingabe}
                    onChange={(e) => setEingabe(e.target.value)}
                />
                <button onClick={handleClick}>Abfragen</button>
                <button onClick={() => window.location.reload()}>Reset</button>
                <button onClick={()=> setEingabe("0492131A757780")}>0492131A757780</button>
                <button onClick={()=> setEingabe("04ABE51A757780")}>04ABE51A757780</button>
                <button onClick={()=> setEingabe("048DCC1A757780")}>048DCC1A757780</button>
                <button onClick={()=> setEingabe("04E0FD1A757780")} style={{backgroundColor: 'red'}}>04E0FD1A757780</button>
                <button onClick={()=> setEingabe("049E0D1A757784")}>049E0D1A757784</button>
                <button  onClick={()=> setEingabe("0433541A757780")}>0433541A757780</button>
                <button onClick={()=> setEingabe("04BB2B6ABE6F80")}>04BB2B6ABE6F80</button>
            </div>

        </div>
    );
};

export default App;