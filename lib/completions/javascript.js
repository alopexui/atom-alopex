'use babel'

import units from './units'

const globalPattern = /\$a\./
const methodCallPattern = /\./
const validatorPattern = /validator\./gi

const requireDir = require('require-dir')
const APICompletions = requireDir('./javascript')


export default {
  /*
  convertForEclispe : function(){
    let _completions = []
    let globalFunc = APICompletions["Global"]
    var xmlDoc = document.implementation.createDocument(null, "templates")

    for ( api in APICompletions ){
      let funcs = APICompletions[api]
      for (let funcName in funcs) {
        let func = funcs[funcName]
        _completions = _completions.concat(this.makeCompletions(func, funcName, ""))
      }
    }

    for (let func of _completions) {
      let template = document.createElementNS(null, "template")
      let description = ""
      if ( func.rightLabelHTML ){
        descriptions = "["+func.rightLabelHTML+"]"
      }

      template.setAttribute("autoinsert", true)
      template.setAttribute("context", "javaScript")
      template.setAttribute("deleted", false)
      template.setAttribute("enabled", true)
      template.setAttribute("name", func.text)
      template.setAttribute("description", func.description)
      if ( /^\$/g.test(func.snippet)){
        template.innerHTML = "$"+func.snippet.replace(/[0-9]:/g,"")
      } else {
        template.innerHTML = func.snippet.replace(/[0-9]:/g,"")
      }
      xmlDoc.documentElement.appendChild(template)
    }

    return xmlDoc
  },

  */
  getGlobalCompletions: function(line, prefix){
    let _completions = []
    let globalFunc = APICompletions["Global"]
    prefix = line.split(' ').pop()

    for (let funcName in globalFunc) {
      let func = globalFunc[funcName]
      _completions = _completions.concat(this.makeCompletions(func, funcName, prefix))
    }

    return _completions
  },
  getFunctionCompletions: function(line, prefix){
    let _completions = []
    let segment = line.split(' ').pop()

    // Validator 일 경우
    if ( validatorPattern.test(segment) ){
      prefix = segment
      let funcs = APICompletions["Validator"]
      for (let funcName in funcs) {
        let func = funcs[funcName]
        _completions = _completions.concat(this.makeCompletions(func, funcName, prefix))
      }
      return _completions
    }

    for ( api in APICompletions ){
      if ( api === "Component" || api === "Function"){
        let funcs = APICompletions[api]
        for (let funcName in funcs) {
          let func = funcs[funcName]
          _completions = _completions.concat(this.makeCompletions(func, funcName, prefix))
        }
      }
    }
    return _completions
  },
/*
  getValidatorCompletions: function(line, prefix){
    let _completions = []
    let validatorFunc = APICompletions["Validator"]
    prefix = line.split(' ').pop()

    for (let funcName in validatorFunc) {
      let func = validatorFunc[funcName]
      _completions = _completions.concat(this.makeCompletions(func, funcName, prefix))
    }

    return _completions
  },
*/
  makeCompletions(func, funcName, prefix){
    // arguments 중에서 required 인 경우에는 반드시 표기하고,
    // optional (required:false) 인 경우에는 없는 경우와 있는 경우를 추가

    let completions = []

    func.type = "function"
    if ( !func.leftLabelHTML ){
      func.leftLabel = 'void'
    }
    if ( prefix !== '.' ){
      func.replacementPrefix = prefix
    }
    if ( func.arguments ){
      let args
      if (func.arguments.length > 1 ){
        args = func.arguments.reduce(function(previousValue, currentValue, currentIndex, array) {
          if ( currentIndex === 1 ) {
            let prev = { "requiredArgName" : "", "requiredArgSnippet" : "", "allArgName": "", "allArgSnippet" :""}
            if ( previousValue.required ){
              prev.requiredArgName = previousValue.name
              prev.requiredArgSnippet = '${1:'+ previousValue.name + '}'
            }
            prev.allArgName = previousValue.name
            prev.allArgSnippet = '${1:'+ previousValue.name + '}'
            previousValue = prev
          }
          return {
            "requiredArgName" : (currentValue.required) ? previousValue.requiredArgName + ', '+ currentValue.name : previousValue.requiredArgName,
            "requiredArgSnippet": (currentValue.required) ? previousValue.requiredArgSnippet + ', ${'+(currentIndex+1)+':'+ currentValue.name+'}' : previousValue.requiredArgSnippet,
            "allArgName": previousValue.requiredArgName + ', '+ currentValue.name,
            "allArgSnippet": previousValue.requiredArgSnippet + ', ${'+(currentIndex+1)+':'+ currentValue.name+'}'
          }
        })
      } else {
        args = { "requiredArgName" : "", "requiredArgSnippet" : "", "allArgName": "", "allArgSnippet" :""}
        if ( func.arguments[0].required ){
          args.requiredArgName = func.arguments[0].name
          args.requiredArgSnippet = '${1:'+ func.arguments[0].name + '}'
        }
        args.allArgName = func.arguments[0].name
        args.allArgSnippet = '${1:'+ func.arguments[0].name + '}'
      }
      func.text = func.displayText = funcName + "(" + args.requiredArgName + ")"
      func.snippet = funcName + "("+ args.requiredArgSnippet+")"
      completions.push(func)

      if ( args.allArgName !== args.requiredArgName ){
        var newFunc = units.clone(func)
        newFunc.text =  newFunc.displayText = funcName + "(" + args.allArgName + ")"
        newFunc.snippet = funcName + "("+ args.allArgSnippet+")"
        completions.push(newFunc)
      }
    } else {
      func.text =  func.displayText = funcName + "()"
      if( typeof func.snippet === "undefined"){
        func.snippet = funcName + "()"
      }
      completions.push(func)
    }

    return completions;
  },

  getPrefix(line) {
    const matches = line.match(REGEXP_LINE)

    return matches && matches[0];
  },

  isGlobalAPI (scopes, line) {
    let segment = line.split(' ').pop()

    return globalPattern.test(segment)
  },

  isFunction (scopes, line) {
    let segment = line.split(' ').pop()

    return this.hasJSScope(scopes) && methodCallPattern.test(segment)
  },

  isValidation (scopes, line) {
    let segment = line.split(' ').pop()

    return this.hasJSScope(scopes) && validationPattern.test(segment)
  },

  hasJSScope (scopes) {
    return (
      this.hasScopeDescriptor(scopes, ['source.js', 'source.js.embedded.html'])
      && !this.hasScopeDescriptor(scopes, ['string.quoted.double.js'])
      && !this.hasScopeDescriptor(scopes, ['string.quoted.single.js'])
    )
  },

  hasScopeDescriptor (fromScopes, toScopes) {
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
  }
}
