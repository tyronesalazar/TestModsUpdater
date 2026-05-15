const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const modsFolder = "./mods";
const baseUrl = "https://media.githubusercontent.com/media/tyronesalazar/TestModsUpdater/refs/heads/main/mods"; // cambia esto

function sha256(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash("sha256");
    hash.update(fileBuffer);
    return hash.digest("hex");
}

const mods = fs.readdirSync(modsFolder)
    .filter(f => f.endsWith(".jar"))
    .map(file => {
        const fullPath = path.join(modsFolder, file);
        // replace spaces with %20 for URL encoding
        file = file.replace(/ /g, "%20");
        return {
            name: file,
            hash: sha256(fullPath),
            url: `${baseUrl}/${file}`
        };
    });

const manifest = {
    version: Date.now().toString(),
    mods: mods
};

fs.writeFileSync(
    "manifest.json",
    JSON.stringify(manifest, null, 2)
);

console.log("Manifest generado con", mods.length, "mods");