import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import MovieList from "./Components/MovieList";
import MovieListHeading from "./Components/MovieListHeading";
import SearchBox from "./Components/SearchBox";
import AddFavorites from "./Components/AddFavorites";
import RemoveFavorite from "./Components/RemoveFavorite";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const getMovieRequest = async (searchValue) => {
      const apiKey = process.env.REACT_APP_OMDB_APIKEY;
      const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=${apiKey}`;
      const response = await fetch(url);
      const responseJson = await response.json();
      if (responseJson.Search) setMovies(responseJson.Search);
    };

    getMovieRequest(searchValue);
  }, [searchValue])

  useEffect(() => {
		const favoriteMovies = JSON.parse(localStorage.getItem('react-movie-app-favorites'));
		if (favoriteMovies) setFavorites(favoriteMovies);
	}, []);

  const saveToLocal = (items) => {
    localStorage.setItem("react-movie-app-favorites", JSON.stringify(items));
  }

  const addFavoriteMovie = (movie) => {
    const newFavoriteList = [...favorites, movie];
    setFavorites(newFavoriteList);
    saveToLocal(newFavoriteList);
  }

  const removeFavoriteMovie = (movie) => {
    const newFavoriteList = favorites.filter((fav) => fav.imdbID !== movie.imdbID)
    setFavorites(newFavoriteList);
    saveToLocal(newFavoriteList);
  }

  return (
    <div className="container-fluid movie-app">
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Movies" />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className="row">
        <MovieList 
        movies={movies}
        handleFavoritesClick={addFavoriteMovie}
        favoriteComponent={AddFavorites}
        />
      </div>
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Favorites" />
      </div>
      <div className="row">
        <MovieList 
          movies={favorites}
          handleFavoritesClick={removeFavoriteMovie}
          favoriteComponent={RemoveFavorite}
        />
      </div>
    </div>
  );
}

export default App;
