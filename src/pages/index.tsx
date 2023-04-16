import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import utilStyles from "@/styles/utils.module.css";
import Link from "next/link";
import Date from "@/components/Date";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import { getUpcomingMoviesList } from "@/lib/outings";
import { Movie } from "tmdb-ts";
import listStyles from "@/styles/movieList.module.css";
import { Star } from "@mui/icons-material";
import Layout from "@/components/Layout";

interface Props {
  upcomingMoviesData: Movie[];
}

export async function getStaticProps() {
  const upcomingMoviesData = await getUpcomingMoviesList();
  if (upcomingMoviesData) {
    return {
      props: {
        upcomingMoviesData,
      },
      revalidate: 60 * 60, // 1 hour in seconds
    };
  } else {
    return {
      props: {},
      revalidate: 60 * 60, // 1 hour in seconds
    };
  }
}

export default function Home({ upcomingMoviesData }: Props) {
  return (
    <>
      <Head>
        {/* <title>Create Next App</title> */}
        <title>HAYATO NEXT</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Banner />

        <main className={styles.main}>
          <div className={listStyles.headerBox}>
            <h3 className={listStyles.header}>Upcoming Movies</h3>
          </div>
          <ul className={listStyles.movieList}>
            {upcomingMoviesData.map(
              ({ id, title, poster_path, vote_average }) => (
                <li className={listStyles.movie} key={id}>
                  <Link
                    href={`/movies/${id}`}
                    className={listStyles.movieOverlay}
                  >
                    <h5 className={listStyles.title}>{title}</h5>
                    <br />
                    {/* <small className={utilStyles.lightText}> */}
                    {/* {date ? <Date dateString={date} /> : '---'} */}
                    {/* </small> */}
                    <p className={listStyles.vote}>
                      <Star className={listStyles.voteStar} />
                      <span className={listStyles.voteNumber}>
                        {vote_average}
                      </span>
                    </p>
                  </Link>
                  <Image
                    className={listStyles.image}
                    src={`https://image.tmdb.org/t/p/original${poster_path}`}
                    height={750}
                    width={500}
                    // fill={true}
                    alt={`Poster for ${title}`}
                  />
                </li>
              )
            )}
          </ul>
        </main>
      </Layout>
    </>
  );
}

/*

HOMEPAGE:
Have a list of all the latest movies.
1. Load up the static html document.
2. Load up the movies from the "latest" Api.

navbar (logo, search, favorites)
banner image
grid of movies (latest)
Footer - banner
Footer - sitemap
Footer - info



Grid template 

NAVBAR:
1. Logo which links to index (list of movies)
2. Favorites section
3. Searchbar
4. Logout or something? 

FOOTER:
1. Copyright and author information
2. Translation button
3. Sitemap?




IDEA:
In local storage, generate and hold the user's id.
You can use that id to get information based in an excel sheet or something.
json file in vercel can apparently read info on users.
*/
