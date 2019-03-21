import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MyReviews from './MyReviews';
import NavBar from './NavBar';
import image from '../assets/white-waves.png';

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${image});
  height: auto;
  .user__password {
    display: flex;
    width: 20%;
    align-items: center;
    justify-content: center;
    .user__password--link {
      font-family: Roboto;
      text-decoration: none;
      border-bottom: 1px solid black;
      text-transform: uppercase;
      font-weight: bold;
      color: black;
    }
  }
`;

class UserProfile extends React.Component {
  render() {
    const { id } = this.props.match.params;
    return (
      <div>
        <NavBar />
        <StyledContainer>
          <Link to ='/updateuser'>Update User Profile </Link>
          <MyReviews className='header' {...this.props} id={id} />
        </StyledContainer>
      </div>
    );
  }
}

export default UserProfile;
