# Sportitude - Turf Booking Frontend

This is the React-based frontend for the Sportitude turf booking system, converted from the original HTML template.

## Features

- **Modern React Application**: Built with React 18 and Vite for fast development
- **Responsive Design**: Mobile-friendly layout using Bootstrap 5
- **Interactive Components**: 
  - Header with navigation
  - Banner section with call-to-action
  - About section with features
  - Dynamic booking form with game selection
  - Image gallery with lightbox (Fancybox)
  - Footer with contact information

## Tech Stack

- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **jQuery** - For Bootstrap and plugin functionality
- **Fancybox** - Gallery lightbox
- **Font Awesome 6.6.0** - Icons

## Project Structure

```
turf_frontend/
├── public/
│   └── assets/
│       ├── css/          # Stylesheets
│       ├── images/       # Images and icons
│       ├── js/           # jQuery plugins
│       └── webfonts/     # Font files
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Banner.jsx
│   │   ├── About.jsx
│   │   ├── BookingForm.jsx
│   │   ├── Gallery.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd turf_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Components

### Header
Navigation bar with logo, menu items, and contact button.

### Banner
Hero section with main call-to-action and key features.

### About
Information about Sportitude with feature highlights.

### BookingForm
Interactive booking form with:
- Game selection (Football, Cricket, Pickleball, Paintball)
- Date, city, and venue selection
- Ground type selection (Half/Full)
- Time slot selection
- Booking modal for personal information

### Gallery
Image gallery with Fancybox lightbox integration.

### Footer
Footer with logo, contact information, and social media links.

## Customization

### Styling
All styles are located in `/public/assets/css/style.css`. The original SCSS file is also available at `/public/assets/css/style.scss`.

### Images
Replace images in `/public/assets/images/` with your own:
- `logo.png` - Header logo
- `footer-logo.png` - Footer logo
- `banner.jpg` - Banner background
- `gallery*.jpg` - Gallery images
- Game icons (`g1.png`, `g2.png`, etc.)

### Configuration
Modify `vite.config.js` to change:
- Development server port (default: 3000)
- API proxy settings (default: http://localhost:5000)

## Integration with Backend

The frontend is configured to proxy API requests to `http://localhost:5000`. Update the proxy settings in `vite.config.js` if your backend runs on a different port.

## Building for Production

```bash
npm run build
```

This will create an optimized production build in the `dist/` directory.

## License

All Rights Reserved © 2026 Sportitude
