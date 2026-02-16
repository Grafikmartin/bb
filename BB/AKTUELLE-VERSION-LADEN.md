# Aktuelle Version im Browser sehen

Wenn du noch „Praxis“ statt „Die Praxis“ siehst, folge **genau** diesen Schritten:

## 1. Alle Tabs mit der App schließen
- Jeden Tab schließen, in dem `localhost:5172` oder `/bb/` offen ist.

## 2. Dev-Server neu starten
- In Cursor: **Terminal** öffnen (Ctrl+`).
- In den BB-Ordner wechseln: `cd BB` (oder `cd /Users/grunesmarsmannchen/Documents/ordnung/Projekte/Design/BB`).
- Falls bereits ein Server läuft: **Ctrl+C** drücken (Stopp).
- Neu starten: `npm run dev`.
- Warten, bis „Local: http://localhost:5172/“ erscheint.

## 3. Seite ohne Cache laden
**Variante A – Empfohlen:**
- **Neues privates Fenster** öffnen (Chrome: Cmd+Shift+N).
- Adresszeile: **http://localhost:5172/bb/** eintippen (nicht aus Lesezeichen).
- Enter.

**Variante B – Cache in DevTools deaktivieren:**
- Normales Fenster: **http://localhost:5172/bb/** öffnen.
- **F12** (DevTools).
- Tab **Network** (Netzwerk).
- Haken setzen: **„Disable cache“**.
- DevTools **offen lassen** und Seite mit **Cmd+Shift+R** neu laden.

## 4. Prüfen
- Menü öffnen (drei Striche).
- Steht dort **„Die Praxis“** → du siehst die aktuelle Version.
- Steht dort **„Praxis“** → noch alte Version; dann Variante A (privates Fenster) mit frischem Tab wiederholen.

## Wichtig
- Immer **http://localhost:5172/bb/** nutzen (mit Port **5172**).
- Keine andere URL (kein anderes Port, kein `file://`, kein alter Build).
