import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, googleAuthProvider, firestore } from "../lib/firebase";
import debounce from 'lodash.debounce';

export default function EnterPage(props) {
    const { user, username } = useContext(UserContext);

    return(
        <main>
            {user ?
                !username ? <UsernameForm /> : <SignOutButton />
                : <SignInButton />
            }
        </main>
    )
}

// Sign in with Google
function SignInButton(){
    const signInWithGoogle = async () =>{
        try{
            await signInWithPopup(auth, googleAuthProvider);
        }catch(error){
            console.error('Error in SignInWithGoogle()');
            console.error(error);
        }
    }
    
    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google-logo.png'} />
            Sign in with Google
        </button>
    )
}

function SignOutButton(){
    return <button onClick={()=> auth.signOut()}>Sign Out</button>
}

function UsernameForm(){
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setIsLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3){
            setFormValue(val);
            setIsLoading(false);
            setIsValid(false);
        }

        if(re.test(val)){
            setFormValue(val);
            setIsLoading(true);
            setIsValid(false);
        }


    };

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3){
                const ref = doc(firestore, `usernames/${username}`);
                const refSnap = await getDoc(ref);
                console.log('Firestore read executed');
                setIsValid(!refSnap.exists());
                setIsLoading(false);
            }
        }, 500),
        []
    );

    const onSubmit = async (e) => {
        e.preventDefault();
        try{
            // Create refs for both documents
            const userDoc = doc(firestore, `users/${user.uid}`);
            const usernameDoc = doc(firestore, `usernames/${formValue}`);
    
            // Commit both docs together as a batch write
            const batch = writeBatch(firestore);
            batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
            batch.set(usernameDoc, { uid: user.uid });
    
            await batch.commit();

        }catch(error){
            console.error(error);
        }
    }

    return (
        !username && (
          <section>
              <h3>Choose Username</h3>
              <form onSubmit={onSubmit}>
                <input name="username" placeholder="username" value={formValue} onChange={onChange} />

                <UsernameMessage username={formValue} isValid={isValid} isLoading={loading} />
                <button type="submit" className="btn-green" disabled={isValid}>
                    Choose
                </button>

                <h3>Debug State</h3>
                <div>
                    Username: {formValue}
                    <br />
                    Loading: {loading.toString()}
                    <br />
                    Username Valid: {isValid.toString()}
                </div>
              </form>
          </section>  
        )
    );
}

function UsernameMessage({ username, isValid, isLoading }){
    if (isLoading) {
        return <p>Checking...</p>;
      } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
      } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
      } else {
        return <p></p>;
      }
}