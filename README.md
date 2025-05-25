# Shading Palette Generator

A React-based color palette generator that creates shading palettes using basic color theory principles.
![image](https://github.com/user-attachments/assets/bb1a332c-747d-4f00-9624-41ea6f33edf9)


[APPLICATION DEMO](https://shade-palette-generator.vercel.app/)

## ✨ Features

- **Smart Hue Shifting**: Highlights shift toward warm colors (yellow), shadows shift toward cool colors (blue)
- **Natural Color Transitions**: Progressive lightness changes with intelligent saturation adjustments
- **Customizable Controls**: 
  - Adjust base color with color picker or hex input
  - Control palette size (3-11 colors)
  - Fine-tune hue shift intensity (0°-60°)
- **Interactive Interface**: Click any color to copy hex code to clipboard
- **Responsive Design**: Works on desktop and mobile devices

## 🎨 How It Works

The generator follows professional color theory principles:

1. **Base Color**: Your selected color remains unchanged at the center
2. **Highlights**: Shift toward warmer hues (yellow/orange) with increased lightness
3. **Shadows**: Shift toward cooler hues (blue/purple) with decreased lightness
4. **Saturation**: Dynamically adjusted for natural-looking transitions

This creates much more realistic and aesthetically pleasing results than simple brightness/darkness adjustments.

## 🚀 Getting Started

Either click on the demo link above or follow the installation instructions below.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aa-rohan/shade-palette-generator.git
cd shade-palette-generator
```

2. Install dependencies:
```bash
npm install
```

3. Install Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. Configure Tailwind by updating `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

5. Add Tailwind directives to your `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

6. Start the development server:
```bash
npm start
```

## 📱 Usage

1. **Select Base Color**: Use the color picker or enter a hex code
2. **Adjust Palette Size**: Choose between 3-11 colors using the slider
3. **Control Hue Shift**: Fine-tune how much colors shift from the base hue
4. **Copy Colors**: Click any color in the palette to copy its hex code

## 🔧 Customization

### Algorithm Parameters

You can modify the color generation algorithm by adjusting these values in the code:

```javascript
// Highlight hue shift (warm colors)
const hueShift = ratio * (maxHueShift * 0.75);

// Shadow hue shift (cool colors)  
const hueShift = ratio * maxHueShift;

// Lightness adjustments
l = baseL + (ratio * (95 - baseL)); // Highlights
l = baseL * (1 - ratio * 0.8);     // Shadows
```

### Styling

The component uses Tailwind CSS classes. You can customize the appearance by modifying the className props or extending your Tailwind configuration.

## 📄 License

This project is licensed under the MIT License 


---

**Made with ❤️**
