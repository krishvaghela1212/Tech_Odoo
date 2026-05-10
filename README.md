# ✈️ Traveloop: The Ultimate Itinerary Architect

**Plan Less. Wander More.**

Traveloop is a premium, multi-city travel planning application designed to turn complex journeys into beautifully organized itineraries. Built with a focus on aesthetics, responsiveness, and precision, it empowers modern explorers to manage every detail of their adventure in one perfect loop.

---

## 🌟 Core Features

- 📍 **Relational Multi-City Planning**: Build seamless routes across any number of destinations with chronological logic.
- 🕒 **Precision Scheduling**: Assign specific times, categories, and costs to daily activities for microscopic control.
- 📊 **Visual Budget Tracking**: Monitor your spending with dynamic cost breakdowns and remaining balance visualizations.
- 🔍 **Global Discovery**: Integrated search for cities and attractions to find inspiration for your next stop.
- 🔗 **Aesthetic Public Sharing**: Generate beautiful, read-only links to share your itineraries with friends or the community.
- 📋 **Smart Packing Logic**: Maintain categorized checklists (Clothing, Documents, Electronics) to ensure you're always ready.
- 📓 **Trip Journaling**: Capture memories, flight details, and local tips in a structured trip-specific diary.
- 🔐 **Secure Auth**: Full user profile management and data persistence powered by Supabase.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 (Hooks, Context API) |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS 4.0 |
| **Animations** | Motion (Framer Motion) |
| **Backend/DB** | Supabase (PostgreSQL + Auth) |
| **Icons** | Lucide React |
| **Charts** | Recharts |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/traveloop.git
   cd traveloop/client
   ```

2. **Install dependencies:**
   *Note: Due to React 19 peer dependency constraints in some libraries, use the following command:*
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Configuration:**
   Create a `.env` file in the `client` directory and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key (optional for AI features)
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

---

## 🎨 Design Philosophy

Traveloop utilizes a **Midnight & Gold** aesthetic (Glassmorphism):
- **Primary Color**: `#D4A843` (Vibrant Gold)
- **Secondary Color**: `#1A1A1A` (Deep Charcoal)
- **Aesthetic**: Minimalist borders, soft shadows, and micro-animations to create a premium, tactile feel.

---

## 📂 Project Structure

```text
client/
├── src/
│   ├── components/    # Reusable UI components (Navbar, TripCard, etc.)
│   ├── context/       # Auth state management
│   ├── lib/           # Supabase client & utilities
│   ├── pages/         # Feature-specific pages (Itinerary, Budget, etc.)
│   ├── App.jsx        # Main routing & layout
│   └── main.jsx       # Entry point
├── public/            # Static assets
└── vite.config.js     # Build configuration
```

---

## 👨‍💻 Developed For
Created as part of the **2025 Odoo Hackathon**, focusing on innovative relational data management for the travel industry.

---

*“The world is a book; travel is the reading.” — Saint Augustine*
