// pages/forgot-password.tsx
'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {  toast } from 'react-toastify';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react';

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="max-w-md w-full text-center space-y-6 text-white">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p>We’ve sent password reset instructions to {emailForReset}</p>
          <button
            onClick={() => (window.location.href = '/reset-password')}
            className="w-full bg-white text-black py-2 rounded-md font-semibold"
          >
            Enter OTP & Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-white text-2xl text-center font-bold">
          Reset Password
        </h1>
        <p className="text-gray-400 text-center">
          Enter your email address and we&apos;ll send you a code to reset your
          password
        </p>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email }),
              });
              await res.json();
              setEmailForReset(values.email);
              toast.success('Reset code sent!');
              setSent(true);
            } catch {
              toast.error('Something went wrong');
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-2 rounded-md font-semibold flex items-center justify-center gap-2"
              >
                <MailCheck size={18} className="inline-block" />
                {isSubmitting ? 'Sending…' : 'Send Reset Email'}
              </button>
              <a
                href="/login"
                className="text-white hover:underline text-sm block text-center"
              >
                <ArrowLeft size={14} className='inline-block'/> Back to Sign In
              </a>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
