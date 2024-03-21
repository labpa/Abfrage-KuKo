import React, { FC, useEffect, useState } from 'react';

const App: FC = () => {
    const [data, setData] = useState<any>(null);
    const [eingabe, setEingabe] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (eingabe.trim() !== "") { // Überprüfung, ob 'eingabe' leer ist
                    const response = await fetch(`https://supporter.kulturkosmos.de/api/self-service/shifts/${eingabe}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const jsonData = await response.json();
                    setData(jsonData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [eingabe]); // useEffect abhängig von 'eingabe'

    const handleSubmitEingabe = () => {
        console.log("HAllo WELT")
    }

    return (
        <div>
            <h1>Abfrage Supporter</h1>
            {data && (
                <div>
                    <p>Andere Daten: {JSON.stringify(data)}</p>
                </div>
            )}

            <div onSubmit={handleSubmitEingabe}>
                <input
                    type="text"
                    placeholder="ID"
                    value={eingabe} // value statt onChange
                    onChange={(e) => setEingabe(e.target.value)}
                />
                <button type={"submit"}>Check</button>

            </div>
                    </div>
    );
};

export default App;
