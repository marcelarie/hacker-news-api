import dotenv from 'dotenv';
import app from './server.js';
dotenv.config();
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () { return console.log("Server running on port " + PORT + " :)"); });
