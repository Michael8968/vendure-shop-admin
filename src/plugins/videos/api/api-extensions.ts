import gql from 'graphql-tag';

const videoAdminApiExtensions = gql`
  type Video implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    description: String!
    url: String!
    type: String!
  }

  type VideoList implements PaginatedList {
    items: [Video!]!
    totalItems: Int!
  }

  # Generated at run-time by Vendure
  input VideoListOptions

  extend type Query {
    video(id: ID!): Video
    videos(options: VideoListOptions): VideoList!
  }

  input CreateVideoInput {
    name: String!
    description: String!
    url: String!
    type: String!
  }

  input UpdateVideoInput {
    id: ID!
    name: String
    description: String
    url: String
    type: String
  }

  extend type Mutation {
    createVideo(input: CreateVideoInput!): Video!
    updateVideo(input: UpdateVideoInput!): Video!
    deleteVideo(id: ID!): DeletionResponse!
  }
`;

export const adminApiExtensions = gql`
  ${videoAdminApiExtensions}
`;
