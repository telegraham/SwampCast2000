import React from 'react'
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis } from 'victory'
import timeAgo from 'time-ago'

const xTick = (tick) => { 
  const difference = new Date() - tick;
  return difference < 5 * 1000 ? "now" :timeAgo.ago(tick, false) + " ago" 
}

const tickValues = (arr) => {
  const now = new Date().getTime()
  return arr.map((minutesAgo) => {
    return now - minutesAgo * 60 * 1000;
  })
}

export default props => (<VictoryChart height={390} domain={ { x: props.range } } domainPadding={ { y: 20 } } >
            <VictoryAxis 
              label="Time"
              scale="time"
              tickCount={ props.tickCount }
              tickFormat={ props.xTickFn || xTick }
              tickValues={ props.tickValues ? tickValues(props.tickValues) : props.tickValues }
              style={{ axisLabel: { fontFamily: "Times New Roman" }, tickLabels: { fontFamily: "Times New Roman" } }} />
            <VictoryAxis dependentAxis style={{ tickLabels: { fontFamily: "Times New Roman"} }} />
            <VictoryLine
              x="time"
              y="temperature"
              interpolation="linear" data={ props.data }
              style={{ data: { stroke: "#fc0" } }}
            />
            <VictoryScatter data={ props.data }
              x="time"
              y="temperature"
              size={2}
              style={{ data: { fill: "#f00" } }}
            />
            <VictoryLine
              x="time"
              y="humidity"
              interpolation="linear" data={ props.data }
              style={{ data: { stroke: "#0ff" } }}
            />
            <VictoryScatter data={ props.data }
              x="time"
              y="humidity"
              size={2}
              style={{ data: { fill: "#0e5" } }}
            />
          </VictoryChart>)