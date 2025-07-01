require("dotenv").config();
const fastAgi = require("bkk-fastagi.io");
const agis = require("./agis/index");

const app = agis(fastAgi());
const PORT = 4000;

// Listening on PORT
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
