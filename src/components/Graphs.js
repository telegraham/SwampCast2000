import React from 'react';
import Graph from './Graph'

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default class extends React.PureComponent {

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
    return (<ol className="charts">
      <li>
        <Graph title="Last 5 minutes" xTick={ this.props.xTick } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_5_minutes } isUpdate={ this.props.isUpdate } tickValues={ [5, 4, 3, 2, 1, 0] }/>
      </li>
      <li>
        <Graph title="This hour" xTick={ this.props.xTick } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_hour } tickValues={ [ 50,  30, 10] } />
      </li>
      <li> 
        <Graph title="Last 24 hours" xTick={ this.props.xTick } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.today } xTickFn={ this.timeOfDay } />
      </li>
      <li>
        <Graph title="This week" xTick={ this.props.xTick } mouseOver={ this.props.mouseOver } mouseOut={ this.props.mouseOut } data={ this.props.last_week } xTickFn={ this.dayOfWeek } range={ [ (new Date().getTime() - (7 * 24 * 60 * 60 * 1000)), new Date().getTime() ] } tickCount={ 6 } />
      </li>
    </ol>)
    } 
}