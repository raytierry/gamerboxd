import { auth } from '@/lib/auth';
import BacklogButton from '@/components/BacklogButton';

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
    <div className="flex items-center gap-3">
      <BacklogButton game={game} isAuthenticated={isAuthenticated} />
    </div>
  );
}
