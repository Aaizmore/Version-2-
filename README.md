# Lakambini XI Archives

Official digital archives platform for Grade 11 Lakambini students (2025-2026).

## Features

- 📝 **Story Sharing**: Write and share your academic journey
- 🖼️ **Image Support**: Upload and manage images with your posts
- 👥 **User Profiles**: Personalized profiles with avatar support
- 🔐 **Authentication**: Secure sign-in with Supabase Auth
- 📱 **Responsive Design**: Works perfectly on all devices
- ✨ **Professional UI**: Clean, modern interface

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images
- **Styling**: Tailwind CSS with shadcn/ui components
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd lakambini-xi-archives
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Set up the database**
   Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   - `01-create-tables.sql`
   - `02-disable-email-confirmation.sql`
   - `03-supabase-auth-config.sql`
   - `04-enable-email-auth.sql`
   - `05-add-image-support.sql`
   - `06-fix-foreign-key-constraint.sql`
   - `07-setup-supabase-storage.sql`
   - `08-add-profile-pictures.sql`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Project Structure

\`\`\`
lakambini-xi-archives/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── post/              # Individual post pages
│   ├── profile/           # User profile pages
│   ├── write/             # Post creation/editing
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── blog/              # Blog-related components
│   ├── layout/            # Layout components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
│   ├── supabase/          # Supabase client configuration
│   └── utils/             # Helper functions
├── scripts/               # Database setup scripts
└── public/                # Static assets
\`\`\`

## Features Overview

### Authentication
- Email/password sign-up and sign-in
- Automatic profile creation
- Secure session management

### Content Management
- Rich text post creation
- Image upload and management
- Draft and published post states
- Post editing and deletion

### User Experience
- Responsive design for all devices
- Professional UI with smooth animations
- Image galleries and featured images
- Reading time estimates

## Contributing

This is a class project for Grade 11 Lakambini students. If you're part of the class:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For technical issues or questions, please create an issue in the repository or contact the development team.

## License

This project is created for educational purposes for the Grade 11 Lakambini class of 2025-2026.
