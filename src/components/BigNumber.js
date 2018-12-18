import React from 'react';

export default class extends React.PureComponent {

  constructor(props){
    super(props)
    this.wrapperRef = React.createRef();
  }

  state = {
    scrollY: window.pageYOffset,
    justUpdated: false
  }

  handleScroll = () => {
    this.setState({
      scrollY: window.pageYOffset
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const justUpdated = prevState.lastLatestTime && nextProps.latest.time && prevState.lastLatestTime !== nextProps.latest.time
    // console.log(prevState.lastLatestTime, nextProps.latest.time, justUpdated)

    let previous = null
    if (!nextProps.latest.time) // switched location
      previous = null
    else if (justUpdated)
      previous = prevState.latest
    else 
      previous = prevState.previous 

    // console.log(nextProps.latest.time, previous)

    return {
      justUpdated: justUpdated,
      previous,
      latest: nextProps.latest,
      lastLatestTime: nextProps.latest.time
    };
  }

  diff = (key) => {
    // console.log(this.state)
    if (!this.state.previous)
      return ""
    const latest = Math.round(this.state.latest[key])
    const previous = Math.round(this.state.previous[key])
    if (latest === previous)
      return "↔️"
    else if (latest > previous)
      return "📈"
    else if (latest < previous)
      return "📉"
  }

  componentDidMount =  function() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount =  function() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate() {
    if (this.state.justUpdated && !this.justUpdatedTimeout)
      this.justUpdatedTimeout = setTimeout(() => {
        this.setState({ justUpdated: false }, () => {
          this.justUpdatedTimeout = null;
        })
      }, 1000)
  }

  className(datum){
    const classes = ["big-number-wrapper"];

    if (this.wrapperRef && this.wrapperRef.current
      && this.state.scrollY > this.wrapperRef.current.offsetTop)
      classes.push("fixed")
    if (this.props.hover)
      classes.push("hover")
    if (!datum.time)
      classes.push("loading")
    if (this.state.justUpdated)
      classes.push("just-updated")
    return classes.join(" ")
  }

  render(){
    const datum = this.props.hover || this.props.latest;
    return (<div ref={ this.wrapperRef } className={ this.className(datum) }>
    {
      datum.time ? (<dl className="big-number">
        <dt>Temperature </dt>
        <dd className="temperature">{ Math.round(datum.temperature) }° { this.props.hover ? "" : this.diff("temperature") }</dd>
        <dt>Humidity</dt>
        <dd className="humidity">{ Math.round(datum.humidity) }% { this.props.hover ? "" : this.diff("humidity") }</dd>
        <dt>Time</dt>
        <dd className="time">{ datum.timeString || "now" }</dd>
      </dl>) : ""
    }    
    </div>)
  }


}