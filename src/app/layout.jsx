import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/utils/SessionProvider";
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
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css"
          rel="stylesheet"
        />
        {/* Agrega el título y la descripción usando el Metadata API */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Mueve el script de Flowbite al encabezado para evitar errores de scripts síncronos */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"
          defer
        ></script>
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
        <Footer className="mt-20 ">
          <div className="w-full bg-black border-t-2">
            <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
              <div>
                <Footer.Title title="Company" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">About</Footer.Link>
                  <Footer.Link href="#">Careers</Footer.Link>
                  <Footer.Link href="#">Brand Center</Footer.Link>
                  <Footer.Link href="#">Blog</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="help center" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Discord Server</Footer.Link>
                  <Footer.Link href="#">Twitter</Footer.Link>
                  <Footer.Link href="#">Facebook</Footer.Link>
                  <Footer.Link href="#">Contact Us</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="legal" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Privacy Policy</Footer.Link>
                  <Footer.Link href="#">Licensing</Footer.Link>
                  <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="download" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">iOS</Footer.Link>
                  <Footer.Link href="#">Android</Footer.Link>
                  <Footer.Link href="#">Windows</Footer.Link>
                  <Footer.Link href="#">MacOS</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
            <div className="w-full bg-black px-4 border-t-2 py-6 sm:flex sm:items-center sm:justify-between">
              <Footer.Copyright href="#" by="Projectfully" year={2024} />
              <div className="mt-4 flex space-x-6 sm:mt-0  sm:justify-center">
                <Footer.Icon href="#" icon={BsFacebook} />
                <Footer.Icon href="#" icon={BsInstagram} />
                <Footer.Icon href="#" icon={BsTwitter} />
                <Footer.Icon href="#" icon={BsGithub} />
                <Footer.Icon href="#" icon={BsDribbble} />
              </div>
            </div>
          </div>
        </Footer>
      </body>
    </html>
  );
}
