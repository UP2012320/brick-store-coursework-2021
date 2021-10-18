const id = document.querySelector('#root');

const p = document.createElement('p');
p.textContent = 'Hello World!';

if (id) {
  id.appendChild(p);
}
