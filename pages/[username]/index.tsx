import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername, firestore, postToJSON } from "../../lib/firebase";
import { collection, where, query, orderBy, limit, getDocs } from "firebase/firestore";

export async function getServerSideProps(context){
    console.log(context.query);
    const { username } = context.query;
    const userDoc = await getUserWithUsername(username);
    
    let user = null;
    let posts = null;

    if(userDoc){
        user = userDoc.data();
        const postsQuery = query( 
            collection(firestore, userDoc.ref.path + '/posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5));
        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }
    return {
        props: { user, posts }, // will be passed to the page component as props
    }
}

// Server-rendered page
export default function UserProfilePage({ user, posts }) {
    console.log(posts);
    return(
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />

        </main>
    )
}