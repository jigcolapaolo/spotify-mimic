import { usePlayerStore, useTogglerStore } from "@/store/playerStore";

interface Props {
  playlistId: string;
}

export const SideMenuCardVolume: React.FC<Props> = ({ playlistId }) => {
  const { isPlaying, currentSong } = usePlayerStore((state) => state);
  const { isOpen } = useTogglerStore((state) => state);

  return (
    <div className={`${isOpen ? "" : "absolute inset-0 flex items-center justify-center"} 
      ${!isOpen && isPlaying && currentSong.playlist?.id === playlistId ? "bg-zinc-800/50" : ""}`}>
      <div className="text-green-500">
        {isPlaying && currentSong.playlist?.id === playlistId && (
          <video autoPlay muted loop src="/speaker-anim.webm" width={30} height={30} />
        )}
      </div>
    </div>
  );
};
