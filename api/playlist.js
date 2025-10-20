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
      return res.status(400).send("Request body requires name and description");

    const playlist = await createPlaylist(name, description);
    res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  try {
    const numericId = parseInt(id);
    if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
      return res.status(400).send("ID must be a positive integer");
    }

    const playlist = await getPlaylistById(numericId);

    if (!playlist) {
      req.playlist = null;
    } else {
      req.playlist = playlist;
    }
    next();
  } catch (error) {
    next(error);
  }
});

router.route("/:id").get((req, res) => {
  if (!req.playlist) {
    return res.status(404).send("Playlist not found");
  }
  res.send(req.playlist);
});

router.route("/:id/tracks").get(async (req, res) => {
  if (!req.playlist) {
    return res.status(404).send("Playlist not found");
  }

  try {
    const tracks = await getTracksFromPlaylist(req.playlist.id);
    res.send(tracks);
  } catch (error) {
    console.error("Error fetching tracks from playlist:", error);
    res.status(400).send("Could get playlist ");
  }
});

router.route("/:id/tracks").post(async (req, res) => {
  if (!req.playlist) {
    return res.status(404).send("Playlist not found");
  }

  if (!req.body) {
    return res.status(400).send("Request body is required");
  }

  const { trackId } = req.body;
  if (!trackId) {
    return res.status(400).send("Request body requires: trackId");
  }

  const numericTrackId = parseInt(trackId);
  if (
    isNaN(numericTrackId) ||
    !Number.isInteger(numericTrackId) ||
    numericTrackId <= 0
  ) {
    return res.status(400).send("trackId must be a positive integer");
  }

  try {
    const track = await getTrackById(numericTrackId);
    if (!track) {
      return res.status(400).send("Track does not exist");
    }

    const trackAlreadyInPlaylist = await isTrackInPlaylist(
      req.playlist.id,
      numericTrackId
    );
    if (trackAlreadyInPlaylist) {
      return res.status(400).send("Track is already in playlist");
    }

    const playlistTrack = await addTrackToPlaylist(
      req.playlist.id,
      numericTrackId
    );
    res.status(201).send(playlistTrack);
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    res.status(500).send("Internal server error");
  }

  try {
    const playlist = getTracksFromPlaylist(playlist, trackId);
    res.status(201).send("");
  } catch (error) {
    console.error("Track already in playlist");
  }
});
