"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs } from "flowbite-react";
import {
  HiAdjustments,
  HiClipboardList,
  HiCode,
  HiShare,
  HiUserCircle,
} from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { toast } from "sonner";
function copyToClipboard(code) {
  navigator.clipboard.writeText(code);
  toast("copied to clipboard");
}

function EmbedCode({ embedCode }) {
  return (
    <pre className="bg-gray-800 text-white p-4 mt-4 rounded-lg w-fit relative overflow-x-auto">
      <button
        onClick={() => copyToClipboard(embedCode)}
        className="absolute top-2 right-2 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition duration-300"
      >
        Copy
      </button>
      <code className="text-xs md:text-sm block whitespace-pre-wrap">
        {embedCode}
      </code>
    </pre>
  );
}
function Page() {
  return (
    <div>
      <Navbar />

      <div className="bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#ffffff]">
        <div className="w-full">
          <div className="p-4  rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center mt-4">
              Add Your Own HTML code to your boxes!
            </h2>
            <p className="mb-2 text-lg text-center">
              Learn how to use your own HTML code
            </p>

            <div className="">
              <Tabs
                aria-label="Full width tabs"
                className="flex "
                style="fullWidth"
              >
                <Tabs.Item active title="Social Media" icon={HiShare}>
                  <p className="text-center">
                    In the mayority of pages you can see de embeded code in
                    sharing section, however here you can see some examples of
                    embded codes and how to use them. <br /> These are some
                    examples of social media embeded iframes that you can use in
                    your proyects!
                  </p>
                  <span className="font-medium text-white ">
                    <div className="space-y-4 sm:grid md:grid-cols-2 gap-10 mr-5 align-top">
                      {/* Spotify Embed Example */}
                      <div className="h-fit flex-col mt-4 w-full max-w-full p-5 bg-black text-white border-2 rounded-lg flex items-center mb-2">
                        <h3 className="text-xl font-semibold">
                          Spotify Embed Example
                        </h3>

                        <p className="mb-2">
                          Spotify tracks can be embedded using an{" "}
                          <code>iframe</code> with the provided embed URL.
                        </p>
                        <div className="w-full my-2 justify-center">
                          <iframe
                            style={{ borderRadius: "12px" }}
                            src="https://open.spotify.com/embed/track/2NkbaFvHDXMkzQgpkbyB9m?utm_source=generator&theme=0"
                            width="100%"
                            height="152"
                            frameBorder="0"
                            allowfullscreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                          ></iframe>
                        </div>
                        <p className=" ">
                          From here you can get the insert code:
                        </p>
                        <img
                          className="w-full h-auto max-w-full mx-auto mt-5"
                          src="https://res.cloudinary.com/dudftt5ha/image/upload/v1718339977/bep1w6f0owmujkgflc4i.jpg"
                          alt=""
                        />

                        <p className="mt-5 ">Example code: </p>
                        <EmbedCode
                          embedCode={`<iframe
                  style="border-radius:12px"
                  src="https://open.spotify.com/embed/track/2NkbaFvHDXMkzQgpkbyB9m?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>`}
                        />
                      </div>

                      {/* YouTube Embed Example */}
                      <div className="h-fit flex-col w-full max-w-full p-5 bg-black text-white border-2 rounded-lg flex items-center mb-2">
                        <h3 className="text-lg font-semibold">
                          YouTube Embed Example
                        </h3>
                        <p className="mb-2">
                          Embed YouTube videos by using an <code>iframe</code>{" "}
                          with the video URL in the <code>src</code> attribute.
                        </p>

                        <div className="mb-2 w-full">
                          <iframe
                            width="100%"
                            height="499"
                            src="https://www.youtube.com/embed/XXpx8ke2_Ko"
                            title="mi GIMNASIO tiene segundo piso 😮"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </div>

                        <p className=" ">
                          From here you can get the insert code:
                        </p>

                        <img
                          className="w-full h-auto max-w-full mx-auto mt-5"
                          src="https://res.cloudinary.com/dudftt5ha/image/upload/v1718342407/rbq4rlvpazfwut3uadht.jpg"
                          alt=""
                        />

                        <p className="mt-5 ">Example code: </p>
                        <EmbedCode
                          embedCode={`<iframe
                  width="100%"
                  height="499"
                  src="https://www.youtube.com/embed/XXpx8ke2_Ko"
                  title="mi GIMNASIO tiene segundo piso 😮"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>`}
                        />
                      </div>
                      {/* SoundCloud Embed Example */}
                      <div className="h-fit flex-col w-full max-w-full p-5 bg-black text-white border-2 rounded-lg flex items-center mb-2">
                        <h3 className="text-lg font-semibold">
                          SoundCloud Embed Example
                        </h3>
                        <p className="mb-2">
                          SoundCloud tracks can be embedded using an{" "}
                          <code>iframe</code> with the embed URL provided by
                          SoundCloud.
                        </p>
                        <iframe
                          width="100%"
                          height="300"
                          scrolling="no"
                          frameborder="no"
                          allow="autoplay"
                          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1796572192&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                        ></iframe>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#cccccc",
                            lineHeight: "normal",
                            wordBreak: "normal",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            fontFamily:
                              "Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif",
                            fontWeight: "100",
                          }}
                        >
                          <a
                            href="https://soundcloud.com/rauwalejandro"
                            title="Rauw Alejandro"
                            target="_blank"
                            style={{ color: "#cccccc", textDecoration: "none" }}
                          >
                            Rauw Alejandro
                          </a>{" "}
                          ·{" "}
                          <a
                            href="https://soundcloud.com/rauwalejandro/alvaro-diaz-ft-byak"
                            title="Álvaro Diaz Ft – BYAK"
                            target="_blank"
                            style={{ color: "#cccccc", textDecoration: "none" }}
                          >
                            Álvaro Diaz Ft – BYAK
                          </a>
                        </div>
                        <p className=" ">
                          From sharing modal of any song: you can see this and
                          get the code:
                        </p>
                        <img
                          className="w-full h-auto max-w-full mx-auto mt-5"
                          src="https://res.cloudinary.com/dudftt5ha/image/upload/v1718342729/dhknvm5kq6uxqxeojowj.png"
                          alt=""
                        />
                        <p className="">
                          Code not available here due to souncloud syntax error
                          with jsx
                        </p>
                      </div>
                      {/* Google Maps Embed Example */}
                      <div className="h-fit flex-col w-full max-w-full p-5 bg-black text-white border-2 rounded-lg flex items-center mb-2">
                        <h3 className="text-lg font-semibold">
                          Google Maps Embed Example
                        </h3>
                        <p className="mb-2">
                          Embed Google Maps by using an <code>iframe</code> with
                          the map URL in the <code>src</code> attribute.
                        </p>

                        <div className="mb-4">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91371.75808780162!2d-88.3559879!3d44.3023962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8803b19ada53d233%3A0x81e567fe14930085!2sBadger%20Sports%20Park!5e0!3m2!1ses!2sco!4v1718378244805!5m2!1ses!2sco"
                            width="600"
                            height="450"
                            style={{ border: "0" }}
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </div>
                        <p className="">
                          From any regitered location in the modal of share:
                        </p>
                        <img
                          className="w-full h-auto max-w-full mx-auto mt-5"
                          src="https://res.cloudinary.com/dudftt5ha/image/upload/v1718378260/gvdhapeflnmliuzq8ba5.png"
                          alt=""
                        />

                        <p className="">Example code:</p>
                        <EmbedCode
                          embedCode={`<iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91371.
                  75808780162!2d-88.3559879!3d44.3023962!2m3!1f0!2f0!3f0!3m2!1i102
                  4!2i768!4f13.1!3m3!1m2!1s0x8803b19ada53d233%3A0x81e567fe14930085
                  !2sBadger%20Sports%20Park!5e0!3m2!1ses!2sco!4v1718378244805!5m2!
                  1ses!2sco"
                  width="600"
                  height="450"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>`}
                        />
                      </div>
                    </div>
                  </span>
                </Tabs.Item>
                <Tabs.Item title="HTML basics" icon={HiCode}>
                  <div className="text-center">
                    <p className="mb-4">
                      HTML is fundamental for building web pages and allows a
                      wide range of creative uses. Below are some highlighted
                      examples of how HTML code can be used to enrich the user
                      experience:
                    </p>
                  </div>
                  <div className="space-y-4 sm:grid md:grid-cols-2 gap-10 mr-5 align-top">
                    <div className=" mt-5">
                      <h3 className="text-xl font-semibold mb-2">
                        1. Audio Integration
                      </h3>
                      <p className="mb-4">
                        HTML allows the incorporation of audio files into a web
                        page, which can be useful for podcasts, background
                        music, or sound effects.
                      </p>

                      <EmbedCode
                        embedCode={`<audio controls>
  <source src="audiofile.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>`}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl mt-4 font-semibold mb-2">
                        2. Video Playback
                      </h3>
                      <p className="mb-4">
                        With HTML, you can embed videos directly into your web
                        pages, offering a rich multimedia experience. This is
                        ideal for tutorials, product demonstrations, and more.
                      </p>
                      <EmbedCode
                        embedCode={`<video width="320" height="240" controls>
  <source src="videofile.mp4" type="video/mp4">
  Your browser does not support the video element.
</video>`}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">3. Images</h3>
                      <p className="mb-4">
                        Images are essential to make a website attractive and
                        communicative. HTML allows the insertion of images with
                        various formats and properties.
                      </p>
                      <EmbedCode
                        embedCode={`<img src="imagefile.jpg" alt="Image description" width="500" height="300">`}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        4. Links and Navigation
                      </h3>
                      <p className="mb-4">
                        HTML allows the creation of links that facilitate
                        navigation between different pages and sections of a
                        website. These links can be text or images.
                      </p>
                      <EmbedCode
                        embedCode={`<a href="https://www.example.com">Visit our website</a>`}
                      />
                    </div>

                    <div className="">
                      <h3 className="text-xl font-semibold mb-2">
                        5. Tables for Structured Data
                      </h3>
                      <p className="mb-4">
                        HTML tables are perfect for displaying structured data
                        in a clear and organized manner, such as schedules,
                        prices, or statistics.
                      </p>
                      <EmbedCode
                        embedCode={`<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>John</td>
    <td>25</td>
  </tr>
  <tr>
    <td>Ana</td>
    <td>30</td>
  </tr>
</table>`}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        6. User Interface Elements
                      </h3>
                      <p className="mb-4">
                        HTML also includes various elements to enhance the user
                        interface, such as buttons, dropdown lists, and more.
                      </p>
                      <EmbedCode
                        embedCode={`<button type="button">Click here</button>`}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        7. Embedding External Content
                      </h3>
                      <p className="mb-4">
                        You can embed content from other websites, such as maps,
                        social media posts, and more, using the{" "}
                        <code>&lt;iframe&gt;</code> element.
                      </p>
                      <EmbedCode
                        embedCode={`<iframe src="https://www.example.com" width="600" height="400"></iframe>`}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mt-10 text-xl">
                      These are just a few examples of how HTML can be
                      creatively used to enhance the functionality and
                      appearance of a website. The versatility of HTML allows
                      web developers to create interactive and engaging
                      experiences for users.
                    </p>
                  </div>
                </Tabs.Item>
                <Tabs.Item title="Considerations" icon={HiAdjustments}>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Security Considerations for Allowing Embedded HTML
                    </h2>
                    <p className="mb-4">
                      Allowing embedded HTML on your website can enhance its
                      functionality and flexibility. However, it also introduces
                      several security risks that need to be carefully managed.
                      Here are some important considerations:
                    </p>

                    <h3 className="text-xl font-semibold mb-2">
                      1. Security Risks
                    </h3>
                    <p className="mb-4">
                      Embedding HTML directly can expose your website to various
                      security vulnerabilities, such as Cross-Site Scripting
                      (XSS) attacks. Malicious users could inject harmful
                      scripts into your site, which could compromise user data
                      or take control of user sessions.
                    </p>

                    <h3 className="text-xl font-semibold mb-2">
                      2. Sanitizing Input
                    </h3>
                    <p className="mb-4">
                      To mitigate these risks, its crucial to sanitize any HTML
                      input before rendering it on your site. This process
                      involves removing or escaping potentially harmful content,
                      ensuring that only safe HTML is displayed.
                    </p>

                    <h3 className="text-xl font-semibold mb-2">
                      3. Limitations
                    </h3>
                    <p className="mb-4">
                      Due to these security concerns, certain functionalities
                      will be restricted. Specifically:
                    </p>
                    <ul className="list-disc pl-5 mb-4">
                      <li>
                        Forms cannot be created within the embedded HTML to
                        prevent unauthorized data collection and submission.
                      </li>
                      <li>
                        Requests to any APIs will be disabled to avoid
                        unintended interactions with external services.
                      </li>
                      <li>
                        Embedded content from Twitter will not function due to
                        its outdated implementation and potential security
                        risks.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-2">Conclusion</h3>
                    <p className="mb-4">
                      While allowing embedded HTML can enhance your website, it
                      is essential to be aware of the associated security risks.
                      By following the outlined considerations and best
                      practices, you can provide a safer and more secure
                      experience for your users.
                    </p>
                  </div>
                </Tabs.Item>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
