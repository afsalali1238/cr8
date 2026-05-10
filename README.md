# CraftersUnited (cr8un8)

**Empowering India's Local Crafters through a Transparent, Direct Marketplace.**

CraftersUnited is a discovery-first platform built to bridge the gap between traditional Indian artisans and modern buyers. By combining interactive maps with social community features, we enable makers to showcase their work, share their locations, and connect directly with their customers without middleman interference.

## 🚀 Key Features

- **Interactive Discovery Map**: Explore a clustered map of artisans across India using Leaflet and OpenStreetMap.
- **Self-Serve Onboarding**: Simple, high-fidelity signup flow for artists to list their bio, location, and social links.
- **Community Feed**: Niche-specific discussion boards (Ceramics, Jewelry, Home Decor) for crafters to share resources and techniques.
- **Direct Contact**: Integrated WhatsApp and Instagram links on every profile for zero-commission inquiries.
- **Premium Design System**: A high-fidelity UI built on custom tokens (Clay, Sand, Cream) for a warm, artisanal feel.

## 🛠 Tech Stack

- **Core**: Next.js 14 (App Router), TypeScript
- **Backend/Auth/Storage**: Supabase
- **Styling**: Tailwind CSS + Custom Design Tokens
- **Mapping**: Leaflet + React-Leaflet + MarkerCluster
- **Deployment**: Vercel

## 📦 Getting Started

1. **Clone the repo**:
   ```bash
   git clone https://github.com/afsalali1238/cr8.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 📜 Database Schema

The core schema is located in `supabase/migrations/`. It includes:
- `artists`: Identity, location, and social metadata.
- `listings`: Products linked to specific artisans.
- `communities`: Niche discussion categories.
- `posts` & `comments`: The social backbone of the platform.

---
*Built with ❤️ for the Indian maker community.*
