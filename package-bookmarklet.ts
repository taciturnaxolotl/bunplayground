#!/usr/bin/env bun

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { minify as terserMinify } from "terser";

const main = async () => {
  // Get the file path from command line arguments
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Error: Please provide a file path as an argument");
    process.exit(1);
  }

  try {
    // Read the JavaScript file
    const fullPath = resolve(process.cwd(), filePath);
    const fileContent = readFileSync(fullPath, "utf8");

    // Minify the JavaScript using terser
    const result = await terserMinify(fileContent, {
      mangle: true,
      compress: true,
    });

    if (!result.code) {
      throw new Error("Minification failed");
    }

    const minified = result.code;

    // Create the bookmarklet by prefixing with "javascript:"
    const bookmarklet = `javascript:${encodeURIComponent(minified)}`;

    console.log(bookmarklet);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

main();
