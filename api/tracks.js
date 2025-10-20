import express from "express";
import {
  getTracks,
  getTrackById,
  createTracts,
  addTrackToPlaylist,
} from "../db/queries/tracks.js";

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    const tracks = await getTracks();
    res.send(tracks);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");
    const { name, duration } = req.body;

    if (!name || !duration)
      return res.status(400).send("Request body requires: name, duration");

    const track = await getTracks(name, duration);
    res.status(201).send(track);
  });

router.param("id", async (req, res, next, id) => {
  try {
    const track_Id = parseInt(id);
    if (isNaN(track_Id)) {
      return res.status(400).send("ID must be a positive integer");
    }

    const track = await getTrackById(id);
    if (track) {
      req.track = track;
      next();
    } else {
      req.track = null;
      next();
    }
  } catch (error) {
    next(error);
  }
});

router
  .route("/:id")
  .get((req, res) => {
    if (!req.track) {
      return res.status(404).send("Track not found");
    }
    res.send(req.track);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");
    const { playlistId } = req.body;
    if (!playlistId)
      return res.status(400).send("Request body requires: playlistId");

    const playlist_track = await addTrackToPlaylist(playlistId, req.track.id);
    res.status(201).send(playlist_track);
  });

export default router;
