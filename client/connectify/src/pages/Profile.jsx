import React, { useState } from "react";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Link } from "react-router-dom";

// ------------------ GraphQL Queries & Mutations ------------------

const GET_USER = gql`
  query GetUser {
    me {
      id
      name
      email
      profilePic
    }
  }
`;

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

const UPLOAD_PROFILE_PIC = gql`
  mutation UploadProfilePic($file: Upload!) {
    uploadProfilePic(file: $file) {
      success
      imageUrl
    }
  }
`;

// ------------------ Component ------------------

export default function Profile() {
  const [selectedImg, setSelectedImg] = useState(null);

  const {
    data: userData,
    loading: loadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery(GET_USER, {
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  });

  const {
    data: postData,
    loading: loadingPosts,
    error: postError,
  } = useQuery(GET_POSTS);

  const [uploadProfilePic] = useMutation(UPLOAD_PROFILE_PIC, {
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  });

  if (loadingUser || loadingPosts) {
    return <p className="text-white p-6">Loading profile...</p>;
  }

  if (userError || postError) {
    return <p className="text-red-400 p-6">Error loading profile data.</p>;
  }

  const user = userData?.me;
  const allPosts = postData?.getPosts || [];

  const userPosts = user
    ? allPosts.filter((post) => post.author.id === user.id)
    : [];

  if (!user) return <p className="text-white p-6">No user data found.</p>;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { data } = await uploadProfilePic({ variables: { file } });
      if (data?.uploadProfilePic?.imageUrl) {
        setSelectedImg(file); // preview new pic
        await refetchUser(); // refresh user data from server
      }
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  };

  const profilePicUrl = selectedImg
    ? URL.createObjectURL(selectedImg)
    : user.profilePic;

  function capitalizeFullName(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#282142] text-white py-10 px-8 rounded-2xl shadow-lg max-w-2xl w-full">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-10">
          <div className="relative">
            <label
              htmlFor="avatar"
              className="cursor-pointer w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden bg-blue-600 flex items-center justify-center text-5xl font-bold text-white select-none"
            >
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name[0].toUpperCase()
              )}
            </label>
            <input
              onChange={handleFileChange}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{capitalizeFullName(user.name)}</h1>
            <p className="text-gray-300">{user.email}</p>
          </div>
        </div>

        {/* Posts Section */}
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-500 pb-2">
          Your Posts
        </h2>
        <div className="space-y-6">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white/10 p-4 rounded shadow border border-gray-300/20"
              >
                <p className="text-white">{post.text}</p>
                <div className="mt-2 text-sm text-gray-400">{post.timeAgo}</div>
                <div className="mt-3 text-sm text-white flex space-x-6">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <FaHeart className="text-sm" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <FaRegComment className="text-sm" />
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              You haven’t posted anything yet.{" "}
              <Link
                to="/feed"
                className="text-blue-400 hover:underline ml-1"
              >
                Go to Feed to create your first post.
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
