import React, { useCallback, useEffect, useState } from 'react'

import { Contract } from 'web3-eth-contract'

import { yam as yamAddress } from '../../constants/tokenAddresses'
import useYam from '../../hooks/useYam'
import { getPoolContracts } from '../../yamUtils'

import Context from './context'
import { Farm } from './types'

const NAME_FOR_POOL: { [key: string]: string } = {
  yam1_pool: 'YAM 1.0 Zombieland',
  eth_pool: 'Weth Homestead',
  yam_ycrv_pool: 'Eternal Lands',
  ycrv_pool: 'Curve Village',
}

const ICON_FOR_POOL: { [key: string]: string } = {
  yam1_pool: '🧟‍♂️',
  eth_pool: '🌎',
  yam_ycrv_pool: '🌈',
  ycrv_pool: '💰',
}

const SORT_FOR_POOL: { [key: string]: number } = {
  yam1_pool: 1,
  eth_pool: 2,
  ycrv_pool: 3,
  yam_ycrv_pool: 4,
}

const Farms: React.FC = ({ children }) => {

  const [farms, setFarms] = useState<Farm[]>([])
  const yam = useYam()

  const fetchPools = useCallback(async () => {
    const pools: { [key: string]: Contract} = await getPoolContracts(yam)

    const farmsArr: Farm[] = []
    const poolKeys = Object.keys(pools)

    for (let i = 0; i < poolKeys.length; i++) {
      const poolKey = poolKeys[i]
      const pool = pools[poolKey]
      let tokenKey = poolKey.replace('_pool', '')
      if (tokenKey === 'eth') {
        tokenKey = 'weth'
      } else if (tokenKey === 'yam_ycrv') {
        tokenKey = 'ycrv_yam_uni_lp'
      }

      const method = pool.methods[tokenKey]
      try {
        let tokenAddress = ''
        if (method) {
          tokenAddress = await method().call()
        } else if (tokenKey === 'ycrv_yam_uni_lp') {
          tokenAddress = '0xC329BC05CC9fb5f4e8dA13Bf6A849D33dD2A167b'
        }
        farmsArr.push({
          contract: pool,
          name: NAME_FOR_POOL[poolKey],
          depositToken: tokenKey,
          depositTokenAddress: tokenAddress,
          earnToken: 'yam2',
          earnTokenAddress: yamAddress,
          icon: ICON_FOR_POOL[poolKey],
          id: tokenKey,
          sort: SORT_FOR_POOL[poolKey]
        })
      } catch (e) {
        console.log(e)
      }
    }
    farmsArr.sort((a, b) => a.sort < b.sort ? 1 : -1)
    setFarms(farmsArr)
  }, [yam, setFarms])

  useEffect(() => {
    if (yam) {
      fetchPools()
    }
  }, [yam, fetchPools])

  return (
    <Context.Provider value={{ farms }}>
      {children}
    </Context.Provider>
  )
}

export default Farms
