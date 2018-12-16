import React, { Component } from 'react';
import { getReadings } from '../adapter'
import { ActionCable } from 'react-actioncable-provider';
import Graph from './Graph'

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

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
      last_5_minutes: [ ...updatedLast5, historicalReading ],
      // last_hour: [ ...updatedLastHour, historicalReading ],
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

  mouseOver = (data) => {
    const temp = data.find(datum => datum.temperature && !datum.continuous)
    const hum = data.find(datum => datum.humidity && !datum.continuous)
    if (temp && hum)
      this.setState({ hover: { temperature: temp.temperature, humidity: hum.humidity, time: temp.time } })
  }
  mouseOut = (data) => {
    if (this.state.hover && this.state.hover.time === data[0].time)
      this.setState({ hover: null })
  }

  render(){
    const { location } = this.props
    return <section>
      <hr className="graph-divider-top" />
      <h2>
        { this.props.location.name }
      </h2>
      <h3>
        Temp: { this.state.hover ? this.state.hover.temperature : this.state.latest.temperature }
      </h3>
      <ActionCable
        key={ location.slug }  
        channel={{ channel: 'ReadingsChannel', location: location.slug }}
        onReceived={this.handleReceivedReading}
      />
      <ol className="charts">
        <li>
          <Graph mouseOver={ this.mouseOver } mouseOut={ this.mouseOut } data={ this.state.last_5_minutes } isUpdate={ this.state.isUpdate } tickValues={ [5, 4, 3, 2, 1, 0] }/>
        </li>
        <li>
          <Graph mouseOver={ this.mouseOver } mouseOut={ this.mouseOut } data={ this.state.last_hour } tickValues={ [ 50,  30, 10] } />
        </li>
        <li> 
          <Graph mouseOver={ this.mouseOver } mouseOut={ this.mouseOut } data={ this.state.today } xTickFn={ this.timeOfDay } />
        </li>
        <li>
          <Graph mouseOver={ this.mouseOver } mouseOut={ this.mouseOut } data={ this.state.last_week } xTickFn={ this.dayOfWeek } range={ [ (new Date().getTime() - (7 * 24 * 60 * 60 * 1000)), new Date().getTime() ] } tickCount={ 4 } />
        </li>
      </ol>
    </section>
  }
}
