import React from "react";
import { useLocation, Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    ...pathnames.map((pathname, index) => ({
      name: capitalizeFirstLetter(pathname),
      href: `/${pathnames.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <nav className="flex mb-5" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <li className="inline-flex items-center">
                <HiChevronRight className="w-6 h-6 text-gray-400 ml-2" />
              </li>
            )}
            <li className="inline-flex items-center">
              {index < breadcrumbItems.length - 1 ? (
                <Link
                  to={item.href}
                  className="text-gray-700 hover:text-gray-900 ml-1 md:ml-2 text-sm font-medium"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className="text-gray-400 ml-1 md:ml-2 text-sm font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
