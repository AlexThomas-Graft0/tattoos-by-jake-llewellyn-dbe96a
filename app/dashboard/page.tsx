'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

interface PortfolioItem {
  id: string
  created_at: string
  title: string
  category: string
  image_url: string
}

interface Booking {
  id: string
  created_at: string
  user_id: string | null
  date_requested: string
  tattoo_description: string
  status: string
  reference_image_url: string | null
}

interface BlogPost {
  id: string
  created_at: string
  title: string
  slug: string
  body: string
  image_url: string | null
}

export default function OwnerDashboard() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'bookings' | 'portfolio' | 'blog'>('bookings')

  // Data States
  const [bookings, setBookings] = useState<Booking[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [blog, setBlog] = useState<BlogPost[]>([])

  // Global loading & messages
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Modals & Action States
  const [bookingFilter, setBookingFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Portfolio Form State
  const [portfolioId, setPortfolioId] = useState<string | null>(null) // null means creating new
  const [portfolioTitle, setPortfolioTitle] = useState('')
  const [portfolioCategory, setPortfolioCategory] = useState('Fine Line')
  const [portfolioImageUrl, setPortfolioImageUrl] = useState('')
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false)

  // Blog Form State
  const [blogId, setBlogId] = useState<string | null>(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogSlug, setBlogSlug] = useState('')
  const [blogBody, setBlogBody] = useState('')
  const [blogImageUrl, setBlogImageUrl] = useState('')
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false)

  // Booking Edit State (status updates)
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null)

  // Auto-generate slug from blog title
  const handleBlogTitleChange = (val: string) => {
    setBlogTitle(val)
    if (!blogId) {
      setBlogSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      )
    }
  }

  // Load initial data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      // Bookings
      const { data: bData, error: bErr } = await supabase
        .from('bookings')
        .select('*')
        .order('date_requested', { ascending: false })
      if (bErr) throw bErr
      setBookings(bData || [])

      // Portfolio
      const { data: pData, error: pErr } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false })
      if (pErr) throw pErr
      setPortfolio(pData || [])

      // Blog
      const { data: postData, error: postErr } = await supabase
        .from('blog')
        .select('*')
        .order('created_at', { ascending: false })
      if (postErr) throw postErr
      setBlog(postData || [])

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  // Flash Message Helper
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const triggerError = (msg: string) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(null), 6000)
  }

  // ----------------------------------------------------
  // BOOKINGS HANDLERS
  // ----------------------------------------------------
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    setUpdatingBookingId(id)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setBookings(prev =>
        prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
      )
      triggerSuccess(`Booking status updated to ${newStatus}`)
    } catch (err: any) {
      triggerError(err.message || 'Failed to update booking status.')
    } finally {
      setUpdatingBookingId(null)
    }
  }

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking request?')) return
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (error) throw error

      setBookings(prev => prev.filter(item => item.id !== id))
      triggerSuccess('Booking request deleted successfully.')
    } catch (err: any) {
      triggerError(err.message || 'Failed to delete booking.')
    }
  }

  // ----------------------------------------------------
  // PORTFOLIO HANDLERS
  // ----------------------------------------------------
  const openPortfolioModal = (item?: PortfolioItem) => {
    if (item) {
      setPortfolioId(item.id)
      setPortfolioTitle(item.title)
      setPortfolioCategory(item.category)
      setPortfolioImageUrl(item.image_url)
    } else {
      setPortfolioId(null)
      setPortfolioTitle('')
      setPortfolioCategory('Fine Line')
      setPortfolioImageUrl('')
    }
    setIsPortfolioModalOpen(true)
  }

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!portfolioTitle.trim() || !portfolioImageUrl.trim()) {
      triggerError('Please fill in all portfolio fields.')
      return
    }

    try {
      if (portfolioId) {
        // Edit
        const { data, error } = await supabase
          .from('portfolios')
          .update({
            title: portfolioTitle,
            category: portfolioCategory,
            image_url: portfolioImageUrl,
          })
          .eq('id', portfolioId)
          .select()

        if (error) throw error
        triggerSuccess('Portfolio item updated successfully!')
      } else {
        // Insert
        const { data, error } = await supabase
          .from('portfolios')
          .insert({
            title: portfolioTitle,
            category: portfolioCategory,
            image_url: portfolioImageUrl,
          })
          .select()

        if (error) throw error
        triggerSuccess('New portfolio piece added!')
      }
      setIsPortfolioModalOpen(false)
      fetchData()
    } catch (err: any) {
      triggerError(err.message || 'Error saving portfolio item.')
    }
  }

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio piece?')) return
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPortfolio(prev => prev.filter(item => item.id !== id))
      triggerSuccess('Portfolio piece removed.')
    } catch (err: any) {
      triggerError(err.message || 'Failed to delete portfolio item.')
    }
  }

  // ----------------------------------------------------
  // BLOG HANDLERS
  // ----------------------------------------------------
  const openBlogModal = (post?: BlogPost) => {
    if (post) {
      setBlogId(post.id)
      setBlogTitle(post.title)
      setBlogSlug(post.slug)
      setBlogBody(post.body)
      setBlogImageUrl(post.image_url || '')
    } else {
      setBlogId(null)
      setBlogTitle('')
      setBlogSlug('')
      setBlogBody('')
      setBlogImageUrl('')
    }
    setIsBlogModalOpen(true)
  }

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blogTitle.trim() || !blogSlug.trim() || !blogBody.trim()) {
      triggerError('Please fill in all mandatory blog fields (Title, Slug, Body).')
      return
    }

    try {
      const payload = {
        title: blogTitle,
        slug: blogSlug,
        body: blogBody,
        image_url: blogImageUrl.trim() || null,
      }

      if (blogId) {
        // Edit
        const { error } = await supabase
          .from('blog')
          .update(payload)
          .eq('id', blogId)

        if (error) throw error
        triggerSuccess('Blog post updated successfully!')
      } else {
        // Insert
        const { error } = await supabase
          .from('blog')
          .insert(payload)

        if (error) throw error
        triggerSuccess('New blog post published!')
      }
      setIsBlogModalOpen(false)
      fetchData()
    } catch (err: any) {
      triggerError(err.message || 'Error saving blog post.')
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    try {
      const { error } = await supabase
        .from('blog')
        .delete()
        .eq('id', id)

      if (error) throw error

      setBlog(prev => prev.filter(item => item.id !== id))
      triggerSuccess('Blog post deleted.')
    } catch (err: any) {
      triggerError(err.message || 'Failed to delete blog post.')
    }
  }

  // Computed Stats
  const pendingCount = bookings.filter(b => b.status === 'Pending').length
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length
  const totalBookings = bookings.length
  const totalPortfolio = portfolio.length

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingFilter === 'All' || b.status === bookingFilter
    const matchesSearch =
      b.tattoo_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.date_requested.includes(searchQuery)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded">
              ADMIN
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Tattoos by Jake Llewellyn</h1>
              <p className="text-xs text-slate-400">Gilfach, Bargoed Studio Hub</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-all duration-200"
            >
              ← View Website
            </Link>
            <button
              onClick={fetchData}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Flash Notifications */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-3">
              <span className="text-red-400 font-bold">⚠️ Error:</span>
              <p className="text-sm">{errorMsg}</p>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white font-bold text-sm">Dismiss</button>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-200 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-bold">✓ Success:</span>
              <p className="text-sm">{successMsg}</p>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white font-bold text-sm">Dismiss</button>
          </div>
        )}

        {/* Stats Summary Panel */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Bookings</span>
            <span className="text-3xl font-bold text-white">{totalBookings}</span>
            <div className="absolute right-4 bottom-4 text-slate-800 group-hover:text-slate-700 transition font-mono text-5xl select-none">#1</div>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden group hover:border-amber-500/50 transition">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">Pending Requests</span>
            <span className="text-3xl font-bold text-amber-300">{pendingCount}</span>
            <div className="absolute right-4 bottom-4 text-amber-950/40 font-mono text-5xl select-none">⏳</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Portfolio Works</span>
            <span className="text-3xl font-bold text-blue-400">{totalPortfolio}</span>
            <div className="absolute right-4 bottom-4 text-slate-800 group-hover:text-slate-700 transition font-mono text-5xl select-none">🎨</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Blog Articles</span>
            <span className="text-3xl font-bold text-purple-400">{blog.length}</span>
            <div className="absolute right-4 bottom-4 text-slate-800 group-hover:text-slate-700 transition font-mono text-5xl select-none">📝</div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-8 space-x-1 bg-slate-900/50 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🗓️ Bookings & Enquiries ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'portfolio'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🎨 Portfolio Manager ({portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'blog'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📝 Blog Hub ({blog.length})
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">Fetching studio records from database...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-2">Filter Status:</span>
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setBookingFilter(status)}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                          bookingFilter === status
                            ? 'bg-slate-800 text-white border border-slate-700'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search descriptions & dates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-lg pl-8 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:border-blue-500"
                    />
                    <svg className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
                    <p className="text-slate-400 text-sm">No booking records found matching your filters.</p>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="py-4 px-6">Client / Request Details</th>
                            <th className="py-4 px-6">Date Requested</th>
                            <th className="py-4 px-6">Reference Image</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-800/40 transition">
                              <td className="py-4 px-6">
                                <p className="text-sm font-semibold text-white mb-1">
                                  {b.user_id ? `Registered Client (ID: ${b.user_id.substring(0, 8)}...)` : 'Anonymous Guest'}
                                </p>
                                <p className="text-xs text-slate-300 max-w-md line-clamp-2 italic">
                                  &ldquo;{b.tattoo_description}&rdquo;
                                </p>
                              </td>
                              <td className="py-4 px-6 text-sm text-slate-300">
                                {new Date(b.date_requested).toLocaleDateString('en-GB', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                              <td className="py-4 px-6">
                                {b.reference_image_url ? (
                                  <a
                                    href={b.reference_image_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group relative block w-12 h-12 rounded overflow-hidden border border-slate-700 hover:border-blue-500 transition"
                                  >
                                    <img
                                      src={b.reference_image_url}
                                      alt="Reference"
                                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                    />
                                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[9px] text-white font-bold">
                                      VIEW
                                    </span>
                                  </a>
                                ) : (
                                  <span className="text-xs text-slate-500 italic">No Reference</span>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    b.status === 'Pending'
                                      ? 'bg-amber-900/40 text-amber-300 border border-amber-500/30'
                                      : b.status === 'Confirmed'
                                      ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30'
                                      : b.status === 'Completed'
                                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-rose-900/40 text-rose-300 border border-rose-500/30'
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right space-x-2">
                                <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-1">
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                                    disabled={updatingBookingId === b.id}
                                    className="text-[11px] px-2 py-1 rounded hover:bg-indigo-600 hover:text-white text-indigo-400 transition"
                                    title="Mark as Confirmed"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'Completed')}
                                    disabled={updatingBookingId === b.id}
                                    className="text-[11px] px-2 py-1 rounded hover:bg-emerald-600 hover:text-white text-emerald-400 transition"
                                    title="Mark as Completed"
                                  >
                                    Done
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}
                                    disabled={updatingBookingId === b.id}
                                    className="text-[11px] px-2 py-1 rounded hover:bg-rose-600 hover:text-white text-rose-400 transition"
                                    title="Cancel"
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleDeleteBooking(b.id)}
                                  className="text-xs text-slate-500 hover:text-rose-400 px-2 py-1 transition"
                                  title="Delete Record"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Portfolio Showcase</h3>
                  <button
                    onClick={() => openPortfolioModal()}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/10 flex items-center gap-2"
                  >
                    <span>+ Add Portfolio Piece</span>
                  </button>
                </div>

                {portfolio.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-4">No portfolio images uploaded yet.</p>
                    <button
                      onClick={() => openPortfolioModal()}
                      className="text-blue-500 hover:underline text-xs"
                    >
                      Upload your first piece now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {portfolio.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-slate-700 transition"
                      >
                        <div className="relative aspect-square w-full bg-slate-950">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 right-2 bg-slate-900/90 text-slate-300 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-slate-800">
                            {item.category}
                          </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div className="mb-4">
                            <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {item.id.substring(0, 8)}...</p>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                            <button
                              onClick={() => openPortfolioModal(item)}
                              className="text-xs text-slate-300 hover:text-white transition font-medium"
                            >
                              Edit Details
                            </button>
                            <button
                              onClick={() => handleDeletePortfolio(item.id)}
                              className="text-xs text-rose-500 hover:text-rose-400 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BLOG */}
            {activeTab === 'blog' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Aftercare Tips & Blog Posts</h3>
                  <button
                    onClick={() => openBlogModal()}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/10 flex items-center gap-2"
                  >
                    <span>+ Write New Post</span>
                  </button>
                </div>

                {blog.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-4">No articles written yet.</p>
                    <button
                      onClick={() => openBlogModal()}
                      className="text-blue-500 hover:underline text-xs"
                    >
                      Publish your first blog post
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blog.map((post) => (
                      <div
                        key={post.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition flex flex-col md:flex-row gap-6"
                      >
                        {post.image_url && (
                          <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500 font-mono">/{post.slug}</span>
                              <span className="text-xs text-slate-500">
                                {new Date(post.created_at).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-white mb-2">{post.title}</h4>
                            <p className="text-xs text-slate-300 line-clamp-3 mb-4">{post.body}</p>
                          </div>
                          <div className="flex items-center space-x-4 border-t border-slate-800/80 pt-4">
                            <button
                              onClick={() => openBlogModal(post)}
                              className="text-xs text-blue-400 hover:text-blue-300 transition font-medium"
                            >
                              Edit Article
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(post.id)}
                              className="text-xs text-rose-500 hover:text-rose-400 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* PORTFOLIO MODAL */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {portfolioId ? 'Edit Portfolio Item' : 'Add New Portfolio Piece'}
              </h3>
              <button
                onClick={() => setIsPortfolioModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSavePortfolio} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Piece Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fine Line Rose on Forearm"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Style Category
                </label>
                <select
                  value={portfolioCategory}
                  onChange={(e) => setPortfolioCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Fine Line">Fine Line</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Geometric">Geometric</option>
                  <option value="Cover-ups">Cover-ups</option>
                  <option value="Custom Design">Custom Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Image URL (HTTPS)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={portfolioImageUrl}
                  onChange={(e) => setPortfolioImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Must be an absolute secure URL starting with https://
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition"
                >
                  {portfolioId ? 'Save Changes' : 'Add to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {blogId ? 'Edit Blog Post' : 'Compose New Blog Post'}
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveBlog} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Aftercare Mistakes to Avoid"
                    value={blogTitle}
                    onChange={(e) => handleBlogTitleChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Slug (URL path)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. aftercare-mistakes"
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={blogImageUrl}
                  onChange={(e) => setBlogImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Body Content
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write the full post details here..."
                  value={blogBody}
                  onChange={(e) => setBlogBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition"
                >
                  {blogId ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer info */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12 border-t border-slate-900 text-center text-xs text-slate-500 space-y-2">
        <p>© 2024 Tattoos by Jake Llewellyn. All Rights Reserved.</p>
        <p>6A Gwerthonor Place, Gilfach, Bargoed, CF81 8JQ | Phone: 07729357006</p>
      </footer>
    </div>
  )
}