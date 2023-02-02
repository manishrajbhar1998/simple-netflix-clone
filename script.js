//consts
const youtubekey = 'AIzaSyAt9-BNdJbRjyn_FDrcHkhxnLPxIBPVjhw'
const apiKey = "835dc4108b9d8d4bdc8651a4b8725dd3";
const baseUrl = "https://api.themoviedb.org/3/";
const imgPath = "https://image.tmdb.org/t/p/original";
const apiPath = {
    fetchAllCategories: `${baseUrl}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchPopular: `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyBjdtEQIflYYMo_KISA5r7srbRmbvUlnpQ`
}

window.addEventListener('load', function () {
    init()
    this.window.addEventListener('scroll',function(){
        // header ui update
        const header = document.getElementById("header");
        if(window.scrollY > 5) header.classList.add('black-bg');
        else header.classList.remove('black-bg');
    })
})



// Boots up the app
function init() {
    fetchPopularMovies();
    fectAndBuildAllSection();
}

function fetchPopularMovies() {
    fetchAndBuildMoviesSection(apiPath.fetchPopular, "Popular movies")
        .then(list => {
            const random = parseInt(Math.random()*list.length);
            buildBannerFunction(list[random]);
        }).catch(err => {
            console.log(err);
        })

}

function buildBannerFunction(movie) {
    console.log(movie);
    const banner_section = document.getElementById("banner-section");
    const banner_content = document.getElementById("banner-content");

    banner_section.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

    const div = document.createElement('div');
    div.innerHTML = `<h2 class="banner-title">${movie.title}</h2>
        <p class="banner-info">#Release Date | ${movie.release_date}</p>
        <p class="banner-overview">${movie.overview}</p>
        <div class="ation-buttons">
            <button class="action-btn"><i class="fa-solid fa-play"></i>&nbsp;&nbsp; Play</button>
            <button class="action-btn"><i class="fa-solid fa-download"></i>&nbsp;&nbsp; More Info</button>
        </div>`
        banner_content.append(div)
}



function fectAndBuildAllSection() {
    fetch(apiPath.fetchAllCategories)
        .then(res => res.json())
        .then(res => {
            const categories = res.genres;

            if (Array.isArray(categories) && categories.length) {
                categories.forEach((category) => {
                    fetchAndBuildMoviesSection(apiPath.fetchMoviesList(category.id), category.name)
                })
               
               

            }
        })
        .catch(err => console.log(err))
}


function fetchAndBuildMoviesSection(fetchUrl, categoryName) {
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            const movies = res.results;
            // console.log(movies);
            if (Array.isArray(movies) && movies.length) {
                buildMovieSection(movies, categoryName)
            }
            return movies;
        })
        .catch(err => console.log(err))
}

function buildMovieSection(list, categoryName) {
    // console.log(list);
    const moviesCont = document.getElementById('movies-cont');
    const moviesListHTML = list.map(item => {
        return ` <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}','yt${item.id}')">
                    <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" >
                    <p class="movie-title">${item.title}</p>
                    <iframe class="movie-item-video" width="245" height="150" src="" id="yt${item.id}"></iframe>
                </div>
                `;
    }).join('');

    const moviesSectionHTML = `<h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2> 
                                <div class="movies-row">
                                    ${moviesListHTML}
                                </div>`


    const div = document.createElement('div');
    div.classList = "movies-section"
    div.innerHTML = moviesSectionHTML;
    moviesCont.append(div)
   
}


function searchMovieTrailer(movieName,iframeId){
    if(!movieName)return;
    console.log(movieName);
    fetch(apiPath.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        console.log(res.items[0]);
        const bestResult = res.items[0];
        const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
        console.log(youtubeUrl);
        document.getElementById(iframeId).src = `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0`
    })
    .catch(err => console.log(err))
}

