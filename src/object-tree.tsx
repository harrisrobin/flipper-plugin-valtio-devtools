import React from "react"
import { JSONTree } from "react-json-tree"

export const ObjectTree = (props) => {
  const { object, level = 1 } = props
  return (
    <div>
      <JSONTree
        data={object}
        hideRoot
        shouldExpandNodeInitially={(keyPath, data, level) => {
          return true
        }}
        getItemString={(type, data, itemType, itemString) => {
          if (type === "Object") {
            return <span>{itemType}</span>
          }
          return (
            <span>
              {itemType} {itemString}
            </span>
          )
        }}
        valueRenderer={(transformed, untransformed) => {
          return `${untransformed || transformed}`
        }}
      />
    </div>
  )
}
