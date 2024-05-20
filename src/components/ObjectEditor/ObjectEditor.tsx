import React, { useEffect, useRef, useState } from 'react'
import { StarObject } from '../../shared/interfaces'
import { HexColorPicker } from 'react-colorful'
import { Button, Input } from '@mui/material'

interface ObjectEditorProps {
  skyObject: StarObject
  onObjectChange: (obj: StarObject) => void
}

const ObjectEditor = ({ skyObject, onObjectChange }: ObjectEditorProps) => {
  const colorRef = useRef<string>(skyObject.color)

  const [values, setValues] = useState<StarObject>(skyObject)

  const [showColorPicker, setShowColorPicker] = useState<boolean>(false)

  useEffect(() => {
    onObjectChange(values)
  }, [values])

  useEffect(() => {
    if (showColorPicker) colorRef.current = skyObject.color
  }, [showColorPicker])

  function handleChange<T extends keyof StarObject>(
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | undefined,
    key: T,
    value?: string
  ) {
    setValues((prev) => {
      const obj = { ...prev }

      if (event) {
        let newValue
        if (event.target.type === 'number') {
          newValue = Number(event.target.value)
        } else {
          newValue = event.target.value
        }

        console.log(newValue)

        obj[key] = newValue as StarObject[T]
      } else {
        obj[key] = value as StarObject[T]
      }

      return obj
    })
  }

  return (
    <div className=" relative flex flex-col gap-y-1 w-full sm:w-80">
      <span>{skyObject?.name}</span>
      {Object.entries(skyObject).map((entry) => (
        <>
          {entry[0] !== 'id' && entry[0] !== 'color' && (
            <div className=" flex justify-between">
              <span>{entry[0]}:</span>
              <Input
                type={typeof entry[1]}
                value={values[entry[0] as keyof StarObject]}
                onChange={(event) =>
                  handleChange(event, entry[0] as keyof StarObject)
                }></Input>
            </div>
          )}

          {entry[0] === 'color' && (
            <>
              <div className=" flex justify-between">
                <span>{entry[0]}:</span>
                <div
                  className=" flex min-w-32 cursor-pointer"
                  onClick={() => setShowColorPicker(true)}>
                  <div
                    className=" w-6 h-6 aspect-square"
                    style={{
                      backgroundColor: entry[1]
                    }}
                  />
                </div>
              </div>

              {showColorPicker && (
                <>
                  {/* <div className=" absolute w-full h-full" /> */}

                  <div className=" fixed flex items-center justify-center z-50 w-full h-full inset-0">
                    <div
                      className=" fixed inset-0 bg-black bg-opacity-75"
                      onClick={() => setShowColorPicker(false)}
                    />

                    <div className=" flex flex-col gap-y-2">
                      <HexColorPicker
                        color={entry[1]}
                        onChange={(newColor) => {
                          colorRef.current = newColor
                        }}
                      />

                      <Button
                        variant="contained"
                        onClick={() => {
                          setShowColorPicker(false)
                          handleChange(
                            undefined,
                            entry[0] as keyof StarObject,
                            colorRef.current
                          )
                        }}>
                        Zatwierdź
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </>
      ))}
    </div>
  )
}

export default ObjectEditor
