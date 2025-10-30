import express from "express";
import cors from "cors";
import path from "path";

const app = express();

// Allow frontend to talk to backend
app.use(cors());

// Serve HTML files from public folder
app.use(express.static("public"));

// Generate random number between 0-255
function randomRGB() {
  return Math.floor(Math.random() * 256);
}

// Convert RGB to Hex format
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert RGB to HSL format
function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
}

// API endpoint to get random color
app.get("/api/color/random", (req, res) => {
  const r = randomRGB();
  const g = randomRGB();
  const b = randomRGB();

  res.json({
    hex: rgbToHex(r, g, b),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: rgbToHsl(r, g, b),
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
