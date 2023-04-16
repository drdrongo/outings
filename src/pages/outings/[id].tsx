import utilStyles from "@/styles/utils.module.css";
import Layout from "@/components/Layout";
import Link from "next/link";
import Head from "next/head";
import Date from "@/components/Date";
import { Movie } from "tmdb-ts";
import { getMovieDetails } from "@/lib/outings";
import Image from "next/image";

export default function MovieDetail({ movieData }: { movieData: Movie }) {
  if (!movieData) return null;

  const { title, id, poster_path, overview } = movieData;
  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>

      <h2>{title}</h2>
      <br />
      {id}
      <br />
      <Image
        src={`https://image.tmdb.org/t/p/original${poster_path}`}
        height={60}
        width={40}
        alt={`Poster for ${title}`}
      />

      <br />
      <p>{overview}</p>
      <br />

      <Link href="/">{"<="} Back to Home</Link>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: ["/movies/*"],
    // fallback: true, false or "blocking" // See the "fallback" section below
    fallback: true,
  };
}

// Fetch necessary data for the blog post using params.id
export async function getStaticProps({ params }: { params: any }) {
  const movieData = await getMovieDetails(params.id);
  return {
    props: {
      movieData,
    },
  };
}
