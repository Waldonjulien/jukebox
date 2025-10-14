import express from "express";
import playlistRouter from "./api/playlist.js";
import tracksRouter from "./api/tracks.js";

const app = express();
app.use(express.json());

app.use("/playlists", playlistRouter);
app.use("/tracks", tracksRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});
export default app;
