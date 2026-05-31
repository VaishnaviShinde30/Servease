# Servease – Smart Service Recommendation System

Servease is a smart service discovery platform built for a final-year project demonstration. It allows customers to discover local services (like xerox, tailoring, repairs) based on an intelligent recommendation system that scores shops by distance, price, and customer ratings.

## Tech Stack
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL + Auth)

## Features & Roles
The application features Role-Based Access Control (RBAC) with three separate portals:
1. **Customer Dashboard**: Can filter shops by price/rating/type and leave reviews. Highlights the "Best Recommended Shop" using a custom weighting algorithm.
2. **Shopkeeper Dashboard**: Can add, edit, and delete service listings, and set base pricing.
3. **Admin Dashboard**: Secure panel to manage platform users and forcefully remove inappropriate shop listings.

## Recommendation Algorithm
The system highlights the top shop dynamically using the formula:
`score = (0.4 * Rating) + (0.3 * Price Score) + (0.3 * Distance Score)`
*(Lower price and shorter distance yield a higher score).*

## Setup & Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` variables using your Supabase project keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web application at `http://localhost:5173`.
