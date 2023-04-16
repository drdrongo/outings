import axios, { AxiosError } from "axios";
import { Movie } from "tmdb-ts";
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "cf11fcf01784e6183be8f7679d3c3885";

const handleError = (error: Error | AxiosError) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      // and an instance of http.ClientRequest in node.js
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error", error.message);
    }
  } else {
    console.error("Error", error);
  }
};

export interface UpcomingMovieData {
  results: Movie[];
  page: number;
  dates: { maximum: string; minimum: string };
}

export const getUpcomingMoviesList: () => Promise<
  Movie[] | void
> = async () => {
  const params = {
    api_key: API_KEY,
    language: "en-US",
  };
  return axios
    .get(`${BASE_URL}/movie/upcoming`, { params })
    .then((response: any) => {
      // .results : [] - array of movie instances
      // .page: 1 integer, which page youre on.
      // .dates: { maximum: '2023-04-30', minimum: '2023-04-15' },
      const { results, page, dates }: UpcomingMovieData = response.data;
      return results;
    })
    .catch(handleError);
};

export const getMovieDetails: (id: number) => Promise<Movie[] | void> = async (
  id
) => {
  const params = { api_key: API_KEY, language: "en-US" };
  return axios
    .get(`${BASE_URL}/movie/${id}`, { params })
    .then((response: any) => {
      return response.data;
    })
    .catch(handleError);
};

// export async function getMovieData(id: string): Promise<MovieData> {
//   const fullPath = path.join(postsDirectory, `${id}.md`);
//   const fileContents = fs.readFileSync(fullPath, "utf8");

//   // Use gray-matter to parse the post metadata section
//   const matterResult = matter(fileContents);

//   // Use remark to convert markdown into HTML string
//   const processedContent = await remark()
//     .use(html)
//     .process(matterResult.content);
//   const contentHtml = processedContent.toString();

//   // Combine the data with the id
//   return {
//     id,
//     contentHtml,
//     ...matterResult.data,
//   };
// }
