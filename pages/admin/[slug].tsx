import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, servertimestamp } from '../../lib/firebase';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData, useDocumentOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { collection, doc, updateDoc } from 'firebase/firestore';

export default function AdminPostEdit(props) {
    return(
        <main>
            <AuthCheck>
                <PostManager />
            </AuthCheck>
            
        </main>
    );
}

function PostManager(){
    // state variable to check whether in preview mode or not
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;

    const userPostsPath = `users/${auth.currentUser.uid}/posts`
    const postRef = doc(collection(firestore, userPostsPath), slug.toString());
    
    const [post] = useDocumentData(postRef);
    

    return (
        <main className={styles.container}>
            {post && (
                <>
                <section>
                    <h1>{post.title}</h1>
                    <p>ID: {post.slug}</p>

                    <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                </section>

                <aside>
                <h3>Tools</h3>
                    <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                    <Link href={`/${post.username}/${post.slug}`}>
                    <button className="btn-blue">Live view</button>
                    </Link>
                </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview}){
    const { register, handleSubmit, reset, watch, formState: {errors}, formState } = useForm({ defaultValues, mode: 'onChange' });
    const { isValid, isDirty } = formState;
    console.log('isValid: ' , isValid);
    console.log('isDirty: ' , isDirty);
    

    const updatePost = async({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            updatedAt: servertimestamp()
        });

        reset({ content, published });
        toast.success('Post updated successfully!');
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
        
                <textarea {...register("content", {
                    maxLength: { value: 20000, message: 'content is too long' },
                    minLength: { value: 10, message: 'content is too short' },
                    required: { value: true, message: 'content is required' },
                })}></textarea>

                <fieldset>
                <input className={styles.checkbox} name="published" type="checkbox" {...register("published")} />
                <label>Published</label>
                </fieldset>

                {errors.content && <p className='text-danger'>{errors.content.message}</p>}

                <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
                Save Changes
                </button>
            </div>
        </form>
    )
}