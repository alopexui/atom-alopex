'use babel'
/** @jsx etch.dom */

import etch from 'etch'

export default class WelcomeView {
  constructor () {
    etch.initialize(this)
  }

  render () {
    return (

      <div className='welcome'>
        <div className='welcome-container'>
          <div className='alopex-logo'>
            <img src='atom://atom-alopex/styles/images/alopex_header_img.png' />
          </div>
          <div className='welcome-consent'>
            <h2>HTML5 Framework in simplicity and easy of use</h2>
            <p>최소한의 자바스크립트 코드를 통한 HTML5 기반의 Rich UI 제작 프레임워크</p>
            <div>
            <section className='welcome-panel'>
              <p className='welcome-note'>자세한 사용 방법은 아래의 홈페이지를 방문하여 주세요.</p>
              <div className='welcome-consent-choices'>
                <div>
                  <a href="http://ui.alopex.io" target="_blank"><button className='btn'>Alopex UI Home</button></a>
                </div>
                <div>
                  <a href="http://grid.alopex.io" target="_blank"><button className='btn'>Alopex Grid Home</button></a>
                </div>
                <div>
                  <a href="https://nexcore.skcc.com/support/" target="_blank"><button className='btn'>Online HelpDesk</button></a>
                </div>
              </div>
            </section>
            <div className='welcome-detail'>
                  <p>다음의 유용한 Package들을 추가로 설치 할 수 있습니다.</p>
                  <button ref='projectButton' onclick={this.installOtherPackage} className='btn btn-primary'>
                    Install below Packages
                  </button>
                  <ul>
                    <li><a href='https://atom.io/packages/minimap' >Minimap</a></li>
                    <li><a href='https://atom.io/packages/highlight-selected' >Highlight Selected</a></li>
                    <li><a href='https://atom.io/packages/open-in-browsers' >Open in Browsers</a></li>

                  </ul>
            </div>
            <p></p>
            <section className='welcome-panel'>
                <input className='input-checkbox' type='checkbox' id='show-alopex-welcome-on-startup' checked={atom.config.get('atom-alopex.showWelcomeOnStartup')} onchange={this.didChangeShowOnStartup} />
                <label for='show-alopex-welcome-on-startup'>Show Alopex Welcome when opening Atom</label>
            </section>
            </div>
          </div>
        </div>
      </div>

    )
  }

  update () {
    return etch.update(this)
  }

  didChangeShowOnStartup () {
   atom.config.set('atom-alopex.showWelcomeOnStartup', this.checked)
  }
  installOtherPackage () {
    require('atom-package-deps').install('atom-alopex')
          .then(function() {
            const notification=atom.notifications.addInfo ('Atom restart now?',{
              dismissable : true,
              detail: "if use installed packages, you must restart Atom!",
              buttons: [{
                text: 'Yes',
                onDidClick: function onDidClick() {
                    atom.commands.dispatch(atom.views.getView(atom.workspace), 'window:reload')
                }
              }, {
                text: 'No',
                onDidClick: function onDidClick() {
                  notification.dismiss()
                }
              }]
            });

          })

  }

  getTitle () {
    return "Alopex Welcome"
  }

  async destroy () {
    await etch.destroy(this)
  }
}
