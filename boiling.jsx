//Parent will change the state, the children will get that state from them
//Send an entire function through props (as a property from parent to child for child to send back to parent. Sending handleCelsiusChange a property.
//Remember that children have no state.
//Calculator is the parent which calls temperatureInput.


//Two utility functions to convert celsius to fahrenheit and vice versa
function toCelsius(f){
	return (f-32) * (5/9);
}

function toFahrenheit(c){
	return (c*9/5 + 32);
}


//Make another utility function that tries the conversion. If it can, it returns the conversaion rounded. If it can't, it returns an empty string. This is in case user puts in a word.
function tryConvert(value, tUnit){
	var tryNumber = Number(value);
	if(isNaN(tryNumber)){
		//This is a !!!NOT!!! a valid number we can work with! What is your problem, user?
		return '';
	}else{
		//this is a valid number (isNaN returned false). We can convert it!
		if(tUnit == 'c'){
			var convertedNumber = toFahrenheit(tryNumber);
		}else{
			var convertedNumber = toCelsius(tryNumber);
		}
		return convertedNumber;
	}
}
// console.log('100 deg f is ', tryConvert(100, 'f'), "celsius");
// console.log('0 deg c is ', tryConvert(0, 'c'), "fahrenheit");

function BoilingVerdict(props){
	if(props.celsius >= 100){
		<p>The water would boil at {props.celsius} Celsius</p>
	} else{
		return(
		<p>The water would NOT boil at {props.celsius} Fahrenheit</p>
		)
	}
}

var TemperatureInput = React.createClass({
	// getInitialState: function() {
	// 	return{value: ''} //returns empty string
	// },
	handleChange: function(event){
		// this.setState({
		// 	value: event.target.value
		// })

		//state is managed by setState whereas props are sent. Props are sent when a component is built (ex: TemperatureInput tUnits="celsius") but not managed by anything.
		//"this" refers to this component. when component is called, its attributes get sent.
		this.props.onChange(event.target.value)
	},
	render: function(){

		var value = this.props.value;
		var tUnits = this.props.tUnits;
		return(
			<div>
				<label>Enter temperature in question in {tUnits}</label>
				<input placeholder="Temp" value={value} onChange={this.handleChange} />
			</div>
		)
	}
})

var Calculator = React.createClass({
	//calculator will have state b/c it is the parent
	getInitialState: function() {
		return{
			value: 32,
			scale: 'c'
		}
	},

	handleCelsiusChange: function(value){
		this.setState({
			scale: 'c',
			value: value
		})
	}, 

	handleFahrenheitChange: function(value){
		this.setState({
			scale: 'f',
			value: value
		})
	}

	render: function(){
		// var userEnteredTemp = this.state.value;
		var scale = this.state.scale;
		var value = this.state.value;
		if (this.state.scale == 'c'){
			//this would mean that celsius was last entered. We would know this because handleCelsuisChange was run.
			var fTemp = tryConvert(value, 'c');
			var cTemp = value;
		}else if(this.state.scale == 'f'){
			var fTemp = value;
			var cTemp = tryConvert(value, 'f');
		}

		return(
			<div>
				<TemperatureInput tUnits="Celsius" value={cTemp} onChange={this.handleCelsiusChange} />
				<TemperatureInput tUnits="Fahrenheit" value={fTemp} onChange={this.handleFahrenheitChange}/>
				<BoilingVerdict celsius = {Number(cTemp)} />
			</div>
		)
	}
})


ReactDOM.render(
	<Calculator />,
	document.getElementById('boiling')
)