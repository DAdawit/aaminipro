// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="">
      <div className="">
        <main>
          <Outlet />
        </main>

        {/* <footer className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Your App. All rights reserved.
        </footer> */}
      </div>
    </div>
  );
};

export default AuthLayout;
