import React, { Component } from 'react';
import { getReadings } from '../adapter'
import { ActionCable } from 'react-actioncable-provider';
import Graphs from './Graphs'
import BigNumber from './BigNumber'

import timeAgo from 'time-ago'


const celsiusToFahrenheit = c => c * 9 / 5 + 32

export default class extends Component {

  state = {
    latest: {},
    last_5_minutes: [],
    last_hour: [],
    today: [],
    last_week: [],
    // last_month: [],
    // last_year: [],
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
        latest: this.formatDatum(data.latest),
        last_5_minutes: this.data(data.last_5_minutes),
        last_hour: this.data(data.last_hour, "mean_", "start_"),
        today: this.data(data.today, "mean_", "start_"),
        last_week: this.data(data.last_week, "mean_", "start_"),
        locationSlug: slug,
        isUpdate: false
      })
    })
  }

  data(dataArray, sourceReadingKeyPrefix = "", sourceTimeKeyPrefix = ""){
    return dataArray.map((datum) => this.formatDatum(datum, sourceReadingKeyPrefix, sourceTimeKeyPrefix))
  }

  formatDatum = (reading, sourceReadingKeyPrefix = "", sourceTimeKeyPrefix = "") => ({
    humidity: reading[sourceReadingKeyPrefix + "humidity"],
    temperature: celsiusToFahrenheit(reading[sourceReadingKeyPrefix + "temperature"]),
    time: new Date(reading[sourceTimeKeyPrefix + "time"]).getTime()
  })

  handleReceivedReading = (reading) => {
    const ago5 = new Date() - 5 * 60 * 1000
    // const ago60 = new Date() - 60 * 60 * 1000
    const updatedLast5 = this.state.last_5_minutes.filter(reading => reading.time > ago5)
    // const updatedLastHour = this.state.last_hour.filter(reading => reading.time > ago60)
    const historicalReading = this.formatDatum(reading.historical_reading);
    this.setState({
      latest: historicalReading,
      last_5_minutes: [ ...updatedLast5, historicalReading ],
      // last_hour: [ ...updatedLastHour, historicalReading ],
      isUpdate: true
    })
  }

  xTick = (tick) => { 
    const difference = new Date() - tick;
    return difference < 5 * 1000 ? "now" : timeAgo.ago(tick, false) + " ago" 
  }

  mouseOver = (data) => {
    // // console.log("over", data[0] ? data[0].time : null)
    const temp = data.find(datum => datum.temperature && !datum.continuous)
    const hum = data.find(datum => datum.humidity && !datum.continuous)
    if (temp && hum)
      this.setState({ hover: { temperature: temp.temperature, humidity: hum.humidity, time: temp.time } })
      // this.setState({ hover: { temperature: 9, humidity: 3, time: 200 } })
  }
  mouseOut = (data) => {
    // console.log("out", data[0] ? data[0].time : null, this.state.hover && this.state.hover.time === data[0].time ? "matches state" : "nope")
    // if (this.state.hover && this.state.hover.time === data[0].time)
    this.setState((prevState) => {
      if (!data[0] || (prevState.hover && prevState.hover.time === data[0].time))
        return { hover: null }
      else
        return { }
    })
  }

  render(){
    const { location } = this.props;
    return <section>
      <hr className="graph-divider-top" />
      <h2>
        { this.props.location.name }
      </h2>
      <BigNumber hover={ this.state.hover } latest={ this.state.latest } xTick={ this.xTick } />
      <ActionCable
        key={ location.slug }  
        channel={{ channel: 'ReadingsChannel', location: location.slug }}
        onReceived={this.handleReceivedReading}
      />
      <Graphs 
        mouseOver={ this.mouseOver } 
        mouseOut={ this.mouseOut } 
        last_5_minutes={ this.state.last_5_minutes }
        last_hour={ this.state.last_hour }
        today={ this.state.today }
        last_week={ this.state.last_week }
        isUpdate={ this.state.isUpdate }
        xTick={ this.xTick }
        />
    </section>
  }
}
