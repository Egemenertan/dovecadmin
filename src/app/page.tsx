'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, User, Clock } from 'lucide-react';
import { BlogListItem } from '@/types/blog';
import { subscribeToBlogs, deleteBlog } from '@/lib/blogService';
import BlogCard from '@/components/BlogCard';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { logout } = useAuth();

  // Firebase'den blogları real-time olarak yükle
  useEffect(() => {
    console.log('🚀 HomePage: useEffect starting...');
    let unsubscribe: (() => void) | null = null;

    const startListening = () => {
      try {
        console.log('🔥 HomePage: Starting Firebase listener...');
        setLoading(true);
        setError(null);
        
        // Real-time listener başlat
        unsubscribe = subscribeToBlogs((blogsData) => {
          console.log('📊 HomePage: Received blogs data:', blogsData);
          console.log('📈 HomePage: Number of blogs:', blogsData.length);
          setBlogs(blogsData);
          setLoading(false);
        });
        
        console.log('✅ HomePage: Firebase listener started successfully');
      } catch (err) {
        console.error('❌ HomePage: Error starting listener:', err);
        setError('Unable to connect to Firebase Firestore. Please check your internet connection.');
        setLoading(false);
      }
    };

    startListening();

    // Cleanup function
    return () => {
      console.log('🧹 HomePage: Cleaning up Firebase listener...');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Blog silme işlemi
  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setDeleting(id);
      await deleteBlog(id);
      // Real-time listener otomatik olarak güncellemeyi yapacak
    } catch (err) {
      console.error('Blog deletion error:', err);
      alert('An error occurred while deleting the blog post');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  // Filter blogs based on status
  const filteredBlogs = blogs.filter(blog => {
    if (filter === 'all') return true;
    return blog.status === filter;
  });

  const getFilterCount = (status: string) => {
    if (status === 'all') return blogs.length;
    return blogs.filter(blog => blog.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-light text-slate-700 mb-2">Connecting to Firebase</h2>
          <p className="text-slate-500 text-sm">Setting up real-time data stream</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Connection Error</h2>
          <div className="bg-white border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
            {error}
          </div>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Retry Connection
            </button>
            <Link
              href="/blogs/new"
              className="text-slate-600 hover:text-slate-900 px-6 py-3 font-medium transition-colors"
            >
              Create New Post
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
                  DOVEC
                </Link>
                <p className="text-slate-600 mt-2 font-light">Modern Blog Management</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Kullanıcı bilgisi */}
                <div className="hidden lg:flex items-center space-x-3 bg-slate-50 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">Admin Kullanıcı</p>
                    <p className="text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Aktif Session</span>
                    </p>
                  </div>
                </div>

                <Link
                  href="/landing-pages"
                  className="text-slate-600 hover:text-slate-900 px-6 py-3 font-medium transition-colors"
                >
                  Landing Pages
                </Link>
                <Link
                  href="/landing-pages/new"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New LP
                </Link>
                <Link
                  href="/blogs/new"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  New Post
                </Link>
                
                {/* Logout butonu */}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-slate-200 hover:border-red-200"
                  title="Güvenli Çıkış"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Çıkış</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-3">Blog Posts</h1>
                <p className="text-slate-600 font-light">Manage your content with real-time updates</p>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Live</span>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 mb-8">
              {[
                { key: 'all', label: 'All Posts' },
                { key: 'published', label: 'Published' },
                { key: 'draft', label: 'Drafts' },
                { key: 'archived', label: 'Archived' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filter === tab.key
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-black/10">
                    {getFilterCount(tab.key)}
                  </span>
                </button>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-slate-900 mb-1">{blogs.length}</div>
                <div className="text-slate-600 font-light">Total Posts</div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-emerald-600 mb-1">{getFilterCount('published')}</div>
                <div className="text-slate-600 font-light">Published</div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-amber-600 mb-1">{getFilterCount('draft')}</div>
                <div className="text-slate-600 font-light">Drafts</div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-slate-600 mb-1">{getFilterCount('archived')}</div>
                <div className="text-slate-600 font-light">Archived</div>
              </div>
            </div>
          </div>

          {/* Blog List */}
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="w-12 h-12 bg-slate-300 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {filter === 'all' ? 'No posts yet' :
                 filter === 'published' ? 'No published posts' :
                 filter === 'draft' ? 'No draft posts' :
                 'No archived posts'}
              </h3>
              <p className="text-slate-600 mb-10 max-w-md mx-auto font-light leading-relaxed">
                {filter === 'all' 
                  ? 'Your Firebase Firestore "blogs" collection is empty. Create your first blog post to get started.'
                  : `You don't have any ${filter === 'published' ? 'published' : filter === 'draft' ? 'draft' : 'archived'} posts yet.`
                }
              </p>
              {filter === 'all' && (
                <Link
                  href="/blogs/new"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 inline-block"
                >
                  Create Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onDelete={handleDeleteBlog}
                  isDeleting={deleting === blog.id}
                  showActions={true}
                />
              ))}
            </div>
          )}

          {/* Footer Status */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white border border-slate-200 rounded-full text-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 font-medium">Connected to Firebase Firestore</span>
            </div>
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-4">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Oturumu Kapat
                </h3>
                <p className="text-gray-600">
                  Admin panelinden çıkmak istediğinizden emin misiniz?
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg font-medium transition-all duration-200"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 