import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    {
      href: '#',
      icon: <FaFacebookF />,
      hoverColor:
        'hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark',
    },
    {
      href: '#',
      icon: <FaTwitter />,
      hoverColor:
        'hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark',
    },
    {
      href: '#',
      icon: <FaInstagram />,
      hoverColor:
        'hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark',
    },
    {
      href: '#',
      icon: <FaLinkedinIn />,
      hoverColor:
        'hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark',
    },
  ];

  const quickLinks = [
    { href: '#', label: 'Contact Us' },
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
  ];

  return (
    <footer className='mt-2 bg-body-light dark:bg-body-dark text-text-light dark:text-text-dark py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Column 1 - About Us */}
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>About Us</h2>
            <p className='text-text-secondary-light dark:text-text-secondary-dark text-sm'>
              We are committed to delivering the best services to our customers.
              Our team works tirelessly to bring you the best experience.
            </p>
          </div>

          {/* Column 2 - Follow Us and Quick Links */}
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Follow Us</h2>
            <div className='flex space-x-4'>
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`p-2 bg-input-light dark:bg-input-dark rounded-full transition-colors ${link.hoverColor}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>

            <h2 className='text-xl font-bold'>Quick Links</h2>
            <ul className='text-text-secondary-light dark:text-text-secondary-dark text-sm space-y-1'>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className='hover:underline'>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Newsletter */}
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Subscribe to our Newsletter</h2>
            <form className='flex space-x-2'>
              <input
                type='email'
                placeholder='Enter your email'
                className='w-full px-4 py-2 bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark border border-border-light dark:border-border-dark'
              />
              <button
                type='submit'
                className='px-4 py-2 bg-button-primary-light text-white rounded-md hover:bg-button-hover-light dark:bg-button-primary-dark dark:hover:bg-button-hover-dark transition-all'
              >
                Subscribe
              </button>
            </form>
            <p className='text-text-secondary-light dark:text-text-secondary-dark text-xs'>
              Stay updated with our latest news and offers.
            </p>
          </div>
        </div>

        <div className='border-t border-border-light dark:border-border-dark mt-8 pt-4 text-center'>
          <p className='text-text-secondary-light dark:text-text-secondary-dark text-xs'>
            &copy; 2024 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
