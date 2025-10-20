import db from "#db/client";
export async function createTracts(name, duration = 180000) {
  const sql = `
        INSERT INTO tracks 
        (name, duration_ms) 
        VALUES ($1, $2) 
        RETURNING *`;
  const {
    rows: [track],
  } = await db.query(sql, [name, duration]);
  return track;
}
export async function getTracks() {
  const sql = `SELECT * 
    FROM tracks`;
  const { rows: tracks } = await db.query(sql);
  return tracks;
}

export async function getTrackById(id) {
  const sql = `SELECT * 
    FROM tracks
    WHERE id = $1`;
  const {
    rows: [track],
  } = await db.query(sql, [id]);
  return track;
}

export async function addTrackToPlaylist(playlistId, trackId) {
  const sql = `
        INSERT INTO playlist_tracks 
        (playlist_id, track_id) 
        VALUES ($1, $2) 
        RETURNING *`;
  const {
    rows: [playlist_track],
  } = await db.query(sql, [playlistId, trackId]);
  return playlist_track;
}
