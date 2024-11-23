import { FaDribbble, FaFacebookF, FaGithub, FaTwitter } from 'react-icons/fa';

export const Socials = () => {
  return (
    <div className='lg:col-span-1 flex flex-col gap-6'>
      {/* Profile Card */}
      <div className=' items-center'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h3 className='text-lg font-semibold mb-4'>Social Accounts</h3>
          <ul className='space-y-4'>
            <li className='flex items-center justify-between'>
              <div className='flex items-center'>
                <FaFacebookF className='mr-2' />
                <span>Facebook</span>
              </div>
              <button className='text-blue-600'>Connect</button>
            </li>
            <li className='flex items-center justify-between'>
              <div className='flex items-center'>
                <FaTwitter className='mr-2' />
                <span>Twitter</span>
              </div>
              <button className='text-blue-600'>Disconnect</button>
            </li>
            <li className='flex items-center justify-between'>
              <div className='flex items-center'>
                <FaGithub className='mr-2' />
                <span>Github</span>
              </div>
              <button className='text-blue-600'>Connect</button>
            </li>
            <li className='flex items-center justify-between'>
              <div className='flex items-center'>
                <FaDribbble className='mr-2' />
                <span>Dribbble</span>
              </div>
              <button className='text-blue-600'>Connect</button>
            </li>
          </ul>
          <button className='mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md'>
            Save all
          </button>
        </div>
      </div>
    </div>
  );
};
