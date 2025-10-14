-- TODO

DROP TABLE IF EXISTS playlist_tracks;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;

CREATE TABLE playlists (
    id SERIAL PRIMARY KEY, 
    "name" text NOT NULL,
    "description" text NOT NULL
);

CREATE TABLE tracks(
    id SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    duration_ms integer NOT NULL

);

CREATE TABLE playlist_tracks (
    id SERIAL PRIMARY KEY,
    "playlist_id" integer REFERENCES playlists(id) ON DELETE CASCADE,
    "track_id" integer REFERENCES tracks(id) ON DELETE CASCADE,
    UNIQUE ("playlist_id", "track_id")
);
