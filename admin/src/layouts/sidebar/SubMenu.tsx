import { useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";
import { ComponentType } from "react";

interface SubMenuItem {
  name: string;
  icon: ComponentType<any>;
  menus: { name: string; path: string }[] | string[];
}

interface SubMenuProps {
  data: SubMenuItem;
}

const SubMenu: React.FC<SubMenuProps> = ({ data }) => {
  const { pathname } = useLocation();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <li
        className={`link ${
          pathname.includes(data.name.toLowerCase()) ? "text-blue-600" : ""
        }`}
        onClick={() => setSubMenuOpen(!subMenuOpen)}
        aria-expanded={subMenuOpen}
      >
        <data.icon size={23} className="min-w-max" />
        <p className="flex-1 capitalize">{data.name}</p>
        <IoIosArrowDown
          className={` ${subMenuOpen ? "rotate-180" : ""} duration-200`}
        />
      </li>
      <motion.ul
        animate={subMenuOpen ? { height: "fit-content" } : { height: 0 }}
        className="flex h-0 flex-col pl-14 text-[0.8rem] font-normal overflow-hidden"
      >
        {data.menus?.map((menu) => (
          <li key={typeof menu === "string" ? menu : menu.path}>
            <NavLink
              to={
                typeof menu === "string"
                  ? `/${data.name.toLowerCase()}/${menu}`
                  : menu.path
              }
              className="link !bg-transparent capitalize"
            >
              {typeof menu === "string" ? menu : menu.name}
            </NavLink>
          </li>
        ))}
      </motion.ul>
    </>
  );
};

export default SubMenu;
