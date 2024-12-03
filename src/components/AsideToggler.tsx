import { LibraryIcon } from "@/icons/Library";
import { useTogglerStore } from "@/store/playerStore";
import { useEffect, useRef, useState } from "react";
import tippy from "tippy.js";

export const AsideToggler = () => {
    const { isOpen, setIsOpen } = useTogglerStore((state) => state);
    const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current === null) return
    const instance = tippy(buttonRef.current, {
      content: isOpen ? "Ocultar Tu biblioteca" : "Mostrar Tu biblioteca",
      theme: "dark",
      placement: "top-start",
      delay: [500, 0],
    });

    const app = document.getElementById("app") as HTMLDivElement;
    const playlistToggleText = document.getElementById("playlist-toggle-text") as HTMLSpanElement;
    const homeText = document.getElementById("home-text") as HTMLSpanElement;
    const searchBtnText = document.getElementById("search-btn-text") as HTMLSpanElement;

    if (isOpen) {
      app.style.gridTemplateColumns = "300px 1fr";

      playlistToggleText.classList.remove("hidden");
      homeText.classList.remove("hidden");
      searchBtnText.classList.remove("hidden");

    } else {
      app.style.gridTemplateColumns = "80px 1fr";

      playlistToggleText.classList.add("hidden");
      homeText.classList.add("hidden");
      searchBtnText.classList.add("hidden");
    }

    return () => {
      instance?.destroy();
    };


  }, [isOpen]);

  return (
    <button
      ref={buttonRef}
      onClick={() => setIsOpen(!isOpen)}
      className="flex gap-4 text-zinc-400 hover:text-zinc-100 items-center py-3 px-5 font-medium transition-duration-300"
    >
      <LibraryIcon />
      <span id="playlist-toggle-text" className="truncate">
        Tu biblioteca
      </span>
    </button>
  );
};
