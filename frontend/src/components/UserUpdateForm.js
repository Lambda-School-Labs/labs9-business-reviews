import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { backendLink } from '../assets/config';
import styled from 'styled-components';
import { withRouter } from 'react-router';

const FormDiv = styled.div`
  margin: 0 auto;
  width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p {
    display: flex;
    justify-content: center;
  }
  img {
    width: 100px;
    border-radius: 50%;
    margin: 0 auto;
  }

  form {
    width: 500px;
    display: flex;
    flex-direction: column;
    margin: 2rem auto;

    label {
      margin: 0.5rem auto;
    }
    input[type='text'] {
      width: 80%;
      padding: 5px;
      margin: 0 auto;
    }
    input[type='submit'] {
      background-color: #ffc40e;
      font-family: 'roboto';
      margin: 10px auto;
      padding: 10px;
      float: center;
      width: 100%;
    }
  }
`;

class UserUpdateForm extends Component {
  state = {
    user: {},
    updatedUser: {},
    name: '',
    email: '',
    location: '',
    description: ''
  };
  async componentDidMount() {
    const res = await axios.get(`${backendLink}/api/user/me`, {
      withCredentials: true
    });
    const [user] = res.data.user;
    this.setState({ user });
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.name && this.state.email && this.state.location && this.state.description) {
      this.setState(this.state.updatedUser = { 
        name: this.state.name,
        email: this.state.email,
        location: this.state.location,
        description: this.state.description
       });
    } else if (this.state.name && this.state.email && this.state.location) {
      this.setState(this.state.updatedUser = {
        name: this.state.name,
        email: this.state.email,
        location: this.state.location,
      });
    } else if (this.state.email && this.state.location && this.state.description) {
      this.setState(this.state.updatedUser = { 
        email: this.state.email,
        location: this.state.location,
        description: this.state.description
       });
    } else if (this.state.name && this.state.location && this.state.description) {
      this.setState(this.state.updatedUser = { 
        email: this.state.name,
        location: this.state.location,
        description: this.state.description
       });
    } else if ( this.state.name && this.state.email ) {
      this.setState(this.state.updatedUser = {
        name: this.state.name,
        email: this.state.email,
      });

    } else if (this.state.email && this.state.location) {
      this.setState(this.state.updatedUser = { 
        email: this.state.email,
        location: this.state.location,
       });
    } else if (this.state.location && this.state.description) {
      this.setState(this.state.updatedUser = { 
        location: this.state.location,
        description: this.state.description
       });
    } else if (this.state.location) {
      this.setState(this.state.updatedUser = { 
        location: this.state.location,
       });
    } else if (this.state.description) {
      this.setState(this.state.updatedUser = {
        description: this.state.description
      });
    } else if (this.state.name ) {
      this.setState(this.state.updatedUser = {
        name: this.state.name
      });
    } else if (this.state.email ) {
      this.setState(this.state.updatedUser = { 
        email: this.state.email,
       });

    }
    const user = {...this.state.updatedUser}
    const res = await axios.put(
      `${backendLink}/api/user/${this.state.user.id}`,
      user,
      {
        withCredentials: 'include'
      }
    );
    if (res.data.error) {
      return console.log(res.data.error);
    }
    alert('successfully updated your credentials');
    return this.props.history.push('/');
  };

  render() {
    return (
      <FormDiv>
        <img src={this.state.user.gravatar} alt={this.state.user.name} />
        <p><a href='http://gravatar.com'> Edit Gravatar </a></p>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="name">Name :</label>
          <input
            onChange={this.onChange}
            name="name"
            placeholder={this.state.user.name}
            value={this.state.name}
          />
          <label htmlFor="email">Email :</label>
          <input
            onChange={this.onChange}
            name="email"
            placeholder={this.state.user.email}
            value={this.state.email}
          />
          <label htmlFor="location">Location :</label>
          <input
            onChange={this.onChange}
            name="location"
            placeholder={this.state.user.location}
            value={this.state.location}
          />
          <label htmlFor="description">Description :</label>
          <input
            onChange={this.onChange}
            name="description"
            placeholder={this.state.user.description}
            value={this.state.description}
          />
          <input type="submit" value="Update User" />
        </form>
        <Link to='/updatepassword'> Change Password </Link>
      </FormDiv>
    );
  }
}

export default withRouter(UserUpdateForm);
