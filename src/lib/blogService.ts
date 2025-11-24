import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { Blog, BlogFormData, BlogListItem } from '../types/blog';

const BLOGS_COLLECTION = 'blogs';

// Slug oluşturma fonksiyonu
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Tüm blogları getir - Basit query index olmadan
export const getAllBlogs = async (): Promise<BlogListItem[]> => {
  try {
    console.log('🔥 getAllBlogs: Starting to fetch blogs...');
    const blogsCollection = collection(db, BLOGS_COLLECTION);
    
    // Basit query - sadece collection'ı al, orderBy olmadan
    const querySnapshot = await getDocs(blogsCollection);
    console.log('📊 getAllBlogs: Query snapshot size:', querySnapshot.size);
    
    const blogs = querySnapshot.docs.map(doc => {
      console.log('📄 getAllBlogs: Blog document:', doc.id, doc.data());
      return {
        id: doc.id,
        ...doc.data()
      };
    }) as BlogListItem[];
    
    // Client-side'da sıralama yap
    const sortedBlogs = blogs.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Desc order
    });
    
    console.log('✅ getAllBlogs: Returning', sortedBlogs.length, 'blogs');
    return sortedBlogs;
  } catch (error) {
    console.error('❌ getAllBlogs: Error fetching blogs:', error);
    throw error;
  }
};

// Real-time listener for all blogs - Basit query
export const subscribeToBlogs = (callback: (blogs: BlogListItem[]) => void): Unsubscribe => {
  console.log('🔥 subscribeToBlogs: Starting real-time listener...');
  const blogsCollection = collection(db, BLOGS_COLLECTION);
  
  // Basit query - sadece collection'ı dinle
  return onSnapshot(blogsCollection, (querySnapshot) => {
    console.log('📊 subscribeToBlogs: Snapshot size:', querySnapshot.size);
    
    const blogs = querySnapshot.docs.map(doc => {
      console.log('📄 subscribeToBlogs: Blog document:', doc.id, doc.data());
      return {
        id: doc.id,
        ...doc.data()
      };
    }) as BlogListItem[];
    
    // Client-side'da sıralama yap
    const sortedBlogs = blogs.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Desc order
    });
    
    console.log('✅ subscribeToBlogs: Calling callback with', sortedBlogs.length, 'blogs');
    callback(sortedBlogs);
  }, (error) => {
    console.error('❌ subscribeToBlogs: Error in subscription:', error);
  });
};

// Yayınlanmış blogları getir - Index olmadan basit sorgu
export const getPublishedBlogs = async (): Promise<BlogListItem[]> => {
  try {
    const blogsCollection = collection(db, BLOGS_COLLECTION);
    // Sadece status filtresini uygula
    const q = query(blogsCollection, where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    
    const blogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogListItem[];
    
    // Client-side'da sıralama yap
    const sortedBlogs = blogs.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Desc order
    });
    
    return sortedBlogs;
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    throw error;
  }
};

// Real-time listener for published blogs - Index hatası için geçici çözüm
export const subscribeToPublishedBlogs = (callback: (blogs: BlogListItem[]) => void): Unsubscribe => {
  const blogsCollection = collection(db, BLOGS_COLLECTION);
  // Önce sadece status filtresi yapalım
  const q = query(
    blogsCollection, 
    where('status', '==', 'published')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const blogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogListItem[];
    
    // Client-side'da sıralama yap
    const sortedBlogs = blogs.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Desc order
    });
    
    callback(sortedBlogs);
  }, (error) => {
    console.error('Error in published blogs subscription:', error);
  });
};

// ID ile blog getir
export const getBlogById = async (id: string): Promise<Blog | null> => {
  try {
    const blogDoc = doc(db, BLOGS_COLLECTION, id);
    const docSnap = await getDoc(blogDoc);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Blog;
    }
    return null;
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    throw error;
  }
};

// Real-time listener for a single blog
export const subscribeToBlog = (id: string, callback: (blog: Blog | null) => void): Unsubscribe => {
  const blogDoc = doc(db, BLOGS_COLLECTION, id);
  
  return onSnapshot(blogDoc, (docSnap) => {
    if (docSnap.exists()) {
      const blog = {
        id: docSnap.id,
        ...docSnap.data()
      } as Blog;
      callback(blog);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error in blog subscription:', error);
    callback(null);
  });
};

// Slug ile blog getir
export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  try {
    const blogsCollection = collection(db, BLOGS_COLLECTION);
    const q = query(blogsCollection, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Blog;
    }
    return null;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    throw error;
  }
};

// Yeni blog oluştur
export const createBlog = async (blogData: BlogFormData): Promise<string> => {
  try {
    const slug = generateSlug(blogData.title);
    const now = serverTimestamp();
    const nowMillis = Date.now();
    
    const newBlog: any = {
      title: blogData.title,
      en_title: blogData.en_title,
      pl_title: blogData.pl_title,
      excerpt: blogData.excerpt,
      en_excerpt: blogData.en_excerpt,
      pl_excerpt: blogData.pl_excerpt,
      content: blogData.content,
      en_content: blogData.en_content,
      pl_content: blogData.pl_content,
      tags: blogData.tags,
      coverImage: blogData.coverImage,
      slug,
      createdAt: now,
      updatedAt: nowMillis,
      oldSlugs: []
    };

    // Status yönetimi: Yayında seçilirse 'published', diğer tüm statuslar 'hidden' olarak gönderilir
    if (blogData.status === 'published') {
      newBlog.status = 'published';
    } else {
      // draft ve archived dahil diğer tüm statuslar hidden olarak gönderilir
      newBlog.status = 'hidden';
    }

    const docRef = await addDoc(collection(db, BLOGS_COLLECTION), newBlog);
    console.log('✅ Blog Firebase\'e kaydedildi, ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Blog oluşturma hatası:', error);
    throw error;
  }
};

// Blog güncelle
export const updateBlog = async (id: string, blogData: Partial<BlogFormData>): Promise<void> => {
  try {
    const blogDoc = doc(db, BLOGS_COLLECTION, id);
    const updateData: any = {
      ...blogData,
      updatedAt: Date.now()
    };

    // Eğer title değişiyorsa slug'ı da güncelle
    if (blogData.title) {
      updateData.slug = generateSlug(blogData.title);
    }

    // Status yönetimi: Yayında seçilirse 'published', diğer tüm statuslar 'hidden' olarak gönderilir
    if (blogData.status !== undefined) {
      if (blogData.status === 'published') {
        updateData.status = 'published';
      } else {
        // draft ve archived dahil diğer tüm statuslar hidden olarak gönderilir
        updateData.status = 'hidden';
      }
    }

    await updateDoc(blogDoc, updateData);
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

// Blog sil
export const deleteBlog = async (id: string): Promise<void> => {
  try {
    const blogDoc = doc(db, BLOGS_COLLECTION, id);
    await deleteDoc(blogDoc);
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

// Blog görüntülenme sayısını artır
export const incrementViewCount = async (id: string): Promise<void> => {
  try {
    const blogDoc = doc(db, BLOGS_COLLECTION, id);
    await updateDoc(blogDoc, {
      view_count: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
};

// Blog beğeni sayısını artır
export const incrementLikeCount = async (id: string): Promise<void> => {
  try {
    const blogDoc = doc(db, BLOGS_COLLECTION, id);
    await updateDoc(blogDoc, {
      like_count: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing like count:', error);
    throw error;
  }
};

// Kategoriye göre blogları getir
export const getBlogsByCategory = async (category: string): Promise<BlogListItem[]> => {
  try {
    const blogsCollection = collection(db, BLOGS_COLLECTION);
    const q = query(
      blogsCollection,
      where('category', '==', category),
      where('status', '==', 'published'),
      orderBy('published_at', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogListItem[];
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    throw error;
  }
}; 