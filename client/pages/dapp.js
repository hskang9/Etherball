import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Countdown from './components/Countdown.js'
import getContract from '../lib/getContract';



class Dapp extends React.Component {
  state = {
    winner: 'N/A',
    prize: 'N/A',
    deadline: 'N/A',
    playing: 'N/A',
    players: 'N/A'

  }

  componentDidMount() {
    const {contract} = this.props
    var gameEvent = contract.Game();
    var playerEvent = contract.Players();
    var prizeEvent = contract.Prize();

    this.getDeadline()
    this.getPrize();
    this.getPlaying();
    this.getPlayer();

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

  guess = async () => {
    const { accounts, contract } = this.props
    await contract.guess(5, { from: accounts[0] })
    alert('Stored 5 into account')
  }

  getDeadline = async () => {
    const { accounts, contract } = this.props
    const response = await contract.deadline.call({ from: accounts[0] })
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

  getPlayer = async () => {
    const { accounts, contract } = this.props
    const response = await getContract.players[0].call({ from : accounts[0] })
    this.setState({ players: response })
  }

  getWinner = async () => {
    const { accounts, contract } = this.props
    const response = await getContract.winner.call({ from : accounts[0] })
    this.setState({ winner: response })
  }


  render () {
    return (
      <div>
        <Countdown date={this.state.deadline} />
        <h1>Etherball</h1>
        <h1>The way to become ethereum whale</h1>
        <h1>One Winner, One Number</h1>
        <h2>Prize:  <span>{this.state.prize}</span></h2>
        <h2># of Players: <span>{this.state.playing}</span></h2>
        <h2>Last winner: <span>{this.state.winner}</span></h2>
        <h2>{Date(this.state.deadline)}</h2>
        <input></input>
        <button onClick={this.guess}>Guess the number</button>
        <div><Link href='/'><a>Home</a></Link></div>
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
