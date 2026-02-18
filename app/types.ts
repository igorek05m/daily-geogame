export const GAME_START_DATE = "2026-02-18";

export type Country = {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  latlng: [number, number];
  borders?: string[];
  area?: number;
  population?: number;
  flag?: string;
  region?: string;
  subregion?: string;
};

export type HintPackage = {
  title: string;
  hints: { label: string; value: string }[];
};

export type Hint = {
  label: string;
  value: string;
};

export interface HintGridProps {
  hintPackages: HintPackage[];
  guesses: unknown[];
  gameOver: boolean;
}

export interface WorldMapProps {
  guesses: Country[];
  targetCountry: Country | null;
}

export type GlobalStats = {
  totalPlayers: number;
  totalWinners: number;
  winRate: number;
  guessDistribution?: Record<string, number>;
};

export interface GameHeaderProps {
  dayNumber: number;
  gameDate: string;
  userStats: { wins: number };
  globalStats?: GlobalStats;
  changeDate: (offset: number) => void;
  isToday: boolean;
  isStart: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface GuessInputProps {
  onGuess: (name: string) => void;
  gameOver: boolean;
}