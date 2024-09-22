import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminRouter } from './Routes/AdminRoute.js';


const app = express();
// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({
    origin:['http://localhost:5173'],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
}));
// Serve static files from the 'public/images' directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.json()); /*Conver Data into Json Format, we are passing from frontend*/
app.use('/auth', adminRouter);
app.use(express.static('public'));

app.listen(3000, () => {
    console.log("Server is running.....");
})

