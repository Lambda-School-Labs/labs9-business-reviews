import React from 'react';
import styled from 'styled-components';
import Axios from 'axios';

const StyledBusiness = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  .business-card{
    border: 1px solid grey;
	  background: white;
	  border-radius: 5px;
    width: 60%;
    margin-top: 40px;
    padding: 15px;
    display: flex;
    align-items: center;
    flex-flow: column wrap;
  }
	
`;

class SearchResult extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			business: []
		};
	}

	componentDidMount() {
		const { id } = this.props.match.params;
		Axios.get(
			`https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyCJBfHA6unIW_6p7vl9KMjTVgEbt0o9XsE&placeid=${id}`
		)
			// .then(res => console.log(res.data.result.formatted_phone_number))
			.then((res) => this.setState({ business: res.data.result }))
			.catch((err) => console.log(err));
	}

	render() {
		console.log('yo: ', this.state.business);
		return (
			<StyledBusiness>
				<div className="business-card">
					<h1>{this.state.business.name}</h1>
					<h2>{this.state.business.rating}</h2>
					<p>{this.state.business.formatted_address}</p>
					<p>{this.state.business.formatted_phone_number}</p>
					<a href={this.state.business.website}>Website</a>
				</div>
			</StyledBusiness>
		);
	}
}

export default SearchResult;