import React from 'react';
import {
  FaEnvelope,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
} from 'react-icons/fa';
import { useFormValidation } from '../hooks/useFormValidation';

const Contact: React.FC = () => {
  const { values, errors, handleChange, validateForm } = useFormValidation({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', values);
      alert('Thank you for your message! We will get back to you soon.');
    }
  };

  return (
    <div className='min-h-screen  dark:from-body-dark dark:to-body-dark'>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-12'>
        <div className='bg-white dark:bg-body-dark rounded-lg shadow overflow-hidden'>
          <div className='md:flex'>
            {/* Contact Information */}
            <div className='md:w-1/3 bg-accent-light dark:bg-accent-dark text-white p-8'>
              <h2 className='text-3xl font-semibold mb-6'>Contact Us</h2>
              <div className='space-y-4 mb-8'>
                <div className='flex items-center'>
                  <FaMapMarkerAlt className='mr-4' size={20} />
                  <span>123 Business Street, City, Country</span>
                </div>
                <div className='flex items-center'>
                  <FaPhone className='mr-4' size={20} />
                  <span>+1 (123) 456-7890</span>
                </div>
                <div className='flex items-center'>
                  <FaEnvelope className='mr-4' size={20} />
                  <span>info@example.com</span>
                </div>
              </div>
              <div className='flex space-x-4'>
                <FaLinkedin
                  size={24}
                  className='cursor-pointer hover:text-accent-secondary-light dark:hover:text-accent-light'
                />
                <FaTwitter
                  size={24}
                  className='cursor-pointer hover:text-accent-secondary-light dark:hover:text-accent-light'
                />
                <FaInstagram
                  size={24}
                  className='cursor-pointer hover:text-accent-secondary-light dark:hover:text-accent-light'
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className='md:w-2/3 p-8'>
              <h3 className='text-2xl font-semibold mb-6 text-text-light dark:text-text-dark'>
                Send us a message
              </h3>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block mb-2 font-medium text-text-primary-light dark:text-text-primary-dark'
                  >
                    Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={values.name}
                    onChange={handleChange}
                    className={`input-base ${errors.name && 'input-error'}`}
                    placeholder='Your name'
                  />
                  {errors.name && (
                    <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='block mb-2 font-medium text-text-primary-light dark:text-text-primary-dark'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={values.email}
                    onChange={handleChange}
                    className={`input-base ${errors.email && 'input-error'}`}
                    placeholder='your@email.com'
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='message'
                    className='block mb-2 font-medium text-text-primary-light dark:text-text-primary-dark'
                  >
                    Message
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={values.message}
                    onChange={handleChange}
                    rows={4}
                    className={`textarea-base ${
                      errors.message && 'textarea-error'
                    }`}
                    placeholder='Your message here...'
                  ></textarea>
                  {errors.message && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.message}
                    </p>
                  )}
                </div>
                <button
                  type='submit'
                  className='w-full bg-accent-light dark:bg-accent-dark text-white py-3 px-6 rounded-md hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-accent-light focus:ring-offset-2'
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className='mt-12'>
          <h3 className='text-2xl font-semibold mb-6 text-text-light dark:text-text-dark'>
            Our Location
          </h3>
          <div className='h-96 rounded-lg overflow-hidden shadow-lg'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215707164965!2d-73.98784368459377!3d40.75779794332859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1620929254641!5m2!1sen!2sus'
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen
              loading='lazy'
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
