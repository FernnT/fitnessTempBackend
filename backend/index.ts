import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import  authRoutes  from "./routes/authRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
const app = express();
app.use(cors());
app.use(bodyparser.json());

app.use('/auth', authRoutes);
app.use('/exercise', exerciseRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
