const key = "1f935c59";
const apiKey = "api_key=3053106c9a5bb9504514f4c439a7c29b";
const baseUrl = "https://api.themoviedb.org/3/";
const discover = "discover/movie?sort_by=popularity.desc&";
const searchSort = "search/movie?";
const apiUrlDiscover = baseUrl + discover + apiKey;
const apiUrlSearch = baseUrl + searchSort + apiKey;
const imgUrl = "https://image.tmdb.org/t/p/w500";
const main = document.getElementById("main");
const form = document.getElementById("form");
const searchBar = document.getElementById("search");
const back = document.getElementById("back");
let movieOMDB = ``;

const getColor = function (vote) {
	if (vote >= 8) {
		return "green";
	} else if (vote >= 5) {
		return "orange";
	} else return "red";
};

const showMovies = function (data) {
	main.innerHTML = ``;

	data.forEach((movie) => {
		const { title, poster_path, vote_average, overview } = movie;
		const movieEl = document.createElement("div");
		movieEl.classList.add("movie");
		movieEl.innerHTML = `
        <img src="${
			imgUrl + poster_path
		}" alt="${title}" data-title="${title}" />
		<div class="movie-info">
			<h3 id="titleOMDB">${title}</h3>
			<span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
		</div>
		<div class="overview">
            ${overview}
		</div>
            `;

		main.appendChild(movieEl);
	});

	movieOMDB = document.querySelectorAll(".movie");
};

const getMovies = async function (url) {
	const res = await fetch(url);
	const data = await res.json();
	showMovies(data.results);
};

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const back = document.getElementById("back");
	back.classList.remove("hidden");

	const searchTerm = searchBar.value;
	searchBar.value = "";
	searchBar.blur();
	if (searchTerm) {
		getMovies(apiUrlSearch + "&query=" + searchTerm);
	} else {
		getMovies(apiUrlDiscover);
	}
});

back.addEventListener("click", function (e) {
	getMovies(apiUrlDiscover);
	back.classList.add("hidden");
});

await getMovies(apiUrlDiscover);
//////////////////////////////////////////////////////////////
///////////                OMDb                    //////////

const getMovieOM = async function (title, imgsrc) {
	const loader = document.getElementById("loader");
	const i = document.querySelector(".ri-close-fill");
	const overlayEl = document.querySelector(".overlay");
	const url = `https://www.omdbapi.com/?t=${title}&apikey=${key}`;
	if (overlayEl.firstChild) {
		overlayEl.firstChild.remove();
		overlayEl.lastChild.remove();
	}
	const res = await fetch(url);
	const data = await res.json();
	const {
		Poster,
		Title,
		imdbRating,
		Rated,
		Year,
		Runtime,
		Genre,
		Plot,
		Actors,
	} = data;

	const html = `
	<div class="info">
	    <img src="${imgsrc}" class="${title}" id="infoimg" />
	    <div id="wow">
		    <h2>${Title}</h2>
		    <div class="ratings">
			    <img src="star.svg" />
			    <h4>${imdbRating}</h4>
		    </div>
		    <div class="details">
			    <span>${Rated}</span>
			    <span>${Year}</span>
			    <span>${Runtime}</span>
		    </div>
		    <div class="genre">
			    <div>${Genre.split(",").join("</div><div>")}</div>
		    </div>
	    </div>
	</div>
	<div class="ok">
		<h3 class="infoh3">Plot:</h3>
		<p class="infop">${Plot}</p>
		<h3 class="infoh3">Cast:</h3>
		<p class="infop">${Actors}</p>
	</div>
	`;

	overlayEl.innerHTML = html;
	overlayEl.classList.remove("hidden");
	i.classList.remove("hidden");
	loader.classList.add("hidden");
};

setInterval(() => {
	movieOMDB.forEach((child) => {
		child.addEventListener("click", function () {
			if (!back.classList.contains("hidden")) {
				back.classList.add("hidden");
			}
			const loader = document.getElementById("loader");
			loader.classList.remove("hidden");
			const blur = document.querySelector(".blur");
			blur.classList.remove("hidden");
			const i = document.querySelector(".ri-close-fill");
			const overlayEl = document.querySelector(".overlay");
			const title = child.querySelector("img").dataset.title;
			const imgsrc = child.querySelector("img").src;

			getMovieOM(title, imgsrc);

			document.addEventListener("keydown", function (e) {
				if (
					e.key == "Escape" &&
					!overlayEl.classList.contains("hidden")
				) {
					overlayEl.classList.add("hidden");
					i.classList.add("hidden");
					blur.classList.add("hidden");
					loader.classList.add("hidden");
				}
			});

			i.addEventListener("click", function (e) {
				const main = document.getElementById("main");
				e.preventDefault();
				if (!overlayEl.classList.contains("hidden")) {
					overlayEl.classList.add("hidden");
					i.classList.add("hidden");
					blur.classList.add("hidden");
					loader.classList.add("hidden");
				}
				if (
					back.classList.contains("hidden") &&
					main.childElementCount != 20
				) {
					back.classList.remove("hidden");
				}
			});
		});
	});
}, 1000);
