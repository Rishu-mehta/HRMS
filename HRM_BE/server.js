const app= require("./App")
const dotenv = require('dotenv');
const ConnectDB=require("./Database/Databaseconnect")
dotenv.config();
ConnectDB();


const PORT = process.env.PORT || 5000;

const sever=app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });