"use client";

import { Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import { useState } from "react";
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

function CustomDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="block  sm:hidden">
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
                    <Sidebar.Item href="/dashboard/projects" icon={HiSearch}>
                      Requests
                    </Sidebar.Item>
                    <Sidebar.Item href="/dashboard/chats" icon={HiUsers}>
                      Chats
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item href="/About" icon={HiClipboard}>
                      About Linkwave
                    </Sidebar.Item>

                    <Sidebar.Item href="/contact" icon={HiInformationCircle}>
                      Contact
                    </Sidebar.Item>
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

export default CustomDrawer;
