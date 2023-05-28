const sqlite3 = require('sqlite3').verbose();
const sqliteFile = './database.db';
/*****************************************************************D
 * tables we have                                                 a
 *    -posts    [type,pid,username,title,src,timestamp,lat,long]  R 
 *    -users    [username,email,saltedhash]                       z
 *    -messages [fuid,tuid,message,pid]                           H
 *****************************************************************/
exports.deletePost = async (pid) => {
   return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(sqliteFile);
    const deleteMessagesQuery = `DELETE FROM messages WHERE pid = ?;`;
    const deletePostsQuery = `DELETE FROM posts WHERE pid = ?;`;
    
    db.serialize(() => {
      db.run(deleteMessagesQuery, pid, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        db.run(deletePostsQuery, pid, (err) => {
          if (err) {
            reject(err);
            return;
          }
          
          db.close((err) => {
            if (err) {
              console.error('Error closing SQLite database connection:', err);
            }
            
            resolve(JSON.stringify({ status: "DELETED" }));
          });
        });
      });
    });
  });
}
exports.checkAvailable = async (username) =>{
  return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(sqliteFile);
      const query = `SELECT * FROM users WHERE username=?;`;
      db.all(query, [username], (err, rows) => {
        if (err) {
          reject(err);
        } else {
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
exports.getMessages = async(pid,from,to) => {
 return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(sqliteFile);
    const query = `SELECT * FROM messages WHERE pid = ? AND (fuid = ? OR fuid = ?)`;
    db.all(query, [pid, from, to], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const messages = rows.map(row => {
        const { fuid, tuid, message, timestamp } = row;
        const message_type = (fuid === from) ? 'outgoing' : 'incoming';
        return {
          type: message_type,
          content: message,
          timestamp: timestamp
        };
      });

      resolve(messages);

    });

    db.close();
  });
}
exports.getMessageList = async(username) => {
 return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(sqliteFile);
    const query = `SELECT USERS.username, POSTS.pid, MESSAGES.message, MESSAGES.timestamp AS last_timestamp
FROM (
  SELECT MESSAGES.pid, MAX(MESSAGES.timestamp) AS max_timestamp
  FROM MESSAGES
  WHERE MESSAGES.fuid = ? OR MESSAGES.tuid = ?
  GROUP BY MESSAGES.pid
) AS latest_messages
LEFT JOIN MESSAGES ON MESSAGES.pid = latest_messages.pid AND MESSAGES.timestamp = latest_messages.max_timestamp
LEFT JOIN USERS ON (MESSAGES.fuid = USERS.username OR MESSAGES.tuid = USERS.username)
LEFT JOIN POSTS ON MESSAGES.pid = POSTS.pid
WHERE USERS.username <> ?;`;
    db.all(query,[username,username,username], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const lastMessage = rows.map(row => {
        const { username, pid, message, last_timestamp } = row;
        return {
          username: username,
          pid: pid,
          message:message,
          timestamp: last_timestamp
        };
      });

      resolve(lastMessage);

    });

    db.close();
  });
}
exports.setMessages = async(pid,from,to,message)=>{
  return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(sqliteFile);
      const query = `INSERT INTO messages (pid, fuid, tuid, message, timestamp) VALUES (?, ?, ?, ?, ?);`;
      db.all(query, [pid, from, to, message, Date.now()], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          db.close(err => {
            if (err) {
              console.error('Error closing SQLite database connection:', err);
            }
            resolve(JSON.stringify({status:"SENT"}));
          });
        }
      });
  });
}
exports.getUserPosts = async(username) =>{
  return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(sqliteFile);
      const query = `SELECT * FROM posts where username=?;`;
      db.all(query, [username], (err, rows) => {
        if (err) {
          reject(err);
        } else {
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
exports.addNewUser = async(username, email, hashedPassword)=>{
  let checkAvailable = await exports.checkAvailable(username);
  if(checkAvailable.length>0){
    return null;
  }else{
  return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(sqliteFile);
      const query = `INSERT INTO users (username, email, saltedhash) VALUES (?, ?, ?);`;
      db.all(query, [username, email, hashedPassword], (err, rows) => {
        if (err) {
          reject(err);
        } else {
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
}
exports.getPost = async (ref_lat, ref_long, searchRadius, type) => {
  return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(sqliteFile);
      const query = !type?`SELECT type,pid,username,title,src,timestamp,lat,long,desc,(6371 * 2 * ASIN(SQRT(
        POWER(SIN((RADIANS(?) - RADIANS(lat)) / 2), 2) +
        COS(RADIANS(?)) * COS(RADIANS(lat)) *
        POWER(SIN((RADIANS(?) - RADIANS(long)) / 2), 2)
    ))) AS distance FROM posts WHERE distance <= ? ORDER BY distance ASC;`:`SELECT type,pid,username,title,src,timestamp,lat,long,(6371 * 2 * ASIN(SQRT(
        POWER(SIN((RADIANS(?) - RADIANS(lat)) / 2), 2) +
        COS(RADIANS(?)) * COS(RADIANS(lat)) *
        POWER(SIN((RADIANS(?) - RADIANS(long)) / 2), 2)
    ))) AS distance FROM posts WHERE distance <= ? AND type="${type} ORDER BY distance ASC";`;
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
exports.addPost = async (type,username,title,src,lat,long,desc) => {
  return new Promise((resolve, reject) => {
      //TODO : before adding post,check if user is correct by comparing password hash along with it
      const db = new sqlite3.Database(sqliteFile);
      const query = `INSERT INTO posts (type,username,title,src,lat,long,timestamp,desc) VALUES (?,?,?,?,?,?,?,?);`;
      db.all(query, [type, username,title,src,lat,long,Math.floor(Date.now()/1000),desc], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Close the database connection
          db.close(err => {
            if (err) {
              console.error('Error closing SQLite database connection:', err);
            }
            resolve(JSON.stringify({status:"SUCCESSFUL"}));
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
  "desc"  TEXT,
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