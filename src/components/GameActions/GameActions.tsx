import { auth } from '@/lib/auth';
import BacklogButton from '@/components/BacklogButton';
import { FavoriteButton } from '@/components/FavoriteButton';

interface GameActionsProps {
  game: {
    id: number;
    slug: string;
    name: string;
    background_image: string | null;
  };
}

export default async function GameActions({ game }: GameActionsProps) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <BacklogButton game={game} isAuthenticated={isAuthenticated} />
      {isAuthenticated && (
        <FavoriteButton
          gameId={game.id}
          gameSlug={game.slug}
          gameName={game.name}
          gameImage={game.background_image}
        />
      )}
    </div>
  );
}
