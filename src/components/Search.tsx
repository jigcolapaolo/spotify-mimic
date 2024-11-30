import { useEffect, useState } from "react";
import { SearchIcon } from "@/icons/SearchIcon";
import { navigate } from "astro/virtual-modules/transitions-router.js";

export const Search = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!search) return;
        
        const timeout = setTimeout(() => {
            setSearch(search);
            navigate(`/?q=${search}`);
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const handleClickClear = () => {
        setSearch("");
        navigate("/");
    }

  return (
    <li>
      <div
        className="flex gap-4 text-zinc-400 hover:text-zinc-100 items-center py-3 px-5 font-medium transition-duration-300"
      >
        <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <SearchIcon />
        </button>
        {
            isSearchOpen ? (
                <div className="relative w-full">
                    <input 
                        type="text"
                        className="bg-zinc-800 rounded-md w-full py-1 px-3 outline-none placeholder:text-zinc-500" 
                        placeholder="Buscar album"
                        spellCheck="false"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={handleClickClear} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-700/50 hover:bg-zinc-700 rounded-full  px-2"
                    >X</button>
                </div>
            ) : (
                <button className="w-full grid place-content-start" onClick={() => setIsSearchOpen(!isSearchOpen)}>Buscar</button>
            )
        }
      </div>
    </li>
  );
};
