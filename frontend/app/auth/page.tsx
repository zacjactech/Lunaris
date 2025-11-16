'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2">
      {/* Form Column */}
      <motion.div
        key={mode}
        initial={shouldReduceMotion ? { opacity: 1 } : { x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 1 } : { x: -100, opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
        className="flex items-center justify-center p-8 bg-background order-2 md:order-1"
      >
        <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted mb-8">
            {mode === 'login'
              ? 'Sign in to continue your journey'
              : 'Start your mindfulness journey'}
          </p>

          {mode === 'login' ? <LoginForm /> : <RegisterForm />}

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-accent hover:underline"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Background Column */}
      <motion.div
        key={`bg-${mode}`}
        initial={shouldReduceMotion ? { opacity: 1 } : { x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
        className="relative flex items-center justify-center p-12 bg-gradient-to-br from-accent to-muted order-1 md:order-2 min-h-[40vh] md:min-h-screen"
      >
        <div className="text-center text-white z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {mode === 'login' ? 'Lunaris' : 'Begin Your Journey'}
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {mode === 'login' ? 'Pause. Breathe. Reflect.' : 'Discover inner peace'}
          </p>
          
          {mode === 'login' && (
            <button
              onClick={() => setMode('register')}
              className="px-8 py-3 bg-white/95 text-accent rounded-lg font-medium hover:scale-105 hover:bg-white transition-all shadow-lg"
            >
              Breathe
            </button>
          )}
        </div>

        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
      </motion.div>
    </div>
  );
}
