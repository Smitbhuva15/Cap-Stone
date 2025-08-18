import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Github, Globe, Linkedin } from 'lucide-react';
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#121A29] text-zinc-300 w-[90%]! mx-auto!">
            <div className=" px-4!  ">
                {/* Logo */}
                <div className="text-center">
                    <a href="/">
                        <div className='flex justify-center  pt-6!'>
                            <img src='./cap3.png' className='logo ' alt="Cap Logo" />
                            <h1 className='title '>Cap<span className=' logox'>X</span>change</h1>
                        </div>
                    </a>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 text-zinc-300 mb-6! pt-3! ">
                    <a
                        href="/"
                        className="transition-colors hover:text-[#2187D0]"
                    >
                        Home
                    </a>
                    <a
                        href="https://github.com/Smitbhuva15/Cap-Stone"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" transition-colors hover:text-[#2187D0]"
                    >
                        GitHub
                    </a>


                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="transition-colors font-medium text-gray-300 hover:text-[#2187D0]">
                                Contact Us
                            </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-80 bg-[#083657] text-white rounded-2xl shadow-2xl p-6! border border-[#2187D0]">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="text-center">
                                    <h3 className="text-lg font-bold tracking-wide">Get in Touch</h3>
                                    <p className="text-sm opacity-80">We’d love to hear from you!</p>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3">

                                    <div className="flex items-center gap-3 bg-white/10 p-3! mt-2! rounded-lg">
                                        <span className="text-xl">📧</span>
                                        <div>
                                            <h4 className="text-sm font-semibold">Email</h4>
                                            <p className="text-sm opacity-90 break-all">bhuvamr96@gmail.com</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </PopoverContent>
                    </Popover>




                </div>

                {/* Bottom Row */}
                <div className=''>
                    <div className="flex flex-col sm:flex-row justify-between items-center  pt-4! gap-4  pb-5!" >
                        <p className="text-md text-zinc-400 text-center sm:text-left ">
                            Designed, Developed & Maintained <span className="font-extrabold text-lg">Smit Bhuva</span>
                        </p>
                        <div className="flex gap-4 ">
                            <a
                                href="https://github.com/Smitbhuva15"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2! rounded-full bg-[#2187D0] hover:bg-[#083657] transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/smit-bhuva-1007ba314/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2! rounded-full bg-[#2187D0] hover:bg-[#083657] transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href={'/'}
                                rel="noopener noreferrer"
                                className="p-2! rounded-full bg-[#2187D0] hover:bg-[#083657] transition-colors"
                            >
                                <Globe className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;




