'use babel';

import WelcomeView from './welcome-view';
import { CompositeDisposable } from 'atom';
import path from 'path';
import CSON from 'season';
import { AtomAutocompleteProvider } from './AtomAutocompleteProvider';
import wget from 'wget';
import extract  from 'extract-zip';
import fs from 'fs';
const WELCOME_URI = 'atom://alopex/welcome'
const ALOPEX_HOME ='http://ui.alopex.io/'
export default {

  atomAlopexView: null,
  modalPanel: null,
  subscriptions: null,
  provider : null,
  //Alopex Setting Item
  config:{
    showWelcomeOnStartup:{
      type: 'boolean',
      default: true,
      description: 'Show Alopex welcome pane when opening a new Atom window.'
    },
    useAlopexAttributeAutocomplete:{
      type:'boolean',
      default : true,
      description : 'AlopexUI HTML attribute autocompletions in Atom'
    },
    useAlopexJavascriptAutocomplete:{
      type:'boolean',
      default : true,
      description : 'AlopexUI JavaScript API autocompletions in Atom'
    }
  },
  activate(state) {

      this.subscriptions = new CompositeDisposable();
    //  Register command that toggles this view

      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-alopex:welcomeGuide': () => this.createAlopexWelcomeView()
      }));
      this.subscriptions.add(atom.commands.add('.tree-view .selected',{
          'atom-alopex:createAlopexUIUXStandard': (e) => this.createAlopexUIUXStandard(e)
      }));
      this.subscriptions.add(atom.commands.add('.tree-view .selected',{
          'atom-alopex:createAlopexTemplateA': (e) => this.createAlopexTemplateA(e)
      }));
      this.subscriptions.add(atom.commands.add('.tree-view .selected',{
          'atom-alopex:createAlopexTemplateB': (e) => this.createAlopexTemplateB(e)
      }));
      this.subscriptions.add(atom.commands.add('.tree-view .selected',{
          'atom-alopex:createAlopexTemplateC': (e) => this.createAlopexTemplateC(e)
      }));

     // Alopex ComponentSet

       //search
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Search-Single': () => this.createAlopexComponentSet('search/single_search')
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Search-SingleForm': () => this.createAlopexComponentSet('search/single_formtable_search')
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Search-MultiForm-OutsideButton': () => this.createAlopexComponentSet('search/multi_formtable_search_outsidebutton')
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Search-MultiForm-InsideButton': () => this.createAlopexComponentSet('search/multi_formtable_search_insidebutton')
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Search-Stepbystep-Select': () => this.createAlopexComponentSet('search/stepbystep_select_search')
      }));


      //tree
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Tree-View-Edit': () => this.createAlopexComponentSet('tree/click_view_editdata')
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Tree-Checkbox-Control': () => this.createAlopexComponentSet('tree/checkbox_tree_controll')
      }));

      //tab
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Tab-Add-Remove': () => this.createAlopexComponentSet('tab/add_remove_tab')
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Tab-2Depth': () => this.createAlopexComponentSet('tab/2DepthTab')
      }));

      //fileUpload
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Fileupload-Advanced': () => this.createAlopexComponentSet('fileUpload/advance_mode')
      }));

      //dialog
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Dialog-Blank': () => this.createAlopexComponentSet('dialog/dialog_blank_type')
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Dialog-Close': () => this.createAlopexComponentSet('dialog/dialog_close_type')
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Dialog-Confirm': () => this.createAlopexComponentSet('dialog/dialog_confirm_type')
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Dialog-OKCancel': () => this.createAlopexComponentSet('dialog/dialog_okcancel_type')
      }));

      //board
      this.subscriptions.add(atom.commands.add('atom-workspace',{
          'atom-alopex:Board-Registration': () => this.createAlopexComponentSet('board/board_registration')
      }));






     this.subscriptions.add(atom.workspace.addOpener((filePath) => {
       if (filePath === WELCOME_URI) {
         return this.createWelcomeView({uri: WELCOME_URI})
       }
     }))
      // auto-complate(code assist) 를 위한 설정 필요.
      this.provider = new AtomAutocompleteProvider();

     //Atom 구동 시 setting 값에 따라 welcome 화면 표시

     if (atom.config.get('atom-alopex.showWelcomeOnStartup')) {
       this.createAlopexWelcomeView();
     }


  },

  deactivate() {

  },

  serialize() {
  //  return {
  //    atomAlopexViewState: this.atomAlopexView.serialize()
//    };
  },
  getProvider() {
    return this.provider;
  },


  createWelcomeView (state) {

    return new WelcomeView();
  },
  createAlopexWelcomeView(){
     atom.workspace.open(WELCOME_URI);
  },
  //Alopex Template
  createAlopexUIUXStandard(e){

    let elClass = e.currentTarget.className;
    if(elClass.indexOf('directory') != -1){
      let extractDest = path.join (e.currentTarget.getPath(), 'alopex-uiux-standard');
      this.downloadAndExtractFile(ALOPEX_HOME+"2.3/demo/alopex-uiux-standard.zip","alopex-uiux-standard.zip",extractDest,true)
    }else{
      atom.notifications.addError ('An error has ocurred',{
        detail: "Template destination is not directory, you must select directory!",
        dismissable: true
      });
    }

 },
  createAlopexTemplateA(e){

    let elClass = e.currentTarget.className;
    if(elClass.indexOf('directory') != -1){
      let extractDest = path.join (e.currentTarget.getPath(), 'alopex-ui-templateA');
      this.downloadAndExtractFile(ALOPEX_HOME+"2.3/publishing/alopex-ui-templateA.zip","alopex-ui-templateA.zip",extractDest,true)
    }else{
      atom.notifications.addError ('An error has ocurred',{
        detail: "Template destination is not directory, you must select directory!",
        dismissable: true
      });
    }

 },
 createAlopexTemplateB(e){

   let elClass = e.currentTarget.className;
   if(elClass.indexOf('directory') != -1){
     let extractDest = path.join (e.currentTarget.getPath(), 'alopex-ui-templateB');
     this.downloadAndExtractFile(ALOPEX_HOME+"2.3/publishing/alopex-ui-templateA.zip","alopex-ui-templateB.zip",extractDest,true)
   }else{
     atom.notifications.addError ('An error has ocurred',{
       detail: "Template destination is not directory, you must select directory!",
       dismissable: true
     });
   }

 },
 createAlopexTemplateC(e){

   let elClass = e.currentTarget.className;
   if(elClass.indexOf('directory') != -1){
     let extractDest = path.join (e.currentTarget.getPath(), 'alopex-ui-templateC');
     this.downloadAndExtractFile(ALOPEX_HOME+"2.3/publishing/alopex-ui-templateA.zip","alopex-ui-templateC.zip",extractDest,true)
   }else{
     atom.notifications.addError ('An error has ocurred',{
       detail: "Template destination is not directory, you must select directory!",
       dismissable: true
     });
   }

},
 downloadAndExtractFile(url,filename,destfolder,msgDismissable){
   let tempDir = path.join (__dirname, "../", "temp/");
   let tmpDest = path.join (__dirname, "../", "temp/",filename);

   if (!fs.existsSync(tempDir)){
    fs.mkdir(tempDir, 0777, (err) => {
        if(err) throw err;
    });
   }

   let download =  wget.download(url, tmpDest,{});
   //let download =  wget.download(url, tmpDest,{});

   atom.notifications.addInfo ('File download start!',{
     detail: filename+" downloading, please wait a minute."
   });


  download.on('error', (err) => {
    atom.notifications.addError ('An error has ocurred',{
      detail: "Downloading "+filename+" error , please try again later : "+err,
      dismissable: msgDismissable
    });
  });
  download.on('end', (output) => {
   extract(tmpDest, {dir: destfolder}, function (err) {
     if(err){
       atom.notifications.addError ('An error has ocurred',{
         detail: "extract "+filename+" error, please try again later : "+err,
         dismissable: msgDismissable
       });
     }else{
       atom.notifications.addSuccess('Successfully downloaded',{
           detail: destfolder,
           dismissable: msgDismissable,
           icon: "cloud-download"
       });
     }
     fs.unlink(tmpDest);
   })

  });
  download.on('progress', (progress) => {
   // code to show progress bar
 //  console.log(progress);
  });
},

// Create Alopex componentSet
 createAlopexComponentSet(compoSetName){
  let editor = atom.workspace.getActiveTextEditor();
  let csonfile    = path.join (__dirname, "../lib/ctf/", compoSetName+".cson");
  let result = CSON.readFileSync(csonfile)
  editor.insertText(result.body);
 }




};
