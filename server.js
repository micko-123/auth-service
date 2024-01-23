const app = require("./app");
const port = process.env.PORT || 8080;
const connectDB = require('./db/db')

connectDB(process.env.MONGO_URI)
app.listen(port, () => {
  console.log(`server running on ${port} ...`);
});
