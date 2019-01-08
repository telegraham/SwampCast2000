import React from 'react';
import Graph from './Graph'

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// const graphs = 

export default class extends React.PureComponent {

  timeOfDay = (value) => {
    const d = new Date(value);
    const hours = d.getHours()
    const minutes = d.getMinutes()
    return `${ hours }:${ minutes > 9 ? minutes : "0" + minutes  }`;
  }

  timeOfDayLong = (value) => {
    const isToday = (new Date()).getDay() === (new Date(value)).getDay();
    return this.timeOfDay(value) + (isToday ? " Today" : " Yesterday");
  }

  dayOfWeek = (value) => {
    return DAYS[new Date(value).getDay()];
  }

  dayOfWeekLong = (value) => {
    return DAYS_SHORT[new Date(value).getDay()] + " " + this.timeOfDay(value);
  }

  date = (value) => {
    const dateObject = new Date(value);
    const date = dateObject.getDate();
    const month = MONTHS[dateObject.getMonth()];
    return `${ month } ${ date }`;
  }
  monthYear = (value) => {
    const dateObject = new Date(value);
    const year = dateObject.getFullYear();
    const month = MONTHS[dateObject.getMonth()];
    return `${ month } ${ year }`;
  }

  fullDate = (value) => {
    const dateObject = new Date(value);
    const year = dateObject.getFullYear();
    const month = MONTHS[dateObject.getMonth()];
    const day = dateObject.getDate();
    return [month, day + ",", year].join(" ")
  }

  range(secondsAgo, secondsInTheFuture = 0) {
    const now = new Date().getTime()
    return [ (now - (secondsAgo * 1000)), now + secondsInTheFuture ];
  }

  render(){ 
    return (<ol className="charts">
      <li>
        <Graph title="Last 5 minutes" xTickFn={ this.props.defaultXTickFn } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_5_minutes } isUpdate={ this.props.isUpdate } tickValues={ [5, 4, 3, 2, 1, 0] } range={ this.range(5 * 60, 1) }/>
      </li>
      <li>
        <Graph title="This hour" xTickFn={ this.props.defaultXTickFn } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_hour } tickValues={ [ 50,  30, 10] } range={ this.range(60 * 60) } />
      </li>
      <li> 
        <Graph title="Last 24 hours" xTickFn={ this.timeOfDay } xTickFnLong={ this.timeOfDayLong } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.today } range={ this.range(24 * 60 * 60) }  />
      </li>
      <li>
        <Graph title="Last week" xTickFn={ this.dayOfWeek } xTickFnLong={ this.dayOfWeekLong } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_week } range={ this.range(7 * 24 * 60 * 60) } tickCount={ 6 } />
      </li>
      <li>
        <Graph title="Last month" xTickFn={ this.date } xTickFnLong={ this.date } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_month } />
      </li>
      <li>
        <Graph title="Last year" xTickFn={ this.monthYear } xTickFnLong={ this.fullDate } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_year } range={ this.range(365 * 24 * 60 * 60) } tickCount={ 6 } />
      </li>
    </ol>)
    } 
}