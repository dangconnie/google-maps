function GoogleCity(props){
	return(
		<div className = "cityName">
			
			<table border=1>
				<tr>
					<td>
					{props.cityObject.city}
					{/* We want the name of city in the city object */}
					</td>
					<td>{props.cityObject.yearRank}</td>
				</tr>
			</table>
		</div>
	)
}

var Cities = React.createClass({
	render: function(){
		var cityRows = [];
		this.props.cities.map(function(currentCity,index){
			// console.log(currentCity.city)
			//1st city in city.city is the first object we're on when we're looping through. In other words, cities[i].
			//2nd city in city.city is the city property in each of those city objects.
			//we want the city property of the currentCity we're on.
			//you can also write console.log(cities[index].city)
			cityRows.push(<GoogleCity cityObject={currentCity} key={index} />)
			//cityObject will be passed currentCity

		})
		var string = "Hello, world. I\'m cold."
		return(	
			<div>
				{cityRows}
			</div>
		)
	}
});

ReactDOM.render(
	<Cities cities={cities} />,
	document.getElementById('cities-container')
)