import React, { useEffect, useState } from 'react'
import { StarObject } from '../../shared/interfaces'

interface ObjectEditorProps {
  skyObject: StarObject
  onObjectChange: (obj: StarObject) => void
}

const ObjectEditor = ({ skyObject, onObjectChange }: ObjectEditorProps) => {
  const [values, setValues] = useState<StarObject>(skyObject)

  useEffect(() => {
    onObjectChange(values)
  }, [values])

  function handleChange<T extends keyof StarObject>(
    event: React.ChangeEvent<HTMLInputElement>,
    key: T
  ) {
    setValues((prev) => {
      const obj = { ...prev }

      let value
      if (event.target.type === 'number') {
        value = Number(event.target.value)
      } else {
        value = event.target.value
      }

      console.log(value)

      obj[key] = value as StarObject[T]

      return obj
    })
  }

  return (
    <div className=" flex flex-col gap-y-1 w-full sm:w-80">
      <span>{skyObject?.name}</span>
      {Object.entries(skyObject).map((entry) => (
        <>
          {entry[0] !== 'id' && (
            <div className=" flex justify-between">
              <span>{entry[0]}:</span>
              <input
                type={typeof entry[1]}
                value={values[entry[0] as keyof StarObject]}
                onChange={(event) =>
                  handleChange(event, entry[0] as keyof StarObject)
                }></input>
            </div>
          )}
        </>
      ))}
    </div>
  )
}

export default ObjectEditor
