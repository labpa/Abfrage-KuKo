import React, { FC, useState } from 'react';

const App: FC = () => {
    const [data, setData] = useState<any>(null);
    const [eingabe, setEingabe] = useState<string>("");


    const fetchData = async () => {
        try {
            if (eingabe.trim() !== "") { // Überprüfung, ob 'eingabe' leer ist
                const ausgabe = await fetch(`https://supporter.kulturkosmos.de/api/self-service/shifts/${eingabe}`);
                if (!ausgabe.ok) {
                    throw new Error('Fehler');
                }
                const jsonData = await ausgabe.json();
                setData(jsonData);
                console.log(jsonData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClick = () => {
        fetchData();
    };

    return (
        <div>
            <h1>Abfrage Supporter {eingabe}</h1>
            {data && (
                <div>
                    <p>Andere Daten: {JSON.stringify(data)}</p>
                    <p>Test 1: {data.startAt}</p>
                    {/*<p>{data}</p>*/}
                </div>
            )}

            <div>
                <input
                    type="text"
                    placeholder="ID"
                    value={eingabe}
                    onChange={(e) => setEingabe(e.target.value)}
                />
                <button onClick={handleClick}>Abfragen</button>
            </div>
        </div>
    );
};

export default App;

