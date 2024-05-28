import { ConstellationObject } from '../../shared/interfaces/interfaces'
import { Divider } from '@mui/material'

import NavigationIcon from '@mui/icons-material/Navigation'
import React from 'react'

interface ConstellationTileProps {
  constellation: ConstellationObject
  onClick: (
    constellation: ConstellationObject,
    event: React.MouseEvent<HTMLDivElement>
  ) => void
}

const ConstellationTile = ({
  constellation,
  onClick
}: ConstellationTileProps) => {
  return (
    <>
      <div
        className=" group flex justify-between items-center w-full pl-2 pr-5 py-2 hover:bg-neutral-100 active:bg-neutral-200 transition-all ease-in-out select-none cursor-pointer"
        onClick={(event) => onClick(constellation, event)}>
        {constellation.name}
        <NavigationIcon className=" rotate-90 text-neutral-600 group-hover:text-neutral-700 group-active:text-neutral-800 transition-all ease-in-out" />
      </div>
      <Divider />
    </>
  )
}

export default ConstellationTile
