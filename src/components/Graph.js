import React from 'react'
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis } from 'victory'
import timeAgo from 'time-ago'

const xTick = (tick) => { 
  const difference = new Date() - tick;
  return difference < 5 * 1000 ? "now" :timeAgo.ago(tick, false) + " ago" 
}

const tickValues = () => {
  const now = new Date().getTime()
  return [5, 4, 3, 2, 1, 0].map((minutesAgo) => {
    return now - minutesAgo * 60 * 1000;
  })
}

export default props => (<VictoryChart height={390} >
            <VictoryAxis 
              label="Time"
              scale="time"
              tickFormat={ xTick }
              tickValues={ tickValues() }
              style={{ axisLabel: { fontFamily: "Times New Roman" }, tickLabels: { fontFamily: "Times New Roman" } }} />
            <VictoryAxis dependentAxis style={{ tickLabels: { fontFamily: "Times New Roman"} }} />
            <VictoryLine
              x="time"
              y="temperature"
              domain={{y: [0, 100] }}
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