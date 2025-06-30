require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { graphqlUploadExpress } = require('graphql-upload');
const jwt = require('jsonwebtoken');
const connectDB = require('./db.js');
const typeDefs = require('./schema/Typedefs.js');
const resolvers = require('./schema/resolvers.js');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  const app = express();

  // 🔁 Required for file uploads
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));




app.use(cors({
  origin: 'http://localhost:5173',  // frontend origin here
  credentials: true,                // allow credentials (cookies)
}));
  app.use(bodyParser.json());

  const server = new ApolloServer({ typeDefs, resolvers ,  csrfPrevention: false,});
  await server.start();

  // 🔐 Inject context with token
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1];

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          return { user: decoded };
        } catch (err) {
          console.error('Invalid token:', err.message);
        }
      }

      return {};
    }
  }));

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
