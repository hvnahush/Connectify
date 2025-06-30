import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent flex justify-between items-center px-4 py-3">
      <div className="text-xl font-bold text-black">Connectify</div>
      <div className="space-x-6 text-black text-sm sm:text-base font-medium">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Login
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/register");
          }}
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Register
        </a>
      </div>
    </nav>
  );
}
