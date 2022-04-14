// this page uses Incremental Static Regeneration
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, collectionGroup, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import PostContent from '../../components/PostContent';

// getStaticProps fetches data on the server at build time
// in order to pre-render page in advance
export async function getStaticProps({params}){
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if(userDoc){
        const postPath = userDoc.ref.path + '/posts';
        const postRef = doc(collection(firestore, postPath), slug);

        post = postToJSON(await getDoc(postRef));
        path = postRef.path;
            
        
    }

    return {
        props: {post, path},
        revalidate: 5000,
    };
}

export async function getStaticPaths(){
    // ToDo Improve by using Admin SDK to select empty docs
    
    const snapshot = await getDocs(collectionGroup(firestore, 'posts'));
    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        
        return{
            params: { username, slug },
        };
    });
    
    return {
        paths,
        fallback: 'blocking',
    }
}

export default function PostPage(props) {
    const postRef = doc(firestore, props.path);
    const [realtimePost] = useDocumentData(postRef); // get feed of data in real time
    
    const post = realtimePost || props.post; // use realtimePost if present otherwise use prerendered post

    return(
        <main>
            <section>
                <PostContent post={post} />
            </section>

            <aside className='card'>
                <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                </p>
            </aside>
        </main>
    )
}