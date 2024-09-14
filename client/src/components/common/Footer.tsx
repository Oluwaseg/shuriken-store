import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border  dark:bg-gray-900 dark:text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">About Us</h2>
            <p className="text-gray-400 dark:text-gray-200 text-sm">
              We are committed to delivering the best services to our customers.
              Our team works tirelessly to bring you the best experience.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Follow Us</h2>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-gray-300 hover:bg-blue-600 hover:text-white dark:bg-gray-700 rounded-full dark:hover:bg-blue-500 transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-300 hover:bg-blue-800 hover:text-white dark:bg-gray-700 rounded-full dark:hover:bg-blue-400 transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-300 hover:bg-pink-600 hover:text-white dark:bg-gray-700 rounded-full dark:hover:bg-pink-500 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-300 hover:bg-blue-950 hover:text-white dark:bg-gray-700 rounded-full dark:hover:bg-blue-700 transition-colors"
              >
                <FaLinkedinIn />
              </a>
            </div>

            <h2 className="text-xl font-bold">Quick Links</h2>
            <ul className="text-gray-400 dark:text-gray-200 text-sm space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Subscribe to our Newsletter</h2>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2  dark:bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-400 dark:text-gray-200 text-xs">
              Stay updated with our latest news and offers.
            </p>
          </div>

          {/* Column 3 - Social Media & Quick Links */}
        </div>

        <div className="border-t border-gray-700 dark:border-gray-50 mt-8 pt-4 text-center">
          <p className="text-gray-500 dark:text-gray-200 text-xs">
            &copy; 2024 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
