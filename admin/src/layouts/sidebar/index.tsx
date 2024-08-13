import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useEffect, useState, useRef } from "react";
import SubMenu from "./SubMenu";
import { motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { SlSettings } from "react-icons/sl";
import { AiOutlineAppstore } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { HiOutlineDatabase } from "react-icons/hi";
import { TbReportAnalytics } from "react-icons/tb";
import { RiBuilding3Line } from "react-icons/ri";
import { useMediaQuery } from "react-responsive";
import { NavLink, useLocation } from "react-router-dom";
import Circle from "../../components/logo/Circle";
import Shuriken from "../../components/logo/Shuriken";

interface SubMenuItem {
  name: string;
  icon: React.ComponentType<any>;
  menus: { name: string; path: string }[];
}

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  const [logoSize, setLogoSize] = useState("w-12 h-12");
  const [open, setOpen] = useState(isOpen);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTabletMid, pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (isTabletMid && open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTabletMid, open]);

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  const subMenusList: SubMenuItem[] = [
    {
      name: "Products",
      icon: RiBuilding3Line,
      menus: [
        { name: "Products", path: "/products" },
        { name: "Create", path: "/products/create" },
      ],
    },
    {
      name: "Categories",
      icon: TbReportAnalytics,
      menus: [
        { name: "Categories", path: "/categories" },
        { name: "Create", path: "/categories/create" },
      ],
    },
  ];

  return (
    <div>
      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className={`bg-primary dark:bg-gray-900 text-gray shadow-xl z-[9999] md:z-[10] max-w-[16rem] w-[16rem] overflow-hidden md:relative fixed ${
          isTabletMid ? "top-16" : "top-0"
        } h-screen`}
      >
        <div className="flex items-center gap-2.5 font-medium border-b py-3 border-slate-300 mx-3">
          <div className={`relative ${logoSize}`}>
            <Circle />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shuriken className="w-1/2 h-1/2 object-contain" />
            </div>
          </div>

          {open && (
            <span className="text-xl whitespace-pre font-semibold">
              Admin Panel
            </span>
          )}
        </div>
        <div className="flex flex-col h-full">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 md:h-[68%] h-[70%]">
            <li>
              <NavLink to={"/"} className="link">
                <AiOutlineAppstore size={23} className="min-w-max" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"/users"} className="link">
                <BsPerson size={23} className="min-w-max" />
                Customer
              </NavLink>
            </li>
            <li>
              <NavLink to={"/orders"} className="link">
                <HiOutlineDatabase size={23} className="min-w-max" />
                Orders
              </NavLink>
            </li>

            {(open || isTabletMid) && (
              <div className="border-y py-5 border-slate-300">
                <small className="pl-3 text-slate-500 inline-block mb-2">
                  Product categories
                </small>
                {subMenusList.map((menu) => (
                  <div key={menu.name} className="flex flex-col gap-1">
                    <SubMenu data={menu} />
                  </div>
                ))}
              </div>
            )}
            <li>
              <NavLink to={"/settings"} className="link">
                <SlSettings size={23} className="min-w-max" />
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
        <motion.div
          onClick={() => setOpen(!open)}
          animate={
            open ? { x: 0, y: 0, rotate: 0 } : { x: -10, y: -200, rotate: 180 }
          }
          transition={{ duration: 0 }}
          className="absolute w-fit h-fit md:block z-50 hidden right-2 bottom-3 cursor-pointer"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
