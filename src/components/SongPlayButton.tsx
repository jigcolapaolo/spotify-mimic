import { Play } from "@/icons/Play";
import { Pause } from "@/icons/Pause";
import { usePlayerStore } from "@/store/playerStore";

interface Props {
    albumId: number
    songIndex: number
}

export const SongPlayButton: React.FC<Props> = ({ albumId, songIndex}) => {

    const { isPlaying, setIsPlaying, setCurrentSong, currentSong } = usePlayerStore(state => state)

    const isSongFromPlaylist = currentSong.playlist?.albumId === albumId
    const isSongPlaying = isPlaying && currentSong.song?.id === songIndex + 1

    const handleClick = () => {
        if (isSongPlaying) {
            setIsPlaying(false)
            return
        }

        if (isSongFromPlaylist) {
          setCurrentSong({ ...currentSong, song: currentSong.songs[songIndex] })
        } else {
          fetch(`/api/get-info-playlist.json?id=${albumId.toString()}`)
            .then(res => res.json())
            .then(data => {
              const { songs, playlist } = data

              setCurrentSong({ playlist, song: songs[songIndex], songs })
            })
        }

        setIsPlaying(true)
    }

  return (
    <button 
      onClick={handleClick}
      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      {isSongPlaying ? (
            <Pause className="cursor-pointer text-green-500"/>
      ) : (
            <Play className="cursor-pointer"/>
      )}
    </button>
  );
};
