import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import List from '@mui/material/List'

import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

import { useState } from 'react'
import { ExpandLess, ExpandMore, Cloud } from '@mui/icons-material'
import { StarObject } from '../../shared/interfaces'

interface SkyElementsProps {
  stars: StarObject[]
  // clouds: CloudObject[]
}

const SkyElements = ({ stars }: SkyElementsProps) => {
  const [starsOpen, setStarsOpen] = useState<boolean>(false)
  const [cloudsOpen, setCloudsOpen] = useState<boolean>(false)

  return (
    <>
      <List>
        <ListItemButton onClick={() => setStarsOpen((prev) => !prev)}>
          <ListItemIcon>
            <AutoAwesomeIcon />
          </ListItemIcon>
          <ListItemText primary="Gwiazdy" />
          {starsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={starsOpen} timeout="auto" unmountOnExit>
          {stars.map((star) => (
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary={star.name} />
            </ListItemButton>
          ))}
        </Collapse>

        <ListItemButton onClick={() => setCloudsOpen((prev) => !prev)}>
          <ListItemIcon>
            <Cloud />
          </ListItemIcon>
          <ListItemText primary="Chmury" />
          {cloudsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={cloudsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding></List>
        </Collapse>
      </List>
    </>
  )
}

export default SkyElements
