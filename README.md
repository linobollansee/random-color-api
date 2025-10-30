# Random Color Generator API

A simple Express.js + TypeScript API that generates random colors in multiple formats (HEX, RGB, HSL) with an optional frontend interface.

## Features

- 🎨 Generate random colors via REST API
- 🔄 Returns colors in HEX, RGB, and HSL formats
- 🖥️ Simple HTML frontend included
- 📋 Copy color values to clipboard
- ⚡ Live background color preview

## Installation

```bash
npm install
```

## Usage

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## API Endpoint

### GET `/api/color/random`

Returns a random color in multiple formats.

**Response:**

```json
{
  "hex": "#a3f2b5",
  "rgb": "rgb(163, 242, 181)",
  "hsl": "hsl(134, 75%, 79%)"
}
```

## Frontend

Visit `http://localhost:3000` to access the web interface where you can:

- Generate random colors with a button click
- View color values in HEX, RGB, and HSL formats
- Copy any color value to clipboard
- See the color applied to the page background

## Project Structure

```
random-color-api/
├── src/
│   └── server.ts       # Express server and API logic
├── public/
│   └── index.html      # Frontend interface
├── dist/               # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies

- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Node.js** - Runtime environment
