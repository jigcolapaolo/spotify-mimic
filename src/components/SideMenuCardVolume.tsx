import { VolumeFull } from "@/icons/VolumeIcons";
import { usePlayerStore } from "@/store/playerStore";

interface Props {
  playlistId: string;
}

export const SideMenuCardVolume: React.FC<Props> = ({ playlistId }) => {
  const { isPlaying, currentSong } = usePlayerStore((state) => state);

  return (
    <div className="text-green-500">
      {isPlaying && currentSong.playlist?.id === playlistId && (
        <video autoPlay muted loop src="/speaker-anim.webm" width={30} height={30} />
      )}
    </div>
  );
};
