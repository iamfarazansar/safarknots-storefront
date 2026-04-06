"use client"

import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa"

const socialLinks = [
  {
    icon: FaFacebookF,
    url: "https://www.facebook.com/safarknots",
  },
  {
    icon: FaTwitter,
    url: "https://twitter.com/safarknots",
  },
  {
    icon: FaYoutube,
    url: "https://www.youtube.com/@safarknots",
  },
  {
    icon: FaInstagram,
    url: "https://www.instagram.com/safarknots/",
  },
]

export default function FooterSocialIcons() {
  return (
    <div className="flex gap-4 justify-center md:justify-start">
      {socialLinks.map(({ icon: Icon, url }) => (
        <div
          key={url}
          onClick={() => window.open(url, "_blank")}
          className="w-10 h-10 rounded-full bg-[#2f2723]/15 flex items-center justify-center text-[#2f2723] hover:bg-[#2f2723]/25 cursor-pointer"
        >
          <Icon size={20} />
        </div>
      ))}
    </div>
  )
}
