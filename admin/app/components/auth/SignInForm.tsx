'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short').required('Required'),
});

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params?.get('redirect') ?? '/';
  const [show, setShow] = useState(false);
  const { refreshUser } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Logo + Headings */}
        <div className="text-center">
          <Image
            src="/stream-fubol logo.svg"
            alt="Streamfutball"
            width={178}
            height={20}
            className="mx-auto"
          />

          <h1 className="mt-10 text-white text-2xl font-bold">Welcome back</h1>
          <p className="text-[#A1A1A1]">
            Sign in to your Streamfutball account
          </p>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // <— include cookie
                body: JSON.stringify(values),
              });
              const json = await res.json();
              if (!res.ok) throw new Error(json.msg || 'Login failed');
              toast.success('Logged in successfully');
              await refreshUser();
              setTimeout(() => router.push(redirect), 800);
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
            <Form
              className="bg-[#0A0A0A] border border-[#26262680] p-6 rounded-xl space-y-4"
              style={{
                boxShadow:
                  '0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 4px 6px -4px rgba(0, 0, 0, 0.10)',
              }}
            >
              <div className="text-center space-y-2">
                <h3 className="text-base text-[#FAFAFA] ">Sign In</h3>
                <p className="text-[13px] text-[##A1A1A1] ">
                  Enter your credentials to access your account
                </p>
              </div>
              <div className="mt-[35px] relative">
                <label
                  className="text-[13px] text-[#FAFAFA] font-medium"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none h-10">
                    <Mail size={18} stroke="#A1A1A1" />
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

              <div className="relative">
                <label
                  className="text-[13px] text-[#FAFAFA] font-medium"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none h-10">
                    <Lock size={18} stroke="#A1A1A1" />
                  </span>

                  <Field
                    name="password"
                    type={show ? 'text' : 'password'}
                    placeholder="Enter your password"
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
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                {/* <label className="flex items-center">
                  <Field
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 text-white"
                  />
                  <span className="ml-2">Remember me</span>
                </label> */}
                <a
                  href="/forgot-password"
                  className="text-[white] text-[12px] font-medium hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-2 rounded-md font-semibold"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>

              <p className="text-center text-gray-400 text-sm">
                Don’t have an account?{' '}
                <a href="/signup" className="text-green-500 hover:underline">
                  Sign up
                </a>
              </p>
            </Form>
          )}
        </Formik>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400 text-sm">
          By signing in, you agree to our{' '}
          <a
            href="/terms"
            className="text-white underline hover:text-green-500"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="text-white underline hover:text-green-500"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
