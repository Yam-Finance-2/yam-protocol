import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/">Home</StyledLink>
      <StyledLink exact activeClassName="active" to="/farms">Farms</StyledLink>
      <a style={{color: "#AA8592",fontWeight: 700,paddingLeft: "16px",paddingRight: "16px",textDecoration: "none"}} href="https://yieldfarming.netlify.app/yam/yamycrv/">
         Yields
      </a>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled(NavLink)`
  color: ${props => props.theme.color.grey[400]};
  font-weight: 700;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
  &.active {
    color: ${props => props.theme.color.primary.main};
  }
`

export default Nav
