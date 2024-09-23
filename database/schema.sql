-- Create the water_levels table
CREATE TABLE IF NOT EXISTS water_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beach_id INTEGER,
    date DATE NOT NULL,
    water_level REAL, -- Water level in meters
    FOREIGN KEY (beach_id) REFERENCES beaches(id)
);
