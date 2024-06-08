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
        className=" group flex justify-between items-center w-full pl-2 pr-5 py-2 
          bg-violet-950 hover:bg-violet-800 active:bg-violet-900 rounded-xl
          transition-all ease-in-out select-none cursor-pointer"
        onClick={(event) => onClick(constellation, event)}>
        ID: {constellation.id} {constellation.name}
      </div>
      <Divider />
    </>
  )
}

export default ConstellationTile
