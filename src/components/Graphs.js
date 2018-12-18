import React from 'react';
import Graph from './Graph'

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

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

  render(){ 
    return (<ol className="charts">
      <li>
        <Graph title="Last 5 minutes" xTickFn={ this.props.defaultXTickFn } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_5_minutes } isUpdate={ this.props.isUpdate } tickValues={ [5, 4, 3, 2, 1, 0] }/>
      </li>
      <li>
        <Graph title="This hour" xTickFn={ this.props.defaultXTickFn } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_hour } tickValues={ [ 50,  30, 10] } />
      </li>
      <li> 
        <Graph title="Last 24 hours" xTickFn={ this.timeOfDay } xTickFnLong={ this.timeOfDayLong } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.today }  />
      </li>
      <li>
        <Graph title="This week" xTickFn={ this.dayOfWeek } xTickFnLong={ this.dayOfWeekLong } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_week }  range={ [ (new Date().getTime() - (7 * 24 * 60 * 60 * 1000)), new Date().getTime() ] } tickCount={ 6 } />
      </li>
    </ol>)
    } 
}