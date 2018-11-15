import React, { Component } from 'react';
import { getReadings } from '../adapter'
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

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
    // console.log(this.state.readings.map(reading => Date.parse(reading.time)))
    return this.state.readings
      .filter(reading => Date.parse(reading.time) > 1542253140000)
      .reduce((accumulator, reading) => {
        reading.data.forEach(datum => {
          accumulator.push({
            ...datum,
            dt: Date.parse(reading.time) + datum.seconds
          })
        })
        return accumulator;
      }, [])
  }

  formatXAxis(huh) {
    return new Date(huh).toLocaleString()
  }

  render(){
    return <section>
      <h2>
        { this.props.location.name }
      </h2>
      <LineChart width={800} height={600} data={ this.processedData() }>
        <XAxis dataKey="dt" tickFormatter={ this.formatXAxis } tickCount={ 10 } />
        <YAxis/>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
        <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
      </LineChart>
    </section>
  }
}
