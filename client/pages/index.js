import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Countdown from './components/Countdown.js'
import getContract from '../lib/getContract'
import Header from './components/Header.js'

class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: 'N/A',
      prize: 'N/A',
      deadline: 'N/A',
      playing: 'N/A',
      players: 'N/A',
      value: 0
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    const {contract} = this.props
    var gameEvent = contract.Game();
    var playerEvent = contract.Players();
    var prizeEvent = contract.Prize();

    this.getDeadline()
    this.getPrize();
    this.getPlaying();


    gameEvent.watch((error, result) => {
      if(!error) {this.setState({
        deadline: result.args._deadline,
        owner: result.args._owner,
        startTime: result.args.startTime
      })} else{
       console.log(error)
      }
    })

    playerEvent.watch((error, result) => {
      if(!error) {this.setState({
        players: result.args._players,
        playing: result.args._playing,
      })} else{
       console.log(error)
      }
    })


    prizeEvent.watch((error, result) => {
      if(!error) {this.setState({
        prize: result.args._prize,
        winner: result.args._winner
      })} else {
        console.log(error)
      }
    })

  }

  handleChange(event) {
    this.setState({value: parseInt(event.target.value)});
    console.log(this.state.value)
  }

  handleSubmit(event) {
    alert('The number has been thrown: ' + this.state.value);
    const { accounts, contract } = this.props
    contract.guess.sendTransaction(this.state.value, {from: accounts[0], value: web3.toWei('0.001', 'ether')})
    alert('Number is thrown')
    event.preventDefault();
  }




  getDeadline = async () => {
    const { accounts, contract } = this.props
    const response = await contract.deadline.call()
    this.setState({ deadline: response.toNumber() })
  }

  getPrize = async () => {
    const { accounts, contract } = this.props
    const balanceInWei = await contract.prize.call({ from: accounts[0] })
    this.setState({ prize: balanceInWei / 1e18 })
  }

  getPlaying = async () => {
    const { accounts, contract } = this.props
    const response = await contract.playing.call({ from: accounts[0] })
    this.setState({ playing: response.toNumber() })
  }

  getWinner = async () => {
    const { accounts, contract } = this.props
    const response = await getContract.winner.call({ from : accounts[0] })
    this.setState({ winner: response })
  }


  render () {
    return (
      <div>
        <Header/>
        <div className="box">
          {/* Hero*/}
          <section className="hero">
            <div className="hero-body">
              <div className="container">
                <h1 className="title is-1">Etherball</h1>
                <h2 className="subtitle is-3">Ethereum lottery</h2>
              </div>
            </div>
          </section>

          {/* Countdown */}
          <Countdown date={this.state.deadline} />

          {/* Rules */}
          <div className="box">
          <h1 className="title is-1">Rule</h1>
          <p>1. The Contract creator sets the time for the end of a lottery and the number to win is set from him since Ethereum's system is deterministic and does not support random number.</p>
          <p>2. Players participate the game by guesssing the number of a lottery(Owner cannot join this game because he sets it up).</p>
          <p>3. At the end of the lottery, If there is no winner, owner gets all of the ether sent to the contract. If player guess the number, player takes 90% of ether in the contract. The creator takes 10% for setting up another game.</p>
          </div>

          {/* Game Status */}
          <div className="box">
            <h2>Prize:  <span>{this.state.prize}</span></h2>
            <h2># of Players: <span>{this.state.playing}</span></h2>
            <h2>Last winner: <span>{this.state.winner}</span></h2>
            <h2>{Date(this.state.deadline)}</h2>
            <form onSubmit={this.handleSubmit}>
              <label>
                Number:
                <input type="text" value={this.state.value} required onChange={this.handleChange} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <Dapp accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
