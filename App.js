
// step 1
let movies = [];

// store page number
let currentPage = 1;

const API_KEY = "f531333d637d0c44abc85b3e74db2186";
const movieList = document.getElementById("movies-list");

async function fetchMovies(currentPage) {
    try {
        // const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${currentPage}`
        );
        const result = await response.json();
        // console.log(response);
        movies = result.results;
        console.log(result.results);
        renderMovies(movies);
    } catch (error) {
        console.log(error);
    }
}
fetchMovies(currentPage);

// getMovieNamesFromLocalStorage
function getMovieNamesFromLocalStorage() {
    const favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

    // console.log('favouriteMovies',favouriteMovies);

    return favouriteMovies === null ? [] : favouriteMovies;
}

function addMovieNameToLocalStorage(movieName) {
    // add movie name to local storage
    const favMoviesNames = getMovieNamesFromLocalStorage();
    // localStorage.setItem(key, data);
    localStorage.setItem(
        "favouriteMovies",
        JSON.stringify([...favMoviesNames, movieName])
    );
}

function removeMovieNameFromLocalStorage(movieName) {
    const favMoviesNames = getMovieNamesFromLocalStorage();

    let filteredMoviesNames = favMoviesNames.filter(
        (movie) => movie !== movieName
    );

    localStorage.setItem("favouriteMovies", JSON.stringify(filteredMoviesNames));
}

// step 2

const renderMovies = (movies) => {
    const favMoviesNames = getMovieNamesFromLocalStorage();

    movieList.innerHTML = "";

    movies.map((movie) => {
        // console.log(movie);

        const {
            poster_path,
            title,
            vote_count,
            vote_average
        } = movie;

        // console.log(poster_path, title, vote_average, vote_count);
        let listItem = document.createElement("li");

        listItem.className = "card";

        let imgSrc = poster_path ?
            `https://image.tmdb.org/t/p/original/${poster_path}` :
            `https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png`;

        listItem.innerHTML += `
        <img src=${imgSrc} alt=${title} class="poster">
        <p class="title">${title}</p>
        <section class="votes-favouriteIcon">
                    <section class="vote">
                        <p class="vote-count">Votes: ${vote_count}</p>
                        <p class="vote-average">Rating: ${vote_average}</p>
                    </section>
                    <i class="favourite-icon ${
                      favMoviesNames.includes(title) ? "fa-solid" : null
                    } fa-regular fa-heart fa-2xl" id="${title}"></i>
                </section>

        `;

        // favourite icon

        const favouriteIconBtn = listItem.querySelector(".favourite-icon");

        favouriteIconBtn.addEventListener("click", (event) => {
            // console.log(event.target);
            const {
                id
            } = event.target;
            console.log(id);
            if (favouriteIconBtn.classList.contains("fa-solid")) {
                //remove the movie name from local storage and from fav array
                removeMovieNameFromLocalStorage(id);

                // remove this class from favouriteIconBtn
                favouriteIconBtn.classList.remove("fa-solid");
            } else {
                // add the movie name to local storage and fav array
                addMovieNameToLocalStorage(id);

                // add class fa-solid
                favouriteIconBtn.classList.add("fa-solid");
            }
        });

        movieList.appendChild(listItem);
    });
};

// step 3 sort by date

const sortByDateButton = document.getElementById("sort-by-date");

sortByDateButton.addEventListener("click", sortByDate);
let firstSortByDateClicked = true;

function sortByDate() {
    // console.log(movies);
    let sortedMovies;

    if (firstSortByDateClicked) {
        sortedMovies = movies.sort(function (a, b) {
            return new Date(a.release_date) - new Date(b.release_date);
        });
        sortByDateButton.textContent = "Sort by date (latest to oldest)";
        firstSortByDateClicked = false;
    } else {
        sortedMovies = movies.sort(function (a, b) {
            return new Date(b.release_date) - new Date(a.release_date);
        });
        sortByDateButton.textContent = "Sort by date (oldest to latest)";
        firstSortByDateClicked = true;
    }

    renderMovies(sortedMovies);
}

// step 4 sort by rating

const sortByRatingButton = document.getElementById("sort-by-rating");

sortByRatingButton.addEventListener("click", sortByRate);
let leastToMostRateClicked = true;

let ratedMovies;

function sortByRate() {
    console.log(movies);
    if (leastToMostRateClicked) {
        ratedMovies = movies.sort(function (a, b) {
            return a.vote_average - b.vote_average;
        });
        sortByRatingButton.textContent = "Sort by rating (most to least)";
        leastToMostRateClicked = false;
    } else {
        ratedMovies = movies.sort(function (a, b) {
            return b.vote_average - a.vote_average;
        });
        sortByRatingButton.textContent = "Sort by rating (least to most)";
        leastToMostRateClicked = true;
    }
    renderMovies(ratedMovies);
}

// Pagination - (allows users to navigate through multiple pages)

const pagination = document.querySelector("div.pagination");
const prevButton = document.querySelector("button#prev-button");
const pageNumberButton = document.querySelector("button#page-number-button");
const nextButton = document.querySelector("button#next-button");

prevButton.addEventListener("click", () => {
    //decrease the current page by 1;
    currentPage--;

    fetchMovies(currentPage);

    pageNumberButton.textContent = `Current Page: ${currentPage}`;

    //disable the prev button when the current page is one
    if (currentPage === 1) {
        prevButton.disabled = true;
        nextButton.disabled = false;
    } else if (currentPage === 2) {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
});

nextButton.addEventListener("click", () => {
    currentPage++;

    fetchMovies(currentPage);

    pageNumberButton.textContent = `Current Page: ${currentPage}`;

    if (currentPage === 3) {
        prevButton.disabled = false;
        nextButton.disabled = true;
    } else {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
});

// Search by movie name API response

// https://api.themoviedb.org/3/search/movie?query=${searchedMovie}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`

const searchMovies = async (searchedMovie) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${searchedMovie}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`
        );

        const result = await response.json();
        movies = result.results;
        renderMovies(movies);
    } catch (error) {
        console.log(error);
    }
};

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

searchButton.addEventListener("click", () => {
    searchMovies(searchInput.value);

    pagination.style.display = "none";
});

const allTab = document.getElementById("all-tab");
const favouritesTab = document.getElementById("favourites-tab");
const sortBtns = document.querySelector(".sorting-options");

//switch between tabs

const getMovieByName = async (movieName) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${API_KEY}&include_adult=false&language=en-US&page=1`);
        const result = await response.json();

        return result.results[0];
        
    } catch (error) {
        console.log(error);
    }
};

const showFavourites = (favMovie) => {
    console.log(favMovie);
    const {
        poster_path,
        title,
        vote_average,
        vote_count
    } = favMovie;

    let listItem = document.createElement("li");

    listItem.className = "card";

    let imgSrc = poster_path ?
        `https://image.tmdb.org/t/p/original/${poster_path}` :
        `https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png`;

    listItem.innerHTML += `
        <img src=${imgSrc} alt=${title} class="poster">
        <p class="title">${title}</p>
        <section class="votes-favouriteIcon">
                    <section class="vote">
                        <p class="vote-count">Votes: ${vote_count}</p>
                        <p class="vote-average">Rating: ${vote_average}</p>
                    </section>
                    <i class="favourite-icon fa-solid fa-xmark fa-2xl xmark" id="${title}"></i>
                </section>

        `;

    const removeFromWishListBtn = listItem.querySelector(".xmark");

    removeFromWishListBtn.addEventListener("click", (event) => {
        const {
            id
        } = event.target;

        removeMovieNameFromLocalStorage(id);

        fetchWishListMovie();
    });
    movieList.appendChild(listItem);
};

const fetchWishListMovie = async () => {
    movieList.innerHTML = "";

    const movieNamesList = getMovieNamesFromLocalStorage();

    for (let i = 0; i < movieNamesList.length; i++) {
        const movieName = movieNamesList[i];

        let movieDataFromName = await getMovieByName(movieName);

        showFavourites(movieDataFromName);
    }
};

// display based on acitve web

function displayMovies() {
    if (allTab.classList.contains("active-tab")) {
        renderMovies(movies);
        sortBtns.style = "revert";
        pagination.style = "revert";
    } else if (favouritesTab.classList.contains("active-tab")) {
        fetchWishListMovie();
        sortBtns.style.display = "none";
        pagination.style.disabled = "none";
    }
}

function switchTab(event) {
    //remove the active-tab class from both the tabs

    allTab.classList.remove("active-tab");
    favouritesTab.classList.remove("active-tab");

    // add the active tab class to the clicked tab

    event.target.classList.add("active-tab");

    //display the movies for that tab
    displayMovies();
}

allTab.addEventListener("click", switchTab);
favouritesTab.addEventListener("click", switchTab);
