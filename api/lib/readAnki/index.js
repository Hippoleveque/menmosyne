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
        .replace(/<(?:.|\n)*?>/gm, "");
      note.back = note.flds
        .replaceAll("\u001F", "\n")
        .replaceAll("<div>", "\n")
        .replaceAll("<br>", "\n")
        .replace(/<(?:.|\n)*?>/gm, "");
      const openBracketIndexes = [];
      const closedBracketIndexes = [];
      // FRONT
      for (let i = 0; i < note.front.length; i++) {
        if (note.front[i] === "[") {
          openBracketIndexes.push(i);
        }
        if (note.front[i] === "]") {
          closedBracketIndexes.push(i);
        }
      }
      while (openBracketIndexes.length) {
        const start = openBracketIndexes.shift();
        const end = closedBracketIndexes.shift();
        const bracketString = note.front.slice(start + 1, end);
        if (bracketString.includes(":")) {
          note.media.push(bracketString.split(":")[1]);
          note.front = note.front.slice(0, start) + note.front.slice(end + 1);
        }
      }
      // BACK
      for (let i = 0; i < note.back.length; i++) {
        if (note.back[i] === "[") {
          openBracketIndexes.push(i);
        }
        if (note.back[i] === "]") {
          closedBracketIndexes.push(i);
        }
      }
      while (openBracketIndexes.length) {
        const start = openBracketIndexes.shift();
        const end = closedBracketIndexes.shift();
        const bracketString = note.back.slice(start + 1, end);
        if (bracketString.includes(":")) {
          note.media.push(bracketString.split(":")[1]);
          note.back = note.back.slice(0, start) + note.back.slice(end + 1);
        }
      }
      // TODO: images, items, sentences
      // LASTLY ensure no dublicates, remove access words, if the word does not exist, remove entry
      // <img src=\"
      // IMAGES
      // const images = indexesOf("<img", note.flds);
      // images.forEach((imageIndex) => {
      //   const imageStr = note.flds.slice(imageIndex);
      //   const innerQuotes = imageStr.match(/"([^"]*)"/)[1];
      //   note.media.push(innerQuotes);
      // });
      // note.media = [...new Set(note.media)];
      note.front = note.front.trim();
      note.back = note.back.trim();
      return note;
    });
    // create
    // fs.writeFileSync(dir + "/notes.json", JSON.stringify(notes, null, 2));
    cb(notes);
    // cleanup
    fs.unlinkSync(dir + "/collection.anki2");
    // close
    db.close();
  });
}

// function indexesOf(searchStr, str, caseSensitive) {
//   const searchStrLen = searchStr.length;
//   if (searchStrLen === 0) return [];
//   let startIndex = 0;
//   let index;
//   const indices = [];
//   if (!caseSensitive) {
//     str = str.toLowerCase();
//     searchStr = searchStr.toLowerCase();
//   }
//   while ((index = str.indexOf(searchStr, startIndex)) > -1) {
//     indices.push(index);
//     startIndex = index + searchStrLen;
//   }
//   return indices;
// }