// pages/signup.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { User, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Too short').required('Password is required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms'),
  marketing: Yup.boolean(),
});

export default function SignupPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <ToastContainer position="top-right" />
      <div className="max-w-md w-full space-y-6">
        {/* Logo & Headings */}
        <div className="text-center">
          <Image
            src="/stream-fubol logo.svg"
            alt="Streamfutball"
            width={178}
            height={20}
            className="mx-auto"
          />

          <h1 className="mt-4 text-white text-2xl font-bold">
            Create your account
          </h1>
          <p className="text-gray-400">
            Create a new Streamfutball admin account
          </p>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirm: '',
            agree: false,
            marketing: false,
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  name: `${values.firstName} ${values.lastName}`,
                  email: values.email,
                  password: values.password,
                  marketing: values.marketing, // optional
                }),
              });
              const json = await res.json();
              if (!res.ok) throw new Error(json.msg || 'Signup failed');
              toast.success('Account created! Redirecting to login…');
              setTimeout(() => router.push('/login'), 1200);
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
              <div className="text-center space-y-2">
                <h3 className="text-base text-[#FAFAFA] ">Sign Up</h3>
                <p className="text-[13px] text-[##A1A1A1] ">
                  Create a new Streamfutball account
                </p>
              </div>
              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="text-[13px] text-[#FAFAFA] font-medium"
                  >
                    First Name
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none h-10">
                      <User size={18} stroke="#FAFAFA" />
                    </span>

                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="w-full pl-12 bg-[#2626264D] border border-[#262626] text-[#A1A1A1] placeholder-[#A1A1A1] rounded-md h-10 px-4 py-0"
                    />
                  </div>

                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="text-[13px] text-[#FAFAFA] font-medium"
                  >
                    Last Name
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="w-full pl-12 bg-[#2626264D] border border-[#262626] text-[#A1A1A1] placeholder-[#A1A1A1] rounded-md h-10 px-4 py-0 mt-2"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="mt-[35px] relative">
                <label
                  className="text-[13px] text-[#FAFAFA] font-medium"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none h-10">
                    <Mail size={18} stroke="#FAFAFA" />
                  </span>

                  <Field
                    name="email"
                    type="email"
                    placeholder="yourname@email.com"
                    className="w-full pl-12 bg-[#2626264D] border border-[#262626] text-[#A1A1A1] placeholder-[#A1A1A1] rounded-md h-10 px-4 py-0"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              {/* Password */}
              <div className="relative">
                <label
                  className="text-[13px] text-[#FAFAFA] font-medium"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none h-10">
                    <Lock size={18} stroke="#FAFAFA" />
                  </span>

                  <Field
                    name="password"
                    type={show ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="w-full pl-12 pr-12 bg-[#2626264D] border border-[#262626] text-[#A1A1A1] placeholder-[#A1A1A1] rounded-md h-10 px-4 py-0"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center h-10 text-[#A1A1A1] focus:outline-none"
                    onClick={() => setShow((v) => !v)}
                  >
                    {show ? (
                      <EyeOff size={18} stroke="#FAFAFA" />
                    ) : (
                      <Eye size={18} stroke="#FAFAFA" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>{' '}
              <div className="relative">
                <label
                  className="text-[13px] text-[#FAFAFA] font-medium"
                  htmlFor="confirm"
                >
                  Confirm Password
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none h-10">
                    <Lock size={18} stroke="#FAFAFA" />
                  </span>

                  <Field
                    name="confirm"
                    type={show ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-12 bg-[#2626264D] border border-[#262626] text-[#A1A1A1] placeholder-[#A1A1A1] rounded-md h-10 px-4 py-0"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center h-10 text-[#A1A1A1] focus:outline-none"
                    onClick={() => setShow((v) => !v)}
                  >
                    {show ? (
                      <EyeOff size={18} stroke="#FAFAFA" />
                    ) : (
                      <Eye size={18} stroke="#FAFAFA" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirm"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              {/* Terms of Service */}
              <div className="flex items-center">
                <Field
                  id="agree"
                  name="agree"
                  type="checkbox"
                  className="h-4 w-4 text-white"
                />
                <label htmlFor="agree" className="ml-2 text-gray-400 text-sm">
                  I agree to the{' '}
                  <a href="/terms" className="text-white hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-white hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              <ErrorMessage
                name="agree"
                component="div"
                className="text-red-500 text-sm"
              />
              {/* Marketing Opt-in */}
              {/* <div className="flex items-center">
                <Field
                  id="marketing"
                  name="marketing"
                  type="checkbox"
                  className="h-4 w-4 text-white"
                />
                <label
                  htmlFor="marketing"
                  className="ml-2 text-gray-400 text-sm"
                >
                  I would like to receive product updates and marketing
                  communications
                </label>
              </div> */}
              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-2 rounded-md font-semibold"
              >
                {isSubmitting ? 'Creating…' : 'Create Account'}
              </button>
              {/* Link to Sign In */}
              <p className="text-center text-gray-400 text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-white hover:underline">
                  Sign in
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
