import { Elysia, file } from "elysia";
import { capMiddleware } from "@cap.js/middleware-elysia";

new Elysia()
  .use(
    capMiddleware({
      token_validity_hours: 0, // how long the token is valid for
      tokens_store_path: ".data/tokensList.json",
      token_size: 1600, // token size in bytes
      scoping: "scoped", // 'global' | 'scoped'
    }),
  )
  .get("/", () => "Hello Elysia!")
  .listen(3000);

console.log("Server started on port 3000");
console.log("http://localhost:3000");
