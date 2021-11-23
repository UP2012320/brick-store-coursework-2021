import html from 'Scripts/newFramework/html';

export let name = '';

export default function Test2() {
  return html`
    <h1>Hello ${name}!</h1>
  `;
}
