import React, { Component } from 'react';
import { getReadings } from '../adapter'
import { ActionCable } from 'react-actioncable-provider';
import Graph from './Graph'


const celsiusToFahrenheit = c => c * 9 / 5 + 32

export default class extends Component {

  state = {
    last_5_minutes: [],
    last_hour: [],
    today: [],
    last_week: [],
    last_month: [],
    last_year: [],
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

  data(whichKey){
    return this.state[whichKey].map(reading => ({
      humidity: reading.humidity,
      temperature: celsiusToFahrenheit(reading.temperature),
      time: new Date(reading.time).getTime()
    }))
  }

  handleReceivedReading = (reading) => {
    const historicalReading = reading.historical_reading;
    this.setState({
      last_5_minutes: [ ...this.state.last_5_minutes.slice(1), historicalReading ],
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
        key={ location.slug }  
        channel={{ channel: 'ReadingsChannel', location: location.slug }}
        onReceived={this.handleReceivedReading}
      />
      <ol className="charts">
        <li>
          <Graph data={ this.data("last_5_minutes") } isUpdate={ this.state.isUpdate } tickValues={ [5, 4, 3, 2, 1, 0] }/>
        </li>
        <li>
          <Graph data={ this.data("last_hour") } tickValues={ [ 50,  30, 10] } />
        </li>
      </ol>
    </section>
  }
}
