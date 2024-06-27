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
  BsTwitter,
} from "react-icons/bs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Projectfully",
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
            <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
              <div>
                <Footer.Title
                  title="Company"
                  className="text-gray-900 dark:text-white"
                />
                <Footer.LinkGroup
                  col
                  className="text-gray-600 dark:text-gray-300"
                >
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    About
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Careers
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Brand Center
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Blog
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title
                  title="Help Center"
                  className="text-gray-900 dark:text-white"
                />
                <Footer.LinkGroup
                  col
                  className="text-gray-600 dark:text-gray-300"
                >
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Discord Server
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Twitter
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Facebook
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Contact Us
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title
                  title="Legal"
                  className="text-gray-900 dark:text-white"
                />
                <Footer.LinkGroup
                  col
                  className="text-gray-600 dark:text-gray-300"
                >
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Privacy Policy
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Licensing
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Terms & Conditions
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title
                  title="Download"
                  className="text-gray-900 dark:text-white"
                />
                <Footer.LinkGroup
                  col
                  className="text-gray-600 dark:text-gray-300"
                >
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    iOS
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Android
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    Windows
                  </Footer.Link>
                  <Footer.Link
                    href="#"
                    className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                  >
                    MacOS
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
            <div className="w-full bg-white dark:bg-gray-900 px-4 border-t-2 border-gray-300 dark:border-gray-700 py-6 sm:flex sm:items-center sm:justify-between">
              <Footer.Copyright
                href="#"
                by="Projectfully"
                year={2024}
                className="text-gray-600 dark:text-gray-300"
              />
              <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                <Footer.Icon
                  href="#"
                  icon={BsFacebook}
                  className="text-gray-600 hover:text-fuchsia-600 dark:text-gray-300 dark:hover:text-fuchsia-400"
                />
                <Footer.Icon
                  href="#"
                  icon={BsInstagram}
                  className="text-gray-600 hover:text-fuchsia-600 dark:text-white dark:hover:text-fuchsia-400"
                />
                <Footer.Icon
                  href="#"
                  icon={BsTwitter}
                  className="text-gray-600 hover:text-fuchsia-600 dark:text-white dark:hover:text-fuchsia-400"
                />
                <Footer.Icon
                  href="#"
                  icon={BsGithub}
                  className="text-gray-600 hover:text-fuchsia-600 dark:text-white dark:hover:text-fuchsia-400"
                />
                <Footer.Icon
                  href="#"
                  icon={BsDribbble}
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
