/**
 * =====================================================
 * RANDOM COLOR API - SERVER
 * =====================================================
 *
 * Willkommen zu diesem Express-TypeScript-Projekt!
 * Dieser Server generiert zufällige Farben und stellt sie
 * über eine REST API zur Verfügung.
 *
 * Lernziele:
 * - Express.js Server aufsetzen
 * - REST API Endpunkte erstellen
 * - Farbumrechnungen verstehen (RGB, HEX, HSL)
 * - TypeScript mit Node.js verwenden
 */

// =====================================================
// 1. IMPORTS - Benötigte Module einbinden
// =====================================================

// Express: Das Webframework für Node.js, mit dem wir unseren Server erstellen
import express from "express";

// CORS: Cross-Origin Resource Sharing - erlaubt Frontend-Zugriffe von anderen Domains
import cors from "cors";

// Path: Node.js Modul für Dateipfad-Operationen (hier importiert, aber nicht verwendet)
import path from "path";

// =====================================================
// 2. SERVER INITIALISIERUNG
// =====================================================

// Erstelle eine neue Express-Anwendung
// Diese Variable 'app' ist unser Hauptserver-Objekt
const app = express();

// Aktiviere CORS-Middleware
// WICHTIG: Erlaubt unserem Frontend (HTML-Seite), mit dem Backend zu kommunizieren
// Ohne CORS würde der Browser die Anfragen aus Sicherheitsgründen blockieren
app.use(cors());

// Stelle statische Dateien aus dem "public" Ordner bereit
// Das bedeutet: Dateien wie index.html werden direkt vom Server ausgeliefert
// Beispiel: http://localhost:3000/index.html
app.use(express.static("public"));

// =====================================================
// 3. HILFSFUNKTIONEN FÜR FARBBERECHNUNGEN
// =====================================================

/**
 * Generiert eine zufällige RGB-Komponente (0-255)
 *
 * RGB-Farben bestehen aus drei Werten:
 * - R (Rot): 0-255
 * - G (Grün): 0-255
 * - B (Blau): 0-255
 *
 * @returns {number} Eine Zahl zwischen 0 und 255
 */
function randomRGB() {
  // Math.random() erzeugt eine Zufallszahl zwischen 0 und 0.999...
  // * 256 skaliert auf 0 bis 255.999...
  // Math.floor() rundet ab auf eine ganze Zahl
  return Math.floor(Math.random() * 256);
}

/**
 * Konvertiert RGB-Werte in das Hexadezimal-Format
 *
 * Hexadezimal (Basis 16) ist die übliche Schreibweise für Farben im Web.
 * Beispiel: RGB(255, 0, 0) wird zu #FF0000 (reines Rot)
 *
 * @param {number} r - Rotwert (0-255)
 * @param {number} g - Grünwert (0-255)
 * @param {number} b - Blauwert (0-255)
 * @returns {string} Hexadezimale Farbdarstellung (z.B. "#ff5733")
 */
function rgbToHex(r: number, g: number, b: number): string {
  // Hilfsfunktion: Wandelt eine Dezimalzahl in Hexadezimal um
  // padStart(2, "0") stellt sicher, dass wir immer 2 Zeichen haben (z.B. "0F" statt "F")
  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  // Kombiniere die drei Hex-Werte mit einem '#' am Anfang
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Konvertiert RGB-Werte in das HSL-Format
 *
 * HSL steht für:
 * - H (Hue/Farbton): 0-360° auf dem Farbkreis
 * - S (Saturation/Sättigung): 0-100% (0% = Grau, 100% = volle Farbe)
 * - L (Lightness/Helligkeit): 0-100% (0% = Schwarz, 100% = Weiß)
 *
 * HSL ist oft intuitiver für Menschen als RGB!
 *
 * @param {number} r - Rotwert (0-255)
 * @param {number} g - Grünwert (0-255)
 * @param {number} b - Blauwert (0-255)
 * @returns {string} HSL-Farbdarstellung (z.B. "hsl(120, 50%, 75%)")
 */
function rgbToHsl(r: number, g: number, b: number): string {
  // Schritt 1: Normalisiere RGB-Werte auf den Bereich 0-1
  // (Division durch 255, da RGB-Werte von 0-255 reichen)
  r /= 255;
  g /= 255;
  b /= 255;

  // Schritt 2: Finde Maximum und Minimum der RGB-Werte
  // Diese werden für die Berechnung von Helligkeit und Sättigung benötigt
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Schritt 3: Initialisiere HSL-Variablen
  let h = 0, // Hue (Farbton)
    s = 0; // Saturation (Sättigung)

  // Berechne Lightness (Helligkeit) als Durchschnitt von max und min
  const l = (max + min) / 2;

  // Schritt 4: Berechne Hue und Saturation nur, wenn die Farbe nicht grau ist
  // (Grau entsteht, wenn alle RGB-Werte gleich sind, d.h. max === min)
  if (max !== min) {
    // Differenz zwischen Maximum und Minimum
    const d = max - min;

    // Berechne Sättigung basierend auf Helligkeit
    // Formel unterscheidet sich je nachdem, ob l größer oder kleiner als 0.5 ist
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    // Berechne Farbton basierend darauf, welche Farbe dominiert
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6; // Rot dominiert
    else if (max === g) h = ((b - r) / d + 2) / 6; // Grün dominiert
    else h = ((r - g) / d + 4) / 6; // Blau dominiert
  }

  // Schritt 5: Konvertiere in die üblichen Einheiten und runde
  // h: 0-1 → 0-360 Grad
  // s: 0-1 → 0-100 Prozent
  // l: 0-1 → 0-100 Prozent
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
}

// =====================================================
// 4. API ENDPUNKTE (ROUTES)
// =====================================================

/**
 * GET /api/color/random
 *
 * Dieser Endpunkt generiert eine zufällige Farbe und gibt sie
 * in drei verschiedenen Formaten zurück: HEX, RGB und HSL.
 *
 * Ablauf:
 * 1. Client sendet GET-Request an /api/color/random
 * 2. Server generiert drei zufällige RGB-Werte
 * 3. Server konvertiert diese in HEX und HSL
 * 4. Server sendet JSON-Response mit allen Formaten zurück
 *
 * Beispiel-Response:
 * {
 *   "hex": "#a3f542",
 *   "rgb": "rgb(163, 245, 66)",
 *   "hsl": "hsl(87, 90%, 61%)"
 * }
 */
app.get("/api/color/random", (req, res) => {
  // Generiere drei zufällige Werte für Rot, Grün und Blau
  const r = randomRGB();
  const g = randomRGB();
  const b = randomRGB();

  // Sende die Farbe in allen drei Formaten als JSON zurück
  // res.json() konvertiert automatisch ein JavaScript-Objekt in JSON
  res.json({
    hex: rgbToHex(r, g, b), // Hexadezimal-Format
    rgb: `rgb(${r}, ${g}, ${b})`, // RGB-Format
    hsl: rgbToHsl(r, g, b), // HSL-Format
  });
});

// =====================================================
// 5. SERVER STARTEN
// =====================================================

/**
 * Starte den Server auf Port 3000
 *
 * app.listen() startet den Server und lässt ihn auf eingehende
 * Anfragen warten (auf Port 3000).
 *
 * Die Callback-Funktion wird ausgeführt, sobald der Server läuft.
 */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("API Endpunkt: http://localhost:3000/api/color/random");
});
