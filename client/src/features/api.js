import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  tagTypes: ["Movie", "Episode"],
  endpoints: (builder) => ({
    //QUERIES
    getLocation: builder.query({
      query: () => "/location/read",
    }),
    getOMDBData: builder.query({
      query: ({ title, year }) => `/omdb/${title}/${year}`,
    }),
    //----------------------------------------------
    //ChipSlider
    //----------------------------------------------
    getAllMovieGenres: builder.query({
      query: () => "/movies/genres",
      providesTags: ["Movie"],
    }),
    getAllEpisodeGenres: builder.query({
      query: () => "/episodes/genres",
      providesTags: ["Episode"],
    }),
    //----------------------------------------------
    //Preview Hero
    //----------------------------------------------
    getAllMovies: builder.query({
      query: () => "/movies",
      providesTags: ["Movie"],
    }),
    /**sample episode per season*/
    getAllSeasons: builder.query({
      query: () => "/episodes",
      providesTags: ["Episode"],
    }),
    getAllEpisodes: builder.query({
      query: () => "/episodes/all",
      providesTags: ["Episode"],
    }),
    //----------------------------------------------
    //Searchbar
    //----------------------------------------------
    getMoviesBySearch: builder.query({
      query: ({ search, input }) => `/movies/BySearch/${search}/${input}`,
      providesTags: ["Movie"],
    }),
    /**sample episodes*/
    getSeasonsBySeries: builder.query({
      query: (series) => `/episodes/seasons/${series}`,
      providesTags: ["Episode"],
    }),
    //----------------------------------------------
    //Home
    //----------------------------------------------
    getMoviesByGenre: builder.query({
      query: (genre) => `/movies/ByGenre/${genre}`,
      providesTags: ["Movie"],
    }),
    /**sample episodes*/
    getSeasonsByGenre: builder.query({
      query: (genre) => `/episodes/ByGenre/${genre}`,
      providesTags: ["Episode"],
    }),
    //----------------------------------------------
    //Preview
    //----------------------------------------------
    getMovieById: builder.query({
      query: (id) => `/movies/ById/${id}`,
      providesTags: ["Movie"],
    }),
    getEpisodeById: builder.query({
      query: (id) => `/episodes/ById/${id}`,
      providesTags: ["Episode"],
    }),
    getEpisodeBySeason: builder.query({
      query: ({ series, season }) => `/episodes/BySeason/${series}/${season}`,
      providesTags: ["Episode"],
    }),
    getRecentEpisode: builder.query({
      query: ({ series, season }) =>
        `/episodes/BySeason/Recent/${series}/${season}`,
      providesTags: ["Episode"],
    }),

    //MUTATIONS (Editor)
    writeLocation: builder.mutation({
      query: (location) => ({
        url: `/location/write/${location}`,
        method: "POST",
        body: location,
      }),
    }),
    //
    createNewMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "POST",
        body: movie,
      }),
      invalidatesTags: ["Movie"],
    }),
    createNewEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "POST",
        body: episode,
      }),
      invalidatesTags: ["Episode"],
    }),
    //
    updateMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "PUT",
        body: movie,
      }),
      invalidatesTags: ["Movie"],
    }),
    updateEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "PUT",
        body: episode,
      }),
      invalidatesTags: ["Episode"],
    }),
    //
    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/movies/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Movie"],
    }),
    deleteEpisode: builder.mutation({
      query: (id) => ({
        url: `/episodes/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Episode"],
    }),
    //
    copyMovieFiles: builder.mutation({
      query: (movie) => ({
        url: "/movies/files",
        method: "POST",
        body: movie,
      }),
    }),
    copyEpisodeFiles: builder.mutation({
      query: (episode) => ({
        url: "/episodes/files",
        method: "POST",
        body: episode,
      }),
    }),
  }),
});

export const {
  useGetLocationQuery,
  useGetOMDBDataQuery,
  //
  useGetAllMovieGenresQuery,
  useGetAllEpisodeGenresQuery,
  //
  useGetAllMoviesQuery,
  useGetAllSeasonsQuery,
  useGetAllEpisodesQuery,
  //
  useGetMoviesBySearchQuery,
  useGetSeasonsBySeriesQuery,
  //
  useGetMoviesByGenreQuery,
  useGetSeasonsByGenreQuery,
  //
  useGetMovieByIdQuery,
  useGetEpisodeByIdQuery,
  useGetEpisodeBySeasonQuery,
  useGetRecentEpisodeQuery,
  //
  useWriteLocationMutation,
  //
  useCreateNewMovieMutation,
  useCreateNewEpisodeMutation,
  //
  useUpdateMovieMutation,
  useUpdateEpisodeMutation,
  //
  useDeleteMovieMutation,
  useDeleteEpisodeMutation,
  //
  useCopyMovieFilesMutation,
  useCopyEpisodeFilesMutation,
} = api;
