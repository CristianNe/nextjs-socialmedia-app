// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, limit, getDocs, QueryDocumentSnapshot } from'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZkZWd_2_u2Ch1WuiMInBgIV_0MKkBsnM",
  authDomain: "nextjs-socialmedia-app.firebaseapp.com",
  projectId: "nextjs-socialmedia-app",
  storageBucket: "nextjs-socialmedia-app.appspot.com",
  messagingSenderId: "964777816107",
  appId: "1:964777816107:web:48a1625e80f3eb09f77a6e",
  measurementId: "G-WVEQ25HK30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
auth.languageCode = 'it'; // applies default browser preference
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 * @returns {QueryDocumentSnapshot} userDoc
 */
 export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, 'users');
  const userQuery = query(usersRef, where('username', '==', username), limit(1));
  const userDoc = (await getDocs(userQuery)).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
 export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}