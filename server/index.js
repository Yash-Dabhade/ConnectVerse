import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

//configuring .env file
dotenv.config({
  path: "./.env",
});

// deciding port to run server (default 4000 if not provided)
const port = process.env.PORT || 4000;

// connecting the mongodb database
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Mongo connection falied", err);
  });
