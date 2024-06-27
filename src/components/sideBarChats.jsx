"use client";

import { Button, Drawer, Sidebar, TextInput, Tooltip } from "flowbite-react";

import { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiSearch,
  HiShoppingBag,
  HiMenu,
  HiUsers,
} from "react-icons/hi";

function CustomChatDrawer({ chats }) {
  const [user, setUser] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleChatClick = (id) => {
    router.push(`/${user}/chats/${id}`);
  };

  const handleClose = () => setIsOpen(false);
  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath
      .split("/")
      .filter((part) => part.trim() !== "");
    const userPart = pathParts[pathParts.length - 3];

    setUser(userPart);
  }, []);
  return (
    <>
      <div className="block sm:hidden">
        <Button onClick={() => setIsOpen(true)}>
          <HiMenu className="w-7 h-7 text-black dark:text-white" />
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
                    <div>Chats:</div>
                    {chats?.map((chat, index) => (
                      <div
                        key={index}
                        onClick={() => handleChatClick(chat.chatId)}
                        className="cursor-pointer p-2 mb-2 dark:bg-gray-700 bg-gray-100 text-black dark:text-white rounded hover:bg-gray-600"
                      >
                        <div className="flex items-center">
                          <div className="mb-1 text-sm font-semibold flex md:flex-nowrap flex-wrap">
                            <p className="mr-3">Nickname:</p>
                            <p className="md:text-sm text-xs ml-0">
                              {chat.chatWithNickName}
                            </p>
                          </div>
                          <Tooltip
                            content="The nickname here will not be changed even if the user changes them"
                            style="dark"
                          >
                            <Button>
                              <FaQuestionCircle />
                            </Button>
                          </Tooltip>
                        </div>
                        <p className="mb-1 text-sm ">
                          <p className="sm:text-sm text-3xs w-fit font-bold">
                            {chat.chatWithEmail}
                          </p>
                        </p>
                        <p className="mb-1 text-2xs dark:text-white/50 text-black/50">
                          Chat ID: {chat.chatId}
                        </p>
                      </div>
                    ))}
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

export default CustomChatDrawer;
