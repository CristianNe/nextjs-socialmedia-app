import Head from "next/head";

export default function MetaTags({title, type, description, image}){
    let img = (image !== "") ? image : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/414px-Nextjs-logo.svg.png";
    return (
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@CristianNeufuss" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={img} />

            <meta property="og:title" content={title} />
            <meta property="og:type" content={type} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={img} />
        </Head>
    )
}