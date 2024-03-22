import React, { FC, useState } from 'react';
import dayjs from "dayjs";
import './css/App.css'

const App: FC = () => {
    //data und eingabe werden deklariert
    const [data, setData] = useState<any>(null);
    const [eingabe, setEingabe] = useState<string>("");

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
    };
console.log(data);

    return (
        <div>
            <h1>Abfrage Supporter {eingabe}</h1>
            {data && data.data
                .sort((a: any, b: any) => dayjs(a.startAt).unix() - dayjs(b.startAt).unix())
                .map((entry: any, index: number) => (
                    <div key={index}>
                        <p><strong>Zeit: </strong>{dayjs(entry.startAt).locale('de').format('DD.MM.YYYY HH:mm')}</p>
                        <p><strong>Treffpunkt: </strong>{waitingSpot[entry.waitingSpot]}</p>
                        <br />
                    </div>
                ))
            }

            {/*Wird später durch NFC-Reader eingabe ersetzt*/}
            <div>
                <input
                    type="text"
                    placeholder="ID"
                    value={eingabe}
                    onChange={(e) => setEingabe(e.target.value)}
                />
                <button onClick={handleClick}>Abfragen</button>
                <button onClick={() => window.location.reload()}>Reset</button>
            </div>

            {/*Kann später alles raus.*/}
            <br />
            <div>
                <button onClick={()=> setEingabe("0492131A757780")}>0492131A757780</button>
            </div>
            <br />
            <div>
                <button onClick={()=> setEingabe("04ABE51A757780")}>04ABE51A757780</button>
            </div>
            <br />
            <div>
                <button onClick={()=> setEingabe("048DCC1A757780")}>048DCC1A757780</button>
            </div>
            <br />
            <div>
                <button onClick={()=> setEingabe("04E0FD1A757780")}>04E0FD1A757780</button>
            </div>
            <br />
            <div>
                <button onClick={()=> setEingabe("049E0D1A757784")}>049E0D1A757784</button>
            </div>
            <br />
            <div>
                <button onClick={()=> setEingabe("0433541A757780")}>0433541A757780</button>
            </div>
            <br />
            <div>
                <button onClick={()=> setEingabe("04BB2B6ABE6F80")}>04BB2B6ABE6F80</button>
            </div>
        </div>
    );
};

export default App;