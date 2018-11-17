import React, { Component } from 'react';
import { getReadings } from '../adapter'
import { ActionCable } from 'react-actioncable-provider';
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries} from 'react-vis';

export default class extends Component {

  state = {
    readings: []
  }

  componentDidMount(){
    this.setReadings()
  }

  componentDidUpdate(){
    if (this.props.location.id !== this.state.locationId)
      this.setReadings()
  }

  setReadings(){
    const { id } = this.props.location;
    // console.log(this.state)
    getReadings(id, (data) => {
      // console.log(data)
      this.setState({
        locationId: id,
        readings: data
      })
    })
  }

  processedData(){
    console.log("pd")
    // console.log(this.state.readings.map(reading => Date.parse(reading.time)))
    return this.state.readings
      .filter(reading => Date.parse(reading.time) > 1542253140000)
      .reduce((accumulator, reading) => {
        reading.data.forEach(datum => {
          accumulator.push({
            // ...datum,
            // dt: Date.parse(reading.time) + datum.seconds
            y: datum.temperature,
            x: Date.parse(reading.time) + datum.seconds
          })
        })
        return accumulator;
      }, [])
  }

  formatXAxis(huh) {
    return new Date(huh).toLocaleString()
  }

  handleReceivedReading = (reading) => {
    this.setState({
      readings: [ ...this.state.readings, reading ]
    })
  }

  render(){
    console.log(this.state.readings.length)
    const { location } = this.props
    return <section>
      <h2>
        { this.props.location.name }
      </h2>
      <ActionCable
        key={ location.id }  
        channel={{ channel: 'ReadingsChannel', location: location.id }}
        onReceived={this.handleReceivedReading}
      />
      <XYPlot height={300} width={300}>
        <LineSeries data={ this.processedData() } />
      </XYPlot>
    </section>
  }
}
