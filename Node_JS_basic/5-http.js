// 5-http.js
const http = require('http');
const fs = require('fs');

function countStudents(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const lines = data
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length <= 1) {
        // Only header or empty file
        const summary = 'Number of students: 0';
        console.log(summary);
        resolve(summary);
        return;
      }

      const headers = lines[0].split(',');
      const fieldIdx = headers.length - 1;
      const firstNameIdx = 0;

      const groups = {};
      let total = 0;

      for (let i = 1; i < lines.length; i += 1) {
        const row = lines[i].split(',');
        // Basic guard against malformed rows
        if (row.length !== headers.length) continue;

        const field = row[fieldIdx];
        const firstName = row[firstNameIdx];

        if (!field || !firstName) continue;

        if (!groups[field]) groups[field] = [];
        groups[field].push(firstName);
        total += 1;
      }

      const parts = [];
      parts.push(`Number of students: ${total}`);
      // Sort fields alphabetically to keep output deterministic (e.g., CS before SWE)
      Object.keys(groups).sort().forEach((field) => {
        const list = groups[field];
        parts.push(
          `Number of students in ${field}: ${list.length}. List: ${list.join(', ')}`
        );
      });

      const summary = parts.join('\n');
      // Match 3-read_file_async.js behavior: also log to console
      console.log(summary);
      resolve(summary);
    });
  });
}

const dbPath = process.argv[2];

const app = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/') {
    res.statusCode = 200;
    res.end('Hello Holberton School!\n');
    return;
  }

  if (req.url === '/students') {
    res.statusCode = 200;
    if (!dbPath) {
      // No DB path provided: mirror 3-read_file_async.js "without the database" behavior
      res.end('This is the list of our students\nCannot load the database\n');
      return;
    }

    countStudents(dbPath)
      .then((summary) => {
        res.end(`This is the list of our students\n${summary}\n`);
      })
      .catch(() => {
        res.end('This is the list of our students\nCannot load the database\n');
      });
    return;
  }

  // Fallback for any other route
  res.statusCode = 404;
  res.end('Not found\n');
});

// Listen on port 1245 as required
app.listen(1245);

module.exports = app;
