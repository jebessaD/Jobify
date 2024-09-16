const express = require("express");
const cors = require("cors");

const { PORT, MONGOSE_URI } = require("./config");
const connectDB = require("./db/connect");
const seed = require("./seed");


const companyRouter = require("./routers/Company");
const jobRouter = require("./routers/Job");
const users = require("./routers/Users");
const authRouter = require("./routers/Auth");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3000",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api/auth", authRouter);
app.use("/api/company", companyRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/admin", users);

const start = async (uri) => {
  try {
    await connectDB(uri);
    await seed()
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

start(MONGOSE_URI);