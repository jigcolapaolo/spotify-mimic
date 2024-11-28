import { usePlayerStore } from "@/store/playerStore";

interface Props {
    title: string
    playlistId?: string
    songId?: number
    className?: string
}

export const Title: React.FC<Props> = ({ title, className = "", playlistId, songId }) => {

    const { currentSong } = usePlayerStore((state) => state);

    const isTitlePlaylistPlaying = (playlistId && !songId) && currentSong.playlist?.id === playlistId;
    const isTitleSongPlaying = (playlistId && songId) && currentSong.song?.id === songId && currentSong.playlist?.id === playlistId;

    return (
        <h4 className={className + " " + `${isTitlePlaylistPlaying || isTitleSongPlaying ? "text-green-500" : "text-white"}`}>
            {title}  
        </h4>
    )
}