import React, { useState } from "react";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

// GraphQL Queries & Mutations
const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      text
      timeAgo
      author {
        id
        name
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($text: String!) {
    createPost(text: $text) {
      text
      author {
        id
        name
      }
    }
  }
`;

const GET_USER = gql`
  query GetUser {
    me {
      id
      name
      profilePic
    }
  }
`;

export default function Feed() {
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [text, setText] = useState("");
  const [postPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate=useNavigate()

  // Fetch posts
  const { data, error, loading, refetch } = useQuery(GET_POSTS);

  // Fetch logged-in user info
  const {
    data: userData,
    loading: loadingUser,
    error: userError,
  } = useQuery(GET_USER, {
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  });

  const [createPost] = useMutation(CREATE_POST);

  if (loading || loadingUser) return <p className="text-white p-6">Loading posts...</p>;
  if (error || userError)
    return (
      <p className="text-red-500 p-6">
        Error: {(error && error.message) || (userError && userError.message)}
      </p>
    );

  const posts = data?.getPosts || [];
  const loggedInUser = userData?.me;

  // Unique authors for filtering
  const authors = [...new Set(posts.map((post) => post.author.name))];

  // Filter posts by selected author
  const filteredPosts = selectedAuthor
    ? posts.filter((post) => post.author.name === selectedAuthor)
    : posts;

  // Pagination
  const numberOfPages = Math.ceil(filteredPosts.length / postPerPage);
  const pages = [...Array(numberOfPages).keys()].map((n) => n + 1);

  const indexOfLast = currentPage * postPerPage;
  const indexOfFirst = indexOfLast - postPerPage;
  const visiblePosts = filteredPosts.slice(indexOfFirst, indexOfLast);

  const token = sessionStorage.getItem("token");

  const handlePost = async () => {
    if (!text.trim()) return;

    try {
      await createPost({
        variables: { text },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      setText("");
      refetch();
    } catch (err) {
      console.error("Post creation failed", err);
    }
  };
  function capitalizeFullName(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

  return (
    <div className="min-h-screen flex bg-[#282142] rounded-2xl">
      {/* Sidebar */}
      <aside className="w-64 text-white shadow-md p-6 rounded-xl m-4 mt-7 border border-gray-300/20 flex flex-col">
        {/* Profile with logged-in user's profile pic */}
        <div className="flex items-center space-x-3 mb-10 cursor-pointer hover:text-blue-400"  onClick={() => navigate("/profile")}>
          {loggedInUser?.profilePic ? (
            <img
              src={loggedInUser.profilePic}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border border-blue-500"
              
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
              {loggedInUser?.name?.[0].toUpperCase() || "?"}
            </div>
          )}
          <span className="text-white font-medium select-none">{capitalizeFullName(loggedInUser?.name)}</span>
        </div>

        {/* Author Filter */}
        <div className="ml-1">
          <h3 className="mb-3 text-lg font-semibold text-white border-b border-gray-600 pb-2">
            People
          </h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            <li
              className={`px-3 py-2 rounded cursor-pointer transition-colors duration-200 ${
                selectedAuthor === null
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => setSelectedAuthor(null)}
            >
              Show All
            </li>
            {authors.map((author, idx) => (
              <li
                key={idx}
                className={`px-3 py-2 rounded cursor-pointer transition-colors duration-200 ${
                  selectedAuthor === author
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-600 hover:text-white"
                }`}
                onClick={() => setSelectedAuthor(author)}
              >
                {author}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="flex-1 p-6 max-w-3xl mx-auto">
        {/* Post Creation Box */}
        <div className="text-white rounded-lg shadow p-4 mb-6">
          <textarea
            placeholder="What's on your mind?"
            className="w-full border border-gray-300/20 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent text-white"
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="text-right mt-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handlePost}
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {visiblePosts.map((post) => (
            <div
              key={post.id}
              className="text-white p-4 rounded shadow border border-gray-300/20"
            >
              <div className="font-semibold text-white">{post.author.name}</div>
              <div className="text-white text-sm">{post.timeAgo}</div>
              <p className="mt-2 text-white">{post.text}</p>
              <div className="mt-3 text-sm text-white flex space-x-6">
                <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                  <FaHeart className="text-sm" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <FaRegComment className="text-sm" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {numberOfPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              {pages.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
