// pages/reset-password.tsx
'use client';

import { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const ResetSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  otp: Yup.string().length(6, 'Enter 6-digit code').required('OTP is required'),
  newPassword: Yup.string()
    .min(6, 'At least 6 characters')
    .required('Required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Required'),
});

// Custom OTP input component
function OTPInput() {
  const { values, setFieldValue } = useFormikContext<{ otp: string }>();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const digit = e.target.value.replace(/\D/, '');
    const arr = values.otp.padEnd(6, ' ').split('');
    arr[i] = digit;
    const newOtp = arr.join('').trimEnd();
    setFieldValue('otp', newOtp);
    if (digit && i < 5) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center mb-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          maxLength={1}
          value={values.otp[i] || ''}
          onChange={(e) => handleChange(e, i)}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          className="w-12 h-12 bg-[#1C1C1C] text-white text-center rounded-md focus:outline-none"
        />
      ))}
    </div>
  );
}

export default function ResetPasswordPage() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-white text-2xl text-center font-bold">
          Enter Reset Code
        </h1>

        <Formik
          initialValues={{ email: '', otp: '', newPassword: '', confirm: '' }}
          validationSchema={ResetSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  email: values.email,
                  otp: values.otp,
                  newPassword: values.newPassword,
                }),
              });
              const json = await res.json();
              if (!res.ok) throw new Error(json.msg || 'Reset failed');
              toast.success('Password reset successfully');
              setTimeout(() => (window.location.href = '/login'), 1000);
            } catch (err: unknown) {
              const errorMsg =
                err instanceof Error
                  ? err.message
                  : 'An unknown error occurred';
              toast.error(errorMsg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="bg-[#121212] p-6 rounded-xl space-y-4">
              {/* OTP boxes */}
              <div>
                <label className="block text-gray-400 mb-1">Reset Code</label>
                <OTPInput />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Email with icon */}
              <div className="relative">
                <label htmlFor="email" className="block text-gray-400 mb-1">
                  Email Address
                </label>
                <Mail
                  className="absolute left-3 top-9 text-gray-500"
                  size={16}
                />
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-[#1C1C1C] text-white placeholder-gray-400 rounded-md px-10 py-2 focus:outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* New Password with icon */}
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block text-gray-400 mb-1"
                >
                  New Password
                </label>
                <Lock
                  className="absolute left-3 top-9 text-gray-500"
                  size={16}
                />
                <Field
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? 'text' : 'password'}
                  placeholder="New password"
                  className="w-full bg-[#1C1C1C] text-white placeholder-gray-400 rounded-md px-10 py-2 focus:outline-none"
                />
                {showNew ? (
                  <EyeOff
                    className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                    size={16}
                    onClick={() => setShowNew(false)}
                  />
                ) : (
                  <Eye
                    className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                    size={16}
                    onClick={() => setShowNew(true)}
                  />
                )}
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Confirm Password with icon */}
              <div className="relative">
                <label htmlFor="confirm" className="block text-gray-400 mb-1">
                  Confirm Password
                </label>
                <Lock
                  className="absolute left-3 top-9 text-gray-500"
                  size={16}
                />
                <Field
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  className="w-full bg-[#1C1C1C] text-white placeholder-gray-400 rounded-md px-10 py-2 focus:outline-none"
                />
                {showConfirm ? (
                  <EyeOff
                    className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                    size={16}
                    onClick={() => setShowConfirm(false)}
                  />
                ) : (
                  <Eye
                    className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                    size={16}
                    onClick={() => setShowConfirm(true)}
                  />
                )}
                <ErrorMessage
                  name="confirm"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-2 rounded-md font-semibold"
              >
                {isSubmitting ? 'Resetting…' : 'Reset Password'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
