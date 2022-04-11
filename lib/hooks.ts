import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';

/***
 * Custom hook that listen to real-time changes
 * of a user document in firestore and returns the
 * user object and username.
 */
export function useUserData(){
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);
  
    useEffect(()=>{
      // turn off realtime subscription
      let unsubscribe;
  
      if(user){
        const ref = doc(firestore,'users', user.uid);
        // listen to real time changes of the document
        unsubscribe = onSnapshot(ref, (document) => {
          setUsername(document.data()?.username);
        });
      }
      else{
        setUsername(null);
      }
      // React calls unsubscribe function when it is returned
      return unsubscribe;
    }, [user]);

    return { user, username };
}