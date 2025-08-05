// src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Please sign in to continue</p>
        </header>

        <main>
          <Outlet />
        </main>

        <footer className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Your App. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
