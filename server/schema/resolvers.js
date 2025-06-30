const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const Post = require("../models/postModel.js");
const dayjs =require("dayjs")
const cloudinary = require('../Cloudinary.js');
const { GraphQLUpload } = require('graphql-upload');
const fs = require('fs');
const relativeTime =require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    getUsers: async () => {
      return await User.find().populate("followers").populate("following");
    },
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthenticated user");
      return await User.findById(user.id);
    },
getPosts: async () => {
      // Populate 'author' so that author is a full user object
      const posts = await Post.find()
        .populate('author')          // this is key to get full author data
        .sort({ createdAt: -1 });

      return posts.map(post => ({
        id: post._id.toString(),
        text: post.text,
        author: {
          id: post.author._id.toString(),
          name: post.author.name,
        },
        timeAgo: dayjs(post.createdAt).fromNow(),
        createdAt: post.createdAt,
      }));
    }
  },

  Mutation: {
    register: async (_, { name, email, password }) => {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        throw new Error("Email is already registered.");
      }

      const existingName = await User.findOne({ name });
      if (existingName) {
        throw new Error("Username is already taken.");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return { token, user: newUser };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return { token, user };
    },

    createPost: async (_, { text }, { user }) => {
      if (!user) throw new Error("Authentication required");
      const newPost = new Post({ text, author: user.id.toString() });
      await newPost.save();
      return await newPost.populate("author");
    },

    likePost: async (_, { postId }, { user }) => {
      if (!user) throw new Error("Authentication required");
      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found");

      const isLiked = post.likes.includes(user.id);
      if (isLiked) {
        post.likes = post.likes.filter((uid) => uid.toString() !== user.id);
      } else {
        post.likes.push(user.id);
      }

      await post.save();
      return post;
    },

    commentPost: async (_, { postId, text }, { user }) => {
      if (!user) throw new Error("Authentication required");
      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found");

      post.comments.push({ user: user.id, text, createdAt: new Date() });
      await post.save();
      return post;
    },
  uploadProfilePic: async (_, { file }, { user }) => {
  if (!user) throw new Error('Unauthenticated');

  const { createReadStream, filename } = await file;

  const streamPromise = new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile_pics',
        public_id: `${user.id}_${filename}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    createReadStream().pipe(stream);
  });

  const imageUrl = await streamPromise;

  // ✅ This must update the user's profilePic field
  await User.findByIdAndUpdate(user.id, { profilePic: imageUrl }); // <== This line

  return {
    success: true,
    imageUrl,
  };
}
  },

  
   
};

module.exports = resolvers;
