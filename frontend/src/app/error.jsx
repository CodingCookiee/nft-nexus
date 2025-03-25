'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
          >
            Go back home
          </Link>
        </div>
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          If the problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
}