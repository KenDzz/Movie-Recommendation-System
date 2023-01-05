function getMovieHome(pageFirst) {
	var pageInt = parseInt(pageFirst);
	var page = pageInt+'-'+(pageInt+30);
	$.ajax({
		url: 'http://127.0.0.1:8000/getmovie/'+page,
		type: 'GET',
		dataType: 'json',
		beforeSend: function() {
	        Notiflix.Loading.dots();  
	    },complete: function() {
			Notiflix.Loading.remove();
    	}
	})
	.done(function(data) { 
		getMovieHomeCookie();
		var urlImg = 'http://image.tmdb.org/t/p/w500';
		console.log(data);
		$(".movie").append('<h2 class="title-movie-recomender">Đề xuất cho bạn</h2>');
		Object.keys(data).forEach(function(key) {
			const genres = [];
			const productionCountries = [];
			const genresObj = data[key]['genres'];
			const productionCountriesObj = data[key]['production_countries'];
			if(genresObj != null){
				Object.keys(genresObj).forEach(function(key) {
					genres.push(genresObj[key]['name']); 
				});
			}
			if(productionCountriesObj != null){
				Object.keys(productionCountriesObj).forEach(function(key) {
					productionCountries.push(productionCountriesObj[key]['name']);
				});
			}
			var urlTrailer = getUrlTrailer(data[key]['id']);
			console.log(urlTrailer)
			var urlTrailerContent = '';
			if(urlTrailer != null){
				const myArray = urlTrailer.split("|");
				if(myArray[1] == 'YouTube'){
					urlTrailerContent = '<a class="btn btn-outline-dark btn-movie-home" data-fancybox="video-gallery" href="https://www.youtube.com/watch?v='+myArray[0]+'">Trailer</a>';
				}else{
					urlTrailerContent = '<a class="btn btn-outline-dark btn-movie-home" data-fancybox="video-gallery" href="https://vimeo.com/'+myArray[0]+'">Trailer</a>';
				}
			}else{
				urlTrailerContent =	'<a  class="btn btn-outline-dark btn-movie-home" data-fancybox="video-gallery" href="">Trailer</a>';
			}

			var urlPosterMovie = 'https://dummyimage.com/293x440/000/fff';
			if (data[key]['poster_path'] != null) {
				urlPosterMovie = urlImg+data[key]['poster_path'];
			}
		  $(".movie").append('<div class="col-2 mt-2"><div class="card-movie card"><img src="'+urlPosterMovie+'" class="card-img-movie" alt="..."><div class="card-img-overlay"><h5 class="card-title">'+data[key]['original_title']+'</h5><p class="card-text">Thể loại:'+genres.toString()+'</p><p class="card-text">Nước sản xuất:'+productionCountries.toString()+'</p><div class="d-grid gap-2 mt-5"><a class="btn btn-outline-dark btn-movie-info" href="movie.html?name='+data[key]['original_title']+'&imdb='+data[key]['imdb_id']+'">Xem thông tin</a>'+urlTrailerContent+'</div></div></div></div>');
		}); 
   	}) 
	.fail(function() {
	}) 
	.always(function() {
	}); 
}

function getMovieHomeCookie() {
	$.ajax({
		url: 'http://127.0.0.1:8000/getmovieCookie/'+getCookie("recommender"),
		type: 'GET',
		dataType: 'json',
		beforeSend: function() {
	        Notiflix.Loading.dots();  
	    },complete: function() {
			Notiflix.Loading.remove();
    	}
	})
	.done(function(data) { 
		var urlImg = 'http://image.tmdb.org/t/p/w500';
		$(".movie-recommender-cookie").append('<h2 class="title-movie-recomender">Đề xuất cho bạn</h2>');
		console.log(data);
		Object.keys(data).forEach(function(key) {
			const genres = [];
			const productionCountries = [];
			const genresObj = data[key]['genres'];
			const productionCountriesObj = data[key]['production_countries'];
			if(genresObj != null){
				Object.keys(genresObj).forEach(function(key) {
					genres.push(genresObj[key]['name']); 
				});
			}
			if(productionCountriesObj != null){
				Object.keys(productionCountriesObj).forEach(function(key) {
					productionCountries.push(productionCountriesObj[key]['name']);
				});
			}
			var urlTrailer = getUrlTrailer(data[key]['id']);
			console.log(urlTrailer)
			var urlTrailerContent = '';
			if(urlTrailer != null){
				const myArray = urlTrailer.split("|");
				if(myArray[1] == 'YouTube'){
					urlTrailerContent = '<a class="btn btn-outline-dark btn-movie-home" data-fancybox="video-gallery" href="https://www.youtube.com/watch?v='+myArray[0]+'">Trailer</a>';
				}else{
					urlTrailerContent = '<a class="btn btn-outline-dark btn-movie-home" data-fancybox="video-gallery" href="https://vimeo.com/'+myArray[0]+'">Trailer</a>';
				}
			}else{
				urlTrailerContent =	'<a  class="btn btn-outline-dark btn-movie-home" data-fancybox="video-gallery" href="">Trailer</a>';
			}

			var urlPosterMovie = 'https://dummyimage.com/293x440/000/fff';
			if (data[key]['poster_path'] != null) {
				urlPosterMovie = urlImg+data[key]['poster_path'];
			}
		  $(".movie-recommender-cookie").append('<h2 class="title-movie-recomender">Đề xuất cho bạn</h2><div class="col-2 mt-2"><div class="card-movie card"><img src="'+urlPosterMovie+'" class="card-img-movie" alt="..."><div class="card-img-overlay"><h5 class="card-title">'+data[key]['original_title']+'</h5><p class="card-text">Thể loại:'+genres.toString()+'</p><p class="card-text">Nước sản xuất:'+productionCountries.toString()+'</p><div class="d-grid gap-2 mt-5"><a class="btn btn-outline-dark btn-movie-info" href="movie.html?name='+data[key]['original_title']+'&imdb='+data[key]['imdb_id']+'">Xem thông tin</a>'+urlTrailerContent+'</div></div></div></div>');
		}); 
   	}) 
	.fail(function() {
	}) 
	.always(function() {
	}); 
}

function MovieRecommender(title) {

	$.ajax({
		url: 'http://127.0.0.1:8000/recommender/'+title,
		type: 'GET',
		dataType: 'json',
		beforeSend: function() {
	        Notiflix.Block.pulse('.movie-recommender', {
				backgroundColor: 'transparent',
			});

	    },complete: function() {
			Notiflix.Block.remove('.movie-recommender');
    	}
	})
	.done(function(data) { 
		var urlImg = 'http://image.tmdb.org/t/p/w500';
		$(".movie-recommender").append('<h2 class="title-movie-recomender">Đề xuất cho bạn</h2>');
		Object.keys(data).forEach(function(key) {
			const genres = [];
			const productionCountries = [];
			const genresObj = data[key]['genres'];
			const productionCountriesObj = data[key]['production_countries'];
			if(genresObj != null){
				Object.keys(genresObj).forEach(function(key) {
					genres.push(genresObj[key]['name']); 
				});
			}
			if(productionCountriesObj != null){
				Object.keys(productionCountriesObj).forEach(function(key) {
					productionCountries.push(productionCountriesObj[key]['name']);
				});
			}
			var urlTrailer = getUrlTrailer(data[key]['id']);
			var urlTrailerContent = '';
			if(urlTrailer != null){
				const myArray = urlTrailer.split("|");
				if(myArray[1] == 'YouTube'){
					urlTrailerContent = '<a class="btn btn-outline-dark btn-movie-home" data-fancybox="video-gallery" href="https://www.youtube.com/watch?v='+myArray[0]+'">Trailer</a>';
				}else{
					urlTrailerContent = '<a class="btn btn-outline-dark btn-movie-home" data-fancybox="video-gallery" href="https://vimeo.com/'+myArray[0]+'">Trailer</a>';
				}
			}else{
				urlTrailerContent =	'<a  class="btn btn-outline-dark btn-movie-home" data-fancybox="video-gallery" href="">Trailer</a>';
			}

			var urlPosterMovie = 'https://dummyimage.com/293x440/000/fff';
			if (data[key]['poster_path'] != null) {
				urlPosterMovie = urlImg+data[key]['poster_path'];
			}
		  $(".movie-recommender").append('<div class="col-2 mt-2"><div class="card-movie card"><img src="'+urlPosterMovie+'" class="card-img-movie" alt="..."><div class="card-img-overlay"><h5 class="card-title">'+data[key]['original_title']+'</h5><p class="card-text">Thể loại:'+genres.toString()+'</p><p class="card-text">Nước sản xuất:'+productionCountries.toString()+'</p><div class="d-grid gap-2 mt-5"><a class="btn btn-outline-dark btn-movie-info" href="movie.html?name='+data[key]['original_title']+'&imdb='+data[key]['imdb_id']+'">Xem thông tin</a>'+urlTrailerContent+'</div></div></div></div>');
		}); 
   	}) 
	.fail(function() {
	}) 
	.always(function() {
	}); 
} 


function MovieIMDB(id) {
	$.ajax({
		url: 'http://127.0.0.1:8000/tmdb/'+id,
		type: 'GET',
		dataType: 'json',
		beforeSend: function() {
	        Notiflix.Loading.dots();
	    },complete: function() {
			Notiflix.Loading.remove();
    	}
	})
	.done(function(data) { 
		var urlImg = 'http://image.tmdb.org/t/p/w500';
		var urlTrailer = getUrlTrailer(data['id']);
		var urlTrailerContent = '';
		const genres = [];
		const genresObj = data['genres'];
		const languages = [];
		const languagesObj = data['spoken_languages'];
		let USDollar = new Intl.NumberFormat('en-US', {
		    style: 'currency',
		    currency: 'USD',
		});
		if(genresObj != null){
			Object.keys(genresObj).forEach(function(key) {
				genres.push(genresObj[key]['name']); 
			});
		}
		if(languagesObj != null){
			Object.keys(languagesObj).forEach(function(key) {
				languages.push(languagesObj[key]['name']); 
			});
		}
		sendMovieClick(data['original_title'],getCookie("recommender"));
		if(urlTrailer != null){
			const myArray = urlTrailer.split("|");
			if(myArray[1] == 'YouTube'){
				urlTrailerContent = 'https://www.youtube.com/embed/'+myArray[0]+'?controls=0&autoplay=1&mute=1&playsinline=1&loop=1&playlist='+myArray[0];
			}else{
				urlTrailerContent = 'https://player.vimeo.com/video/'+myArray[0];
			}
		}else{
			urlTrailerContent =	'https://www.youtube.com/embed/FuIdf6uol7Q?controls=0&autoplay=1&mute=1&playsinline=1&loop=1&playlist=FuIdf6uol7Q';
		}
		$(".movie-info").append('<div class="video-container"><iframe frameborder="0" src="'+urlTrailerContent+'"></iframe></div><div id="text-info"><h1>'+data['original_title']+'</h1><h4>Thể loại:'+genres.toString()+' </h4><div class="d-flex flex-row"><div class="p-2"><p>'+languages.toString()+' | '+data['runtime']+' Phút</p></div><div class="p-2"><p>Ngân sách: '+USDollar.format(data['budget'])+'| Doanh Thu: '+USDollar.format(data['revenue'])+'</p> </div></div><p class="w-50"> '+data['overview']+'</p>');

   	}) 
	.fail(function() {
	}) 
	.always(function() {
	}); 
} 

function getUrlTrailer (idMovie) {
	var result = "";
	$.ajax({
		url: 'https://api.themoviedb.org/3/movie/'+idMovie+'/videos?api_key=83698018e32f927c74f1f51dcaacc231&language=en-US',
		async: false, 
		type: 'GET',
		dataType: 'json'
	})
	.done(function(data) { 
		if(data['results'].length > 0){
			result = data['results'][0]['key']+'|'+data['results'][0]['site'];
		}
   	})
	.fail(function() {
	}) 
	.always(function() {
	});  
	return result;
}




function getMovieInfo (url) {
	let params = getQueryParams(url);
	MovieRecommender(params['name']);
	MovieIMDB(params['imdb']);
}

function getQueryParams(url) {
    const paramArr = url.slice(url.indexOf('?') + 1).split('&');
    const params = {};
    paramArr.map(param => {
        const [key, val] = param.split('=');
        params[key] = decodeURIComponent(val);
    })
    return params;
}


function sendMovieClick(movieName,Cookie){
	$.ajax({
	    type: 'POST',
	    url: 'http://127.0.0.1:8000/movieclick',
	    data: JSON.stringify ({cookie: Cookie, movie_name: movieName}),
	    success: function(data) {},
	    contentType: "application/json",
	    dataType: 'json'
	});
}


 

function setCookie(cname, cvalue, exdays)  {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie(){
	if(getCookie("recommender") == ""){
		setCookie("recommender", createCookieRadom(), 180);
	}
}

function createCookieRadom(){
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var cookieLength = 32;
    var cookie = "";
	for (var i = 0; i <= cookieLength; i++) {
	   var randomNumber = Math.floor(Math.random() * chars.length);
	   cookie += chars.substring(randomNumber, randomNumber +1);
	}
	return cookie;
}

 