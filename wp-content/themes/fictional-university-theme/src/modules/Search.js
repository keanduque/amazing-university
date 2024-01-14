import $ from "jquery";

class Search {
	// 1. Initiate object
	constructor() {
		this.addSearchHTML();
		this.resultsDiv = $("#search-overlay__results");
		this.openButton = $(".js-search-trigger");
		this.closeButton = $(".search-overlay__close");
		this.searchOverlay = $(".search-overlay");
		this.searchField = $("#search-term");
		this.events();
		this.isOverlayOpen = false;
		this.isSpinnerVisible = false;
		this.previousValue;
		this.typingTimer;
		this.output;
		this.TIMER = 750;
	}
	// 2. Events
	events() {
		this.openButton.on("click", this.openOverlay.bind(this));
		this.closeButton.on("click", this.closeOverlay.bind(this));
		$(document).on("keydown", this.keyPressDispatcher.bind(this));
		this.searchField.on("keyup", this.typingLogic.bind(this));
	}

	// 3. Methods (function,  action...) 
	typingLogic(){
		//console.log(this.searchField.val() )
		if(this.searchField.val() != this.previousValue){
			clearTimeout(this.typingTimer);
			if(this.searchField.val()){
				if(!this.isSpinnerVisible){
					this.resultsDiv.html("<div class='spinner-loader'></div>");
					this.isSpinnerVisible = true;
				}
				this.typingTimer =  setTimeout(this.getResults.bind(this), this.TIMER);
			}else{
				this.resultsDiv.html('');
				this.isSpinnerVisible = false;
			}
		}
		this.previousValue = this.searchField.val();
	}

	resultList(results, post_type = "blog"){
		var format_posttype = post_type[0].toUpperCase() + post_type.slice(1);

		if(post_type === 'professors'){
			return `
			<ul class="link-list min-list">
				${results.length > 0 ? results.map((item) => 
					`<li class="professor-card__list-item">
						<a class="professor-card" href="${item.permalink}">
							<img src="${item.image}" alt="" class="professor-card__image" />
							<span class="professor-card__name">${item.title}</span>
						</a>
					</li>`).join('') : `<p>No ${format_posttype} match that search. <a href="${universityData.root_url}/${post_type}">View all ${format_posttype}</a></p>`}
			</ul>`;
		} else if(post_type === 'events'){
			return `
				${results.length > 0 ? '' : `<p>No ${format_posttype} match that search. <a href="${universityData.root_url}/${post_type}">View all ${format_posttype}</a></p>`}
					${results.map((item) => `
						<div class="event-summary">
							<a class="event-summary__date t-center" href="${item.permalink}">
								<span class="event-summary__month">${item.month}</span>
								<span class="event-summary__day">${item.day}</span>
							</a>
							<div class="event-summary__content">
								<h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
								<p>${item.description} <a href="${item.permalink}" class="nu gray">Learn more</a></p>
							</div>
							
						</div>					
					`).join('')}	
			`;
		} else {
			return `
			<ul class="link-list min-list">
				${results.length > 0 ? results.map((item) => `<li>
						<a href="${item.permalink}">${item.title}</a> ${
							item.hasOwnProperty("postType") ? 
								item.postType === 'post' ? 'by ' + item.authorName : "" 
							: ""}
					</li>`
				).join('') : `<p>No ${format_posttype} match that search. <a href="${universityData.root_url}/${post_type}">View all ${format_posttype}</a></p>`}
			</ul>
			`;
		}

	}
	getResults(){
		$.getJSON(universityData.root_url + '/wp-json/university/v1/search?term=' + this.searchField.val(), (results) => {
			this.resultsDiv.html(`
				<div class="row">
					<div class="one-third">
						<h2 class="search-overlay__section-title">General Information</h2>
						${this.resultList(results.generalInfo)}
					</div>
					<div class="one-third">
						<h2 class="search-overlay__section-title">Programs</h2>
						${this.resultList(results.programs, 'programs')}

						<h2 class="search-overlay__section-title">Professors</h2>
						${this.resultList(results.professors, 'professors')}
					</div>
					<div class="one-third">
						<h2 class="search-overlay__section-title">Campuses</h2>
						${this.resultList(results.campuses, 'campuses')}

						<h2 class="search-overlay__section-title">Events</h2>
						${this.resultList(results.events, 'events')}
					</div>
				</div>
			`);
			this.isSpinnerVisible = false;
		});
	}

	keyPressDispatcher(e){
		if(e.keyCode == 83 && !this.isOverlayOpen && !$("input, textarea").is(":focus")) { // S Key
			this.openOverlay();
		}
		if(e.keyCode == 27 && this.isOverlayOpen) { // Escape Key
			this.closeOverlay();
		}
	}

	openOverlay() {
		this.searchOverlay.addClass("search-overlay--active");
		$("body").addClass("body-no-scroll");
		this.searchField.val('');
		setTimeout(() => this.searchField.trigger('focus'), 301);
		console.log("open");
		this.isOverlayOpen = true;
	}

	closeOverlay() {
		this.searchOverlay.removeClass("search-overlay--active");
		$("body").removeClass("body-no-scroll");
		console.log("close");	
		this.isOverlayOpen = false;	
	}

	addSearchHTML(){
		$("body").append(`
			<div class="search-overlay">
				<div class="search-overlay__top">
					<div class="container">
						<i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
						<input type="text" class="search-term" placeholder="What are you looking for?" id="search-term"
							autocomplete="off">
						<i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
					</div>
				</div>
				<div class="container">
					<div id="search-overlay__results"></div>
				</div>
			</div>
		`)
	}
}
export default Search;
