import { allPlaylists, songs as allSongs } from "@/lib/data"
import type { Params } from "astro"

interface Props {
    params: Params
    request: Request
}

export async function GET({ params, request }: Props) {

    const { url } = request
    const urlObject = new URL(url)
    const id = urlObject.searchParams.get("id")

    const playlist = allPlaylists.find(playlist => playlist.id === id)
    const playlistSongs = allSongs.filter(song => song.albumId === playlist?.albumId)

    return new Response(JSON.stringify({ playlist, songs: playlistSongs }),
    {
        headers: { "Content-Type": "application/json" }
    }
)
}