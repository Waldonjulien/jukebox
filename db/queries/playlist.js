import db from "#db/client";

export async function createPlaylist(name, description) {
  const sql = `
        INSERT INTO playlists 
        (name, description) 
        VALUES ($1, $2) 
        RETURNING *`;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description]);
  return playlist;
}

export async function getPlaylists() {
  const sql = `SELECT * 
    FROM playlists`;
  const { rows: playlists } = await db.query(sql);
  return playlists;
}

export async function getPlaylistById(id) {
  const sql = `SELECT * 
    FROM playlists
    WHERE id = $1`;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}
export async function getTracksFromPlaylist(playlistId) {
  const sql = `
    SELECT t.* 
    FROM tracks t
    JOIN playlist_tracks pt ON t.id = pt.track_id
    JOIN playlists p ON pt.playlist_id = p.id
    WHERE p.id = $1`;
  const { rows: tracks } = await db.query(sql, [playlistId]);
  return tracks;
}

export async function isTrackInPlaylist(playlistId, trackId) {
  const sql = `
    SELECT COUNT(*) as count
    FROM playlist_tracks 
    WHERE playlist_id = $1 AND track_id = $2`;
  const {
    rows: [result],
  } = await db.query(sql, [playlistId, trackId]);
  return parseInt(result.count) > 0;
}
