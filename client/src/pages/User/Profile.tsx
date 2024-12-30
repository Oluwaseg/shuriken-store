import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { Camera, CloudUpload, Edit, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SyncLoader } from 'react-spinners';
import * as yup from 'yup';
import {
  fetchUpdateProfile,
  fetchUserDetails,
} from '../../features/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import countriesData from './libs/country.json';

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
  birthday: string;
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userInfo?.avatar?.[0]?.url || 'https://via.placeholder.com/120'
  );
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const formattedBirthday = userInfo?.birthday
    ? new Date(userInfo?.birthday).toISOString().split('T')[0]
    : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormDataValues>({
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
    setValue('shippingInfo.state', '');
  };

  const onSubmit = async (data: FormDataValues) => {
    setSubmitLoading(true);
    setTimeout(async () => {
      console.log('Submitted Data:', data);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string' || value instanceof Blob) {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (typeof subValue === 'string') {
              formData.append(`${key}[${subKey}]`, subValue);
            } else if (subValue instanceof Date) {
              formData.append(`${key}[${subKey}]`, subValue.toISOString());
            } else if (subValue instanceof Blob) {
              formData.append(`${key}[${subKey}]`, subValue);
            } else {
              formData.append(`${key}[${subKey}]`, String(subValue));
            }
          });
        }
      });

      await dispatch(fetchUpdateProfile(formData));
      setSubmitLoading(false);
    }, 3000);
  };

  return (
    <div className='bg-body-light dark:bg-body-dark text-text-primary-light dark:text-text-primary-dark min-h-screen p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12'
      >
        {/* Left Section (Profile & Language) */}
        <div className='lg:col-span-1 flex flex-col gap-6'>
          {/* Profile Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className='flex flex-col items-center bg-primary dark:bg-dark-light p-6 rounded-lg shadow-lg relative'
          >
            <div className='relative'>
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={imagePreview || 'https://via.placeholder.com/120'}
                alt='Profile'
                className='w-32 h-32 rounded-full mb-4 shadow-md'
              />
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                id='imageUpload'
              />
              <motion.label
                whileHover={{ scale: 1.1 }}
                htmlFor='imageUpload'
                className='absolute inset-0 bottom-4 flex items-center justify-center text-white bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300'
              >
                <Edit className='mr-1' size={16} />
                Edit
              </motion.label>
            </div>
            <h1 className='text-xl font-bold mb-2'>{userInfo.name}</h1>
            <p className='mb-4'>{userInfo.username}</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveImage}
              disabled={loading || !image}
              className={`flex items-center justify-center bg-button-primary-light dark:bg-button-primary-dark hover:bg-button-hover-light dark:hover:bg-button-hover-dark text-white px-4 py-2 rounded-md transition-all duration-300 ${
                loading || !image ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className='flex items-center'>
                  Updating...
                  <SyncLoader size={10} color='white' className='ml-2' />
                </div>
              ) : image ? (
                <>
                  Upload Image
                  <CloudUpload className='ml-2' size={16} />
                </>
              ) : (
                <>
                  <Camera className='mr-2' size={16} />
                  Change Picture
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Language & Time */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className='bg-primary dark:bg-dark-light p-6 rounded-lg shadow-lg'
          >
            <h2 className='text-lg font-semibold mb-6'>Language & Time</h2>
            <label className='block text-sm mb-2' htmlFor='language'>
              Select Language
            </label>
            <select
              id='language'
              className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
            >
              <option>English (US)</option>
              <option>French</option>
            </select>

            <label className='block text-sm mt-6 mb-2' htmlFor='timezone'>
              Time Zone
            </label>
            <select
              id='timezone'
              className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
            >
              <option>GMT+0 Greenwich Mean Time</option>
              <option>GMT+1 Central European Time</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-button-primary-light dark:bg-button-primary-dark hover:bg-button-hover-light dark:hover:bg-button-hover-dark text-white w-full py-2 rounded-md mt-8 transition-all duration-300'
            >
              Save all
            </motion.button>
          </motion.div>
        </div>

        {/* Middle Section - General Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='lg:col-span-2'
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='bg-primary dark:bg-dark-light p-8 rounded-lg shadow-lg'
          >
            <h2 className='text-2xl font-semibold mb-6'>General Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm mb-2' htmlFor='name'>
                  Name
                </label>
                <input
                  {...register('name')}
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
                />
                <p className='text-red-500'>{errors.name?.message}</p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='username'>
                  Username
                </label>
                <input
                  {...register('username')}
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
                />
                <p className='text-red-500'>{errors.username?.message}</p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='bio'>
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark resize-none'
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
                    const selectedDate = e.target.value;
                    console.log('Birthday Input Changed:', selectedDate);
                    setValue('birthday', selectedDate);
                  }}
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
                />
                <p className='text-red-500'>{errors.birthday?.message}</p>
              </div>

              <div>
                <label className='block text-sm mb-2' htmlFor='address'>
                  Address
                </label>
                <input
                  {...register('shippingInfo.address')}
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
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
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
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
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
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
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
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
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
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
                  className='w-full p-2 rounded-md bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark'
                />
                <p className='text-red-500'>
                  {errors.shippingInfo?.postalCode?.message}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type='submit'
              disabled={submitLoading}
              className={`w-full bg-button-primary-light dark:bg-button-primary-dark text-white py-2 rounded-md mt-6 flex justify-center items-center transition-all duration-300 ${
                submitLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitLoading ? (
                <>
                  <span className='mr-2'>Saving...</span>
                  <SyncLoader size={10} color='white' />
                </>
              ) : (
                <>
                  Save Changes
                  <Save className='ml-2' size={16} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
