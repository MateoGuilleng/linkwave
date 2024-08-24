import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsMailbox,
  BsTwitter,
} from "react-icons/bs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Linkwave",
  description: "Social media focused on projects",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css"
          rel="stylesheet"
        />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"
          defer
        ></script>
      </head>
      <body className={inter.className}>
        <UserProvider>{children}</UserProvider>
        <Footer className="bg-white  dark:bg-gray-900">
          <div className="w-full bg-white dark:bg-gray-900 border-t-2 border-gray-300 dark:border-gray-700">
            <div className="w-full bg-white dark:bg-gray-900 px-4 border-t-2 border-gray-300 dark:border-gray-700 py-6 sm:flex sm:items-center sm:justify-between">
              <Footer.Copyright
                href="#"
                by="Linkwave"
                year={2024}
                className="text-gray-600 dark:text-gray-300"
              />
              <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center text-black dark:text-white">
                <Footer.Icon
                  href="https://github.com/MateoGuilleng/linkwave"
                  icon={BsGithub}
                  className="text-gray-600 hover:text-fuchsia-600 dark:text-white dark:hover:text-fuchsia-400"
                />
                <p className="text-gray-700 dark:text-white/50">Contacto: mmguilleng@cpsih.edu.co - saherandez@cpsih.edu.co </p>
                <Footer.Icon
                  href="#"
                  icon={BsMailbox}
                  className="text-gray-600 hover:text-fuchsia-600 dark:text-white dark:hover:text-fuchsia-400"
                />
              </div>
            </div>
          </div>
        </Footer>

        <Toaster
          richColors
          position="bottom-center"
          theme="system"
          closeButton
          visibleToasts={2}
        />
      </body>
    </html>
  );
}
