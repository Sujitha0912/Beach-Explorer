const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/beach-explorer.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS beaches (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)");
    db.run("CREATE TABLE IF NOT EXISTS weather_updates (id INTEGER PRIMARY KEY AUTOINCREMENT, beach_id INTEGER, date DATE, weather TEXT, FOREIGN KEY (beach_id) REFERENCES beaches(id))");
    db.run("CREATE TABLE IF NOT EXISTS crowd_updates (id INTEGER PRIMARY KEY AUTOINCREMENT, beach_id INTEGER, date DATE, crowd TEXT, FOREIGN KEY (beach_id) REFERENCES beaches(id))");
});

function getBeaches() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT beaches.id, beaches.name, weather_updates.weather, crowd_updates.crowd
                FROM beaches
                JOIN weather_updates ON beaches.id = weather_updates.beach_id
                JOIN crowd_updates ON beaches.id = crowd_updates.beach_id
                ORDER BY weather_updates.date DESC, crowd_updates.date DESC`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function getBeachDetails(beachId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT beaches.name, weather_updates.weather, crowd_updates.crowd
                FROM beaches
                JOIN weather_updates ON beaches.id = weather_updates.beach_id
                JOIN crowd_updates ON beaches.id = crowd_updates.beach_id
                WHERE beaches.id = ?
                ORDER BY weather_updates.date DESC, crowd_updates.date DESC LIMIT 1`, [beachId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

module.exports = { getBeaches, getBeachDetails };
