

const typeDefs = `
  scalar Date
    scalar Upload


  type User {
    id: ID!
    name: String!
    email: String!
    bio: String
    profilePic: String 
    followers: [User]
    following: [User]
    posts: [Post]
  }

  type Post {
    id: ID!
    text: String!
    author: User!
    likes: [User]
    comments: [Comment]
    timeAgo: String!
    createdAt: Date!
  }
  type Comment {
    id: ID!
    text: String!
    user: User!
    createdAt: Date!
  }
     type UploadResponse {
    success: Boolean!
    imageUrl: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User]
    getUserByID(id: ID!): User
    getPosts: [Post]
    getPostByID(id: ID!): Post
    me: User
  }
  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    uploadProfilePic(file: Upload!): UploadResponse!
    createPost(text: String!): Post
    likePost(postId: ID!): Post
    commentPost(postId: ID!, text: String!): Post

    followUser(userId: ID!): User
    unfollowUser(userId: ID!): User
  }
`;
module.exports = typeDefs;