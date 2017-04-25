'use babel'

import { Disposable } from 'atom'
import { filter } from 'fuzzaldrin'
import COMPONENT from './completions/component'
import API from './completions/javascript'


export class AtomAutocompleteProvider {
  constructor() {
    this.inclusionPriority = 1
    this.excludeLowerPriority = true
    // settings for autocomplete-plus
    this.selector = '.text.html, .text.html.jsp, .source.js, .source.js.jquery, .text.html.php'
    this.disableForSelector =  '.text.html .comment, .source.js .comment'
  }

  // autocomplete-plus
  getSuggestions({editor, bufferPosition, scopeDescriptor, prefix, activatedManually}) {
    const scopes = scopeDescriptor.getScopesArray();
    const line = editor.getTextInRange([ [bufferPosition.row, 0], bufferPosition ]);
    // javascript
    if ( API.hasJSScope(scopes) && atom.config.get('atom-alopex.useAlopexJavascriptAutocomplete') ){

      return new Promise((resolve) => {
        let suggestions = []

        if ( API.isGlobalAPI(scopes, line)){
          suggestions = API.getGlobalCompletions(line, prefix)
        } else if ( API.isFunction(scopes, line)){
          suggestions = API.getFunctionCompletions(line, prefix)
        }

        resolve(this.getfilter(prefix, suggestions))
      })

    }
    // html
    else if ( COMPONENT.hasTagScope(scopes) && atom.config.get('atom-alopex.useAlopexAttributeAutocomplete')){
      return new Promise((resolve) => {

        let suggestions = []

        if (COMPONENT.isTag(scopes, line)) {
          // isTag
        } else if (COMPONENT.isAttributeValue(scopes)) {
          suggestions = COMPONENT.getAttributeValueCompletions(line, prefix)
        } else if(COMPONENT.isAttribute(prefix, scopes)) {
          suggestions = COMPONENT.getAttributeNameCompletions(editor, bufferPosition, prefix)
        }

        resolve(this.getfilter(prefix, suggestions))
      })
    }

  }
  getSuggestionsBlankValue(){
  //  if (COMPONENT.isAttributeValue(scopes)) {
  //     suggestions = COMPONENT.getAttributeValueCompletions(line)
  //  }
  }
  getfilter (prefix, suggestions) {
    return filter(suggestions, prefix, {
      key: 'displayText'
    })
  }

  // autocomplete-plus
  onDidInsertSuggestion({editor, triggerPosition, suggestion}) {
    let line = editor.getTextInRange([ [triggerPosition.row, 0], triggerPosition])
    let segment = line.split(' ').pop()
    /*
    if (suggestion.type === "javascript"){
      if (/^\$a\./.test(suggestion.snippet) && segment.indexOf("$a."+prefix) > -1 ) {

      }
    }
    */
  }
}
