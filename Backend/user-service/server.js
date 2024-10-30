import http from "http";
import index from "./index.js";
import "dotenv/config";
import { connectToDB } from "./model/repository.js";

const port = process.env.PORT || 3001;

const server = http.createServer(index);

await connectToDB().then(() => {
  console.log("MongoDB Connected!");

  server.listen(port);
  console.log("User service server listening on http://34.126.68.8:3002:" + port);
}).catch((err) => {
  console.error("Failed to connect to DB");
  console.error(err);
});

