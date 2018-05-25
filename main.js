const dataU = document.getElementById('gs_citd').getAttribute('data-u') || '';
const dict = {};
for (const obj of document.getElementsByClassName('gs_or_cit')) {
  const scl = obj.closest('.gs_scl');
  const d = dataU.replace('{id}', scl.getAttribute('data-cid')).replace('{p}', '' + scl.getAttribute('data-rp'))
  const go = () => {
    if (d in dict) {
      navigator.clipboard.writeText(dict[d]);
      return;
    }

    console.log(`#1: Will go ${d}`);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      let [, u] = this.responseText.match(/href="(.*)">BibTeX<\/a>/);
      u = u.replace(/&amp;/g, '&');
      console.log(`#2: Will go ${u}`);
      const xhr2 = new XMLHttpRequest();
      xhr2.addEventListener('load', function() {
        dict[d] = this.responseText;
        navigator.clipboard.writeText(this.responseText);
      });
      xhr2.open("GET", u, true);
      xhr2.send();
    });
    xhr.open("GET", d, true);
    xhr.setRequestHeader("X-Requested-With", "XHR");
    xhr.send();
  };
  const el = document.createElement('a');
  el.innerText = 'CopyBibTeXToClipboard';
  el.setAttribute('href', 'javascript:void(0)');
  el.addEventListener('click', go);
  obj.parentNode.insertBefore(el, obj);
}
