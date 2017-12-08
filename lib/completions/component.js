'use babel'

import units from './units'

const trailingWhitespace = /\s$/
const attributeInput = /^([a-zA-Z][-a-zA-Z]*)$/;
const attributePattern = /\s+([a-zA-Z][-a-zA-Z]*)\s*=\s*$/
const tagInput = /^<([a-zA-Z][-a-zA-Z]*|$)/
const tagNotInput = />([a-zA-Z][-a-zA-Z]*|$)/
const tagPattern = /<([a-zA-Z][-a-zA-Z]*)(?:\s|$)/
const classPattern =  /^([a-zA-Z][-a-zA-Z]*|$)/
const classNamePattern = /\s+class\s*=\s*("|')([A-Z][-a-zA-Z]*)("|')\s+/
// requireDir
const requireDir = require('require-dir')
const attrCompletions = requireDir('./components')


export default {
  getTagNameCompletions: function() {

  },
  getAttributeNameCompletions: function(editor, bufferPosition, prefix) {
    let _completions = []
    let tag = this.getPreviousTag(editor, bufferPosition)
    let className = this.getPreviousClass(editor, bufferPosition)

    prefix = prefix.replace(/\s/g, '')

    if (className && attrCompletions[className]) {
      let currClassAttr = attrCompletions[className]
      let globalAttr = attrCompletions.Global
      // Attributes of Current Component
      for (let attrName in currClassAttr) {
        let attr = currClassAttr[attrName]
        attr.text = attr.displayText = attrName
        attr.type = "attribute"
        attr.leftLabel = className
        attr.rightLabelHTML = "Attribute"
        attr.replacementPrefix = prefix

        _completions.push(attr)
      }
      // Global Attributes
      for (let attrName in globalAttr) {
        let attr = globalAttr[attrName]
        attr.text = attr.displayText = attrName
        attr.type = "attribute"
        attr.leftLabel = "Global"
        attr.rightLabelHTML = "Attribute"
        attr.replacementPrefix = prefix

        _completions.push(attr)
      }
    } else {
      // All Attributes
      for (let componentName in attrCompletions) {
        let component = attrCompletions[componentName]
        for (let attrName in component) {
          let attr = component[attrName]
          attr.text = attr.displayText = attrName
          attr.type = "attribute"
          attr.leftLabel = componentName
          attr.rightLabelHTML = "Attribute"
          attr.replacementPrefix = prefix

          _completions.push(attr)
        }
      }
    }

    return _completions
  },

  getAttributeValueCompletions: function(line, prefix) {
    let _completions = [],
    attribute = this.getPreviousAttribute(line)

    for (let componentName in attrCompletions){
      let component = attrCompletions[componentName]
      if ( component[attribute] && component[attribute].values ){
        let currAttrValues = component[attribute].values
        for (let value of currAttrValues){
          value.displayText = value.text
          value.type = "value"
          value.rightLabelHTML = "Value"
          if( !value.descriptionMoreURL) {
            value.descriptionMoreURL = component.descriptionMoreURL
          }
          value.replacementPrefix = prefix

          _completions.push(value)
        }
      }
    }

    return _completions
  },
  getPreviousTag: function(editor, bufferPosition) {
  //  console.log("editor :",editor);
  //    console.log("positiion :",bufferPosition);
    var ref
    let row = bufferPosition.row
    ref = tagPattern.exec(editor.lineTextForBufferRow(row))
      if (ref) {
        return ref[1]
      }
    return null
  },
  getPreviousClass : function(editor, bufferPosition){
    var ref
    let row = bufferPosition.row

    if ( this.getPreviousTag(editor, bufferPosition) ){
      ref = classNamePattern.exec(editor.lineTextForBufferRow(row))
      if ( ref && ref.length === 4 ) {
        return ref[2];
      }
    } else {
      return null
    }
  },

  getPreviousAttribute: function(line) {

    var ref, ref1
    let quoteIndex = line.length - 1
    while (line[quoteIndex] && !((ref = line[quoteIndex]) === '"' || ref === "'")) {
      quoteIndex--
    }

    line = line.substring(0, quoteIndex)
    return (ref1 = attributePattern.exec(line)) != null ? ref1[1] : null
  },
  isAttributeValue: function(scopes) {
    return this.hasTagScope(scopes) && this.hasAttributeValueScope(scopes) && !this.hasAttributeContentScope(scopes)
  },
  isAttribute: function(prefix, scopes) {
    if (!trailingWhitespace.test(prefix) && !attributeInput.test(prefix)) {
      return false
    }
    return this.hasTagScope(scopes) && !this.hasAttributeContentScope(scopes)
  },
  isTag: function(scopes, line) {
    let segment = line.split(' ').pop()
    return tagInput.test(segment) && !tagNotInput.test(segment) && !this.hasScopeDescriptor(scopes, [
      'string.quoted.double.js',
      'string.quoted.single.js'
    ]) && !this.hasAttributeContentScope(scopes)
  },
  hasTagScope: function(scopes) {
    return this.hasTagScopeDescriptor(scopes)
  },
  hasAttributeValueScope: function(scopes) {
    return this.hasScopeDescriptor(scopes, [
      'string.quoted.double.html',
      'string.quoted.single.html'
    ])
  },
  hasAttributeContentScope: function(scopes) {
    return this.hasScopeDescriptor(scopes, [
      'punctuation.definition.brace.curly.begin.js',
      'punctuation.definition.brace.curly.end.js',
      'meta.brace.curly.js'
    ])
  },
  hasScopeDescriptor: function(fromScopes, toScopes) {
    for (let scope of toScopes) {
      if (typeof(scope) === 'string') {
        if (fromScopes.indexOf(scope) !== -1) {
          return true
        }
      } else {
        let pass = false
        for (let text of fromScopes) {
          if (scope.test(text)) {
            pass = true
          }
        }
        if (pass) return true
      }
    }
    return false
  },
  hasTagScopeDescriptor: function(fromScopes) {
    for (let scope of fromScopes){
      if (scope.startsWith('meta.tag.') && scope.endsWith('.html')) {
        return true
      }
    }
    return false
  }
}
