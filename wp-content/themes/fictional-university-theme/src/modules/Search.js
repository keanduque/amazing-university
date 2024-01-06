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

	getResults(){
		$.when(
			$.getJSON(universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val()), 
			$.getJSON(universityData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val())
		).then((posts, pages) => {
			var combinedResults = posts[0].concat(pages[0]);
			
			this.output = `
				<h2 class="search-overlay__section-title">General Information</h2>
				<ul class="link-list min-list">
					${combinedResults.length > 0 ? combinedResults.map((item) => `
					<li>
						<a href="${item.link}">${item.title.rendered}</a> ${item.type === 'post' ? 'by ' + item.authorName : ""}
					</li>`
					).join('') : "<li>No Search found!</li>"}
				</ul>`;
			
			this.resultsDiv.html(this.output);
			this.isSpinnerVisible = false;			
		}, () => this.resultsDiv.html(`<p>Unexpected Error; please try again!</p>`));

		//this.resultsDiv.html("Imagine real search results here...");
		//this.isSpinnerVisible = false;
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
