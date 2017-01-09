function Name(props){
	return(
		<p>{props.textToDisplay}</p>
	)
}

var MyForm = React.createClass({

	getInitialState: function() {
		return {
			value: ''
		}
	},

	handleChange: function(event){
		// console.log(event.target.value)
		this.setState({
			value: event.target.value
			//this is to change value property of the target object of the event object. Input box will change the value to whatever is typed into the box.
		})
	},

	render: function(){
		{/*/fires when state is changed. p tag would re-render itself*/}
		{/* The form element is the SINGLE DOM element*/}
		return(
			<form>
				<label>Name: </label>
			{/* Add an onChange handler to our input box */}
				<input type = "text" placeholder="Enter your name" onChange={this.handleChange} />
			{/* Pass our name component into this.state.value */}
				<Name textToDisplay={this.state.value} />
			</form>
		)
	}
});

ReactDOM.render(
	<MyForm />,
	document.getElementById('form-container')
)