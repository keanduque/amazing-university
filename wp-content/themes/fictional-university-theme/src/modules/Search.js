import $ from "jquery";

class Search {
	// 1. Initiate object
	constructor() {
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
		this.url = 'http://fictional-university.local/wp-json/wp/v2/posts?search=';
		this.output;
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
				this.typingTimer =  setTimeout(this.getResults.bind(this), 2000);
			}else{
				this.resultsDiv.html('');
				this.isSpinnerVisible = false;
			}
		}
		this.previousValue = this.searchField.val();
	}

	getResults(){
		$.getJSON(this.url + this.searchField.val(), posts => { // use arrow function to point on the search object.
			this.output = `
				<h2 class="search-overlay__section-title">General Information</h2>
				<ul class="link-list min-list">
					${posts.map((post) => `<li><a href="${post.link}">${post.title.rendered}</a></li>`).join('')}
				</ul>`;
			this.resultsDiv.html(this.output);
		});
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
		console.log("open");
		this.isOverlayOpen = true;
	}

	closeOverlay() {
		this.searchOverlay.removeClass("search-overlay--active");
		$("body").removeClass("body-no-scroll");
		console.log("close");	
		this.isOverlayOpen = false;	
	}
}
export default Search;
