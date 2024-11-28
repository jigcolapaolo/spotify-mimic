import { Play } from "@/icons/Play";
import { Pause } from "@/icons/Pause";
import { usePlayerStore } from "@/store/playerStore";

interface Props {
  albumId: number;
  songIndex: number;
}

export const SongPlayButton: React.FC<Props> = ({ albumId, songIndex }) => {
  const { isPlaying, setIsPlaying, setCurrentSong, currentSong } =
    usePlayerStore((state) => state);

  const isSongFromPlaylist = currentSong.playlist?.albumId === albumId;
  const isSongPlaying =
    isPlaying && currentSong.song?.id === songIndex + 1 && isSongFromPlaylist;

  const handleClick = () => {
    if (isSongPlaying) {
      setIsPlaying(false);
      return;
    }

    if (isSongFromPlaylist) {
      setCurrentSong({ ...currentSong, song: currentSong.songs[songIndex] });
    } else {
      fetch(`/api/get-info-playlist.json?id=${albumId.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          const { songs, playlist } = data;

          setCurrentSong({ playlist, song: songs[songIndex], songs });
        });
    }

    setIsPlaying(true);
  };

  return (
    <>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isSongPlaying ? "opacity-0" : "opacity-100 group-hover:opacity-0"
        }`}
      >
        {songIndex + 1}
      </span>
      <button
        onClick={handleClick}
        className="absolute inset-0 flex items-center justify-center"
      >
        {isSongPlaying ? (
          <>
            <Pause className="cursor-pointer text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <video
              className="absolute opacity-100 group-hover:opacity-0 transition-opacity duration-300"
              autoPlay
              muted
              loop
              src="/equaliser-anim.webm"
              width={"80"}
              height={"80"}
            />
          </>
        ) : (
          <Play className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>
    </>
  );
};
