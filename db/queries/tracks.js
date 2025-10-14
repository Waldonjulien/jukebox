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

export async function getTracksFromPlaylist(playlistId) {
  const sql = `
    SELECT t.* 
    FROM tracks
    JOIN playlists ON playlist_tracks.track_id = track.id
    JOIN tracks ON plyalist_tracks.playlist_id = playlist.id
    WHERE playlist.id = $1`;
  const { rows: tracks } = await db.query(sql, [playlistId]);
  return tracks;
}
