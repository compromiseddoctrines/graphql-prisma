const { ApolloServer, PubSub } = require('apollo-server');

// import graphql tools for schema
import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools';

// import schema
const typeDefs = importSchema('./src/schema.graphql');

import db from './db';
import { resolvers, fragmentReplacements } from './resolvers/index'
// import prisma js
import prisma from './prisma'

const pubsub = new PubSub();

//resolvers


// sync schema and resolvers to be executable using graphql tools
const schemaWithResolvers = makeExecutableSchema({ typeDefs, resolvers })

// apollo server with schema and resolvers
const server = new ApolloServer({
  schema: schemaWithResolvers,
  context: async ({ req, connection }) => {
    console.log(connection)
    return {
      db: db,
      pubsub,
      prisma,
      req
    };
  },
  fragmentReplacements
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });