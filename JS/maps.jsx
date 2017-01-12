//If you add the zoom feature, add it into the info box and make it into a method.
//make marker a global variable
//toLowercase input values and cities to eliminate case-sensitve
//setPanel - step by step directions
//Add state
//Add input for geocode



/****************** GOOGLE ***********************/
// Create the google map
// First set mapOptions so when we make the Mat constructor, it's easier to see
var mapOptions = {
     center:{lat: 39.8282, lng: -98.5795},
        zoom: 4
 };

//Now make the map
var map = new google.maps.Map(
    document.getElementById('map'),
  	mapOptions
);

//Info window that pops up when marker is clicked on
var infoWindow = new google.maps.InfoWindow({});
var markers = [];
// Make an array to hold our PoI
var poIMarkers = [];
// Set up the directionsService so we can use it
var directionsService = new google.maps.DirectionsService();
// Set up directionsDisplay so we can use it
var directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay.setMap(map);



function calcRoute() {
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };

  //Make a request, run function
  directionsService.route(request, function(result, status) {
  	// console.log(status);
  	// console.log(request);
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
}

var start = "Atlanta, GA";
var end;



//Function to place a marker at a city location
function createMarker(city){
	//We need to know where to place the marker so we need to look into the city array.
	var icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7CFE7569'
	var cityLL = {
		lat: city.lat,
		lng: city.lon
	}
	//Create a marker and call it "marker"
	var marker = new google.maps.Marker({
		position: cityLL,
		map: map,
		title: city.nameOfCity,
		icon: icon,
		animation: google.maps.Animation.DROP
	});
	//We only want ONE infoWindow!
	//What, when to run, what function to run
	google.maps.event.addListener(marker, 'click', function(){
		infoWindow.setContent(`<h2> ${city.nameOfCity}</h2><div>${city.state}</div><div>${city.yearEstimate}</div>`)
		infoWindow.open(map, marker);
	});
	// Push the marker just created above onto the global array "markers"
	markers.push(marker);
}

function createPOI(place){
	// console.log(place);
	var infoWindow = new google.maps.InfoWindow({});
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: place.icon
	});
	google.maps.event.addListener(marker, 'click', () =>{
		infoWindow.setContent(place.name);
		infoWindow.open(map, marker);
	});
	poIMarkers.push(marker);
}

/****************** REACT ***********************/

//Not this.props.cityObject.nameOfCity because we are in a function. It is not inside an object
//{} are for objects
//GoogleCity can't be a function anymore b/c we need to add in the onClick. We converted it from a function to an object to allow for onclick function. So "props" became "this.props"


var GoogleCity = React.createClass({
	// componentDidMount: function() {
	// 	console.log("A City Component Just Mounted Hook!")
	// },

	// componentWillMount: function() {
	// 	console.log("City Component Mounted Hook!")
	// },

	// componentWillReceiveProps: function(nextProps) {
	// 	console.log("Just received",nextProps)	
	// },

	getDirections: function(){
		console.log("test")
		end = this.props.cityObject.nameOfCity;
		calcRoute();
	},

	handleClickedCity: function(event){
		console.log("Someone clicked on a city!");
		//fake a click on the markers. fake click on markers[this.props.cityObject.yearRank]. when we click the marker, the info window opens up. we want the same to happen if you click any of the city name.
		//2nd parameter is what happens
		//-1 because otherwise, the index is always zero for anything clicked after the first click. we don't want this because the same info window will always stay open even if you click on a different city. New York has rank 1 so it would be [0]. so yearRank corresponds with indices -1
		google.maps.event.trigger(markers[this.props.cityObject.yearRank-1], "click")
	},
	zoomToCity: function(event){
		// console.log("Test");
		var cityLL = new google.maps.LatLng(this.props.cityObject.lat, this.props.cityObject.lon)
		//Create a new city at that location's city
		map = new google.maps.Map(
			document.getElementById('map'),
			{
				zoom: 3,
				center: cityLL
			}
		)
		//Add direction service to new map. 
		// directionsDisplay.setMap(map);
		//Old map is gone so we need to do setMap again.
		// Think of nearBySearch like this: $.getJSON(url, function())
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(
			{
				location: cityLL,
				radius: 500, //in meters
				type: ['store']
			}, 
			function(results, status){
				console.log(results);
				if(status === 'OK'){
					//We got a good response!
					//Map through the results array. We have our results array b/c google sent it back after we sent in our search request.
					results.map(function(currPlace, index){
						createPOI(currPlace)
					})
				}
			}
		);

		var bounds = new google.maps.LatLngBounds(cityLL);
		//Loop through the POI markers using Map()
		//LatLngBounds is a google bounds that stretches the map's boundaries to fix zoom problem. Boundaries are extended every time something new is added.
		poIMarkers.map(function(currMarker, index){
			bounds.extend(currMarker.getPosition());
		})
		map.fitBounds(bounds);
	},
	

	render: function(){
		return(
			<tr>
				<td className="city-name" onClick={this.handleClickedCity}>{this.props.cityObject.nameOfCity}</td>
				<td className="city-rank">{this.props.cityObject.yearRank}</td>
				{/*//When "Get Directions" button is clicked, getDirections function will fire*/}
				<td><button className="btn btn-primary" onClick={this.getDirections}>Get Directions</button></td>
				<td><button className="btn btn-success" onClick={this.zoomToCity}>Zoom</button></td>
			</tr>
		)
	}
}); 



//create a city marker and push city components onto cityRows array
 var Cities = React.createClass({
 	getInitialState: function() {
 		return{
 			currCities: this.props.cities
 		}
 	},

 	setStartingLocation: function(event){
 		start = event.target.value;
 	},

 	//when someone types something in, currCities map will re-render
 	//Right now, it is case-sensitive. Make the input values and the city names .toLowercase();
 	handleInputChange: function(event){
 		var newFilterValue = event.target.value;
 		// console.log(newFilterValue);
 		var filteredCitiesArray = [];
 		//Loop through the original list of cities to filter results!
 		this.props.cities.map(function(currCity, index){
 		//currCity is the whole city object. Look through it and look at it's city property.
 			if(currCity.nameOfCity.indexOf(newFilterValue)!== -1){
 				//hit! I don't care where it's at, but it's in the word
 				filteredCitiesArray.push(currCity);
 			} 
 		});
 		console.log(filteredCitiesArray);
 		// this.state.currCities = filteredCitiesArray BAD BECAUSE YOU SHOULDN'T SET STATE!! YOU NEED IT TO RE-RENDER!!
 		this.setState({
 			currCities: filteredCitiesArray
 		})
 	},

 	updateMarkers: function(event){
 		event.preventDefault();
 		// console.log("Update Markers!");
 		//loop through this array called markers. call the one we're on "marker". on every marker that you hit, run this function.
 		//map() is a method
 		//setMap is referring to the googlemaps
 		markers.map(function(marker, index){
 			marker.setMap(null);
 		});
 		this.state.currCities.map(function(city, index){
 			createMarker(city)
 		})
 	},

 	render: function(){
 		var cityRows = [];
 		this.state.currCities.map(function(currentCity, index){
 			createMarker(currentCity);
 			cityRows.push(<GoogleCity cityObject={currentCity} key={index} />)
 		});
 		return(
 			<div>
 			<form onSubmit={this.updateMarkers}>
 				<input type="text" onChange={this.handleInputChange}/>
 				<input type="submit" value="Update Markers" />
 			</form>
 			<form>
 				<input type="text" placeholder="Please enter starting location" onChange={this.setStartingLocation} />
 			</form>
 				<table>
 					<thead>
 						<tr>
 							<th>City Name</th>
 							<th>City Rank</th>

 						</tr>
 					</thead>
 					<tbody>
 						{cityRows}
 					</tbody>
 				</table>
 			</div>
 		)
 	}
 });



ReactDOM.render(
	<Cities cities={cities} />,
	document.getElementById('cities-container')
)