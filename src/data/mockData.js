// ============================================================
// CineFlow — Mock Data (Week 1, no API)
// Replace with TMDB API calls in Week 2
// Images: picsum.photos with per-movie seeds (no API key needed)
// ============================================================

// Helper: deterministic portrait (2:3) poster URL
const poster = (seed) => `https://picsum.photos/seed/${seed}/300/450`
// Helper: deterministic landscape backdrop URL
const backdrop = (seed) => `https://picsum.photos/seed/${seed}/1280/720`

export const MOCK_HERO = {
  id: 1,
  title: "Dune: Part Two",
  tagline: "Long live the fighters.",
  overview:
    "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.",
  backdrop_path: backdrop("dune2-hero"),
  poster_path: poster("dune2"),
  vote_average: 8.3,
  release_date: "2024-03-01",
  genres: ["Sci-Fi", "Adventure", "Drama"],
  runtime: 166,
}

export const MOCK_TRENDING = [
  {
    id: 101,
    title: "Oppenheimer",
    poster_path: poster("oppenheimer-2023"),
    vote_average: 8.2,
    release_date: "2023-07-21",
    genre_ids: [18, 36],
  },
  {
    id: 102,
    title: "Poor Things",
    poster_path: poster("poor-things-2023"),
    vote_average: 7.8,
    release_date: "2023-12-08",
    genre_ids: [35, 18],
  },
  {
    id: 103,
    title: "Past Lives",
    poster_path: poster("past-lives-film"),
    vote_average: 7.9,
    release_date: "2023-06-02",
    genre_ids: [10749, 18],
  },
  {
    id: 104,
    title: "The Zone of Interest",
    poster_path: poster("zone-interest"),
    vote_average: 7.4,
    release_date: "2023-12-15",
    genre_ids: [18, 36],
  },
  {
    id: 105,
    title: "Killers of the Flower Moon",
    poster_path: poster("killers-flower-moon"),
    vote_average: 7.6,
    release_date: "2023-10-20",
    genre_ids: [80, 18, 36],
  },
  {
    id: 106,
    title: "Society of the Snow",
    poster_path: poster("society-snow"),
    vote_average: 7.9,
    release_date: "2024-01-04",
    genre_ids: [18, 12],
  },
  {
    id: 107,
    title: "Maestro",
    poster_path: poster("maestro-film"),
    vote_average: 6.8,
    release_date: "2023-12-20",
    genre_ids: [18],
  },
  {
    id: 108,
    title: "Priscilla",
    poster_path: poster("priscilla-2023"),
    vote_average: 6.9,
    release_date: "2023-11-03",
    genre_ids: [18],
  },
]

export const MOCK_POPULAR = [
  {
    id: 201,
    title: "Dune: Part Two",
    poster_path: poster("dune2-popular"),
    vote_average: 8.3,
    release_date: "2024-03-01",
    genre_ids: [878, 12],
  },
  {
    id: 202,
    title: "Deadpool & Wolverine",
    poster_path: poster("deadpool-wolverine"),
    vote_average: 7.8,
    release_date: "2024-07-26",
    genre_ids: [28, 35, 12],
  },
  {
    id: 203,
    title: "Inside Out 2",
    poster_path: poster("inside-out-2"),
    vote_average: 7.6,
    release_date: "2024-06-14",
    genre_ids: [16, 10751, 35],
  },
  {
    id: 204,
    title: "Alien: Romulus",
    poster_path: poster("alien-romulus"),
    vote_average: 7.1,
    release_date: "2024-08-16",
    genre_ids: [27, 878],
  },
  {
    id: 205,
    title: "Twisters",
    poster_path: poster("twisters-2024"),
    vote_average: 7.0,
    release_date: "2024-07-17",
    genre_ids: [28, 12],
  },
  {
    id: 206,
    title: "A Quiet Place: Day One",
    poster_path: poster("quiet-place-day-one"),
    vote_average: 6.9,
    release_date: "2024-06-28",
    genre_ids: [27, 878, 53],
  },
  {
    id: 207,
    title: "Kingdom of the Planet of the Apes",
    poster_path: poster("kingdom-apes"),
    vote_average: 7.0,
    release_date: "2024-05-10",
    genre_ids: [28, 12, 878],
  },
  {
    id: 208,
    title: "The Fall Guy",
    poster_path: poster("fall-guy-2024"),
    vote_average: 7.0,
    release_date: "2024-05-03",
    genre_ids: [28, 35, 10749],
  },
]

export const MOCK_TOP_RATED = [
  {
    id: 301,
    title: "The Shawshank Redemption",
    poster_path: poster("shawshank-redemption"),
    vote_average: 9.3,
    release_date: "1994-09-23",
    genre_ids: [18, 80],
  },
  {
    id: 302,
    title: "The Godfather",
    poster_path: poster("godfather-1972"),
    vote_average: 9.2,
    release_date: "1972-03-24",
    genre_ids: [18, 80],
  },
  {
    id: 303,
    title: "Schindler's List",
    poster_path: poster("schindlers-list"),
    vote_average: 9.0,
    release_date: "1993-12-15",
    genre_ids: [18, 36, 10752],
  },
  {
    id: 304,
    title: "The Dark Knight",
    poster_path: poster("dark-knight-2008"),
    vote_average: 9.0,
    release_date: "2008-07-18",
    genre_ids: [28, 80, 18],
  },
  {
    id: 305,
    title: "12 Angry Men",
    poster_path: poster("twelve-angry-men"),
    vote_average: 9.0,
    release_date: "1957-04-10",
    genre_ids: [18],
  },
  {
    id: 306,
    title: "Pulp Fiction",
    poster_path: poster("pulp-fiction-1994"),
    vote_average: 8.9,
    release_date: "1994-10-14",
    genre_ids: [53, 80],
  },
  {
    id: 307,
    title: "Forrest Gump",
    poster_path: poster("forrest-gump"),
    vote_average: 8.8,
    release_date: "1994-07-06",
    genre_ids: [35, 18, 10749],
  },
  {
    id: 308,
    title: "Inception",
    poster_path: poster("inception-2010"),
    vote_average: 8.8,
    release_date: "2010-07-16",
    genre_ids: [28, 878, 53],
  },
]

export const MOCK_UPCOMING = [
  {
    id: 401,
    title: "Joker: Folie à Deux",
    poster_path: poster("joker-folie-deux"),
    vote_average: 0,
    release_date: "2024-10-04",
    genre_ids: [80, 18],
  },
  {
    id: 402,
    title: "Venom: The Last Dance",
    poster_path: poster("venom-last-dance"),
    vote_average: 0,
    release_date: "2024-10-25",
    genre_ids: [28, 878],
  },
  {
    id: 403,
    title: "Wicked",
    poster_path: poster("wicked-2024"),
    vote_average: 0,
    release_date: "2024-11-22",
    genre_ids: [10402, 10749, 14],
  },
  {
    id: 404,
    title: "Gladiator II",
    poster_path: poster("gladiator-two"),
    vote_average: 0,
    release_date: "2024-11-22",
    genre_ids: [28, 12, 18],
  },
  {
    id: 405,
    title: "Moana 2",
    poster_path: poster("moana-two"),
    vote_average: 0,
    release_date: "2024-11-27",
    genre_ids: [16, 12, 10751],
  },
  {
    id: 406,
    title: "Mufasa: The Lion King",
    poster_path: poster("mufasa-lion-king"),
    vote_average: 0,
    release_date: "2024-12-20",
    genre_ids: [16, 12, 18],
  },
]

// Genre map (TMDB standard)
export const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
}

export const MOCK_WATCHLIST = [MOCK_TRENDING[0], MOCK_POPULAR[1], MOCK_TOP_RATED[3]]
