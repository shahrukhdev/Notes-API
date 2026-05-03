import express, {Application} from "express";
import routes from "../index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js app
    credentials: true, // allow cookies/auth headers
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// Test
// app.get('/', (req, res) => {
//   res.send('Server is working');
// });

app.use('/api/v1', routes);

export default app;
