import {configs} from '../../common/config/data'
const set = (settings)=>{
  localStorage.settings = JSON.stringify(settings)
}
const get = ()=>{
  if(localStorage.settings){
     return JSON.parse(localStorage.settings)
  }else{
    const latestContract = configs.contracts[configs.contracts.length-1]
    const relays = configs.relays
    let sortedRelays = relays.map((item, i) => {
      item.id = i;
      return item
    })
    return {
      preference: {
        language: "en-US",
        currency: "USD",
        timezone: "UTC+00:00"
      },
      trading: {
        contract: {
          version: latestContract.version,
          address: latestContract.address
        },
        timeToLive: configs.defaultExpireTime,
        timeToLiveUnit: configs.defaultExpireTimeUnit,
        lrcFee: configs.defaultLrcFeePermillage,
        marginSplit: configs.defaultMarginSplitPercentage,
        gasPrice: configs.defaultGasPrice
      },
      relay: {
        selected: sortedRelays[0].value,
        nodes: sortedRelays
      }
    }
  }
}
const getRelay = ()=>{
  const defaultHost = '//relay1.loopring.io'
  return defaultHost
  if(localStorage.settings){
     const settings = JSON.parse(localStorage.settings)
     return settings.relay.selected || defaultHost
  }else{
    return defaultHost
  }
}
const getContractVersion = ()=>{
  const defaultVersion = 'v1.3'
  return defaultVersion
  if(localStorage.settings){
     const settings = JSON.parse(localStorage.settings)
     return settings.trading.contract.version || defaultVersion
  }else{
    return defaultVersion
  }
}


export default {
  set,
  get,
  getRelay,
  getContractVersion,
}

