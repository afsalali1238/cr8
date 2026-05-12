'use client'
import Link from 'next/link'
import { useState } from 'react'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await subscribeToNewsletter(email)
      setStatus('success')
      setMessage('You\'re in! We\'ll share new makers and craft stories with you.')
      setEmail('')
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong.')
    }
  }

  return (
    <footer className="bg-ink text-cream/70 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <span className="font-display text-3xl text-clay">cr8un8</span>
          <p className="mt-3 text-sm leading-relaxed max-w-xs">
            Connecting independent artists with buyers who appreciate the beauty of handmade. India's local craft marketplace.
          </p>
          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-cream text-xs font-semibold uppercase tracking-widest mb-3">
              New makers, every week
            </p>
            {status === 'success' ? (
              <p className="text-green-400 text-sm">{message}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">