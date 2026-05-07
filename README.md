# Team Hub - MLBB Tournament Manager

A comprehensive team management application for Mobile Legends: Bang Bang esports teams. Track tournaments, player statistics, hero pools, finances, and match history.

## Features

- **Home Dashboard**: Calendar view, upcoming events, and recent match history
- **Roster Management**: Player profiles with photos, roles, and social links
- **Player Details**: Individual stats, hero pool with winrates, and match history
- **Heroes Database**: Visual hero gallery with role filtering
- **Match History**: Detailed match records with player performance and bans/picks
- **Tournament Tracker**: Tournament history with placements and bracket links
- **Finance Manager**: Income/expense tracking with charts in Rupiah
- **Team Statistics**: Universal team stats, top players, and most picked heroes
- **Admin Panel**: Forms to add tournaments, matches, players, and heroes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended) or npm
- Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd team-hub
pnpm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings > API** to get your credentials
3. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Database Tables

Go to Supabase **SQL Editor** and run the following SQL:

```sql
-- Players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  team_id TEXT,
  ingame_id TEXT,
  role TEXT NOT NULL,
  instagram_url TEXT,
  photo_filename TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Heroes table
CREATE TABLE IF NOT EXISTS heroes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  organizer TEXT NOT NULL,
  bracket_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  registration_fee DECIMAL(15, 2) DEFAULT 0,
  prize_won DECIMAL(15, 2) DEFAULT 0,
  placement TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournament players
CREATE TABLE IF NOT EXISTS tournament_players (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, player_id)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  opponent_name TEXT NOT NULL,
  opponent_logo TEXT,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_win BOOLEAN NOT NULL,
  our_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  screenshot_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match player stats
CREATE TABLE IF NOT EXISTS match_player_stats (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  hero_id TEXT REFERENCES heroes(id),
  is_mvp BOOLEAN DEFAULT FALSE,
  is_win BOOLEAN NOT NULL,
  kills INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match bans
CREATE TABLE IF NOT EXISTS match_bans (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  hero_id TEXT REFERENCES heroes(id),
  is_our_ban BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match opponent picks
CREATE TABLE IF NOT EXISTS match_opponent_picks (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  hero_id TEXT REFERENCES heroes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finances
CREATE TABLE IF NOT EXISTS finances (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Add Sample Data (Optional)

```sql
-- Insert sample heroes
INSERT INTO heroes (id, name, role) VALUES
('miya', 'Miya', 'Marksman'),
('layla', 'Layla', 'Marksman'),
('zilong', 'Zilong', 'Fighter'),
('tigreal', 'Tigreal', 'Tank'),
('rafaela', 'Rafaela', 'Support'),
('fanny', 'Fanny', 'Assassin'),
('alice', 'Alice', 'Mage'),
('nana', 'Nana', 'Mage'),
('balmond', 'Balmond', 'Fighter'),
('saber', 'Saber', 'Assassin');

-- Insert sample player
INSERT INTO players (full_name, nickname, team_id, ingame_id, role, instagram_url, photo_filename)
VALUES ('John Doe', 'JDX', 'TEAM001', '12345678', 'Gold Laner', 'https://instagram.com/jdx', 'player1.jpg');
```

### 5. Add Hero Images

1. Download MLBB hero images (square format, recommended 200x200px or higher)
2. Name them according to the hero ID (e.g., `miya.png`, `layla.png`)
3. Place them in `public/heroes/` folder

### 6. Add Player Photos

1. Prepare player photos (portrait format, recommended 3:4 aspect ratio)
2. Place them in `public/players/` folder
3. Reference the filename in the player's `photo_filename` field

### 7. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your Team Hub.

## Project Structure

```
├── app/
│   ├── page.tsx              # Home dashboard
│   ├── roster/               # Player roster & details
│   ├── heroes/               # Heroes gallery
│   ├── history/              # Match history
│   ├── tournaments/          # Tournament tracker
│   ├── finance/              # Finance management
│   ├── stats/                # Team statistics
│   └── admin/                # Admin panel & forms
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── home/                 # Home page components
│   ├── roster/               # Roster components
│   ├── heroes/               # Heroes components
│   ├── history/              # History components
│   ├── tournaments/          # Tournament components
│   ├── finance/              # Finance components
│   ├── stats/                # Stats components
│   └── admin/                # Admin form components
├── lib/
│   ├── supabase/             # Supabase client setup
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Utility functions
└── public/
    ├── heroes/               # Hero images
    └── players/              # Player photos
```

## How It Works

### Adding a Tournament
1. Go to Admin > Add Tournament
2. Fill in tournament details (name, organizer, dates, fees)
3. Select participating players
4. Submit - automatically creates finance records for registration fee and prize

### Adding a Match
1. Go to Admin > Add Match
2. Select the tournament (optional)
3. Enter opponent details and result
4. Add player stats (hero picks, KDA, MVP)
5. Select bans and enemy picks
6. Submit - automatically updates all player and team statistics

### Data Flow
- **Tournament Added** → Updates calendar, upcoming events, tournament list, and finances
- **Match Added** → Updates match history, player stats, hero pools, team stats, and winrates
- **All stats are calculated dynamically** from match_player_stats table

## Customization

### Change Team Name
Edit the Navigation component in `components/navigation.tsx`

### Add More Hero Roles
Edit the `heroRoles` array in `components/admin/hero-form.tsx`

### Add More Player Roles
Edit the `roles` array in `components/admin/player-form.tsx`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## License

MIT License - feel free to use this for your team!
