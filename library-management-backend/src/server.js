import express from 'express';
import initRoutes from './routes/initRoutes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import staticFiles from './configs/staticFiles';
import allowCORS from './configs/allowCORS';
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())


allowCORS(app);

staticFiles(app);

initRoutes(app);


app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})
