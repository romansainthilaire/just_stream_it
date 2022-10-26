/* jshint esversion: 6 */

// Navbar
const justStreamItLogo = document.querySelector("#juststreamit-logo");
const home = document.querySelector("#home");
const dropdownContent = document.querySelector(".dropdown__content");

// Genre title
const selectedGenre = document.querySelector("#selected-genre");

// Carousels
const carousels = document.querySelectorAll('.carousel'); 

// Movie posters
const moviePosters = document.querySelectorAll(".movie-poster");
const bestMoviePoster = document.querySelector(".best-movie .movie-poster");
const bestMoviesPosters = document.querySelectorAll(".best-movies .movie-poster");
const popularMoviesPosters = document.querySelectorAll(".popular-movies .movie-poster");
const unpopularButGoodMoviesPosters = document.querySelectorAll(".unpopular-but-good-movies .movie-poster");
const bestFrenchMoviesPosters = document.querySelectorAll(".best-french-movies .movie-poster");
const recentMoviesPosters = document.querySelectorAll(".recent-movies .movie-poster");
const oldButGoldMoviesPosters = document.querySelectorAll(".old-but-gold-movies .movie-poster");

// Best movie
const bestMovieTitle = document.querySelector(".best-movie__title");
const bestMovieDescription = document.querySelector(".best-movie__description");
const bestMovieButton = document.querySelector(".best-movie__button");

// Modal
const modal = document.querySelector(".modal");
const modalCloseButton = document.querySelector(".modal__close-button");
const modalMovieTitle = document.querySelector(".modal__movie-title");
const modalMovieYear = document.querySelector(".modal__movie-year");
const modalMovieDuration = document.querySelector(".modal__movie-duration");
const modalMovieLongDescription = document.querySelector(".modal__movie-long-description");
const modalMoviePoster = document.querySelector(".modal .movie-poster");
const modalMovieGenres = document.querySelector(".modal__movie-genres");
const modalMovieRated = document.querySelector(".modal__movie-rated");
const modalMovieImdbScore = document.querySelector(".modal__movie-imdb-score");
const modalMovieVotes = document.querySelector(".modal__movie-votes");
const modalMovieDirectors = document.querySelector(".modal__movie-directors");
const modalMovieActors = document.querySelector(".modal__movie-actors");
const modalMovieCountries = document.querySelector(".modal__movie-countries");
const modalMovieGrossIncome = document.querySelector(".modal__movie-gross-income");
const modalMovieReleaseDate = document.querySelector(".modal__movie-release-date");

// URLs
const baseUrl = "http://127.0.0.1:8000/api/v1";
const genresUrl = `${baseUrl}/genres/`;
const titlesUrl = `${baseUrl}/titles/`;

// Movies endpoints
const bestMoviesEndpoint = "sort_by=-imdb_score";
const popularMoviesEndpoint = "sort_by=-votes";
const unpopularButGoodMoviesEndpoint = "imdb_score_min=8&sort_by=votes";
const bestFrenchMoviesEndpoint = "country=France&lang=French&sort_by=-imdb_score";
const recentMoviesEndpoint = "sort_by=-year";
const oldButGoldMoviesEndpoint = "imdb_score_min=8&sort_by=year";

function createGenresDropdown() {
    /**
     * Creates a dropdown menu with all movie genres.
     */
    axios
    .get(genresUrl)
    .then(function(response) {
        let genres = response.data.results;
        genres.forEach(genre => {
            axios
            .get(`${titlesUrl}?genre=${genre.name}&${bestFrenchMoviesEndpoint}`)
            .then(function (response) {
                if (response.data.count > 10) {  // a genre must be associated with at least 10 movies
                    const genreLink = document.createElement("div");
                    genreLink.innerText = genre.name;
                    genreLink.className = "genre";
                    dropdownContent.append(genreLink);
                }
                const genreLinks = document.querySelectorAll(".dropdown__content .genre");
                genreLinks.forEach(genreLink => {
                    genreLink.addEventListener("click", function() {
                        genre = genreLink.innerText;
                        setMoviesByGenre(genre);
                    });
                });
            });
        });
    });
}

function openModal() {
    /**
     * Displays the modal.
     */
    modal.style.display = 'block';
}

function closeModal() {
    /**
     * Hides the modal.
     */
    modal.style.display = 'none';
}

function setModalInfo(movie) {
    /**
     * Sets movie details inside the modal.
     */
    modalMovieTitle.innerText = movie.title;
    modalMovieYear.innerText = movie.year;
    modalMovieDuration.innerText = movie.duration;
    modalMovieLongDescription.innerText = movie.long_description;
    modalMoviePoster.src = movie.image_url;
    modalMoviePoster.alt = movie.title;
    modalMovieGenres.innerText = `Genre${movie.genres.length > 1 ? 's' : ''} : ` +
    movie.genres.toString().replaceAll(",", ", ").toLowerCase();
    modalMovieRated.innerText = `Rated : ${movie.rated}`;
    modalMovieImdbScore.innerText = `IMDB Score : ${movie.imdb_score}`;
    modalMovieVotes.innerText = `Votes : ${movie.votes.toLocaleString('fr-FR')}`;
    modalMovieDirectors.innerText = `Director${movie.directors.length > 1 ? 's' : ''} : ` +
    movie.directors.toString().replaceAll(",", ", ");
    modalMovieActors.innerText = `Actor${movie.actors.length > 1 ? 's' : ''} : ` +
    movie.actors.toString().replaceAll(",", ", ");
    modalMovieCountries.innerText = `Countr${movie.countries.length > 1 ? 'ies' : 'y'} : ` +
    movie.countries.toString().replaceAll(",", ", ");
    modalMovieGrossIncome.innerText = "Gross Income : " +
    `${movie.worldwide_gross_income == null ? "unknown" : movie.worldwide_gross_income.toLocaleString('fr-FR') + " $"}`;
    modalMovieReleaseDate.innerText = `Release Date : ${movie.date_published}`;
}

function setBestMovie(bestMoviesUrl) {
    /**
     * Sets best movie information.
     */
    axios
    .get(bestMoviesUrl)
    .then(function(response) {
        const bestMovieId = response.data.results[0].id;
        axios
        .get(`${titlesUrl}${bestMovieId}`)
        .then(function(response) {
            const bestMovie = response.data;
            bestMovieTitle.innerText = bestMovie.title;
            bestMoviePoster.src = bestMovie.image_url;
            bestMoviePoster.alt = bestMovie.title;
            bestMovieDescription.innerText = bestMovie.description;
            const bestMovieModalTriggers = [bestMoviePoster, bestMovieButton];
            bestMovieModalTriggers.forEach(trigger => {
                trigger.addEventListener("click", function() {
                    openModal();
                    setModalInfo(bestMovie);     
                });
            });
        });
    });
}

function setCarouselMovies(moviesUrl, moviePosters) {
    /**
     * Sets movie posters for all carousels.
     */
    const numberOfMovies = Math.min(moviePosters.length, 10); // 5 movies per page, 2 pages max
    const moviesUrlPage1 = moviesUrl + "&page=1";
    const moviesUrlPage2 = moviesUrl + "&page=2";
    axios
    .all([axios.get(moviesUrlPage1), axios.get(moviesUrlPage2)])
    .then(axios.spread((...responses) => {
            const moviesPage1 = responses[0].data.results;
            const moviesPage2 = responses[1].data.results;
            let movieIds = [];
            moviesPage1.forEach(movie => {
                movieIds.push(movie.id);
            });
            moviesPage2.forEach(movie => {
                movieIds.push(movie.id);
            });
            movieIds.forEach(function (movieId, index) {
                axios
                .get(`${titlesUrl}${movieId}`)
                .then(function(response) {
                    const movie = response.data;
                    if (index < numberOfMovies) {
                        const moviePoster = moviePosters[index];
                        moviePoster.src = movie.image_url;
                        moviePoster.alt = movie.title;
                        moviePoster.addEventListener("click", function() {
                            openModal();
                            setModalInfo(movie);      
                        });
                    }
                });
            });
    }));
}

function setMoviesByGenre(genre=null) {
    /**
     * Sets all movies (best movie and carousel movies) by genre.
     */
    selectedGenre.innerText = genre == null ? "All genres" : genre;
    const titlesByGenreUrl = genre == null ? `${titlesUrl}?` : `${titlesUrl}?genre=${genre}&`;
    const bestMoviesUrl = titlesByGenreUrl + bestMoviesEndpoint;
    const popularMoviesUrl = titlesByGenreUrl + popularMoviesEndpoint;
    const unpopularButGoodMoviesUrl = titlesByGenreUrl + unpopularButGoodMoviesEndpoint;
    const bestFrenchMoviesUrl = titlesByGenreUrl + bestFrenchMoviesEndpoint;
    const recentMoviesUrl = titlesByGenreUrl + recentMoviesEndpoint;
    const oldButGoldMoviesUrl = titlesByGenreUrl + oldButGoldMoviesEndpoint;
    setBestMovie(bestMoviesUrl);
    setCarouselMovies(bestMoviesUrl, bestMoviesPosters);
    setCarouselMovies(popularMoviesUrl, popularMoviesPosters);
    setCarouselMovies(unpopularButGoodMoviesUrl, unpopularButGoodMoviesPosters);
    setCarouselMovies(bestFrenchMoviesUrl, bestFrenchMoviesPosters);
    setCarouselMovies(recentMoviesUrl, recentMoviesPosters);
    setCarouselMovies(oldButGoldMoviesUrl, oldButGoldMoviesPosters);
}

function getVisibleMoviePosterNb() {
    /**
     * Gets the number of visible movie posters according to the size of the window.
     */
    if (window.innerWidth < 750) {
        return 1;
    } else if (window.innerWidth < 1200) {
        return 2;
    } else if (window.innerWidth < 1400) {
        return 3;
    } else {
        return 4;
    }
}

function setCarousels() {
    /**
     * Sets all carousels.
     */
    carousels.forEach(carousel => {
        const containerWidth = carousel.querySelector(".carousel__container").offsetWidth;
        const moviePosterList = carousel.querySelector(".carousel__movie-poster-list");
        const moviePosters = carousel.querySelectorAll('.movie-poster');
        const moviePosterWidth = moviePosters[0].offsetWidth;
        const visibleMoviePosterNb = getVisibleMoviePosterNb();
        const moviePosterMargin = (containerWidth - visibleMoviePosterNb * moviePosterWidth) / (2 * visibleMoviePosterNb);
        moviePosters.forEach(moviePoster => {
            moviePoster.style.margin = `0 ${moviePosterMargin}px`;
        });
        moviePosterList.style.transform = window.innerWidth < 750 ? `translateX(0px)`: `translateX(-5px)`;
        let steps = 0;
        const prevButton = carousel.querySelectorAll(".carousel__button")[0];
        const nextButton = carousel.querySelectorAll(".carousel__button")[1];
        nextButton.addEventListener("click", function() {
            const visibleMoviePosterNb = getVisibleMoviePosterNb();
            if (steps < moviePosters.length - visibleMoviePosterNb) {
                steps++;
                moveMoviePosterList();
            }
        });
        prevButton.addEventListener("click", function() {
            if (steps > 0) {
                steps--;
                moveMoviePosterList();
            }
        });
        function moveMoviePosterList() {
            moviePosterList.style.transform = `translateX(-${(moviePosterWidth + 2 * moviePosterMargin + 4) * steps}px)`;
        }  
    });
}

// Genres dropdown is created
createGenresDropdown();
// Movies are displayed for all genres
setMoviesByGenre();
// Carousels are initialized
setCarousels();

// Sets default movie poster if image_url not found
moviePosters.forEach(moviePoster => {
    moviePoster.addEventListener("error", function() {
        moviePoster.src = "img/default-movie-poster.png";
        moviePoster.alt = "Default movie poster";
    });
});

// Shows all genres when logo is clicked
home.addEventListener("click", function() {
    setMoviesByGenre();
});

// Shows all genres when home is clicked
justStreamItLogo.addEventListener("click", function() {
    setMoviesByGenre();
});

// Closes modal if close button is clicked
modalCloseButton.addEventListener('click', closeModal);

// Closes modal if clic outside
window.addEventListener('click', function(e) {
    if (e.target == modal) {
        closeModal();
    }
});

// Sets carousels when resize
window.addEventListener("resize", function() {
    setCarousels();
});
