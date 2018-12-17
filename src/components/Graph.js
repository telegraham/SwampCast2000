import React from 'react'
import { VictoryChart, VictoryLabel, VictoryLine, VictoryScatter, VictoryAxis, VictoryVoronoiContainer } from 'victory'

const axisStyle = { 
  axisLabel: { 
    fontFamily: "Times New Roman" 
  }, 
  tickLabels: { 
    fontFamily: "Times New Roman",
  } 
}
const axisStyleDegrees = { 
  ...axisStyle,
  tickLabels: {
    ...axisStyle.tickLabels,
    fill: "#c50"
  }
}
const axisStyleHumidity = { 
  ...axisStyle,
  tickLabels: {
    ...axisStyle.tickLabels,
    fill: "#0a7"
  }
}

const humidityFormatter = (tick) => tick + "%"
const temperatureFormatter = (tick) => tick + "°"

export default class extends React.PureComponent {

  tickValues = (arr) => {
    const now = new Date().getTime()
    return arr.map((minutesAgo) => {
      return now - minutesAgo * 60 * 1000;
    })
  }

  putDataInHoverCallback = (callbackKey) => {
    return (data) => {
      this.props[callbackKey](data)
    }
  } 

  sizeFn = (datum, active) => active ? 4 : 2

  render(){
    return (<VictoryChart containerComponent={ <VictoryVoronoiContainer 
                                                  voronoiDimension="x"
                                                  onActivated={ this.putDataInHoverCallback("mouseOver") } 
                                                  onDeactivated={ this.putDataInHoverCallback("mouseOut") }/> } 
                          height={390} 
                          domain={ { x: this.props.range } } 
                          domainPadding={ { y: 20 } } >
            <VictoryLabel 
              text={ this.props.title } 
              x={225} y={30} 
              textAnchor="middle" 
              style={ { 
                  fontFamily: "Times New Roman" 
                } }/>
            <VictoryAxis 
              scale="time"
              tickCount={ this.props.tickCount }
              tickFormat={ this.props.xTickFn || this.props.xTick }
              tickValues={ this.props.tickValues ? this.tickValues(this.props.tickValues) : this.props.tickValues }
              style={ axisStyle } />
            <VictoryAxis 
              dependentAxis 
              tickFormat={ temperatureFormatter }
              style={ axisStyleDegrees } />
            <VictoryAxis 
              dependentAxis 
              tickFormat={ humidityFormatter }
              orientation="right"
              style={ axisStyleHumidity } />
            <VictoryLine
              x="time"
              y="temperature"
              interpolation="linear" data={ this.props.data }
              style={{ data: { stroke: "#fc0" } }}
            />
            <VictoryScatter data={ this.props.data }
              x="time"
              y="temperature"
              size={ this.sizeFn }
              style={{ data: { fill: "#f00" } }}
            />
            <VictoryLine
              x="time"
              y="humidity"
              interpolation="linear" data={ this.props.data }
              style={{ data: { stroke: "#0ff" } }}
            />
            <VictoryScatter data={ this.props.data }
              x="time"
              y="humidity"
              size={ this.sizeFn }
              style={{ data: { fill: "#0e5" } }}
            />

          </VictoryChart>)
  }
}