import { SearchIcon } from "@/icons/SearchIcon";
import { useSearchStore, useTogglerStore } from "@/store/playerStore";
import { useEffect, useRef } from "react";
import tippy from "tippy.js";

export const SearchBtn = () => {
  const { isSearchOpen, setIsSearchOpen } = useSearchStore((state) => state);
  const { isOpen } = useTogglerStore((state) => state);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current === null) return
    const instance = tippy(buttonRef.current, {
      content: isOpen ? "" : "Buscar",
      theme: "dark",
      placement: "right",
      delay: [500, 0],
    })

    return () => {
      instance.destroy();
    };
  }, [isOpen])


  return (
    <li>
        <button
          ref={buttonRef}
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="flex gap-4 text-zinc-400 hover:text-zinc-100 items-center py-3 px-5 font-medium transition-duration-300"
        >
          <SearchIcon />
          <span id="search-btn-text">Buscar</span>
        </button>
    </li>
  );
};
