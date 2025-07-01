'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogListItem } from '@/types/blog';
import { getPublishedBlogs } from '@/lib/blogService';
import BlogCard from '@/components/BlogCard';

export default function HomePage() {
  const [recentBlogs, setRecentBlogs] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentBlogs = async () => {
      try {
        const blogs = await getPublishedBlogs();
        setRecentBlogs(blogs.slice(0, 3)); // Son 3 yayınlanmış blog
      } catch (error) {
        console.error('Error loading recent blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
              DOVEC
            </Link>
            <nav className="flex items-center space-x-6">
              <Link 
                href="/blogs" 
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Blog Posts
              </Link>
              <Link 
                href="/blogs/new" 
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                New Post
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Modern Blog
              <span className="block text-slate-600">Management</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
              Firebase Firestore powered content management with real-time updates, 
              OpenAI translation, and elegant design.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link
                href="/blogs/new"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 shadow-lg shadow-slate-900/25"
              >
                Create New Post
              </Link>
              <Link
                href="/blogs"
                className="text-slate-600 hover:text-slate-900 px-8 py-4 font-medium text-lg transition-colors border border-slate-200 rounded-xl hover:border-slate-300"
              >
                View All Posts
              </Link>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-slate-300 transition-all duration-300">
                <div className="w-12 h-12 bg-slate-100 rounded-xl mb-6 mx-auto"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Firebase Firestore</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Real-time database for secure content storage and instant synchronization across all devices.
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-slate-300 transition-all duration-300">
                <div className="w-12 h-12 bg-slate-100 rounded-xl mb-6 mx-auto"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">AI Translation</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Automatically translate Turkish content to English using OpenAI GPT-3.5-turbo technology.
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-slate-300 transition-all duration-300">
                <div className="w-12 h-12 bg-slate-100 rounded-xl mb-6 mx-auto"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Rich Editor</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  TipTap-based rich text editor with support for images, tables, and advanced formatting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Latest Posts</h2>
            <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
              Discover the most recent content from our Firebase Firestore database
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-600 font-light">Loading posts from Firebase...</p>
            </div>
          ) : recentBlogs.length > 0 ? (
            <div className="space-y-8 max-w-5xl mx-auto">
              {recentBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  showActions={false}
                />
              ))}
              
              {/* Show More Button */}
              <div className="text-center pt-12">
                <Link
                  href="/blogs"
                  className="text-slate-600 hover:text-slate-900 px-8 py-4 font-medium transition-colors border border-slate-200 rounded-xl hover:border-slate-300"
                >
                  View All Blog Posts
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="w-12 h-12 bg-slate-300 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Published Posts</h3>
              <p className="text-slate-600 font-light mb-8 leading-relaxed">
                Your Firebase Firestore database doesn't have any published blog posts yet.
              </p>
              <Link
                href="/blogs/new"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 inline-block"
              >
                Create Your First Post
              </Link>
            </div>
          )}
        </div>

        {/* Status Section */}
        <div className="py-16 text-center">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white border border-slate-200 rounded-full text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-slate-600 font-medium">Firebase Firestore Connected</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">DOVEC</h3>
            <p className="text-slate-600 font-light mb-8 max-w-md mx-auto">
              Firebase-powered modern blog management system with elegant design
            </p>
            <div className="flex justify-center space-x-8 text-sm text-slate-500">
              <span>Firebase Firestore</span>
              <span>OpenAI Translation</span>
              <span>TipTap Editor</span>
              <span>Next.js 15</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 