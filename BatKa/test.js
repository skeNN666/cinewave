const div = document.createElement('div');

div.textContent = 'This div was created by test.js';
div.innerHTML += '<p style="color: blue;">This is a paragraph inside the div.</p>';
div.setAttribute('class', 'test-div');
div.style.border = '2px solid black';
div.style.padding = '10px';
div.style.margin = '10px';  