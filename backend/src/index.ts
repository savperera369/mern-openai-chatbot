import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
// application dev server

const PORT = process.env.PORT || 5002;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log('Server Open and connected to database'));
  })
  .catch((err) => console.log(err));

