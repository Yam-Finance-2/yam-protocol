import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';
import * as Types from "./types.js";
import { SUBTRACT_GAS_LIMIT, addressMap } from './constants.js';

import ERC20Json from '../clean_build/contracts/IERC20.json';
import YAMJson from '../clean_build/contracts/YAMDelegator.json';
import YAMRebaserJson from '../clean_build/contracts/YAMRebaser.json';
import YAMReservesJson from '../clean_build/contracts/YAMReserves.json';
import YAMGovJson from '../clean_build/contracts/GovernorAlpha.json';
import YAMTimelockJson from '../clean_build/contracts/Timelock.json';
import WETHJson from './weth.json';
import UNIFactJson from './unifact2.json';
import UNIPairJson from './uni2.json';
import UNIRouterJson from './uniR.json';

import YAM1PoolJson from '../clean_build/contracts/YAMYAMPool.json';
import YCRVPoolJson from '../clean_build/contracts/YAMYCRVPool.json';
import WETHPoolJson from '../clean_build/contracts/YAMETHPool.json';
import IncJson from '../clean_build/contracts/YAMIncentivizer.json';

export class Contracts {
  constructor(
    provider,
    networkId,
    web3,
    options
  ) {
    this.web3 = web3;
    this.defaultConfirmations = options.defaultConfirmations;
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5;
    this.confirmationType = options.confirmationType || Types.ConfirmationType.Confirmed;
    this.defaultGas = options.defaultGas;
    this.defaultGasPrice = options.defaultGasPrice;

    this.uni_pair = new this.web3.eth.Contract(UNIPairJson);
    this.uni_router = new this.web3.eth.Contract(UNIRouterJson, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');
    this.uni_fact = new this.web3.eth.Contract(UNIFactJson, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
    this.ycrv = new this.web3.eth.Contract(ERC20Json.abi, '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8');
    this.yam1 = new this.web3.eth.Contract(YAMJson.abi, '0x0e2298E3B3390e3b945a5456fBf59eCc3f55DA16');
    this.yam = new this.web3.eth.Contract(YAMJson.abi, '0x49411930AC0c14713e36Db62700FBE31017aCc9A');

    this.yam1_pool = new this.web3.eth.Contract(YAM1PoolJson.abi, '0x880f0550F0972231Dad1EBa238F5925367338C6D');
    this.ycrv_pool = new this.web3.eth.Contract(YCRVPoolJson.abi, '0xE29b7D23e47c16B8EedF50a17A03649F5Db35433');
    this.eth_pool = new this.web3.eth.Contract(WETHPoolJson.abi, '0xd9c5472986A1a6E12390ceeb7a28A2D236D5CA02');
    this.yam_ycrv_pool = new this.web3.eth.Contract(IncJson.abi, '0xf20c3357782EfA7016a8eC40c21ff46E5bdd0B39');

    this.yam_ycrv_uni_lp = new this.web3.eth.Contract(ERC20Json.abi, '0xC329BC05CC9fb5f4e8dA13Bf6A849D33dD2A167b');

    this.erc20 = new this.web3.eth.Contract(ERC20Json.abi);

    this.rebaser = new this.web3.eth.Contract(YAMRebaserJson.abi, '0x511EaFF0192327F22aBD87dd6f7Fd42e20FFBF9B');
    this.reserves = new this.web3.eth.Contract(YAMReservesJson.abi, '0x090FA55fB6Bea4F8f2Fa162B1a054496344F8065');
    this.gov = new this.web3.eth.Contract(YAMGovJson.abi, '0xCfF48086cD9840261D19319cCe360bB1683AfA72');
    this.timelock = new this.web3.eth.Contract(YAMTimelockJson.abi, '0x34F5BdF7f03F62e1e26ffA8b46574303E1c044B0');
    this.weth = new this.web3.eth.Contract(WETHJson, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
    this.setProvider(provider, networkId);
    this.setDefaultAccount(this.web3.eth.defaultAccount);
  }


  setProvider(
    provider,
    networkId
  ) {
    this.yam.setProvider(provider);
    this.rebaser.setProvider(provider);
    this.reserves.setProvider(provider);
    this.gov.setProvider(provider);
    this.timelock.setProvider(provider);
    const contracts = [
      { contract: this.yam, json: YAMJson },
      { contract: this.rebaser, json: YAMRebaserJson },
      { contract: this.reserves, json: YAMReservesJson },
      { contract: this.gov, json: YAMGovJson },
      { contract: this.timelock, json: YAMTimelockJson },
      { contract: this.yam_ycrv_pool, json: IncJson },
      { contract: this.yam1_pool, json: YAM1PoolJson },
      { contract: this.ycrv_pool, json: YCRVPoolJson },
      { contract: this.eth_pool, json: WETHPoolJson },
    ]

    contracts.forEach(contract => this.setContractProvider(
        contract.contract,
        contract.json,
        provider,
        networkId,
      ),
    );
    this.yam1.options.address = addressMap["YAM1"];
    this.ycrv.options.address = addressMap["YCRV"];
    this.weth.options.address = addressMap["WETH"];
    this.yam_ycrv_uni_lp.options.address = addressMap["YAMYCRV"];
    this.uni_fact.options.address = addressMap["uniswapFactoryV2"];
    this.uni_router.options.address = addressMap["UNIRouter"];

    this.pools = [
      {"tokenAddr": this.ycrv.options.address, "poolAddr": '0xE29b7D23e47c16B8EedF50a17A03649F5Db35433'},
      {"tokenAddr": this.weth.options.address, "poolAddr": '0xd9c5472986A1a6E12390ceeb7a28A2D236D5CA02'},
      {"tokenAddr": this.yam1.options.address, "poolAddr": '0x880f0550F0972231Dad1EBa238F5925367338C6D'},
    ]
  }

  setDefaultAccount(
    account
  ) {
    this.ycrv.options.from = account;
    this.yam1.options.from = account;
    this.yam.options.from = account;
    this.weth.options.from = account;
  }

  async callContractFunction(
    method,
    options
  ) {
    const { confirmations, confirmationType, autoGasMultiplier, ...txOptions } = options;

    if (!this.blockGasLimit) {
      await this.setGasLimit();
    }

    if (!txOptions.gasPrice && this.defaultGasPrice) {
      txOptions.gasPrice = this.defaultGasPrice;
    }

    if (confirmationType === Types.ConfirmationType.Simulate || !options.gas) {
      let gasEstimate;
      if (this.defaultGas && confirmationType !== Types.ConfirmationType.Simulate) {
        txOptions.gas = this.defaultGas;
      } else {
        try {
          console.log("estimating gas");
          gasEstimate = await method.estimateGas(txOptions);
        } catch (error) {
          const data = method.encodeABI();
          const { from, value } = options;
          const to = method._parent._address;
          error.transactionData = { from, value, data, to };
          throw error;
        }

        const multiplier = autoGasMultiplier || this.autoGasMultiplier;
        const totalGas = Math.floor(gasEstimate * multiplier);
        txOptions.gas = totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit;
      }

      if (confirmationType === Types.ConfirmationType.Simulate) {
        let g = txOptions.gas;
        return { gasEstimate, g };
      }
    }

    if (txOptions.value) {
      txOptions.value = new BigNumber(txOptions.value).toFixed(0);
    } else {
      txOptions.value = '0';
    }

    const promi = method.send(txOptions);

    const OUTCOMES = {
      INITIAL: 0,
      RESOLVED: 1,
      REJECTED: 2,
    };

    let hashOutcome = OUTCOMES.INITIAL;
    let confirmationOutcome = OUTCOMES.INITIAL;

    const t = confirmationType !== undefined ? confirmationType : this.confirmationType;

    if (!Object.values(Types.ConfirmationType).includes(t)) {
      throw new Error(`Invalid confirmation type: ${t}`);
    }

    let hashPromise;
    let confirmationPromise;

    if (t === Types.ConfirmationType.Hash || t === Types.ConfirmationType.Both) {
      hashPromise = new Promise(
        (resolve, reject) => {
          promi.on('error', (error) => {
            if (hashOutcome === OUTCOMES.INITIAL) {
              hashOutcome = OUTCOMES.REJECTED;
              reject(error);
              const anyPromi = promi ;
              anyPromi.off();
            }
          });

          promi.on('transactionHash', (txHash) => {
            if (hashOutcome === OUTCOMES.INITIAL) {
              hashOutcome = OUTCOMES.RESOLVED;
              resolve(txHash);
              if (t !== Types.ConfirmationType.Both) {
                const anyPromi = promi ;
                anyPromi.off();
              }
            }
          });
        },
      );
    }

    if (t === Types.ConfirmationType.Confirmed || t === Types.ConfirmationType.Both) {
      confirmationPromise = new Promise(
        (resolve, reject) => {
          promi.on('error', (error) => {
            if (
              (t === Types.ConfirmationType.Confirmed || hashOutcome === OUTCOMES.RESOLVED)
              && confirmationOutcome === OUTCOMES.INITIAL
            ) {
              confirmationOutcome = OUTCOMES.REJECTED;
              reject(error);
              const anyPromi = promi ;
              anyPromi.off();
            }
          });

          const desiredConf = confirmations || this.defaultConfirmations;
          if (desiredConf) {
            promi.on('confirmation', (confNumber, receipt) => {
              if (confNumber >= desiredConf) {
                if (confirmationOutcome === OUTCOMES.INITIAL) {
                  confirmationOutcome = OUTCOMES.RESOLVED;
                  resolve(receipt);
                  const anyPromi = promi ;
                  anyPromi.off();
                }
              }
            });
          } else {
            promi.on('receipt', (receipt) => {
              confirmationOutcome = OUTCOMES.RESOLVED;
              resolve(receipt);
              const anyPromi = promi ;
              anyPromi.off();
            });
          }
        },
      );
    }

    if (t === Types.ConfirmationType.Hash) {
      const transactionHash = await hashPromise;
      if (this.notifier) {
          this.notifier.hash(transactionHash)
      }
      return { transactionHash };
    }

    if (t === Types.ConfirmationType.Confirmed) {
      return confirmationPromise;
    }

    const transactionHash = await hashPromise;
    if (this.notifier) {
        this.notifier.hash(transactionHash)
    }
    return {
      transactionHash,
      confirmation: confirmationPromise,
    };
  }

  async callConstantContractFunction(
    method,
    options
  ) {
    const m2 = method;
    const { blockNumber, ...txOptions } = options;
    return m2.call(txOptions, blockNumber);
  }

  async setGasLimit() {
    const block = await this.web3.eth.getBlock('latest');
    this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT;
  }

  setContractProvider(
    contract,
    contractJson,
    provider,
    networkId,
  ){
    contract.setProvider(provider);
    try {
      contract.options.address = contractJson.networks[networkId]
        && contractJson.networks[networkId].address;
    } catch (error) {
      // console.log(error)
    }
  }
}
