// Navbar
const justStreamItLogo = document.querySelector("#juststreamit-logo");
const home = document.querySelector("#home");
const dropdownContent = document.querySelector(".dropdown__content");

// Genre
const genreTitle = document.querySelector("#genre")

// Best movie
const bestMovieTitle = document.querySelector(".best-movie__title");
const bestMoviePoster = document.querySelector(".best-movie .movie-poster");
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


const moviePosters = document.querySelectorAll(".movie-poster")
moviePosters.forEach(moviePoster => {
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

const baseUrl = "http://127.0.0.1:8000/api/v1";
const genresUrl = `${baseUrl}/genres/`;
const titlesUrl = `${baseUrl}/titles/`;

genre = null;

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

    axios
    .get(genresUrl)
    .then(function(response) {

        // Set genre title
        genreTitle.innerText = genre == null ? "All genres" : genre;

        // Set URLs
        let bestMoviesUrlPage1 = `${titlesUrl}?sort_by=-imdb_score&page=1`;
        let bestMoviesUrlPage2 = `${titlesUrl}?sort_by=-imdb_score&page=2`;
        let popularMoviesUrlPage1 = `${titlesUrl}?sort_by=-votes&page=1`;
        let popularMoviesUrlPage2 = `${titlesUrl}?sort_by=-votes&page=2`;
        let unpopularButGoodMoviesUrlPage1 = `${titlesUrl}?imdb_score_min=8&sort_by=votes&page=1`;
        let unpopularButGoodMoviesUrlPage2 = `${titlesUrl}?imdb_score_min=8&sort_by=votes&page=2`;
        let frenchMoviesUrlPage1 = `${titlesUrl}?country=France&lang=French&sort_by=-imdb_score&page=1`;
        let frenchMoviesUrlPage2 = `${titlesUrl}?country=France&lang=French&sort_by=-imdb_score&page=2`;
        let recentMoviesUrlPage1 = `${titlesUrl}?sort_by=-year&page=1`;
        let recentMoviesUrlPage2 = `${titlesUrl}?sort_by=-year&page=2`;
        let oldMoviesUrlPage1 = `${titlesUrl}?imdb_score_min=8&sort_by=year&page=1`;
        let oldMoviesUrlPage2 = `${titlesUrl}?imdb_score_min=8&sort_by=year&page=2`;
        if (genre != null) {
            bestMoviesUrlPage1 = `${titlesUrl}?genre=${genre}&sort_by=-imdb_score&page=1`;
            bestMoviesUrlPage2 = `${titlesUrl}?genre=${genre}&sort_by=-imdb_score&page=2`;
            popularMoviesUrlPage1 = `${titlesUrl}?genre=${genre}&sort_by=-votes&page=1`;
            popularMoviesUrlPage2 = `${titlesUrl}?genre=${genre}&sort_by=-votes&page=2`;
            unpopularButGoodMoviesUrlPage1 = `${titlesUrl}?genre=${genre}&imdb_score_min=8&sort_by=votes&page=1`;
            unpopularButGoodMoviesUrlPage2 = `${titlesUrl}?genre=${genre}&imdb_score_min=8&sort_by=votes&page=2`;
            frenchMoviesUrlPage1 = `${titlesUrl}?genre=${genre}&country=France&lang=French&sort_by=-imdb_score&page=1`;
            frenchMoviesUrlPage2 = `${titlesUrl}?genre=${genre}&country=France&lang=French&sort_by=-imdb_score&page=2`;
            recentMoviesUrlPage1 = `${titlesUrl}?genre=${genre}&sort_by=-year&page=1`;
            recentMoviesUrlPage2 = `${titlesUrl}?genre=${genre}&sort_by=-year&page=2`;
            oldMoviesUrlPage1 = `${titlesUrl}?genre=${genre}&imdb_score_min=8&sort_by=year&page=1`;
            oldMoviesUrlPage2 = `${titlesUrl}?genre=${genre}&imdb_score_min=8&sort_by=year&page=2`;
        }

        // Set best movie
        axios
        .get(bestMoviesUrlPage1)
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

        // Set top 7 best movies
        const top7BestMovieImages = document.querySelectorAll("#best-movies .movie-poster")
        setTop7Movies(bestMoviesUrlPage1, bestMoviesUrlPage2, top7BestMovieImages)

        // Set top 7 popular movies
        const top7PopularMovieImages = document.querySelectorAll("#popular-movies .movie-poster")
        setTop7Movies(popularMoviesUrlPage1, popularMoviesUrlPage2, top7PopularMovieImages)

        // Set top 7 unpopular but good movies
        const top7UnpopularButGoodMovieImages = document.querySelectorAll("#unpopular-but-good-movies .movie-poster")
        setTop7Movies(unpopularButGoodMoviesUrlPage1, unpopularButGoodMoviesUrlPage2, top7UnpopularButGoodMovieImages)

        // Set top 7 best french movies
        const top7BestFrenchMovieImages = document.querySelectorAll("#french-movies .movie-poster")
        setTop7Movies(frenchMoviesUrlPage1, frenchMoviesUrlPage2, top7BestFrenchMovieImages)

        // Set top 7 recent movies
        const top7RecentMovieImages = document.querySelectorAll("#recent-movies .movie-poster")
        setTop7Movies(recentMoviesUrlPage1, recentMoviesUrlPage2, top7RecentMovieImages)

        // Set top 7 old but gold movies
        const top7OldMovieImages = document.querySelectorAll("#old-movies .movie-poster")
        setTop7Movies(oldMoviesUrlPage1, oldMoviesUrlPage2, top7OldMovieImages)

    })
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

// Set top 7 movies
function setTop7Movies(moviesUrlPage1, moviesUrlPage2, top7MovieImages) {
    axios
    .all([axios.get(moviesUrlPage1), axios.get(moviesUrlPage2)])
    .then(axios.spread((...responses) => {
        const top7MoviesPage1 = responses[0].data.results.slice(0, 6)
        const top7MoviesPage2 = responses[1].data.results.slice(0, 2)
        let top7MovieIds = []
        top7MoviesPage1.forEach(movie => {
            top7MovieIds.push(movie["id"])
        })
        top7MoviesPage2.forEach(movie => {
            top7MovieIds.push(movie["id"])
        })
        top7MovieIds.forEach(function (movieId, index) {
            axios
            .get(`${titlesUrl}${movieId}`)
            .then(function(response) {
                const movie = response.data;
                movieImage = top7MovieImages[index];
                movieImage.src = movie["image_url"];
                movieImage.alt = movie["title"];
                movieImage.addEventListener("click", function() {
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