import React, { Component } from 'react';
import { getReadings } from '../adapter'
import { ActionCable } from 'react-actioncable-provider';
import Graph from './Graph'

export default class extends Component {

  state = {
    last_5_minutes: []
  }

  componentDidMount(){
    this.setReadings()
  }

  componentDidUpdate(){
    if (this.props.location.slug !== this.state.locationSlug)
      this.setReadings()
  }

  setReadings(){
    const { slug } = this.props.location;
    // console.log(this.state)
    getReadings(slug, (data) => {
      // console.log(data)
      this.setState({
        ...data,
        locationSlug: slug,
        isUpdate: false
      })
    })
  }

  data(){
    return this.state.last_5_minutes.map(reading => ({
      humidity: reading.humidity,
      temperature: reading.temperature,
      time: new Date(reading.time).getTime()
    }))
  }

  handleReceivedReading = (reading) => {
    const historicalReading = reading.historical_reading;
    this.setState({
      last_5_minutes: [ ...this.state.last_5_minutes, historicalReading ],
      isUpdate: true
    })
  }

  render(){
    const { location } = this.props
    return <section>
      <hr className="graph-divider-top" />
      <h2>
        { this.props.location.name }
      </h2>
      <ActionCable
        key={ location.id }  
        channel={{ channel: 'ReadingsChannel', location: location.slug }}
        onReceived={this.handleReceivedReading}
      />
      <ol className="charts">
        <li>
          <Graph data={ this.data() } isUpdate={ this.state.isUpdate }/>
        </li>
      </ol>
    </section>
  }
}
