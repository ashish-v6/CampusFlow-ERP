import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import _config from "./config/config.js";

const PORT = (_config.port as string) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
