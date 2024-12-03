import { create } from "zustand"

interface PlayerState {
    isPlaying: boolean;
    currentSong: any;
    volume: number;
    setVolume: (volume: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentSong: (currentSong: any) => void;
}

interface SearchState {
    isSearchOpen: boolean;
    setIsSearchOpen: (isSearchOpen: boolean) => void;
}

interface TogglerState {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    isPlaying: false,
    currentSong: { playlist: null, song: null, songs: [] },
    volume: 1,
    setVolume: (volume: number) => set({ volume }),
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentSong: (currentSong) => set({ currentSong }),
}))

export const useSearchStore = create<SearchState>((set) => ({
    isSearchOpen: false,
    setIsSearchOpen: (isSearchOpen: boolean) => set({ isSearchOpen }),
}))

export const useTogglerStore = create<TogglerState>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
}))