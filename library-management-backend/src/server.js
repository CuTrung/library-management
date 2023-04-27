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

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.text({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

app.use(cookieParser())


allowCORS(app);

staticFiles(app);

initRoutes(app);


app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})
