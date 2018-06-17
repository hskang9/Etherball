const Etherball = artifacts.require('./Etherball.sol')

module.exports = function (deployer) {
  //deployer.deploy(SimpleStorage)
  deployer.deploy(Etherball,1530337194, "0x66baEE296244226CCD732b50856b9E142D05eaA2", 100)
}
