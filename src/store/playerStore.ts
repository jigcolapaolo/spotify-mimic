import { create } from "zustand"

interface PlayerState {
    isPlaying: boolean;
    currentSong: any;
    volume: number;
    setVolume: (volume: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentSong: (currentSong: any) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    isPlaying: false,
    currentSong: { playlist: null, song: null, songs: [] },
    volume: 1,
    setVolume: (volume: number) => set({ volume }),
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentSong: (currentSong) => set({ currentSong }),
}))