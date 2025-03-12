const express = require('express');
const fs = require('fs');
const path = require('path');
const markdownPdf = require('markdown-pdf');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/convert', (req, res) => {
    try {
      const { markdown } = req.body;
      if (!markdown) {
        return res.status(400).json({ error: 'markdown required' });
      }
  
      const uniqueFilename = uuidv4();
      const inputPath = path.join('/tmp/', `${uniqueFilename}.md`);
      const outputPath = path.join('/tmp/', `${uniqueFilename}.pdf`);
  
      fs.writeFileSync(inputPath, markdown);
  
      fs.createReadStream(inputPath)
        .pipe(markdownPdf())
        .pipe(fs.createWriteStream(outputPath))
        .on('finish', () => {
          res.download(outputPath, (err) => {
            if (err) {
              console.error('Error on send:', err);
              return res.status(500).json({ error: 'Error sending file' });
            }
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
          });
        });
    } catch (error) {
      console.error('Internal server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(port, () => {
  console.log(`running on http://0.0.0.0:${port}`);
});
