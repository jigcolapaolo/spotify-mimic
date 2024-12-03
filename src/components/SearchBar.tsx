import { useSearchStore } from "@/store/playerStore";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { useEffect, useState } from "react";

export const SearchBar = () => {
  const { isSearchOpen } = useSearchStore((state) => state);
  const [search, setSearch] = useState("");


  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("q") && !search) {
      navigate("/");
      return;
    }

    const timeout = setTimeout(() => {
      setSearch(search);
      if (search) navigate(`/?q=${search}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <>
      {isSearchOpen && (
        <div className="absolute w-[40%] top-2 left-1/2 -translate-x-1/2 z-50">
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
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-700/50 hover:bg-zinc-700 rounded-full  px-2"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};
