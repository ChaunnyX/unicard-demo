// Генерация точечных карт (dotted-map) + координаты пинов → SVG в public, JSON в src/data
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
const DottedMap = require('dotted-map').default;

mkdirSync(new URL('../public/img/maps', import.meta.url), { recursive: true });

// ---- Мировая карта ----
const world = new DottedMap({ height: 60, grid: 'diagonal' });
const worldSvg = world.getSVG({ radius: 0.22, color: '#C9D0E4', shape: 'circle', backgroundColor: 'transparent' });

const POINTS = {
  moscow: [55.75, 37.62], amsterdam: [52.37, 4.9], frankfurt: [50.11, 8.68],
  tr: [38.9, 35.2], ae: [24.0, 54.0], eg: [26.8, 30.8], th: [15.87, 100.99],
  ge: [42.3, 43.4], am: [40.1, 45.0], kz: [48.0, 66.9], kg: [41.2, 74.8],
  uz: [41.4, 64.6], tj: [38.9, 71.3], us: [39.8, -98.6], de: [51.2, 10.4],
  fr: [46.6, 2.2], it: [42.8, 12.8], es: [40.5, -3.7], gr: [39.1, 21.8],
  rs: [44.0, 21.0], id: [-8.4, 115.2], vn: [16.0, 107.8], cn: [35.9, 104.2],
  il: [31.4, 35.0], az: [40.3, 47.6], in: [22.9, 78.9], jp: [36.5, 138.0],
  kr: [36.3, 127.8], gb: [54.0, -2.5], me: [42.7, 19.3], sa: [24.2, 45.0],
  cy: [35.1, 33.3], md: [47.0, 28.4], by: [53.6, 27.9], eu: [48.7, 9.0],
};
const pins = {};
for (const [k, [lat, lng]] of Object.entries(POINTS)) {
  const { x, y } = world.getPin({ lat, lng });
  pins[k] = { x: +x.toFixed(2), y: +y.toFixed(2) };
}
// viewBox из svg
const vb = worldSvg.match(/viewBox="([^"]+)"/)[1];
writeFileSync(new URL('../public/img/maps/world.svg', import.meta.url), worldSvg);
writeFileSync(new URL('../src/data/mapPins.json', import.meta.url), JSON.stringify({ viewBox: vb, pins }, null, 1));
console.log('world ok', vb, Object.keys(pins).length, 'pins');
