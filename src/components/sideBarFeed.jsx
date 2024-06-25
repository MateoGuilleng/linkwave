"use client";

import { Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import { useState } from "react";
import {
  HiChartPie,
  HiClipboard,
  HiLink,
  HiUserCircle,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiSearch,
  HiShoppingBag,
  HiMenu,
  HiUsers,
} from "react-icons/hi";

function CustomDrawerFeed({ followingUsers, followingProjects }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="">
        <Button onClick={() => setIsOpen(true)}>
          <HiMenu className="w-7 h-7" />
        </Button>
      </div>
      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item href="/dashboard" icon={HiChartPie}>
                      Dashboard
                    </Sidebar.Item>
                    <Sidebar.Item href="/dashboard/projects" icon={HiPencil}>
                      Projects
                    </Sidebar.Item>
                    <Sidebar.Item href="/dashboard/chats" icon={HiUsers}>
                      Chats
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item href="/docs" icon={HiClipboard}>
                      Docs
                    </Sidebar.Item>

                    <Sidebar.Item href="/contact" icon={HiInformationCircle}>
                      Contact
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item>Following projects:</Sidebar.Item>

                    <ul className="mt-2">
                      {followingProjects?.map((followingProject, index) => (
                        <div key={index} className="flex gap-2 items-center ml-5">
                          <HiLink />
                          <a
                            className="sm:hover:border-b-2 sm:border-b-0 border-b-2"
                            href={`${followingProject?.author}/${followingProject?.title}`}
                          >
                            {" "}
                            {followingProject.title}
                          </a>
                        </div>
                      ))}
                    </ul>
                    <Sidebar.Item>Following users: </Sidebar.Item>
                    <ul className="mt-2">
                      {followingUsers?.map((followingUser, index) => (
                        <div key={index} className="flex gap-2 items-center ml-5">
                          <HiUserCircle />{" "}
                          <a
                            className="sm:hover:border-b-2 sm:border-b-0 border-b-2"
                            href={`${followingUser}`}
                          >
                            {" "}
                            {followingUser}
                          </a>
                        </div>
                      ))}
                    </ul>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}

export default CustomDrawerFeed;
