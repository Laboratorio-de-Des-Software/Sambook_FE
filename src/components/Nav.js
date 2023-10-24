import React from "react";

import { BiHomeAlt, BiUser, biuser } from "react-icons/bi";
import { BsClipboardData, BsBriefcase, BsChatSquareText,  } from "react-icons/bs";

import { Link } from "react-scroll";

const Nav = () => {
  return (
    <nav className="fixed bottom-2 lg:bottom-8 w-full overflow-hidden z-50">
      <div className="container mx-auto">
          {/* nav inner*/}
          <div className="w-full bg-black/20 h-[96px] backdrop-blur-2x1 rounded-full 
          max-w-[460px] mx-auto px-5 flex justify-between items-center text-2xl text-white/50 
          ">
            <Link to='home'
             activeClass='active'
             smooth={true}
             spy={true}
             offset={-200}
             classname='cursor-pointer w-[60px] h-[6-px] flex items-center justify-center'>
              <BiHomeAlt/>
            </Link>

            <Link to='about' 
            activeClass='active'
            smooth={true}
            spy={true}
            classname='cursor-pointer w-[60px] h-[6-px] flex items-center justify-center'>
              <BiUser/>
            </Link>
          </div>
        </div>
    </nav>
  );
};

export default Nav;
