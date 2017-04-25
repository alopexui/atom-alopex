'use babel'

export default {
    clone: function (obj) {
        let newObj = {}
        for (let key in obj) {
            newObj[key] = obj[key]
        }

        return newObj
    }/*,
    cloneAttr (obj, componentName, attrName){
      let newObj = this.clone(obj)

      newObj.text = attrName
      newObj.type = "attribute"
      newObj.displayText = attrName
      newObj.rightLabelHTML = "Attribute"
      newObj.leftLabel = componentName

      return newObj;
    },
    cloneValue (obj, attrName, descriptionMoreURL){
      let newObj = this.clone(obj)

      newObj.type = "value"
      newObj.displayText = newObj.text
      newObj.rightLabelHTML = "Value"
      if( !newObj.descriptionMoreURL) {
        newObj.descriptionMoreURL = descriptionMoreURL
      }
      return newObj
    },
    cloneFunc (obj, funcName){
      let newObj = this.clone(obj)

      newObj.text = funcName
      newObj.type = "function"
      newObj.displayText = newObj.text
      newObj.rightLabelHTML = "Function"

      return newObj
    },*/
}
