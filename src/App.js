import { useState, useEffect } from 'react';

const App = () => {
  const [baseColor, setBaseColor] = useState('#ff4444');
  const [paletteSize, setPaletteSize] = useState(7);
  const [hueShiftAmount, setHueShiftAmount] = useState(35);
  const [palette, setPalette] = useState([]);

  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const generatePalette = (baseHex, count, maxHueShift) => {
    const [baseH, baseS, baseL] = hexToHsl(baseHex);
    const colors = [];
    const midIndex = Math.floor(count / 2);

    for (let i = 0; i < count; i++) {
      let h = baseH;
      let s = baseS;
      let l = baseL;

      if (i < midIndex) {
        const ratio = (midIndex - i) / midIndex;
        const hueShift = ratio * (maxHueShift * 0.75); // highlights get 75% of max shift (looks better imo)
        h = (baseH + hueShift) % 360;
        
        l = baseL + (ratio * (95 - baseL)); //increase lightness for highlights by a lot
        
        
        s = baseS * (1 - ratio * 0.3); // slightly decreasing the saturation for highlights
      } else if (i > midIndex) {
        const ratio = (i - midIndex) / (count - midIndex - 1);
        const hueShift = ratio * maxHueShift; // Shadows get full hue shift (looks better imo)
        h = (baseH - hueShift + 360) % 360;
        
        l = baseL * (1 - ratio * 0.8); // decrease lightness for shadows
        
        // for midtones, slightly increase saturation
        if (ratio < 0.5) {
          s = Math.min(100, baseS * (1 + ratio * 0.3));
        } else {
          s = baseS * (1 - (ratio - 0.5) * 0.4);
        }
      }

      colors.push({
        hex: hslToHex(h, s, l),
        hsl: [Math.round(h), Math.round(s), Math.round(l)],
        type: i < midIndex ? 'highlight' : i > midIndex ? 'shadow' : 'base'
      });
    }

    return colors;
  };

  useEffect(() => {
    const newPalette = generatePalette(baseColor, paletteSize, hueShiftAmount);
    setPalette(newPalette);
  }, [baseColor, paletteSize, hueShiftAmount]);

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color.hex);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shading Palette Generator</h1>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Base Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                placeholder="#ff4444"
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Palette Size</label>
            <input
              type="range"
              min="3"
              max="11"
              step="2"
              value={paletteSize}
              onChange={(e) => setPaletteSize(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-500 mt-1">{paletteSize} colors</span>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Hue Shift Amount</label>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={hueShiftAmount}
              onChange={(e) => setHueShiftAmount(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-500 mt-1">{hueShiftAmount}° shift</span>
          </div>
        </div>

        <div className="mb-6">
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex rounded-lg overflow-hidden shadow-md" style={{ height: '120px' }}>
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 cursor-pointer hover:scale-105 transition-transform duration-200"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color)}
                  title={`Click to copy ${color.hex}`}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {palette.map((color, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <div className="font-mono text-sm font-medium">{color.hex}</div>
                      <div className="text-xs text-gray-600 capitalize">{color.type}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    HSL({color.hsl[0]}, {color.hsl[1]}%, {color.hsl[2]}%)
                  </div>
                  <button
                    onClick={() => copyToClipboard(color)}
                    className="mt-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">How it works:</h3>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Highlights:</strong> Shift toward warmer hues (yellow) and increase lightness</li>
            <li>• <strong>Base:</strong> Original color remains unchanged</li>
            <li>• <strong>Shadows:</strong> Shift toward cooler hues (blue) and decrease lightness</li>
            <li>• <strong>Hue Shift:</strong> Control how much colors shift (0° = no shift, 60° = maximum shift)</li>
            <li>• Saturation is adjusted to create more natural-looking transitions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;