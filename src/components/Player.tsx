import { Play, Pause, Prev, Next, Shuffle, Repeat } from "@/icons/PlayerIcons";
import { usePlayerStore } from "@/store/playerStore";
import { useEffect, useRef, useState } from "react";
import { Slider } from "./Slider";
import {
  VolumeFull,
  VolumeLow,
  VolumeMedium,
  VolumeSilenced,
} from "@/icons/VolumeIcons";

const CurrentSong = ({
  image,
  title,
  artists,
}: {
  image: string;
  title: string;
  artists: string[];
}) => {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const currentSong = usePlayerStore((state) => state.currentSong);

  return (
    <div
      className="flex items-center gap-5 relative overflow-hidden transition duration-1000"
      style={{
        opacity: currentSong.playlist ? 1 : 0,
      }}
    >
      <picture
        style={{
          animation: "discRotation 20s linear infinite",
          animationPlayState: isPlaying ? "running" : "paused",
        }}
        className="relative w-16 h-16 bg-zinc-800 rounded-full shadow-lg overflow-hidden"
      >
        <div className="border-2 border-zinc-800 rounded-full">
          <img src={image} alt={title} className="rounded-full" />
        </div>
        <div className="absolute w-3 h-3 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </picture>

      <div className="flex flex-col">
        <h3 className="font-semibold text-sm block">{title}</h3>
        <span className="text-xs opacity-80">{artists?.join(", ")}</span>
      </div>
    </div>
  );
};

const VolumeControl = () => {
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const previousVolumeRef = useRef(volume);

  const isVolumeSilenced = volume === 0;
  const isVolumeLow = volume < 0.4;
  const isVolumeMedium = volume < 0.8;

  const handleClickVolume = () => {
    if (isVolumeSilenced) {
      setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
    }
  };

  return (
    <div className="group flex justify-center gap-x-2">
      <button
        onClick={handleClickVolume}
        className="text-white opacity-70 hover:opacity-100 transition"
      >
        {isVolumeSilenced ? (
          <VolumeSilenced />
        ) : isVolumeLow ? (
          <VolumeLow />
        ) : isVolumeMedium ? (
          <VolumeMedium />
        ) : (
          <VolumeFull />
        )}
      </button>
      <Slider
        defaultValue={[100]}
        max={100}
        min={0}
        value={[volume * 100]}
        className="w-[95px]"
        onValueChange={(value) => {
          const [newVolume] = value;
          const volumeValue = newVolume / 100;
          setVolume(volumeValue);
        }}
      />
    </div>
  );
};

const SongControl = ({
  audio,
}: {
  audio: React.RefObject<HTMLAudioElement>;
}) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    audio.current?.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const handleTimeUpdate = () => {
    setCurrentTime(audio?.current?.currentTime ?? 0);
  };

  const formatTime = (time: number) => {
    if (time == null || isNaN(time)) return "00:00";

    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const duration = audio?.current?.duration ?? 0;

  return (
    <div className="flex gap-x-3 text-xs pt-2">
      <span className="opacity-50 w-[50px] text-center">
        {formatTime(currentTime)}
      </span>
      <Slider
        defaultValue={[0]}
        max={audio?.current?.duration ?? 0}
        min={0}
        value={[currentTime]}
        className="w-[400px]"
        onValueChange={(value) => {
          (audio.current as HTMLAudioElement).currentTime = value[0];
        }}
      />
      <span className="opacity-50 w-[50px] text-center">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default function Player() {
  const { isPlaying, setIsPlaying, setCurrentSong, currentSong, volume } =
    usePlayerStore((state) => state);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current as HTMLAudioElement;
    audio.onended = () => {
      const { playlist, song, songs } = currentSong;
      if (!playlist || !song) return;

      const index = songs.indexOf(song);
      if (index < songs.length - 1) {
        const nextSong = songs[index + 1];
        setCurrentSong({ ...currentSong, song: nextSong });
      } else {
        setIsPlaying(false);
      }
    };

    return () => {
      const audio = audioRef.current as HTMLAudioElement;
      audio.onended = null;
    };
  }, [currentSong]);

  useEffect(() => {
    isPlaying ? audioRef.current?.play() : audioRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current as HTMLAudioElement;
    const { song, playlist, songs } = currentSong;
    if (song) {
      const src = `/music/${playlist.id}/0${song.id}.mp3`;
      audio.src = src;
      audio.volume = volume;
      audio.play();
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current as HTMLAudioElement;
    audio.volume = volume;
  }, [volume]);

  const handleClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClickPrev = () => {
    const { playlist, song, songs } = currentSong;
    if (!playlist || !song) return;

    const index = songs.indexOf(song);
    if (index > 0) {
      const prevSong = songs[index - 1];
      setCurrentSong({ ...currentSong, song: prevSong });
    }
  };

  const handleClickNext = () => {
    const { playlist, song, songs } = currentSong;
    if (!playlist || !song) return;

    const index = songs.indexOf(song);
    if (index < songs.length - 1) {
      const nextSong = songs[index + 1];
      setCurrentSong({ ...currentSong, song: nextSong });
    }
  };

  return (
    <div className="flex flex-row justify-between w-full px-3 z-50">
      <div className="w-[200px]">
        <CurrentSong {...currentSong.song} />
      </div>
      <div className="grid place-content-center gap-4 flex-1">
        <div className="flex justify-center flex-col items-center">
          <div className="flex gap-x-4">
            <button className="rounded-full p-1 text-zinc-300 hover:text-zinc-100 hover:scale-105">
              <Shuffle />
            </button>
            <button
              className="rounded-full p-2 text-zinc-300 hover:text-zinc-100 hover:scale-105"
              onClick={handleClickPrev}
            >
              <Prev />
            </button>
            <button
              className="bg-white rounded-full p-2 text-black hover:scale-105"
              onClick={handleClick}
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button
              className="rounded-full p-2 text-zinc-300 hover:text-zinc-100 hover:scale-105"
              onClick={handleClickNext}
            >
              <Next />
            </button>
            <button className="rounded-full p-1 text-zinc-300 hover:text-zinc-100 hover:scale-105">
              <Repeat />
            </button>
          </div>
          <SongControl audio={audioRef} />
          <audio ref={audioRef} />
        </div>
      </div>

      <div className="flex justify-end items-center w-[200px]">
        <VolumeControl />
      </div>
    </div>
  );
}
