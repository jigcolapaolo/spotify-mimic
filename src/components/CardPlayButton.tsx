import { Pause, Play } from "@/icons/PlayerIcons";
import { allPlaylists, songs } from "@/lib/data";
import { usePlayerStore } from "@/store/playerStore";

interface Props {
  id: string;
  size?: string;
  fade?: boolean;
}

export default function CardPlayButton({
  id,
  size = "small",
  fade = false,
}: Props) {
  const { currentSong, isPlaying, setIsPlaying, setCurrentSong } =
    usePlayerStore((state) => state);

  const isPlayingPlaylist = isPlaying && currentSong.playlist?.id === id;

  const handleClick = () => {
    if (isPlayingPlaylist) {
      setIsPlaying(false);
      return;
    }

    fetch(`/api/get-info-playlist.json?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const { songs, playlist } = data;

        setIsPlaying(true);
        setCurrentSong({ playlist, song: songs[0], songs });
      });
  };

  const iconClassName = size === "small" ? "w-4 h-4" : "w-5 h-5";
  const fadeClass = fade ? "absolute right-4 bottom-20 translate-y-4 transition-all duration-500 z-10 opacity-0" : "";
  const PlayingClass = isPlayingPlaylist ? "translate-y-0 opacity-100" : "group-hover:translate-y-0 group-hover:opacity-100";

  return (
    <div className={fadeClass + " " + PlayingClass}>
      <button
        className="card-play-button rounded-full bg-green-500 p-4 text-black hover:cursor-pointer
                        hover:bg-green-400 hover:scale-105 transition"
        onClick={handleClick}
      >
        {isPlayingPlaylist ? (
          <Pause className={iconClassName} />
        ) : (
          <Play className={iconClassName} />
        )}
      </button>
    </div>
  );
}
