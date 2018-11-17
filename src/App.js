import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import { getLocations } from './adapter'

import Locations from './components/Locations'
import Graph from './components/Graph'


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
      return <Graph location={ location } />
    else
      return <React.Fragment />
  }

  render(){
    return (
      <React.Fragment>
        <h1>Temperature TCF</h1>
        <Locations locations={ this.state.locations } />
        <Route path="/:locationSlug" render={ this.renderLocation } />
      </React.Fragment>
    );
  }

}
