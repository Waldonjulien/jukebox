import db from "#db/client";
import { createPlaylist } from "./queries/playlist.js";
import { createTracts, addTrackToPlaylist } from "./queries/tracks.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 11; i++) {
    await createPlaylist("playlist " + i, "Description for playlist " + i);
  }
  for (let i = 1; i <= 20; i++) {
    await createTracts("track " + i, 180000 + i * 1000); // 3 minutes + i seconds in milliseconds
  }
  for (let i = 1; i <= 15; i++) {
    const playlistId = Math.floor(Math.random() * 10) + 1;
    const trackId = Math.floor(Math.random() * 20) + 1;
    await addTrackToPlaylist(playlistId, trackId);
  }
}
