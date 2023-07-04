import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import sql from "./db";
import { customAlphabet } from "nanoid";

export const app = express();
export const port = 8000;

// Use base64 (64 characters) to avoid need to escape characters in short url.
// Set length to 5 characters.
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  5
);

interface ShortURL {
  id: string;
  original_url: string;
  visit_count: number;
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Get call to root, mainly for testing setup.
app.get("/", (request, response) => {
  response.send("--- Midget Gems ----");
});

// Create a short url
app.post("/url", async (request, response) => {
  const { url = "unkown" } = request.body;

  const [shortURL] = await sql<
    ShortURL[]
  >`SELECT * FROM url WHERE original_url = ${url}`;

  if (shortURL) {
    response.status(200);
    response.json({
      id: shortURL.id,
      originalURL: shortURL.original_url,
      visitCount: shortURL.visit_count,
    });
  } else {
    const id = nanoid();
    const add = await sql<
      ShortURL[]
    >`INSERT INTO url (id, original_url, visit_count) VALUES
    (${id}, ${url}, 0);`;
    if (add) {
      response.status(201);
      response.json({
        id: id,
        originalURL: url,
        visitCount: 0,
      });
    } else {
      response.status(204);
      response.json({ result: "Hmm...couldn't connect to database." });
    }
  }
});

// Get short url
app.get("/url/:id", async (request, response) => {
  const [{ id, original_url, visit_count }] =
    await sql`SELECT * FROM url WHERE id = ${request.params.id}`;
  response.json({
    id: id,
    originalURL: original_url,
    visitCount: visit_count,
  });
});

// Visit url
app.post("/url/:id/visit", async (request, response) => {
  const [{ id, original_url, visit_count }] =
    await sql`UPDATE url SET visit_count = visit_count + 1 WHERE id = ${request.params.id} RETURNING *;`;
  response.json({
    id: id,
    originalURL: original_url,
    visitCount: visit_count,
  });
});
