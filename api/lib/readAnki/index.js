import fs from "fs";
import Zip from "node-zip";
import sqlite3 from "sqlite3";

// ONE: Create temp files from zip
// TWO: go through media and move each numeric file, renamed
// THREE: Open the sql database, go through each note

export default function ankiToJson(inputFile, outputDir, cb) {
  if (!inputFile) {
    return new Error("inputFile required");
  }
  const name = inputFile.split("/").pop().split(".")[0];
  const dir = outputDir !== undefined ? outputDir : "./" + name;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(dir + "/media")) {
    fs.mkdirSync(dir + "/media");
  }
  const zip = new Zip(fs.readFileSync(inputFile), {
    base64: false,
    checkCRC32: true,
  });
  const media = JSON.parse(zip.files.media._data);
  for (const key in zip.files) {
    const file = zip.files[key];
    if (!isNaN(file.name)) {
      fs.writeFileSync(dir + "/media/" + media[file.name], file._data, {
        encoding: "binary",
      });
    } else if (file.name === "collection.anki2") {
      fs.writeFileSync(dir + "/" + file.name, file._data, {
        encoding: "binary",
      });
    }
  }

  console.log(dir + "/collection.anki2");
  const db = new sqlite3.Database(dir + "/collection.anki2");
  let res;
  db.all("SELECT id, flds, sfld FROM notes", (err, notes) => {
    if (err) {
      return console.log("ERROR", err);
    }
    notes = notes.map((note) => {
      note.media = [];
      note.front = note.sfld
        .replaceAll("\u001F", "\n")
        .replaceAll("<div>", "\n")
        .replaceAll("<br>", "\n")
        .replace(/<(?:.|\n)*?>/, "");

      note.back = note.flds
        .replaceAll("\u001F", "\n")
        .replaceAll("<div>", "\n")
        .replaceAll("<br>", "\n");

      note.back = note.back.split("\n")[1];
      note.back = note.back.replace(/<(?:.|\n)*?>/, "");
      note.front = note.front.trim();
      note.back = note.back.trim();
      return note;
    });
    cb(notes);
    // cleanup
    fs.unlinkSync(dir + "/collection.anki2");
    // close
    db.close();
  });
}
