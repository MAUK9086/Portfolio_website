'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Github, Linkedin, Twitter, Mail, Send } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

const socials = [
  { label: 'GitHub', href: '#', Icon: Github },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
  { label: 'Twitter', href: '#', Icon: Twitter },
  { label: 'Email', href: 'mailto:you@example.com', Icon: Mail },
]

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? 'your-key-here',
          ...data,
        }),
      })
      if (res.ok) {
        toast.success('Message sent. I will get back to you soon.')
        reset()
      } else {
        toast.error('Something went wrong. Try emailing directly.')
      }
    } catch {
      toast.error('Failed to send. Check your connection.')
    }
    setSubmitting(false)
  }

  return (
    <main className="container py-24 pt-32 max-w-xl">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Get in Touch</p>
        <h1 className="text-5xl font-bold text-white mb-4">Contact</h1>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-10">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Open to research collaborations and interesting conversations
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              {...register('name')}
              placeholder="Your name"
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <textarea
              {...register('message')}
              rows={5}
              placeholder="What is on your mind?"
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors resize-none"
            />
            {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-6 mt-12 pt-10 border-t border-white/10">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={label}
              className="text-white/30 hover:text-white transition-colors"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </motion.div>
    </main>
  )
}
