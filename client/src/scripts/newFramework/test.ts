import html from 'Scripts/newFramework/html';
import Test2 from './test2';

export let name = 'unknown';
export let age = 0;
export let input: HTMLInputElement;

export default function Test() {
  return html`
    <${Test2} name='${name}' />
    <p>She is ${age}</p>
    <input />
    <button onclick='${() => {
      name = input.value ?? 'Emily';
      age = 19;
    }}'></button>
  `;
}
