import { allPlaylists, songs as allSongs, songs } from "@/lib/data"

interface Props {
    params: { id: string }
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