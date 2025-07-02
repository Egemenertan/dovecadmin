'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BlogListItem } from '@/types/blog';

interface BlogCardProps {
  blog: BlogListItem;
  onDelete?: (id: string, title: string) => void;
  isDeleting?: boolean;
  showActions?: boolean;
}

export default function BlogCard({ blog, onDelete, isDeleting, showActions = true }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'draft':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'archived':
        return 'text-slate-600 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'draft':
        return 'Draft';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | any) => {
    // Firebase Timestamp için
    if (dateString?.toDate) {
      return dateString.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    // String tarih için
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageError = () => {
    console.log('❌ Image failed to load:', blog.coverImage);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', blog.coverImage);
    setImageError(false);
    setImageLoading(false);
  };

  // Check if we have a valid image URL
  const hasValidImage = blog.coverImage && 
    blog.coverImage.trim() !== '' && 
    !imageError &&
    (blog.coverImage.startsWith('http') || blog.coverImage.startsWith('/') || blog.coverImage.startsWith('data:'));

  return (
    <article className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-xl transition-all duration-500 ease-out">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(blog.status)}`}>
              {getStatusText(blog.status)}
            </span>
          </div>
          <time className="text-sm text-slate-500 font-light">
            {formatDate(blog.createdAt)}
          </time>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <Link href={`/blogs/${blog.id}`} className="block group-hover:text-slate-900 transition-colors">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-slate-700 transition-colors">
              {blog.title}
            </h2>
            {blog.en_title && (
              <h3 className="text-lg font-light text-slate-600 mb-3">
                {blog.en_title}
              </h3>
            )}
          </Link>

          <p className="text-slate-700 leading-relaxed line-clamp-3 font-light">
            {blog.excerpt}
          </p>
        </div>

        {/* Featured Image */}
        {blog.coverImage && (
          <div className="relative overflow-hidden rounded-xl bg-slate-100">
            {hasValidImage && !imageError ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </>
            ) : (
              // Fallback when no image or image failed
              <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <div className="w-16 h-16 bg-slate-300 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">
                    {imageError ? 'Failed to load image' : 'No image'}
                  </p>
                  {imageError && blog.coverImage && (
                    <p className="text-xs text-slate-300 mt-1 truncate max-w-32">
                      {blog.coverImage}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meta & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-6 text-sm text-slate-500">
            <span>📝 {blog.status === 'published' ? 'Yayınlanmış' : blog.status === 'draft' ? 'Taslak' : 'Arşivlenmiş'}</span>
          </div>

          {showActions && (
            <div className="flex items-center space-x-4">
              <Link
                href={`/blogs/${blog.id}`}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Read
              </Link>
              <Link
                href={`/blogs/edit/${blog.id}`}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Edit
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(blog.id, blog.title)}
                  disabled={isDeleting}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
} 