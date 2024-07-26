import app from "./app.js";
import connectDb from "./db/index.js";

const PORT = 5000;

connectDb().then(() => {
  app.listen(PORT || 5000, () => {
    console.log("server is running on PORT:", PORT);
  });
});
