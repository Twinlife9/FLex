const field_uname = document.querySelector('#unamefield');
const form = document.querySelector('form');
const start = document.querySelector('.screen-start');
const start_button = document.querySelector('#start_btn');

function proceedStart(state) {
  switch (state) {
    case 0:
      {
        form.onsubmit = e => {
          e.preventDefault();
          const fd = new FormData(form);
          const uname = fd.get('username');
          if (uname != '') {
            console.log('succes');
            field_uname.innerText = uname;
            start.style.display = 'none';
            proceedStart(1);
          }
        };
      }
      break;
    case 1:
      {
        start_button.onclick = e => {
          const ranking = document.querySelector('.screen-ranking');
          ranking.style.display = 'none';
          proceedStart(2);
        };
      }
      break;
      case 2:
      {
        GameStart();
      }
      break;
      
    default:
      break;
  }
}
proceedStart(0);
