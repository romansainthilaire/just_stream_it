// Navbar
const justStreamItLogo = document.querySelector("#juststreamit-logo");
const home = document.querySelector("#home");
const dropdownContent = document.querySelector(".dropdown__content");

// Genre
const genreTitle = document.querySelector("#genre")

// Movie posters
const allMoviePosters = document.querySelectorAll(".movie-poster")
const bestMoviePoster = document.querySelector(".best-movie .movie-poster");
const bestMoviesPosters = document.querySelectorAll(".best-movies .movie-poster")
const popularMoviesPosters = document.querySelectorAll(".popular-movies .movie-poster")
const unpopularButGoodMoviesPosters = document.querySelectorAll(".unpopular-but-good-movies .movie-poster")
const bestFrenchMoviesPosters = document.querySelectorAll(".best-french-movies .movie-poster")
const recentMoviesPosters = document.querySelectorAll(".recent-movies .movie-poster")
const oldButGoldMoviesPosters = document.querySelectorAll(".old-but-gold-movies .movie-poster")

// Best movie
const bestMovieTitle = document.querySelector(".best-movie__title");
const bestMovieDescription = document.querySelector(".best-movie__description");
const bestMovieButton = document.querySelector(".best-movie__button");

// Modal
const modal = document.querySelector(".modal")
const modalCloseButton = document.querySelector(".modal__close-button")
const modalMovieTitle = document.querySelector(".modal__movie-title")
const modalMovieYear = document.querySelector(".modal__movie-year")
const modalMovieDuration = document.querySelector(".modal__movie-duration")
const modalMovieLongDescription = document.querySelector(".modal__movie-long-description")
const modalMoviePoster = document.querySelector(".modal .movie-poster")
const modalMovieGenres = document.querySelector(".modal__movie-genres")
const modalMovieRated = document.querySelector(".modal__movie-rated")
const modalMovieImdbScore = document.querySelector(".modal__movie-imdb-score")
const modalMovieVotes = document.querySelector(".modal__movie-votes")
const modalMovieDirectors = document.querySelector(".modal__movie-directors")
const modalMovieActors = document.querySelector(".modal__movie-actors")
const modalMovieCountries = document.querySelector(".modal__movie-countries")
const modalMovieBudget = document.querySelector(".modal__movie-budget")
const modalMovieReleaseDate = document.querySelector(".modal__movie-release-date")

// URLs
const baseUrl = "http://127.0.0.1:8000/api/v1";
const genresUrl = `${baseUrl}/genres/`;
const titlesUrl = `${baseUrl}/titles/`;
const numberOfMoviesPerPage = 5





genre = null;














allMoviePosters.forEach(moviePoster => {
    moviePoster.addEventListener("error", function() {
        moviePoster.src = "img/default-movie-poster.png";
        moviePoster.alt = "Default movie poster";
    });
})

// Open modal
function openModal() {
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Close modal if close button is clicked
modalCloseButton.addEventListener('click', closeModal);

// Close modal if clic outside
window.addEventListener('click', function(e) {
    if (e.target == modal) {
        closeModal();
    }
});





// Create genres dropdown
axios
.get(genresUrl)
.then(function(response) {
    let genres = response.data.results;
    genres.forEach(genre => {
        axios
        .get(`${titlesUrl}?genre=${genre["name"]}&imdb_score_min=7`)
        .then(function (response) {
            if (response.data["count"] > 7) { // A genre must be associated with at least 8 movies
                genre_link = document.createElement("span");
                genre_link.innerText = genre["name"];
                dropdownContent.append(genre_link);
            }
            genre_links = document.querySelectorAll(".dropdown__content span")
            genre_links.forEach(genre_link => {
                genre_link.addEventListener("click", function() {
                    genre = genre_link.innerText;
                    showMoviesByGenre(genre);
                })
            })
        })
    })
})

// Show all genres when home is clicked
justStreamItLogo.addEventListener("click", function() {
    genre = null;
    showMoviesByGenre(genre);
})

// Show all genres when logo is clicked
home.addEventListener("click", function() {
    genre = null;
    showMoviesByGenre(genre);
})

showMoviesByGenre(genre);

// Show movies by genre
function showMoviesByGenre(genre=null) {

    // Set genre title
    genreTitle.innerText = genre == null ? "All genres" : genre;

    // Set URLs
    const titlesByGenreUrl = genre == null ? `${titlesUrl}?` : `${titlesUrl}?genre=${genre}&`
    const bestMoviesUrl = `${titlesByGenreUrl}sort_by=-imdb_score`;
    const popularMoviesUrl = `${titlesByGenreUrl}sort_by=-votes`;
    const unpopularButGoodMoviesUrl = `${titlesByGenreUrl}imdb_score_min=8&sort_by=votes`;
    const bestFrenchMoviesUrl = `${titlesByGenreUrl}country=France&lang=French&sort_by=-imdb_score`;
    const recentMoviesUrl = `${titlesByGenreUrl}sort_by=-year`;
    const oldButGoldMoviesUrl = `${titlesByGenreUrl}imdb_score_min=8&sort_by=year`;

    // Set best movie
    axios
    .get(bestMoviesUrl)
    .then(function(response) {
        const bestMovieId = response.data.results[0]["id"];
        axios
        .get(`${titlesUrl}${bestMovieId}`)
        .then(function(response) {
            const bestMovie = response.data;
            bestMovieTitle.innerText = bestMovie["title"];
            bestMoviePoster.src = bestMovie["image_url"];
            bestMoviePoster.alt = bestMovie["title"];
            bestMovieDescription.innerText = bestMovie["description"];
            bestMovieModalTriggers = [bestMoviePoster, bestMovieButton]
            bestMovieModalTriggers.forEach(trigger => {
                trigger.addEventListener("click", function() {
                    openModal()
                    setModalInfo(bestMovie)      
                })
            })
        })
    })


    
    setMovies(bestMoviesUrl, bestMoviesPosters)
    setMovies(popularMoviesUrl, popularMoviesPosters)
    setMovies(unpopularButGoodMoviesUrl, unpopularButGoodMoviesPosters)
    setMovies(bestFrenchMoviesUrl, bestFrenchMoviesPosters)
    setMovies(recentMoviesUrl, recentMoviesPosters)
    setMovies(oldButGoldMoviesUrl, oldButGoldMoviesPosters)
}

// Set modal information
function setModalInfo(movie) {
    modalMovieTitle.innerText = movie["title"];
    modalMovieYear.innerText = movie["year"];
    modalMovieDuration.innerText = movie["duration"];
    modalMovieLongDescription.innerText = movie["long_description"];
    modalMoviePoster.src = movie["image_url"];
    modalMoviePoster.alt = movie["title"];
    modalMovieGenres.innerText = `Genre${movie["genres"].length > 1 ? 's' : ''} : ` +
    movie["genres"].toString().replaceAll(",", ", ").toLowerCase();
    modalMovieRated.innerText = `Rated : ${movie["rated"]}`;
    modalMovieImdbScore.innerText = `IMDB Score : ${movie["imdb_score"]}`;
    modalMovieVotes.innerText = `Votes : ${movie["votes"]}`
    modalMovieDirectors.innerText = `Director${movie["directors"].length > 1 ? 's' : ''} : ` +
    movie["directors"].toString().replaceAll(",", ", ");
    modalMovieActors.innerText = `Actor${movie["actors"].length > 1 ? 's' : ''} : ` +
    movie["actors"].toString().replaceAll(",", ", ");
    modalMovieCountries.innerText = `Countr${movie["countries"].length > 1 ? 'ies' : 'y'} : ` +
    movie["countries"].toString().replaceAll(",", ", ");
    modalMovieBudget.innerText = `Budget : ${movie["budget"] == null ? "unknown" : movie["budget"] + " $"}`;
    modalMovieReleaseDate.innerText = `Release date : ${movie["date_published"]}`;
}


// Set movies
function setMovies(moviesUrl, moviePosters) {
    numberOfMovies = moviePosters.length
    numberOfPages = Math.ceil(numberOfMovies / numberOfMoviesPerPage)
    let moviesUrls = []
    for (let pageIndex = 1; pageIndex <= numberOfPages; pageIndex++) {
        moviesUrls.push(moviesUrl + `&page=${pageIndex}`)
    }
    numberOfMoviesLeft = numberOfMovies

    axios
    .all([axios.get(moviesUrls[0]), axios.get(moviesUrls[1])])
    .then(axios.spread((...responses) => {
            moviesPage1 = responses[0].data.results.slice(0, numberOfMoviesPerPage)
            moviesPage2 = responses[1].data.results.slice(0, numberOfMoviesPerPage)
            let movieIds = []
            moviesPage1.forEach(movie => {
                movieIds.push(movie["id"])
            })
            moviesPage2.forEach(movie => {
                movieIds.push(movie["id"])
            })
            movieIds.forEach(function (movieId, index) {
                axios
                .get(`${titlesUrl}${movieId}`)
                .then(function(response) {
                    const movie = response.data;
                    moviePoster = moviePosters[index];
                    moviePoster.src = movie["image_url"];
                    moviePoster.alt = movie["title"];
                    moviePoster.addEventListener("click", function() {
                        openModal()
                        setModalInfo(movie)      
                    })
                })
            })
    }))
}

const carousels = document.querySelectorAll('.carousel'); 

window.addEventListener("DOMContentLoaded", setCarousels(carousels))
window.addEventListener("resize", function() {
    setCarousels(carousels)
})

function setCarousels(carousels) {
    carousels.forEach(carousel => {
        const imageList = carousel.querySelector('.carousel__movie-posters');
        imageList.style.transform = "translateX(0px)"
        const container = carousel.querySelector(".carousel > div")
        const containerWidth = container.offsetWidth
        const images = carousel.querySelectorAll('img');
        const imageWidth = images[0].offsetWidth
        if (window.innerWidth > 1400) {
            visibleImageNb = 4
        } else if (window.innerWidth > 1150) {
            visibleImageNb = 3
        } else if (window.innerWidth > 950) {
            visibleImageNb = 2
        } else {
            visibleImageNb = 1
        }
        imageMargin = (containerWidth - visibleImageNb * imageWidth) / (2 * visibleImageNb)
        images.forEach(image => {
            image.style.margin = `0 ${imageMargin}px`
        })
        let imagesSteps = 0;
        const prevButton = carousel.querySelectorAll(".carousel__button")[0];
        const nextButton = carousel.querySelectorAll(".carousel__button")[1];
        nextButton.addEventListener("click", function() {
            if (imagesSteps < images.length - visibleImageNb) {
                imagesSteps++;
                moveimages();
            }
        })
        prevButton.addEventListener("click", function() {
            if (imagesSteps > 0) {
                imagesSteps--;
                moveimages();
            }
        })
        function moveimages() {
          imageList.style.transform = `translateX(-${(imageWidth + 2 * imageMargin + 4) * imagesSteps}px)`;
        }
    })
}