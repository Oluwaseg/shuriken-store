import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCamera, FaCloudUploadAlt, FaEdit } from 'react-icons/fa';

import SyncLoader from 'react-spinners/SyncLoader';
import * as yup from 'yup';
import {
  fetchUpdateProfile,
  fetchUserDetails,
} from '../../features/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import countriesData from './libs/country.json';
import { Socials } from './libs/socialInfo';
import { UpdateUserPassword } from './libs/validate-password';
type Country = {
  name: string;
  code: string;
  states: string[];
};

const countries: Country[] = countriesData.countries;

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  bio: yup.string().optional(),
  birthday: yup.string().required('Birthday is required'),
  shippingInfo: yup.object().shape({
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    phoneNo: yup.string().required('Phone number is required'),
    postalCode: yup.string().required('Postal Code is required'),
  }),
});
interface FormDataValues {
  name: string;
  username: string;
  email: string;
  bio?: string;
  birthday?: string;
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    country: string;
    phoneNo: string;
    postalCode: string;
  };
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    userInfo?.shippingInfo?.country || ''
  );

  const [states, setStates] = useState<string[]>([]);

  const formattedBirthday = userInfo?.birthday
    ? new Date(userInfo?.birthday).toISOString().split('T')[0]
    : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: userInfo?.name || '',
      username: userInfo?.username || '',
      email: userInfo?.email || '',
      bio: userInfo?.bio || '',
      birthday: formattedBirthday || '',

      shippingInfo: {
        address: userInfo?.shippingInfo?.address || '',
        city: userInfo?.shippingInfo?.city || '',
        state: userInfo?.shippingInfo?.state || '',
        country: userInfo?.shippingInfo?.country || '',
        phoneNo: userInfo?.shippingInfo?.phoneNo || '',
        postalCode: userInfo?.shippingInfo?.postalCode || '',
      },
    },
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userInfo?.avatar?.[0]?.url || 'https://via.placeholder.com/120'
  );
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  useEffect(() => {
    if (selectedCountry) {
      const countryData = countries.find((c) => c.name === selectedCountry);
      setStates(countryData?.states || []);
    }
    setValue('shippingInfo.country', selectedCountry);
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (userInfo?.shippingInfo?.country) {
      setSelectedCountry(userInfo.shippingInfo.country);
      const countryData = countries.find(
        (c) => c.name === userInfo.shippingInfo.country
      );
      setStates(countryData?.states || []);
      setValue('shippingInfo.state', userInfo.shippingInfo.state || '');
    }
  }, [userInfo, setValue]);

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('avatar', image);
    setLoading(true);
    await dispatch(fetchUpdateProfile(formData));
    dispatch(fetchUserDetails());
    setLoading(false);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setStates(countries.find((c) => c.name === country)?.states || []);
    setValue('shippingInfo.state', ''); // Reset state when country changes
  };

  const onSubmit = async (data: FormDataValues) => {
    setSubmitLoading(true); // Set loading before submitting
    setTimeout(async () => {
      console.log('Submitted Data:', data);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string' || value instanceof Blob) {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'object' && value !== null) {
          // For nested objects, recursively append each sub-value
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (typeof subValue === 'string') {
              formData.append(`${key}[${subKey}]`, subValue);
            } else if (subValue instanceof Date) {
              formData.append(`${key}[${subKey}]`, subValue.toISOString());
            } else if (subValue instanceof Blob) {
              // Handle Blob type
              formData.append(`${key}[${subKey}]`, subValue);
            } else {
              // Ensure nested values are properly serialized
              formData.append(`${key}[${subKey}]`, String(subValue));
            }
          });
        }
      });

      await dispatch(fetchUpdateProfile(formData));
      setSubmitLoading(false); // Reset the loading state after submit
    }, 3000); // Delay for 3 seconds before submitting the form
  };

  return (
    <div className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300 min-h-screen p-6'>
      {/* Main container for profile */}
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12'>
        {/* Left Section (Profile & Language) */}
        <div className='lg:col-span-1 flex flex-col gap-6'>
          {/* Profile Card */}
          <div className='flex flex-col items-center bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg relative'>
            {/* Nested div for image and upload */}
            <div className='relative'>
              <img
                src={imagePreview || 'https://via.placeholder.com/120'}
                alt='Profile'
                className='w-32 h-32 rounded-full mb-4 shadow-md transition-opacity duration-300 ease-in-out hover:opacity-75'
              />
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                id='imageUpload'
              />
              <label
                htmlFor='imageUpload'
                className='absolute inset-0 bottom-4 flex items-center justify-center text-white bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300'
              >
                <FaEdit className='mr-1' />
                Edit
              </label>
            </div>
            <h1 className='text-xl font-bold mb-2 dark:text-white'>
              {userInfo.name}
            </h1>
            <p className='mb-4 dark:text-white'>{userInfo.username}</p>

            <button
              onClick={handleSaveImage}
              disabled={loading || !image}
              className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-opacity duration-300 ${
                loading || !image ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className='flex items-center'>
                  Updating...
                  <div className=' ml-2'>
                    <SyncLoader size={10} color='white' />
                  </div>
                </div>
              ) : image ? (
                <>
                  Upload Image
                  <FaCloudUploadAlt className='ml-2' />
                </>
              ) : (
                <>
                  <FaCamera className='mr-2' />
                  Change Picture
                </>
              )}
            </button>
          </div>

          {/* Language & Time */}
          <div className='bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg font-semibold mb-6'>Language & Time</h2>
            <label className='block text-sm mb-2' htmlFor='language'>
              Select Language
            </label>
            <select
              id='language'
              className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
            >
              <option>English (US)</option>
              <option>French</option>
            </select>

            <label className='block text-sm mt-6 mb-2' htmlFor='timezone'>
              Time Zone
            </label>
            <select
              id='timezone'
              className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
            >
              <option>GMT+0 Greenwich Mean Time</option>
              <option>GMT+1 Central European Time</option>
            </select>

            <button className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-8'>
              Save all
            </button>
          </div>
        </div>

        {/* Middle Section - General Information */}
        <div className='lg:col-span-2'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='bg-gray-200 dark:bg-gray-700 p-8 rounded-lg shadow-lg'
          >
            <h2 className='text-2xl font-semibold mb-6'>General Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm mb-2' htmlFor='name'>
                  Name
                </label>
                <input
                  {...register('name')}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                />
                <p className='text-red-500'>{errors.name?.message}</p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='username'>
                  Username
                </label>
                <input
                  {...register('username')}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                />
                <p className='text-red-500'>{errors.username?.message}</p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='email'>
                  Email
                </label>
                <input
                  {...register('email')}
                  type='email'
                  disabled
                  className='w-full p-2 rounded-md bg-gray-400 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                />
                <p className='text-red-500'>{errors.email?.message}</p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='bio'>
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 resize-none'
                />
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='birthday'>
                  Birthday
                </label>
                <input
                  {...register('birthday')}
                  type='date'
                  defaultValue={formattedBirthday || ''}
                  onChange={(e) => {
                    const selectedDate = e.target.value; // This will always be in 'yyyy-mm-dd' format.
                    console.log('Birthday Input Changed:', selectedDate);
                    setValue('birthday', selectedDate); // Store as a string in the correct format.
                  }}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                />
                <p className='text-red-500'>{errors.birthday?.message}</p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='address'>
                  Address
                </label>
                <input
                  {...register('shippingInfo.address')}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                />
                <p className='text-red-500'>
                  {errors.shippingInfo?.address?.message}
                </p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='city'>
                  City
                </label>
                <input
                  {...register('shippingInfo.city')}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                />
                <p className='text-red-500'>
                  {errors.shippingInfo?.city?.message}
                </p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='country'>
                  Country
                </label>
                <select
                  {...register('shippingInfo.country')}
                  onChange={handleCountryChange}
                  value={selectedCountry}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                >
                  <option value=''>Select a country</option>
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>

                <p className='text-red-500'>
                  {errors.shippingInfo?.country?.message}
                </p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='state'>
                  State
                </label>

                <select
                  {...register('shippingInfo.state')}
                  disabled={!states.length}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                >
                  <option value=''>Select a state</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <p className='text-red-500'>
                  {errors.shippingInfo?.state?.message}
                </p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='phoneNo'>
                  Phone Number
                </label>
                <input
                  {...register('shippingInfo.phoneNo')}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                />
                <p className='text-red-500'>
                  {errors.shippingInfo?.phoneNo?.message}
                </p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='postalCode'>
                  Zip/Postal Code
                </label>
                <input
                  {...register('shippingInfo.postalCode')}
                  className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                />
                <p className='text-red-500'>
                  {errors.shippingInfo?.postalCode?.message}
                </p>
              </div>
            </div>

            <button
              type='submit'
              disabled={submitLoading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md mt-6 flex justify-center items-center transition-opacity duration-300 ${
                submitLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitLoading ? (
                <>
                  <span className='mr-2'>Saving...</span>
                  <SyncLoader size={10} color='white' />
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>

        {/* Right Section - Social & Password Info */}
        <Socials />
        <UpdateUserPassword />
      </div>
    </div>
  );
};

export default Profile;
