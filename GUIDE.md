# Random Color Generator API - Simple Guide

This is a beginner-friendly guide to build the Random Color Generator API. We'll keep everything simple and minimal.

## Step 1: Setup Project

Open your terminal and run these commands:

```bash
# Create and enter project folder
mkdir random-color-api
cd random-color-api

# Create package.json
npm init -y

# Install what we need (latest versions as of October 2025)
npm install express@^4.21.1 cors@^2.8.5
npm install -D typescript@^5.6.3 @types/express@^5.0.0 @types/node@^22.8.6 @types/cors@^2.8.17 ts-node@^10.9.2 nodemon@^3.1.7
```

## Step 2: Configure TypeScript

Create a file called `tsconfig.json` in your project folder:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**What these settings do:**

- `target: ES2022` - Use modern JavaScript features
- `module: NodeNext` - Modern Node.js module system
- `strict: true` - Enable all strict type-checking options
- `skipLibCheck: true` - Skip type checking of declaration files (faster builds)
- `forceConsistentCasingInFileNames: true` - Prevents case-sensitivity issues

## Step 3: Update package.json

Open `package.json` and add these scripts:

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

**Scripts explained:**

- `dev` - Development mode with auto-restart on file changes
- `build` - Compile TypeScript to JavaScript
- `start` - Run the compiled production build

## Step 4: Create the Server File

Create folder `src` and file `src/server.ts`:

```typescript
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
```

## Step 5: Create the Frontend (Optional - Simple Version)

Create folder `public` and file `public/index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Color Generator</title>
  </head>
  <body>
    <h1>Random Color Generator</h1>

    <div>
      <p>
        HEX: <span id="hex">#000000</span>
        <button onclick="copy('hex', this)">Copy</button>
      </p>
      <p>
        RGB: <span id="rgb">rgb(0,0,0)</span>
        <button onclick="copy('rgb', this)">Copy</button>
      </p>
      <p>
        HSL: <span id="hsl">hsl(0,0%,0%)</span>
        <button onclick="copy('hsl', this)">Copy</button>
      </p>
    </div>

    <button onclick="getColor()">Generate New Color</button>

    <script>
      async function getColor() {
        const response = await fetch("http://localhost:3000/api/color/random");
        const color = await response.json();

        document.getElementById("hex").textContent = color.hex;
        document.getElementById("rgb").textContent = color.rgb;
        document.getElementById("hsl").textContent = color.hsl;
        document.body.style.backgroundColor = color.hex;
      }

      function copy(format, button) {
        const text = document.getElementById(format).textContent;
        navigator.clipboard.writeText(text);

        // Better UX: Change button text instead of alert
        const originalText = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }

      getColor();
    </script>
  </body>
</html>
```

## Step 6: Run Your Project

**Development mode:**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```

Open your browser and go to: `http://localhost:3000`

## How It Works

**Backend (server.ts):**

1. Creates a web server with Express
2. Has one endpoint `/api/color/random` that returns random colors
3. Generates random RGB values (0-255)
4. Converts RGB to Hex and HSL formats
5. Returns all three formats as JSON

**Frontend (index.html) - Optional:**

1. Basic HTML page with no CSS styling
2. Shows HEX, RGB, and HSL values with copy buttons
3. Copy buttons show "Copied!" feedback (better UX than alerts)
4. Generate button calls the API
5. Background changes to the generated color
6. That's it - super minimal!

## Color Formats Explained

- **RGB**: Uses three numbers (0-255) for Red, Green, Blue
- **HEX**: Same as RGB but in hexadecimal (#RRGGBB)
- **HSL**: Hue (0-360°), Saturation (0-100%), Lightness (0-100%)

## Testing

1. Click "Generate New Color" - background should change
2. Click any "Copy" button - color value gets copied
3. Try in browser: `http://localhost:3000/api/color/random` - you'll see JSON

That's it! You have a working Random Color Generator API.
