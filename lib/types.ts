export interface Player {
  id: number
  full_name: string
  nickname: string
  team_id: string | null
  ingame_id: string | null
  role: string
  instagram_url: string | null
  photo_filename: string | null
  created_at: string
}

export interface Hero {
  id: string
  name: string
  role: string
}

export interface Tournament {
  id: number
  name: string
  organizer: string
  bracket_url: string | null
  start_date: string
  end_date: string | null
  registration_fee: number
  prize_won: number
  placement: string | null
  status: string
  created_at: string
}

export interface TournamentPlayer {
  id: number
  tournament_id: number
  player_id: number
  created_at: string
}

export interface Match {
  id: number
  tournament_id: number
  opponent_name: string
  opponent_logo: string | null
  match_date: string
  is_win: boolean
  our_score: number
  opponent_score: number
  screenshot_url: string | null
  notes: string | null
  created_at: string
  tournament?: Tournament
}

export interface MatchPlayerStat {
  id: number
  match_id: number
  player_id: number
  hero_id: string | null
  is_mvp: boolean
  is_win: boolean
  kills: number
  deaths: number
  assists: number
  created_at: string
  player?: Player
  hero?: Hero
  match?: Match
}

export interface MatchBan {
  id: number
  match_id: number
  hero_id: string | null
  is_our_ban: boolean
  created_at: string
}

export interface MatchOpponentPick {
  id: number
  match_id: number
  hero_id: string | null
  created_at: string
}

export interface Finance {
  id: number
  tournament_id: number | null
  type: 'income' | 'expense'
  amount: number
  description: string | null
  transaction_date: string
  created_at: string
  tournament?: Tournament
}

export interface PlayerStats {
  total_matches: number
  wins: number
  losses: number
  winrate: number
  total_mvp: number
  total_kills: number
  total_deaths: number
  total_assists: number
  tournaments_joined: number
}

export interface HeroPoolStat {
  hero_id: string
  hero_name: string
  hero_role: string
  total_picks: number
  wins: number
  losses: number
  winrate: number
  mvp_count: number
}

export interface TeamStats {
  total_matches: number
  wins: number
  losses: number
  winrate: number
  total_tournaments: number
  total_prize: number
}
