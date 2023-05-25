const sqlite3 = require('sqlite3').verbose();
const sqliteFile = './database.db';
/*****************************************************************D
 * tables we have                                                 a
 *    -posts    [type,pid,username,title,src,timestamp,lat,long]  R 
 *    -users    [username,email,saltedhash]                       z
 *    -messages [fuid,tuid,message]                               H
 *****************************************************************/
exports.getPost = async (ref_lat, ref_long, searchRadius, type) => {
  return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(sqliteFile);
      const query = !type?`SELECT type,pid,username,title,src,timestamp,lat,long,(6371 * 2 * ASIN(SQRT(
        POWER(SIN((RADIANS(?) - RADIANS(lat)) / 2), 2) +
        COS(RADIANS(?)) * COS(RADIANS(lat)) *
        POWER(SIN((RADIANS(?) - RADIANS(long)) / 2), 2)
    ))) AS distance FROM posts WHERE distance <= ?;`:`SELECT type,pid,username,title,src,timestamp,lat,long,(6371 * 2 * ASIN(SQRT(
        POWER(SIN((RADIANS(?) - RADIANS(lat)) / 2), 2) +
        COS(RADIANS(?)) * COS(RADIANS(lat)) *
        POWER(SIN((RADIANS(?) - RADIANS(long)) / 2), 2)
    ))) AS distance FROM posts WHERE distance <= ? AND type="${type}";`;
      db.all(query, [ref_lat, ref_lat,ref_long,searchRadius], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Close the database connection
          db.close(err => {
            if (err) {
              console.error('Error closing SQLite database connection:', err);
            }
            resolve(rows);
          });
        }
      });
  });
}
/**
 * Adds post to the posts table
 * @param {string} type - Either a "LOST" or "FOUND"
 * @param {string} username - A valid user already in users table
 * @param {string} title - The title for the post
 * @param {string} src - source of images in array ['img1','img2'...]
 * @param {string} lat - The Latitude
 * @param {string} long - The Longtitude
 **/
exports.addPost = async (type,username,title,src,lat,long) => {
  return new Promise((resolve, reject) => {
      //TODO : before adding post,check if user is correct by comparing password hash along with it
      const db = new sqlite3.Database(sqliteFile);
      const query = `INSERT INTO posts (type,username,title,src,lat,long,timestamp) VALUES (?,?,?,?,?,?,?);`;
      db.all(query, [type, username,title,src,lat,long,Math.floor(Date.now()/1000)], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Close the database connection
          db.close(err => {
            if (err) {
              console.error('Error closing SQLite database connection:', err);
            }
            resolve(rows);
          });
        }
      });
  });
}

exports.createTable = () => {
  const db = new sqlite3.Database(sqliteFile);
  const users = `CREATE TABLE IF NOT EXISTS "users" (
  "username"  TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL,
  "saltedhash"  TEXT NOT NULL,
  PRIMARY KEY("username")
);`;

  db.run(users, err => {
    if (err) {
      console.error('Error creating table in SQLite:', err);
    } else {
      console.log('Users Table created in SQLite');
    }
  });

  const messages = `CREATE TABLE IF NOT EXISTS "messages" (
  "fuid"  TEXT,
  "tuid"  TEXT,
  "message"  TEXT,
  "timestamp" INTEGER,
  "pid" INTEGER NOT NULL,
  FOREIGN KEY("tuid") REFERENCES "users"("username"),
  FOREIGN KEY("fuid") REFERENCES "users"("username"),
  FOREIGN KEY("pid") REFERENCES "posts"("pid")
);`;

  db.run(messages, err => {
    if (err) {
      console.error('Error creating table in SQLite:', err);
    } else {
      console.log('messages Table created in SQLite');
    }
  });

   const posts = `CREATE TABLE IF NOT EXISTS "posts" (
  "type"  TEXT NOT NULL DEFAULT 'lost',
  "pid" INTEGER NOT NULL UNIQUE,
  "username"  TEXT NOT NULL,
  "title"  TEXT NOT NULL,
  "src"  TEXT NOT NULL,
  "timestamp" INTEGER NOT NULL,
  "lat" REAL NOT NULL,
  "long"  REAL NOT NULL,
  FOREIGN KEY("username") REFERENCES "users"("username"),
  PRIMARY KEY("pid" AUTOINCREMENT)
);`;

  db.run(posts, err => {
    if (err) {
      console.error('Error creating table in SQLite:', err);
    } else {
      console.log('posts Table created in SQLite');
    }
    db.close();
  });
}