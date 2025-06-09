import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createWorker } from 'tesseract.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8081;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Enable CORS
app.use(cors());

// Function to find matching ground truth file
async function findGroundTruth(originalFilename: string): Promise<string | null> {
  try {
    const groundTruthDir = path.join(__dirname, '../../archive-2/Archive/Ground Truth');
    const files = await fs.readdir(groundTruthDir);
    
    // Remove extension from original filename for comparison
    const baseName = path.parse(originalFilename).name;
    
    // Find matching ground truth file
    const matchingFile = files.find(file => {
      const groundTruthBaseName = path.parse(file).name;
      return groundTruthBaseName === baseName;
    });

    if (matchingFile) {
      const groundTruthPath = path.join(groundTruthDir, matchingFile);
      const groundTruthContent = await fs.readFile(groundTruthPath, 'utf-8');
      return groundTruthContent;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding ground truth:', error);
    return null;
  }
}

(async () => {
  // Initialize Tesseract worker with Greek language
  const worker = await createWorker('grc');
  
  // Configure worker for Greek text
  await worker.setParameters({
    tessedit_char_whitelist: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω',
    preserve_interword_spaces: '1'
  });

  // OCR endpoint
  app.post('/api/ocr', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Process the image with Tesseract
      const { data: { text } } = await worker.recognize(req.file.buffer);
      
      // Find matching ground truth
      const groundTruth = await findGroundTruth(req.file.originalname);
      
      res.json({
        originalText: text,
        groundTruth: groundTruth || 'No matching ground truth found',
        translation: `[Translation of: ${text}]`
      });
    } catch (error) {
      console.error('OCR processing error:', error);
      res.status(500).json({ 
        error: 'Failed to process image',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', worker: true });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})(); 