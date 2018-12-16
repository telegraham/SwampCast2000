import React from 'react'
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis, VictoryVoronoiContainer } from 'victory'
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

// const scatterEvents = (props) => ([{
//   target: "data",
//   eventHandlers: {
//     onActivated: (event, datum) => ({ 
//       mutation: () => {
//         props.mouseOver(datum.datum)
//         return { }
//       }
//     }),
//     onDeactivated: (event, datum) => ({ 
//       mutation: () => {
//         props.mouseOut(datum.datum)
//         return { }
//       }
//     })
//   }
// }])

const putDataInHoverCallback = (callback) => {
  return (one) => {
    callback(one)
  }
} 


const sizeFn = (datum, active) => active ? 4 : 2

export default props => (<VictoryChart 
                          containerComponent={ <VictoryVoronoiContainer 
                                                  voronoiDimension="x"
                                                  onActivated={ putDataInHoverCallback(props.mouseOver) } 
                                                  onDeactivated={ putDataInHoverCallback(props.mouseOut) }/> } 
                          height={390} 
                          domain={ { x: props.range } } 
                          domainPadding={ { y: 20 } } >
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
              size={ sizeFn }
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
              size={ sizeFn }
              style={{ data: { fill: "#0e5" } }}
            />
          </VictoryChart>)