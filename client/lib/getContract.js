import initContract from 'truffle-contract'

const getContract = async (web3, contractDefinition) => {
  const contract = initContract(contractDefinition)
  console.log(web3.currentProvider)
  contract.setProvider(web3.currentProvider)

  // Dirty hack for web3@1.0.0 support for localhost testrpc
  // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
  if (typeof contract.currentProvider.sendAsync !== 'function') {
    contract.currentProvider.sendAsync = function () {
      return contract.currentProvider.send.apply(
        contract.currentProvider, arguments
      )
    }
  }
  // Create contract on local environment
  //const instance = await contract.deployed()
  // Get contract from an address
  const instance = await contract.at("0x43f85028cf8aa7c85e715a91ceec99701320b9de")
  return instance
}

export default getContract
