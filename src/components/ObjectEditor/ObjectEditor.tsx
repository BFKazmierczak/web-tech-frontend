import {
  useEffect,
  useRef,
  useState,
  useCallback,
  ChangeEvent,
  MouseEvent
} from 'react'
import { StarObject } from '../../shared/interfaces'
import { HexColorPicker } from 'react-colorful'
import { capitalize } from '@mui/material'
import { Button, Input } from '../Inputs'

interface ObjectEditorProps {
  skyObject: StarObject
  onObjectChange: (obj: StarObject) => void
  onSaveChanges: (star: StarObject) => void
}

const ObjectEditor = ({
  skyObject,
  onObjectChange,
  onSaveChanges
}: ObjectEditorProps) => {
  const colorRef = useRef<string>(skyObject.color)

  const [values, setValues] = useState<StarObject>({ ...skyObject })
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false)

  useEffect(() => {
    setValues({ ...skyObject })
  }, [skyObject])

  useEffect(() => {
    if (JSON.stringify(skyObject) !== JSON.stringify(values)) {
      onObjectChange(values)
    }
  }, [values])

  const handleChange = useCallback(
    <T extends keyof StarObject>(
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined,
      key: T,
      value?: string
    ) => {
      setValues((prev) => {
        const newValue = event
          ? event.target.type === 'number'
            ? Number(event.target.value)
            : event.target.value
          : value

        return {
          ...prev,
          [key]: newValue as StarObject[T]
        }
      })
    },
    []
  )

  const handleObjectSave = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onSaveChanges(values)
    },
    [onSaveChanges, values]
  )

  return (
    <div className="relative flex flex-col gap-y-3 w-full p-5 sm:w-[600px]">
      <span className="flex gap-x-1">
        <span className="font-light">
          {skyObject.id === -1 ? 'Dodawanie:' : 'Edytowanie:'}
        </span>
        {skyObject?.name} {skyObject.id !== -1 && `(${skyObject.id})`}
      </span>

      <hr />

      <div className="flex">
        <div className="flex flex-col gap-y-1 w-1/2">
          {Object.keys(skyObject).map(
            (key) =>
              key !== 'id' &&
              key !== 'color' &&
              key !== 'updatedAt' &&
              key !== 'createdAt' && (
                <span key={key} className="font-bold h-8">
                  {capitalize(key)}:
                </span>
              )
          )}
        </div>

        <div className="flex flex-col gap-y-1 w-1/2">
          {Object.entries(values).map(
            ([key, value]) =>
              key !== 'id' &&
              key !== 'color' &&
              key !== 'updatedAt' &&
              key !== 'createdAt' && (
                <div key={key} className="flex items-center h-8">
                  <Input
                    type={typeof value}
                    value={value as string}
                    onChange={(event) =>
                      handleChange(event, key as keyof StarObject)
                    }
                  />
                </div>
              )
          )}

          {values.color && (
            <>
              <div
                className="flex gap-x-1 w-full justify-between items-center min-w-32 cursor-pointer"
                onClick={() => setShowColorPicker(true)}>
                <Button
                  icon={
                    <div
                      className="w-4 h-4 aspect-square rounded-md"
                      style={{ backgroundColor: colorRef.current }}
                    />
                  }>
                  Zmień
                </Button>
              </div>

              {showColorPicker && (
                <div className="fixed flex items-center justify-center z-50 w-full h-full inset-0">
                  <div
                    className="fixed inset-0 bg-black bg-opacity-75"
                    onClick={() => setShowColorPicker(false)}
                  />
                  <div className="flex flex-col gap-y-2">
                    <HexColorPicker
                      color={colorRef.current}
                      onChange={(newColor) => {
                        colorRef.current = newColor
                      }}
                    />
                    <Button
                      onClick={() => {
                        setShowColorPicker(false)
                        handleChange(undefined, 'color', colorRef.current)
                      }}>
                      Zatwierdź
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Button onClick={handleObjectSave}>
        {skyObject.id === -1 ? 'Gotowe' : 'Zatwierdź zmiany'}
      </Button>
    </div>
  )
}

export default ObjectEditor
