# Abfrage Supporter
## App erstellen
+ Git -> Neues leeres Repository erstellen -> Lokal klonen.
+ Lokalen Ordner im Terminal öffnen.
  + Initialisiert ein neues Node.js-Projekt: `yarn init -y`
  + Installiert create-react-app lokal auf dem System: `yarn global add create-react-app`
  + React-App mit Template Typescript erstellen: `yarn create react-app abfrage-supporter --template typescript`

## React aufräumen
+ Alle CSS- und Testdateien entfernen.
+ App.tsx zu Arrow Function und FC hinzugefügt.
+ Titel des index.html-Dokuments angepasst.

## Implementierung
### Abfrage

### Ausgabe
![ersteAusgabe.png](src%2Fimages%2Fdokumentation%2FersteAusgabe.png)  
Erste Abfrage. Daten werden als JSON String ausgegeben.
### Sortieren
+ Sortieren nach Datum
+ Sortieren nach Uhrzeit
  Zuerst findet eine Sortierung nach Datum statt. Zusätzlich, um die Reihenfolge der Schichten einzuhalten, wird noch nach der Uhrzeit sortiert. So wird an Tagen mit zwei Schichten zuerst die frühere und anschließend die spätere Schicht angezeigt.

### Übersetzen
Für die Übersetzung wurde ein Array erzeugt, in dem der englische Name wie in der API gespeichert ist und die deutsche Übersetzung gespeichert sind:

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
turtle: "Turtle",  
window: "bitte erfragen"

## Test

### Codes zum Testen:
0492131A757780  
04ABE51A757780  
048DCC1A757780  
04E0FD1A757780  
049E0D1A757784  
0433541A757780  
04BB2B6ABE6F80  

### Code auf Karten
105D5A59  
30105314


### Test Button
Um unterschiedliche Fälle zu testen, wurden mehrere Buttons erstellt. Jeder Button wurde mit einer Beispiel-ID versehen. Über das Aufrufen der Buttons ist es möglich, Testabfragen zu machen.  
![test1.png](src%2Fimages%2Fdokumentation%2Ftest1.png)  
Auf dem Bild sind die Buttons mit entsprechender ID zu sehen.

### Test Sortieren
![test2.png](src%2Fimages%2Fdokumentation%2Ftest2.png)  
Am 30.06.2023 sind zwei Schichten eingetragen. Zuerst wird die frühe Schicht ausgegeben.

## Todo
### Einfangen der Tastatur eingabe -> NFC Reader
https://github.com/kybarg/react-barcode-reader  
`yarn add react-barcode-reader`



# Todo
## Karte
+ hinzufügen der neuen Supporter:innen Karte 2024

## Supporter:innen
+ Aus Supporter soll Supporter:innen werden

## Wetter
+ Anzeige Linksunten Wetterbericht