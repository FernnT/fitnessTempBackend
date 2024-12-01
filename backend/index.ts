import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import  authRoutes  from "./routes/authRoutes";

const app = express();
app.use(cors());
app.use(bodyparser.json());

app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
