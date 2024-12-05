import { ChangeEvent, useState } from 'react';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const useFormValidation = (initialValues: FormValues) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const formErrors: FormErrors = {};

    if (!values.name.trim()) {
      formErrors.name = 'Name is required';
    }

    if (!values.email.trim()) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      formErrors.email = 'Email is invalid';
    }

    if (!values.message.trim()) {
      formErrors.message = 'Message is required';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return { values, errors, handleChange, validateForm };
};
