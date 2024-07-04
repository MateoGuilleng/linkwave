import React from "react";

const CustomAside = () => {
  return (
    <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block text-black dark:text-white">
      <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-black dark:border-indigo-100 top-12">
        <h2 className="pl-3 mb-4 text-2xl font-semibold">Navigation</h2>
        <div className="border-b border-black dark:border-white gap-4 flex flex-col pb-4">
          <a
            href="/dashboard"
            className="flex items-center px-3 py-2.5 font-semibold hover:border-2 border-black dark:border-white hover:rounded-full"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/projects/"
            className="flex items-center px-3 py-2.5 font-semibold hover:border-2 border-black dark:border-white hover:rounded-full"
          >
            Projects
          </a>
          <a
            href="/dashboard/chats"
            className="flex items-center px-3 py-2.5 font-semibold hover:border-2 border-black dark:border-white hover:rounded-full"
          >
            Chats
          </a>
        </div>

        <a
          href="/docs"
          className="flex items-center px-3 py-2.5 font-semibold hover:border-2 border-black dark:border-white hover:rounded-full"
        >
          Docs
        </a>
        <a
          href="/contact"
          className="flex items-center px-3 py-2.5 font-semibold hover:border-2 border-black dark:border-white hover:rounded-full"
        >
          contact
        </a>
      </div>
    </aside>
  );
};

export default CustomAside;
