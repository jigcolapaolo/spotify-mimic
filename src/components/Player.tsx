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
import tippy from "tippy.js";

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
      className="flex items-center h-full gap-5 relative overflow-hidden transition duration-1000"
      style={{
        opacity: currentSong.playlist ? 1 : 0,
      }}
    >
      <picture
        className="relative w-[40%] rounded-full bg-zinc-800  shadow-lg overflow-hidden"
        style={{
          animation: "discRotation 20s linear infinite",
          animationPlayState: isPlaying ? "running" : "paused",
        }}
      >
        <div className="border-2 border-zinc-800 rounded-full">
          <img src={image} alt={title} className="rounded-full" />
        </div>
        <div className="absolute w-3 h-3 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </picture>

      <div className="flex flex-col w-[60%] min-w-[100px]">
        <h3 className="font-semibold text-sm"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-wrap",
          }}>{title}</h3>
        <span className="text-xs opacity-80">{artists?.join(", ")}</span>
      </div>
    </div>
  );
};

const VolumeControl = () => {
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const previousVolumeRef = useRef(volume);
  const volumeBtnRef = useRef<HTMLButtonElement>(null);

  const isVolumeSilenced = volume === 0;
  const isVolumeLow = volume < 0.4;
  const isVolumeMedium = volume < 0.8;

  useEffect(() => {
    if (volumeBtnRef.current === null) return
    const instance = tippy(volumeBtnRef.current, {
      content: volume === 0 ? "No silenciar" : "Silenciar",
      theme: "dark",
    });

    return () => {
      instance.destroy();
    };
  }, [volume])

  const handleClickVolume = () => {
    if (isVolumeSilenced) {
      setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
    }
  };




  return (
    <div className="group flex justify-center gap-x-2 flex-row-reverse pointer-events-none sm:flex-row sm:pointer-events-auto">
      <button
        id="player-volume-button"
        onClick={handleClickVolume}
        className="text-white opacity-70 hover:opacity-100 transition"
        ref={volumeBtnRef}
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
        id="player-volume-slider"
        defaultValue={[100]}
        max={100}
        min={0}
        value={[volume * 100]}
        className="w-[95px] opacity-0 sm:opacity-100"
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
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    audio.current?.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isDragging]);

  const handleTimeUpdate = () => {
    console.log(isDragging)
    if (!isDragging) {
      setCurrentTime(audio?.current?.currentTime ?? 0);
    }
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
      <span id="player-song-current-time" className="opacity-50 w-[50px] text-center">
        {formatTime(currentTime)}
      </span>
      <Slider
        id="player-play-slider"
        defaultValue={[0]}
        max={audio?.current?.duration ?? 0}
        min={0}
        value={[currentTime]}
        className="w-[100px]  md:w-[400px]"
        onValueChange={(value) => {
          setIsDragging(true);
          setCurrentTime(value[0]);
        }}
        onValueCommit={(value) => {
          setIsDragging(false);
          (audio.current as HTMLAudioElement).currentTime = value[0];
        }}
      />
      <span id="player-song-duration" className="opacity-50 w-[50px] text-center">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default function Player() {
  const { isPlaying, setIsPlaying, setCurrentSong, currentSong, volume } =
    usePlayerStore((state) => state);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false)

  const playBtnRef = useRef<HTMLButtonElement>(null);
  const shuffleBtnRef = useRef<HTMLButtonElement>(null);
  const repeatBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const audio = audioRef.current as HTMLAudioElement;
    audio.onended = () => {
      const { playlist, song, songs } = currentSong;
      if (!playlist || !song) return;

      const index = songs.indexOf(song);

      if (isRepeatOn) {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      if (isShuffleOn) {

        let randomIndex = index

        while (index === randomIndex) {
          randomIndex = Math.floor(Math.random() * songs.length);
        }

        const randomSong = songs[randomIndex];
        setCurrentSong({ ...currentSong, song: randomSong });
        return;
      }

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
  }, [currentSong, isShuffleOn, isRepeatOn]);

  useEffect(() => {
    isPlaying ? audioRef.current?.play() : audioRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current as HTMLAudioElement;
    const { song, playlist } = currentSong;
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

  useEffect(() => {
    const tooltips = [
      {
        ref: playBtnRef,
        content: isPlaying ? "Pausar" : "Reproducir",
      },
      {
        ref: shuffleBtnRef,
        content: isShuffleOn ? "Desactivar Aleatorio" : "Activar Aleatorio",
      },
      {
        ref: repeatBtnRef,
        content: isRepeatOn ? "Desactivar Repetición" : "Activar Repetición",
      },
      {
        ref: prevBtnRef,
        content: "Anterior",
      },
      {
        ref: nextBtnRef,
        content: "Siguiente",
      },
    ];
  
    const instances = tooltips.map(({ ref, content }) => {
      if (ref.current) {
        return tippy(ref.current, {
          content,
          theme: "dark",
          placement: "top",
          delay: [500, 0],
        });
      }
      return null;
    });

    return () => {
      instances.forEach((instance) => instance?.destroy());
    };
  }, [isPlaying, isShuffleOn, isRepeatOn]);
  

  const handleClick = () => {
    if (currentSong.playlist === null) return;
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

  const handleClickShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  }

  const handleClickRepeat = () => {
    setIsRepeatOn(!isRepeatOn)
  }

  return (
    <div id="player-container" className="flex flex-row justify-between w-full h-full px-3 z-50">
      <div className="hidden md:w-[200px] md:block">
        <CurrentSong {...currentSong.song} />
      </div>
      <div className="grid place-content-center gap-4 flex-1">
        <div className="flex justify-center flex-col items-center">
          <div className="flex gap-x-4">
            <button 
              id="player-shuffle-button"
              className="rounded-full p-1 text-zinc-300 hover:text-zinc-100 hover:scale-105"
              onClick={handleClickShuffle}
              ref={shuffleBtnRef}
            >
              <Shuffle className={isShuffleOn ? "text-green-500" : ""} />
            </button>
            <button
              id="player-prev-button"
              className="rounded-full p-2 text-zinc-300 hover:text-zinc-100 hover:scale-105"
              onClick={handleClickPrev}
              ref={prevBtnRef}
            >
              <Prev />
            </button>
            <button
              id="player-play-button"
              className="bg-white rounded-full p-2 text-black hover:scale-105"
              onClick={handleClick}
              ref={playBtnRef}
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button
              id="player-next-button"
              className="rounded-full p-2 text-zinc-300 hover:text-zinc-100 hover:scale-105"
              onClick={handleClickNext}
              ref={nextBtnRef}
            >
              <Next />
            </button>
            <button 
              id="player-repeat-button"
              className="rounded-full p-1 text-zinc-300 hover:text-zinc-100 hover:scale-105"
              onClick={handleClickRepeat}
              ref={repeatBtnRef}
            >
              <Repeat className={isRepeatOn ? "text-green-500" : ""} />
            </button>
          </div>
          <SongControl audio={audioRef} />
          <audio id="audio-player" ref={audioRef} />
        </div>
      </div>

      <div className="flex justify-end items-center w-[50px] md:w-[200px]">
        <VolumeControl />
      </div>
    </div>
  );
}
