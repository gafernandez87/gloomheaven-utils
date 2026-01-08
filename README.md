# Gloomhaven Damage Calculator

A modern, gamer-themed React application for calculating damage distribution in Gloomhaven, featuring Shield and Pierce mechanics.

## Features

- ⚔️ **Real-time Calculations**: Automatic damage calculation as you type
- 🛡️ **Shield & Pierce Mechanics**: Accurate implementation of Gloomhaven's combat rules
- 🎮 **Gamer-themed UI**: Beautiful dark theme with neon accents and animations
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Visual Representation**: Emoji-based visual blocks showing damage flow
- ⚡ **Performance Optimized**: Built with Vite and React for lightning-fast performance

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## How It Works

The calculator implements Gloomhaven's damage calculation formulas:

1. **Effective Shield** = `max(Shield - Pierce, 0)`
2. **Damage Taken** = `max(Attack - Effective Shield, 0)`
3. **Remaining HP** = `max(HP - Damage Taken, 0)`

### Calculation Order

1. Pierce reduces the target's Shield for this attack
2. The remaining Shield reduces the damage
3. Values never go below 0

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Custom gamer-themed styling with animations

## License

MIT

