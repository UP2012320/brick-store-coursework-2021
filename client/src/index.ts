import html from 'Scripts/newFramework/html';
import VirtualDom from 'Scripts/newFramework/virtualDom';
import Test from 'Scripts/newFramework/test';

console.debug(Test());

/*const o = VirtualDom.render(html`
  <div id='id'>
    <input value='test' maxlength='${1}' />
    <label class='${'my-class'}' id='test' onclick='${() => d()}'>
      <main>
        <b>hello</b>
      </main>
    </label>
    <select>
      <p>${'customText'}</p>
    </select>
  </div>
`, document.querySelector('#root'));

console.debug(o);*/
