import React, { Component } from 'react';
import { getReadings } from '../adapter'
import { ActionCable } from 'react-actioncable-provider';
import Graph from './Graph'

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

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

  data(whichKey, sourceReadingKeyPrefix = "", sourceTimeKeyPrefix = ""){
    return this.state[whichKey].map(reading => ({
      humidity: reading[sourceReadingKeyPrefix + "humidity"],
      temperature: celsiusToFahrenheit(reading[sourceReadingKeyPrefix + "temperature"]),
      time: new Date(reading[sourceTimeKeyPrefix + "time"]).getTime()
    }))
  }

  handleReceivedReading = (reading) => {
    const historicalReading = reading.historical_reading;
    this.setState({
      last_5_minutes: [ ...this.state.last_5_minutes.slice(1), historicalReading ],
      isUpdate: true
    })
  }

  timeOfDay(value){
    const d = new Date(value);
    const hours = d.getHours()
    const minutes = d.getMinutes()
    return `${ hours }:${ minutes > 9 ? minutes : "0" + minutes  }`;
  }

  dayOfWeek(value){
    return DAYS[new Date(value).getDay()];
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
        <li> 
          <Graph data={ this.data("today", "mean_", "start_") } xTickFn={ this.timeOfDay } />
        </li>
        <li>
          <Graph data={ this.data("last_week", "mean_", "start_") } xTickFn={ this.dayOfWeek } range={ [ (new Date().getTime() - (7 * 24 * 60 * 60 * 1000)), new Date().getTime() ] } tickCount={ 4 } />
        </li>
      </ol>
    </section>
  }
}
