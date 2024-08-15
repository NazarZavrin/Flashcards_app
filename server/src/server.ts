import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import appRouter from './routers/appRouter';
import { errorHandler } from './middlewares/errorHandler';
import { connectToMongoDB } from './utils/connect-to-MongoDB';

const result = dotenv.config({ path: path.join(path.resolve(), 'server', 'src', 'config', '.env') });
if (result.error) {
    throw result.error;
} else {
    console.log("Environment variables are parsed.");
}

const app = express();
const PORT = process.env.PORT || 5000;
var whitelist = [process.env.FRONT_END_URL];
let corsOptions: cors.CorsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !process.env.FRONT_END_URL) {
            callback(null, true);
        } else if (process.env.ALLOW_UNDEFINED_ORIGIN === 'true' && !origin) { // ← set process.env.ALLOW_UNDEFINED_ORIGIN to 'false' if you want to block REST tools (such as Postman) or server-to-server requests
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server endpoint");
})
app.use(appRouter);
app.use(errorHandler);

async function start() {
    const connectionResult = await connectToMongoDB();
    console.log(connectionResult);
    if (connectionResult.includes("Success")) {
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}...`);
        });
    }
}
start();