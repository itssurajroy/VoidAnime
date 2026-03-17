import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, getDocs, deleteDoc, where, orderBy, limit, increment, DocumentSnapshot } from 'firebase/firestore';
import { UserProfile, UserStats, GamificationData } from '@/types/user';
import app from './config';

export const db = getFirestore(app);

// User Profile
export async function getUserProfile(uid: string) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function createUserProfile(uid: string, data: any) {
  await setDoc(doc(db, 'users', uid), {
    profile: { ...data, isPro: false },
    settings: { theme: 'dark', defaultScoreFormat: 'POINT_10', notificationsEnabled: true, listPrivacy: 'public' },
    createdAt: new Date().toISOString()
  });
}

export async function updateUserProfile(uid: string, data: any) {
  await updateDoc(doc(db, 'users', uid), { profile: data });
}

export async function upsertUserProfile(uid: string, data: any) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, { profile: { ...docSnap.data().profile, ...data } });
  } else {
    await createUserProfile(uid, data);
  }
}

// User List (Tracking)
export async function getListEntry(uid: string, anilistId: number) {
  const docRef = doc(db, `lists/${uid}/entries`, anilistId.toString());
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function getUserList(uid: string) {
  const q = query(collection(db, `lists/${uid}/entries`));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateListEntry(uid: string, anilistId: number, data: any) {
  const docRef = doc(db, `lists/${uid}/entries`, anilistId.toString());
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    await updateDoc(docRef, { ...data, 'timestamps.updated': new Date().toISOString() });
  } else {
    await setDoc(docRef, {
      ...data,
      timestamps: { started: new Date().toISOString(), updated: new Date().toISOString(), completed: null }
    });
  }
}

export async function removeListEntry(uid: string, anilistId: number) {
  await deleteDoc(doc(db, `lists/${uid}/entries`, anilistId.toString()));
}

// Activity Feed
export async function addActivityEvent(uid: string, eventData: any) {
  const newEventRef = doc(collection(db, `activity/${uid}/feed`));
  await setDoc(newEventRef, {
    ...eventData,
    createdAt: new Date().toISOString()
  });
}

// Reviews
export async function addReview(uid: string, anilistId: number, reviewData: any) {
  await setDoc(doc(db, `reviews/${uid}/${anilistId}`), {
    ...reviewData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// FCM Subscriptions
export async function updateNotificationSubscription(uid: string, anilistId: number, data: any) {
  await setDoc(doc(db, `notifications/${uid}/subscriptions`, anilistId.toString()), data, { merge: true });
}

// Blog Posts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  authorImage?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  featured: boolean;
  views: number;
}

export async function getBlogPosts(limitNum = 20): Promise<BlogPost[]> {
  const q = query(
    collection(db, 'blog_posts'),
    where('publishedAt', '!=', ''),
    orderBy('publishedAt', 'desc'),
    limit(limitNum)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const q = query(
    collection(db, 'blog_posts'),
    where('featured', '==', true),
    orderBy('publishedAt', 'desc'),
    limit(3)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPost;
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const q = query(
    collection(db, 'blog_posts'),
    where('category', '==', category),
    orderBy('publishedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
}

export async function incrementBlogPostViews(postId: string): Promise<void> {
  const postRef = doc(db, 'blog_posts', postId);
  await updateDoc(postRef, {
    views: increment(1)
  });
}

// User Profile Functions (by username)
export async function getUserProfileByUsername(username: string) {
  const q = query(collection(db, 'users'), where('username', '==', username));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

export async function updateUserStatsAndGamification(uid: string, stats?: Partial<UserStats>, gamification?: Partial<GamificationData>) {
  const userRef = doc(db, 'users', uid);
  const updateData: any = { updatedAt: new Date() };
  if (stats) updateData.stats = stats;
  if (gamification) updateData.gamification = gamification;
  await updateDoc(userRef, updateData);
}

// User List Functions (by status)
export async function getUserListByStatus(uid: string, status?: string, limitNum = 50) {
  let q: any;
  if (status) {
    q = query(collection(db, `lists/${uid}/entries`), where('status', '==', status), limit(limitNum));
  } else {
    q = query(collection(db, `lists/${uid}/entries`), limit(limitNum));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

// User Activity Functions
export async function getUserActivityFeed(uid: string, limitNum = 20) {
  const q = query(
    collection(db, `activity/${uid}/feed`),
    orderBy('createdAt', 'desc'),
    limit(limitNum)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function logUserActivity(uid: string, activity: {
  type: string;
  animeId: number;
  animeTitle: string;
  animeCover: string;
  episode?: number;
  score?: number;
}) {
  const docRef = doc(collection(db, `activity/${uid}/feed`));
  await setDoc(docRef, {
    ...activity,
    createdAt: new Date().toISOString()
  });
}

// Username availability check
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}
