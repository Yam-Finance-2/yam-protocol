var fs = require('fs')

// ============ Contracts ============


// Protocol
// deployed second
const YAMImplementation = artifacts.require("YAMDelegate");
const YAMProxy = artifacts.require("YAMDelegator");

// deployed third
const YAMReserves = artifacts.require("YAMReserves");
const YAMRebaser = artifacts.require("YAMRebaser");

const Gov = artifacts.require("GovernorAlpha");
const Timelock = artifacts.require("Timelock");

// deployed fourth
const YAM_YAMPool = artifacts.require("YAMYAMPool");
const YAM_YCRVPool = artifacts.require("YAMYCRVPool");
const YAM_ETHPool = artifacts.require("YAMETHPool");

// deployed fifth
const YAMIncentivizer = artifacts.require("YAMIncentivizer");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    // deployTestContracts(deployer, network),
    deployDistribution(deployer, network, accounts),
    // deploySecondLayer(deployer, network)
  ]);
}

module.exports = migration;

// ============ Deploy Functions ============


async function deployDistribution(deployer, network, accounts) {
  console.log(network)

  let rebase = new web3.eth.Contract(YAMRebaser.abi, YAMRebaser.address);
  let pair = await rebase.methods.uniswap_pair().call();

  let yam = await YAMProxy.deployed();
  let yReserves = await YAMReserves.deployed()
  let yRebaser = await YAMRebaser.deployed()
  let tl = await Timelock.deployed();
  let gov = await Gov.deployed();

  // console.log("deploying pools")

  if (network != "test") {
    // await deployer.deploy(YAM_YAMPool, YAMProxy.address);
    // await deployer.deploy(YAM_YCRVPool, YAMProxy.address);
    // await deployer.deploy(YAM_ETHPool, YAMProxy.address);
    // await deployer.deploy(YAMIncentivizer, pair, YAMProxy.address);
    //
    let yam1_pool = new web3.eth.Contract(YAM_YAMPool.abi, '0x880f0550F0972231Dad1EBa238F5925367338C6D');
    let ycrv_pool = new web3.eth.Contract(YAM_YCRVPool.abi, '0xE29b7D23e47c16B8EedF50a17A03649F5Db35433');
    let eth_pool = new web3.eth.Contract(YAM_ETHPool.abi, '0xd9c5472986A1a6E12390ceeb7a28A2D236D5CA02');
    let yam_ycrv_pool = new web3.eth.Contract(YAMIncentivizer.abi, '0xf20c3357782EfA7016a8eC40c21ff46E5bdd0B39');
    //
    // console.log("setting distributor");
    // await Promise.all([
    //     yam1_pool.methods.setRewardDistribution("0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0").send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
    //     ycrv_pool.methods.setRewardDistribution("0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0").send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
    //     eth_pool.methods.setRewardDistribution("0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0").send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
    //     yam_ycrv_pool.methods.setRewardDistribution("0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0").send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
    //   ]);
    //
    // let one_hundred = web3.utils.toBN(10**3).mul(web3.utils.toBN(10**18)).mul(web3.utils.toBN(100));
    //
    // console.log("transfering");
    // await Promise.all([
    //   yam.transfer(YAM_YAMPool.address, one_hundred.toString()),
    //   yam.transfer(YAM_YCRVPool.address, one_hundred.toString()),
    //   yam.transfer(YAM_ETHPool.address, one_hundred.toString()),
    //   yam._setIncentivizer(YAMIncentivizer.address),
    // ]);
    //
    // console.log("notifying")
    // await Promise.all([
    //   yam1_pool.methods.notifyRewardAmount(one_hundred.toString()).send({from:"0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0"}),
    //   ycrv_pool.methods.notifyRewardAmount(one_hundred.toString()).send({from:"0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0"}),
    //   eth_pool.methods.notifyRewardAmount(one_hundred.toString()).send({from:"0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0"}),
    //
    //   // incentives is a minter and prepopulates itself.
    //   yam_ycrv_pool.methods.notifyRewardAmount("0").send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 500000}),
    // ]);
    //
    // console.log("set reward distribution to timelock")
    // await Promise.all([
      // yam1_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
      // ycrv_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
      // eth_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
      // yam_ycrv_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
    // ]);
    // console.log("transer ownership for pools")
    // await Promise.all([
    //   yam1_pool.methods.transferOwnership(Timelock.address).send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
    //   ycrv_pool.methods.transferOwnership(Timelock.address).send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
    //   eth_pool.methods.transferOwnership(Timelock.address).send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
    //   yam_ycrv_pool.methods.transferOwnership(Timelock.address).send({from: "0x6a59ff65Dbf14788F74e2ea2503DE500FA99cBa0", gas: 100000}),
    // ]);
  }

  // console.log("transer ownership for all")
  //
  // await Promise.all([
  //   yam._setPendingGov(Timelock.address),
  //   yReserves._setPendingGov(Timelock.address),
  //   yRebaser._setPendingGov(Timelock.address),
  // ]);

  console.log("accept ownership")
  await Promise.all([
      tl.executeTransaction(
        YAMProxy.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),

      tl.executeTransaction(
        YAMReserves.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),

      tl.executeTransaction(
        YAMRebaser.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
  ]);

  console.log("set and accept ownership for gov")
  await tl.setPendingAdmin(Gov.address);
  await gov.__acceptAdmin();
  await gov.__abdicate();
}
