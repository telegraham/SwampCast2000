import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';


import { getLocations } from './adapter'

import Location from './components/Location'
import Nav from './components/Nav'
import Home from './components/Home'


export default class extends Component {

  state = {
    locations: []
  }

  componentDidMount(){
    getLocations(data => {
      this.setState({ locations: data });
    });
  }

  renderLocation = (renderProps) => {
    const slug = renderProps.match.params.locationSlug;
    const location = this.state.locations.find(location => location.slug === slug)
    if (location)
      return <Location location={ location } />
    else
      return <React.Fragment />
  }

  render(){
    return (
      <React.Fragment>
        <Nav locations={ this.state.locations } />
        <h1 className="header-main">
          <NavLink to="/">SwampCast 2000</NavLink>
        </h1>
        <hr className="graph-divider-top" />
        <Route exact path="/" component={ Home } /> 
        <Route path="/:locationSlug" render={ this.renderLocation } />
      </React.Fragment>
    );
  }

}
