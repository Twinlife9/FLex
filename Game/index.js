const form = document.querySelector('form');
const panel = document.querySelector('.panel'); 
const field_uname = document.querySelector('#unamefield');
form.onsubmit = (e)=>{
  e.preventDefault();
  const fd = new FormData(form)
  const uname = fd.get('username');
  if (uname != '') {
    console.log('succes');
    field_uname.innerText = uname;
    panel.style.display = 'none';
  }
}
