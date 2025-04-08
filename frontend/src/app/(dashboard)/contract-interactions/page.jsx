import React from "react";
import { Text } from "../../components/ui/common";
import { FaBookOpenReader } from "react-icons/fa6";
import { TfiWrite } from "react-icons/tfi";
import { ReadContract, WriteContract } from "../../components/ui/client";

const Page = () => {
  return (
    <div className=" container py-20 flex flex-col items-center justify-center">
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl px-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaBookOpenReader className="cursor-pointer h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <Text
            variant="h4"
            color="default"
            align="center"
            weight="medium"
            className="mb-4 cursor-pointer bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
          >
            Read Contract
          </Text>
          <ReadContract />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <TfiWrite className="cursor-pointer h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <Text
            variant="h4"
            color="default"
            align="center"
            weight="medium"
            className="mb-4 cursor-pointer bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
          >
            Write Contract
          </Text>
          <WriteContract />
        </div>
      </div>
    </div>
  );
};

export default Page;
