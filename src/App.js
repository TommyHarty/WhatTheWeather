import React, { Component } from 'react';
import LocationPicker from 'react-location-picker';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import './App.css';
import { darkskyAPI } from './utils';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: '',
      resultsVisible: false,
      apiKey: darkskyAPI,
      address: "Twin Peaks (San Francisco)",
      position: {
         lat: 37.7525,
         lng: -122.4476
      },
      day: new Date()
    }

    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.handleDayChange = this.handleDayChange.bind(this)
  }

  handleLocationChange ({ position, address }) {
    this.setState({ position, address })
  }

  handleDayChange (day) {
    this.setState({ day: new Date(day) })
  }

  handleFormSubmit = e => {
    const date = Date.parse(this.state.day) / 1000
    const url = `https://api.darksky.net/forecast/${this.state.apiKey}/${this.state.position.lat},${this.state.position.lng},${date}?exclude=flagscurrently,minutely,hourly`

    fetch(url)
      .then(response => response.json())
      .then(response => {
        this.setState({ searchResult: response.daily.data[0], resultsVisible: true })
        window.scrollTo(0, 0)
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="container">
        <p className="heading">What The Weather?</p>
        <div className="card">
          <h1 className="card-header">{this.state.address}</h1>
          <LocationPicker
            containerElement={ <div style={ {height: '100%'} } /> }
            mapElement={ <div style={ {height: '400px'} } /> }
            defaultPosition={this.state.position}
            onChange={this.handleLocationChange}
          />
        </div>
        <div className="card">
          <InfiniteCalendar
            width={'100%'}
            height={350}
            selected={this.state.day}
            onSelect={this.handleDayChange}
          />
        </div>
        <div>
          <button className="button" onClick={this.handleFormSubmit}>So, what?</button>
        </div>
        {this.state.resultsVisible && (
          <div className="results">
            <p className="heading">{this.state.searchResult.summary}</p>
            <p>{this.state.day.toString()}</p>
            <p>{this.state.address}</p>
            <button className="button" onClick={() => this.setState({ resultsVisible: false })}>Search again...</button>
          </div>
        )}
      </div>
    );
  }
}
