import { render, screen } from '@testing-library/react';
import GameCard from '@/components/GameCard/GameCard';
import type { RAWGGame } from '@/types/game.types';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="game-image" />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className} data-testid="game-link">
      {children}
    </a>
  ),
}));

const mockGame: RAWGGame = {
  id: 1,
  slug: 'the-witcher-3',
  name: 'The Witcher 3',
  background_image: 'https://example.com/witcher3.jpg',
  metacritic: 93,
  released: '2015-05-19',
  genres: [{ id: 1, name: 'RPG', slug: 'rpg' }],
  platforms: [],
  stores: [],
  short_screenshots: [],
  rating: 4.5,
  playtime: 50,
};

describe('GameCard', () => {
  it('should render game name', () => {
    render(<GameCard game={mockGame} />);

    expect(screen.getByText('The Witcher 3')).toBeInTheDocument();
  });

  it('should link to game detail page', () => {
    render(<GameCard game={mockGame} />);

    const link = screen.getByTestId('game-link');
    expect(link).toHaveAttribute('href', '/games/the-witcher-3');
  });

  it('should render game image when available', () => {
    render(<GameCard game={mockGame} />);

    const image = screen.getByTestId('game-image');
    expect(image).toHaveAttribute('src', 'https://example.com/witcher3.jpg');
    expect(image).toHaveAttribute('alt', 'The Witcher 3');
  });

  it('should render placeholder when no image', () => {
    const gameWithoutImage = { ...mockGame, background_image: null };
    render(<GameCard game={gameWithoutImage} />);

    expect(screen.queryByTestId('game-image')).not.toBeInTheDocument();
    expect(screen.getByText('🎮')).toBeInTheDocument();
  });

  it('should render metacritic score when available', () => {
    render(<GameCard game={mockGame} />);

    expect(screen.getByText('93')).toBeInTheDocument();
  });

  it('should not render metacritic when not available', () => {
    const gameWithoutMetacritic = { ...mockGame, metacritic: null };
    render(<GameCard game={gameWithoutMetacritic} />);

    expect(screen.queryByText('93')).not.toBeInTheDocument();
  });

  it('should render first genre when available', () => {
    render(<GameCard game={mockGame} />);

    expect(screen.getByText('RPG')).toBeInTheDocument();
  });

  it('should not render genre when not available', () => {
    const gameWithoutGenre = { ...mockGame, genres: [] };
    render(<GameCard game={gameWithoutGenre} />);

    expect(screen.queryByText('RPG')).not.toBeInTheDocument();
  });
});
