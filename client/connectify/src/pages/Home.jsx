// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import React from 'react'
export default function Home() {
  return (
    <div className="min-h-screen text-gray-800">
      {/* Navbar */}
    

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">Welcome to Connectify</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          A modern social platform to connect, share, and grow with your friends and community. Post updates, follow others, and explore ideas.
        </p>
        <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className=" py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Create Posts</h3>
            <p className="text-gray-600">Share updates, ideas, and memories with your followers instantly.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Follow Friends</h3>
            <p className="text-gray-600">Stay connected by following your favorite people and influencers.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-600">Send and receive messages in real-time with your connections.</p>
          </div>
        </div>
      </section>

      <footer className=" text-center py-6 mt-12 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Connectify. All rights reserved.
      </footer>
    </div>
  );
}
