# Entwicklerdokumentation

## Einführung

[Hier kommt eine Einführungstext hin, der den Zweck der Dokumentation erläutert.]

## Code-Überblick

### Importierte Bibliotheken
- **React**: Die Hauptbibliothek zur Erstellung von React-Komponenten.
- **FC**: Function Component.
- **useEffect und useState**: React-Hooks zur Verwaltung des Komponentenzustands und zur Behandlung von Seiteneffekten.
- **dayjs**: Eine Bibliothek zur einfachen Handhabung von Datums- und Zeitangaben.
- **react-barcode-reader**: Eine React-Komponente zum Lesen von Barcode- und QR-Codes von Geräten, die als Tastatureingabe funktionieren.

### Zustandsvariablen
- **data - any**: In "data" werden die abgerufenen Informationen zu den Schichten gespeichert.
- **eingabe - string**: Enthält die Eingabe des Benutzers in Form einer UID. Wurde zu Testzwecken erstellt, um eine UID manuell eingeben zu können. Im Betrieb wird die gescannte UID jedoch in der Variablen "uid" gespeichert.
- **uid - string**: Enthält die gescannte UID des NFC-Bändchens. Ersetzt später "eingabe".
- **abfrage - boolean**: Gibt an, ob gerade eine Abfrage für Schichtinformationen aktiv ist bzw. getätigt wird.
- **warnung - boolean**: Wenn eine aktive Warnung besteht, wird "warnung" auf true gesetzt.
- **warnungAusgabe - string**: Wenn es eine Warnung gibt, wird der Inhalt der Warnung in "warnungAusgabe" gespeichert.
- **noData - boolean**: Wenn es bei einer Abfrage der UID keine Daten als Rückgabe von der API gibt, wird "noData" auf true gesetzt und auf dem Display wird über das Fehlen von Daten bzw. das Nicht-Korrektsein der UID informiert.

### Funktionen
- **handleScan**: Wird aufgerufen, wenn ein Bändchen gescannt wird. Speichert die UID in die Variable "uid" und startet die Datenabfrage.
- **fetchData**: Ruft die Schichtinformationen über die API ab. Gibt es von der API Daten zu Schichten, werden diese in "data" gespeichert. Sollte die Rückgabe der API NULL sein, wird "noData" auf true.

### handleClick
Wird aufgerufen, wenn der Abfrage-Button geklickt wird. Startet die Datenabfrage mit dem Wert von "eingabe". Im Betrieb spielt handleClick keine Rolle mehr und ist auskommentiert. Wird für die manuelle Eingabe/Abfrage der UID während der Testphase verwendet.

### Schnittstellen

[Hier können Informationen zu Schnittstellen stehen, die das Modul bereitstellt oder verwendet.]

### UI-Funktionalität

[Hier können Details zur Benutzeroberfläche stehen, z. B. wie sie funktioniert, wie sie aussieht usw.]

### Bilder

[Hier können Bilder von relevanten Teilen der Anwendung eingefügt werden, z. B. Screenshots der Benutzeroberfläche.]

### CSS-Styling

[Hier können Informationen zum verwendeten CSS-Styling stehen, z. B. Klassenstrukturen, verwendete Frameworks usw.]
