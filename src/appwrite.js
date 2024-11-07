// src/appwrite.js
import { Client, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://YOUR_APPWRITE_ENDPOINT") // Replace with your Appwrite endpoint
  .setProject("YOUR_PROJECT_ID"); // Replace with your Appwrite project ID

const databases = new Databases(client);

export { databases };
