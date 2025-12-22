# Jhustify - Your Verified Next Step

The unified gateway to Africa's real economy. Earn the trust that fuels growth. Transact with confidence.

## Overview

Jhustify is a business verification and trust platform designed specifically for the African market. It provides a centralized directory for both formal and informal businesses, helping them build credibility and visibility through a verified trust system.

## Features

- **Business Verification**: Multi-tier verification system for both registered (formal) and unregistered (informal) businesses
- **Trust Badges**: Digital verification badges (Basic and Gold) that businesses can display
- **Business Directory**: Searchable directory of verified businesses across Africa
- **Messaging System**: Secure communication channel between customers and businesses
- **Subscription Management**: Tiered subscription model (Basic, Verified, Premium)
- **Modern UI**: Beautiful, fluid, mobile-first design with custom theme colors

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based authentication
- **UI Components**: Custom component library with Jhustify theme

## Theme Colors

- `#C2EABD` - Light Green
- `#D9F8D4` - Lighter Green
- `#465362` - Dark Blue-Gray
- `#D6D9DD` - Light Gray
- `#F5F5F5` - Off-White

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jhustify
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MongoDB connection string and JWT secret.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
jhustify/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── business/     # Business management endpoints
│   │   └── verification/ # Verification endpoints
│   ├── business/         # Business profile pages
│   ├── dashboard/        # Business owner dashboard
│   ├── search/           # Business search page
│   ├── verify/           # Verification wizard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── page.tsx          # Homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   └── TrustBadge.tsx    # Trust badge component
├── lib/                   # Utility libraries
│   ├── models/           # Mongoose models
│   ├── utils/            # Utility functions
│   └── db.ts             # Database connection
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Business
- `GET /api/business` - List/search businesses
- `POST /api/business` - Create new business
- `GET /api/business/[id]` - Get business details
- `PATCH /api/business/[id]` - Update business

### Verification
- `GET /api/verification/status` - Get verification status
- `POST /api/verification/documents` - Submit verification documents
- `POST /api/verification/proof-of-presence` - Submit proof of presence (informal)

## Verification Tiers

1. **Basic (Free)**: Basic listing, no verification
2. **Verified ($5/month)**: Full verification with Trust Badge
3. **Premium ($15/month)**: Enhanced features, Gold Badge, analytics

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

[Your License Here]

## Support

For support, email support@jhustify.com or visit our documentation.
