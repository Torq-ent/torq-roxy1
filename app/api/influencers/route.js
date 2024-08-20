import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "influencers.db");
const db = new sqlite3.Database(dbPath);

export async function GET(req) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM influencers ORDER BY RANDOM() LIMIT 1",
      [],
      (err, rows) => {
        if (err) {
          console.error("Database error:", err.message);
          resolve(
            new Response(JSON.stringify({ error: err.message }), {
              status: 500,
            })
          );
          return;
        }

        if (!rows || rows.length === 0) {
          console.error("No influencers found");
          resolve(
            new Response(JSON.stringify({ error: "No influencers found" }), {
              status: 404,
            })
          );
          return;
        }

        console.log("Influencer fetched:", rows[0]);
        resolve(
          new Response(JSON.stringify({ influencer: rows[0] }), { status: 200 })
        );
      }
    );
  });
}
