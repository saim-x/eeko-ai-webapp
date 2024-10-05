"use client";

import Link from "next/link";
import { Leaf, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center fixed top-0 left-0 right-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-filter backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <Link className="flex items-center space-x-2" href="/">
        <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 dark:text-blue-400" />
        <span className="font-inter font-semibold text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-500">EekoAI</span>
      </Link>
      <nav className="ml-auto flex items-center">
        <button
          className="sm:hidden mr-4"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <ul className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row absolute sm:relative top-16 sm:top-0 left-0 sm:left-auto right-0 sm:right-auto bg-white dark:bg-gray-900 sm:bg-transparent sm:dark:bg-transparent p-4 sm:p-0 space-y-4 sm:space-y-0 sm:space-x-8`}>
          {["Features", "About", "Contact"].map((item) => (
            <li key={item}>
              <Link
                className="font-inter text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                href={`/#${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            </li>
          ))}
          {["WeedDetector", "ChatBot", "NasaData", "InsectDetector"].map((item) => (
            <li key={item}>
              <Link
                className="font-inter text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                href={`/${item}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/register"
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md font-inter text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          Sign Up
        </Link>
      </nav>
    </header>
  );
};

export default Header;