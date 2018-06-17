import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import Countdown from './components/Countdown.js'



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

  storeValue = async () => {
    const { accounts, contract } = this.props
    await contract.set(5, { from: accounts[0] })
    alert('Stored 5 into account')
  }

  getValue = async () => {
    const { accounts, contract } = this.props
    const response = await contract.get.call({ from: accounts[0] })
    this.setState({ balance: response.toNumber() })
  }

  getStart = async () => {
    const {accounts, contract} = this.props
    const response = await contract.getStart.call({ from: accounts[0] })
    this.setState({ balance: response.toNumber() })
  }

  getEthBalance = async () => {
    const { web3, accounts } = this.props
    const balanceInWei = await web3.eth.getBalance(accounts[0])
    this.setState({ ethBalance: balanceInWei / 1e18 })
  }



  render () {
    const { balance = 'N/A', ethBalance = "N/A" } = this.state
    return (
      <div>
        <Countdown date={this.state.deadline} />
        <h1>Etherball</h1>
        <h1>The way to become ethereum whale</h1>
        <h1>One Winner, One Number</h1>
        <h2>{this.state.prize}</h2>
        <h2>{this.state.playing}</h2>
        <h2>{this.state.players}</h2>
        <input></input>
        <button onClick={this.storeValue}>Guess the number</button>
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
