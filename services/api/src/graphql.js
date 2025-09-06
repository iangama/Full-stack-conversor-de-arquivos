import { ApolloServer, gql } from 'apollo-server-express';

const typeDefs = gql`
  type JobInfo {
    id: ID!
    status: String!
    progress: Int
    outputUrl: String
    error: String
  }

  type Query {
    jobStatus(id: ID!): JobInfo!
  }

  type Mutation {
    requestConversion(objectKey: String!, targetFormat: String!): JobInfo!
  }
`;

export function buildGraph(serverDeps) {
  const { getJobInfo, enqueue } = serverDeps;

  const resolvers = {
    Query: { jobStatus: (_, { id }) => getJobInfo(id) },
    Mutation: {
      requestConversion: async (_, { objectKey, targetFormat }) => {
        const job = await enqueue({ objectKey, targetFormat });
        return { id: job.id, status: 'queued' };
      }
    }
  };

  return new ApolloServer({ typeDefs, resolvers });
}
