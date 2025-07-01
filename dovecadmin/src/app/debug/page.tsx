'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DebugPage() {
  const [firebaseStatus, setFirebaseStatus] = useState('Testing...');
  const [blogsData, setBlogsData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('🔥 Testing Firebase connection...');
        console.log('Environment variables:', {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });

        // Test Firebase connection
        setFirebaseStatus('Connecting to Firebase...');
        
        // Get all documents from blogs collection
        const blogsCollection = collection(db, 'blogs');
        console.log('📚 Getting blogs collection...');
        
        const querySnapshot = await getDocs(blogsCollection);
        console.log('📊 Query snapshot size:', querySnapshot.size);
        
        const blogs: any[] = [];
        querySnapshot.forEach((doc) => {
          console.log('📄 Blog document:', doc.id, doc.data());
          blogs.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setBlogsData(blogs);
        setFirebaseStatus(`✅ Connected! Found ${blogs.length} blogs`);
        setError(null);

      } catch (err: any) {
        console.error('❌ Firebase error:', err);
        setError(`Firebase Error: ${err.message}`);
        setFirebaseStatus('❌ Connection failed');
      } finally {
        setLoading(false);
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Firebase Debug Page</h1>
        
        {/* Firebase Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Firebase Connection Status</h2>
          <p className="text-lg mb-4">{firebaseStatus}</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              <pre className="text-sm overflow-x-auto">{error}</pre>
            </div>
          )}

          <div className="text-sm text-slate-600 space-y-2">
            <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
            <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
            <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 20)}...</p>
          </div>
        </div>

        {/* Blogs Data */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Blogs Collection Data ({blogsData.length} documents)
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading Firebase data...</p>
            </div>
          ) : blogsData.length > 0 ? (
            <div className="space-y-4">
              {blogsData.map((blog, index) => (
                <div key={blog.id} className="border border-slate-200 rounded-xl p-4">
                  <h3 className="font-bold text-slate-900 mb-2">
                    Document #{index + 1}: {blog.id}
                  </h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>Title:</strong> {blog.title || 'No title'}</p>
                    <p><strong>Status:</strong> {blog.status || 'No status'}</p>
                    <p><strong>Created:</strong> {blog.created_at || 'No date'}</p>
                    <p><strong>Category:</strong> {blog.category || 'No category'}</p>
                  </div>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-slate-600 hover:text-slate-900">
                      View full document data
                    </summary>
                    <pre className="mt-2 text-xs bg-slate-50 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(blog, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Documents Found</h3>
              <p className="text-slate-600">
                The 'blogs' collection in your Firebase Firestore is empty.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <a
            href="/blogs"
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Go to Blogs Page
          </a>
          <a
            href="/blogs/new"
            className="text-slate-600 hover:text-slate-900 px-6 py-3 font-medium transition-colors border border-slate-200 rounded-xl hover:border-slate-300"
          >
            Create New Blog
          </a>
        </div>
      </div>
    </div>
  );
} 