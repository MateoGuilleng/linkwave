import React from 'react';

const CustomAside = () => {
  return (
    <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
      <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
        <h2 className="pl-3 mb-4 text-2xl font-semibold">Navigation</h2>
        <a
          href="/dashboard"
          className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
        >
          Dashboard
        </a>
        <a
          href="/dashboard/projects/"
          className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
        >
          Projects
        </a>
        <a
          href="/dashboard/chats"
          className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
        >
          Chats
        </a>
        <hr />
        <a
          href="/docs"
          className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
        >
          Docs
        </a>
        <a
          href="/contact"
          className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
        >
          contact
        </a>
      </div>
    </aside>
  );
};

export default CustomAside;
