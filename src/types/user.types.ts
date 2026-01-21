export type BacklogStatus =
  | 'WANT_TO_PLAY'
  | 'PLAYING'
  | 'COMPLETED'
  | 'DROPPED'
  | 'ON_HOLD';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
}

export interface BacklogGame {
  id: string;
  userId: string;
  gameId: number;
  status: BacklogStatus;
  createdAt: Date;
  updatedAt: Date;
  game?: {
    id: number;
    slug: string;
    name: string;
    backgroundImage: string | null;
    metacritic: number | null;
    released: string | null;
  };
}

export interface FavoriteGame {
  id: string;
  userId: string;
  gameId: number;
  rank: number;
  createdAt: Date;
  game?: {
    id: number;
    slug: string;
    name: string;
    backgroundImage: string | null;
    metacritic: number | null;
    released: string | null;
  };
}

export interface UserStats {
  totalGames: number;
  byStatus: {
    wantToPlay: number;
    playing: number;
    completed: number;
    dropped: number;
    onHold: number;
  };
}
