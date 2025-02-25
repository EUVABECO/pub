import fs from 'fs';
import path from 'path';
import { importJWK, exportJWK } from 'jose';

async function main() {
  const pubKeysDir = path.join(process.cwd(), 'pub_keys');
  const outputDir = path.join(process.cwd(), 'build/well-known');

  fs.mkdirSync(outputDir, { recursive: true });

  const keysMap = new Map();

  const directories = fs.readdirSync(pubKeysDir, { withFileTypes: true });
  for (const dirent of directories) {
    if (dirent.isDirectory()) {
      const partnerDir = path.join(pubKeysDir, dirent.name);
      const jsonFiles = fs.readdirSync(partnerDir).filter(file => file.endsWith('.json'));

      for (const file of jsonFiles) {
        const filePath = path.join(partnerDir, file);
        try {
          const data = fs.readFileSync(filePath, 'utf8');
          const key = JSON.parse(data);

          const cryptoKey = await importJWK(key);
          const normalizedKey = await exportJWK(cryptoKey);

          // Add the 'kid' property to the normalized key
          normalizedKey.kid = key.kid;

          if (keysMap.has(key.kid)) {
            throw new Error(`Duplicate key detected for kid '${key.kid}' in ${filePath}.`);
          }

          keysMap.set(key.kid, normalizedKey);
        } catch (error) {
          console.error(`Error processing ${filePath}: ${error.message}`);
          process.exit(1);
        }
      }
    }
  }

  const jwks = { keys: Array.from(keysMap.values()) };
  const outputFile = path.join(outputDir, 'jwks.json');
  const helloWorld = path.join(outputDir, 'index.html');
  fs.writeFileSync(outputFile, JSON.stringify(jwks, null, 2));
  fs.writeFileSync(helloWorld, "<html><body><h1>Hello</h1></body><html/>");
  console.log(`JWKS file generated successfully at ${outputFile}`);
}

main();
