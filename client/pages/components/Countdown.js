import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Countdown extends Component {
  constructor(props) {
    super(props);


    this.state = {
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
    }
  }

  componentWillMount() {
    // update every second
    this.interval = setInterval(() => {
      const date = this.calculateCountdown(this.props.date);
      date ? this.setState(date) : this.stop();
    }, 1000);
  }

  componentWillUnmount() {
    this.stop();
  }

  calculateCountdown(endDate) {
    let diff = (endDate*1000 - Date.now()) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) { // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) { // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;

    return timeLeft;
  }

  stop() {
    clearInterval(this.interval);
  }

  addLeadingZeros(value) {
    value = String(value);
    while (value.length < 2) {
      value = '0' + value;
    }
    return value;
  }

  render() {
    const countDown = this.state;

    return (
      <div className="Countdown box">
      <style jsx>{`
      .Countdown{
         margin: 10px auto;
         padding-bottom: 20px;
         background-color: white;
         text-align: center;
      }

      .Countdown-col{
         display: inline-block;
      }

      .Countdown-col-element{
         display: inline-block;
         margin: 0 20px;
         display: flex;
         flex-direction: column;
      }

      .Countdown-col-element strong{
         font-size: 50px;
      }
      `}</style>
      <h1> Time left:</h1>
        <span className="Countdown-col">
          <span className="Countdown-col-element">
              <strong >{this.addLeadingZeros(countDown.days)}</strong>
              <span>{countDown.days === 1 ? 'Day' : 'Days'}</span>
          </span>
        </span>

        <span className="Countdown-col">
          <span className="Countdown-col-element">
            <strong>{this.addLeadingZeros(countDown.hours)}</strong>
            <span>Hours</span>
          </span>
        </span>


        <span className="Countdown-col">
          <span className="Countdown-col-element">
            <strong>{this.addLeadingZeros(countDown.min)}</strong>
            <span>Min</span>
          </span>
        </span>

        <span className="Countdown-col">
          <span className="Countdown-col-element">
            <strong>{this.addLeadingZeros(Math.floor(countDown.sec))}</strong>
            <span>Sec</span>
          </span>
        </span>
      </div>
    );
  }
}

Countdown.propTypes = {
  date: PropTypes.number.isRequired || PropTypes.strring.isRequired
};


export default Countdown;
