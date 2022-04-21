import styles from '../../styles/Admin.module.css';
import MetaTags from "../../components/Metatags";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { collection, query, orderBy, doc, setDoc } from "firebase/firestore";
import { firestore, auth, servertimestamp } from '../../lib/firebase';
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

export default function AdminsPostsPage({}) {
    return(
        <main>
            <AuthCheck>
                <MetaTags 
                title="Admin Page "
                type="website"
                description="Admin page of the nextjs-social media blog"
                image="" />

                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>
    )
}

function PostList(){
    const userPostsPath = `users/${auth.currentUser.uid}/posts`
    const ref = collection(firestore, userPostsPath);
    const postQuery = query(ref, orderBy('createdAt'));

    const [querySnapshot] = useCollection(postQuery);
  
    const posts = querySnapshot?.docs.map((doc) => doc.data());
  
    return (
      <>
        <h1>Manage your Posts</h1>
        <PostFeed posts={posts} admin />
      </>
    );
}

function CreateNewPost(){
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title));

    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createPost = async(e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(collection(firestore, 'users'), uid + '/posts/' + slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# hello world!',
            createdAt: servertimestamp(),
            updatedAt: servertimestamp(),
            heartCount: 0,
          };

        await setDoc(ref, data);
        toast.success('Post created');
        router.push(`/admin/${slug}`);
    }
    return (
        <form onSubmit={createPost}>
        <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Article!"
            className={styles.input}
        />
        <p>
            <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-green">
            Create New Post
        </button>
        </form>
    );
}