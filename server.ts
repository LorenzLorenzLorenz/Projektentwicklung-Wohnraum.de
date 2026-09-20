import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const videoPath = path.join(process.cwd(), 'video.mp4');

// Direct streaming helper for local video file to handle Safari byte-range requests perfectly
app.get("/api/video", (req, res) => {
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video file is downloading, please refresh in a moment.");
  }
  
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

const modelDirPath = path.join(process.cwd(), 'public', 'models');
const modelPath = path.join(modelDirPath, 'V8Web-Model.glb');

// Download 3D GLB model if needed in background, ensuring the full 2.78MB model is always intact
function downloadModelIfNeeded(): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (fs.existsSync(modelPath) && fs.statSync(modelPath).size > 2500000) {
        console.log('3D GLB Model already exists on disk with full size.');
        return resolve();
      }

      if (!fs.existsSync(modelDirPath)) {
        fs.mkdirSync(modelDirPath, { recursive: true });
      }

      console.log('Downloading complete 3D GLB model to local storage in background...');
      const file = fs.createWriteStream(modelPath);
      const url = 'https://v8-web-model.vercel.app/models/V8Web-Model.glb';

      https.get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307 || response.statusCode === 308) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            https.get(redirectUrl, (redRes) => {
              redRes.pipe(file);
            }).on('error', (err) => {
              console.error('Error in redirected model download:', err);
              resolve();
            });
          } else {
            resolve();
          }
        } else {
          response.pipe(file);
        }
      }).on('error', (err) => {
        console.error('Error in model request:', err);
        resolve();
      });

      file.on('finish', () => {
        file.close();
        console.log('Local 3D GLB model download sequence complete.');
        resolve();
      });
    } catch (err) {
      console.error('Error in downloadModelIfNeeded:', err);
      resolve();
    }
  });
}

// Download video if needed in background, non-blocking for fast server boot
function downloadVideoIfNeeded(): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (fs.existsSync(videoPath) && fs.statSync(videoPath).size > 10000000) {
        console.log('Video already exists on disk with correct size.');
        return resolve();
      }
      
      console.log('Downloading video from Google Drive to local storage in background...');
      const file = fs.createWriteStream(videoPath);
      
      // Direct download url that returns content-length: 12780664
      const url = 'https://drive.usercontent.google.com/download?id=12xvg8eExy7FJSU3_E0--V0I_KLRACE0L&export=download&confirm=t';
      
      const request = https.get(url, (response) => {
        if (response.statusCode === 303 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            https.get(redirectUrl, (redRes) => {
              redRes.pipe(file);
            }).on('error', (err) => {
              console.error('Error in redirected video download:', err);
              resolve();
            });
          } else {
            resolve();
          }
        } else {
          response.pipe(file);
        }
      });

      file.on('finish', () => {
        file.close();
        console.log('Local video download sequence complete.');
        resolve();
      });

      request.on('error', (err) => {
        console.error('Error in video request:', err);
        resolve();
      });
    } catch (err) {
      console.error('Error in downloadVideoIfNeeded:', err);
      resolve();
    }
  });
}

async function startServer() {
  // Start 3D model and video downloads non-blocking in background so server listens instantly
  downloadModelIfNeeded().catch((err) => console.error("Model download background error:", err));
  downloadVideoIfNeeded().catch((err) => console.error("Video download background error:", err));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
