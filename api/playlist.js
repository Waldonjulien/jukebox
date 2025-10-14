import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  getTracksFromPlaylist,
  isTrackInPlaylist,
} from "../db/queries/playlist.js";
import { getTrackById, addTrackToPlaylist } from "../db/queries/tracks.js";

router
  .route("/")
  .get(async (req, res) => {
    const playlists = await getPlaylists();
    res.send(playlists);
  })

  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).send("Request body requires: name, description");

    const playlist = await createPlaylist(name, description);
    res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  try {
    // Validate that id is a valid positive integer
    const numericId = parseInt(id);
    if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
      return res.status(400).json({ error: "ID must be a positive integer" });
    }

    const playlist = await getPlaylistById(numericId);
    if (playlist) {
      req.playlist = playlist;
      next();
    } else {
      req.playlist = null;
      next();
    }
  } catch (error) {
    next(error);
  }
});
router.route("/:id").get((req, res) => {
  if (!req.playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }
  res.send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res) => {
    if (!req.playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    try {
      const tracks = await getTracksFromPlaylist(req.playlist.id);
      res.send(tracks);
    } catch (error) {
      console.error("Error fetching tracks from playlist:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
  .post(async (req, res) => {
    if (!req.playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (!req.body) return res.status(400).send("Request body is required.");
    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Request body requires: trackId");

    // Validate that trackId is a valid positive integer
    const numericTrackId = parseInt(trackId);
    if (
      isNaN(numericTrackId) ||
      !Number.isInteger(numericTrackId) ||
      numericTrackId <= 0
    ) {
      return res
        .status(400)
        .json({ error: "trackId must be a positive integer" });
    }

    try {
      const track = await getTrackById(numericTrackId);
      if (!track) {
        return res.status(400).json({ error: "Track does not exist" });
      }

      // Check if the track is already in the playlist
      const trackAlreadyInPlaylist = await isTrackInPlaylist(
        req.playlist.id,
        numericTrackId
      );
      if (trackAlreadyInPlaylist) {
        return res.status(400).json({ error: "Track is already in playlist" });
      }

      // Add the track to the playlist
      const playlist_track = await addTrackToPlaylist(
        req.playlist.id,
        numericTrackId
      );
      res.status(201).send(playlist_track);
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
