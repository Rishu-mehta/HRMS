const app= require("./App")
const dotenv = require('dotenv');
const ConnectDB=require("./Database/Databaseconnect")
dotenv.config();
ConnectDB();

const sever=app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  
  });