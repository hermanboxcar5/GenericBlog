hljs.configure({
  // optionally configure hljs
  languages: ["javascript", "HTML", "CSS", "python", "java"]
});

// Initialize QUill editor
var quill = new Quill("#editor-container", {
  modules: {
    syntax: true,
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["image", "code-block"],
      [{ color: [] }, { background: [] }],
      ["link"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"]
    ]
  },
  placeholder: "Start Typing...",
  theme: "snow"
});

let months=['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function getdate(txt){
  console.log(txt)
  let arr=txt.split('-').join('/').split('/')
  console.log(arr)
  arr[1]=months[arr[1]-1]
  console.log(arr)
  return `${arr[1]} ${arr[2]}, ${arr[0]}`
}

function makeurl(inputString) {
  // Replace spaces with underscores and remove any other special characters
  return inputString
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^\w-]+/g, ''); // Remove any special characters
}


function txt50(input) {
  input = input.split('<br>').join('\n')
  let parser= new DOMParser()
  dom = parser.parseFromString(`<div id='PARSER-01'>${input}</div>`, 'text/html');
  input = dom.getElementById('PARSER-01').innerText
  console.log(input)
  input =input.slice(0, 500)
  input = input.replace(/\n+$/, '')
  return input+'...'
}





function preview() {
  
  
  let pwindow = document.getElementById("display");
  let author = document.getElementById("author").value;
  let content = quill.root.innerHTML;
  let title = document.getElementById("title").value;
  updatememory(document.getElementById('memoryslot_select_editor').value)
  updatememslots('memslotselectdiv', true, document.getElementById('memoryslot_select_editor').value)
  updatememslots('memslot-select-div', false, document.getElementById('memoryslot_select_editor').value)
  let dateo = document.getElementById("date").value;
  let date = getdate(dateo)
  let datetxt = date;
  pwindow.innerHTML = `
    <p class="font-medium"><span id='date-display'>${datetxt}</p>
      <h1 class="text-5xl">${title}</h1>
      <p class="font-medium">By <span id='author'>${author}</span></p>
      <div class="spacer-s"></div>
    <div id='main'>
      ${content}
    </div>
  `;
document.getElementById('urlpreview').value='https://blog.richcode.org/articles/'+dateo+"-"+makeurl(title)+'.html'
  document.getElementById('tab-title').innerHTML=title;

  codeformat()
  console.log(content);
}

function dl() {
  document.getElementById('savecode').style.display='none'
  document.getElementById('loadcode').style.display='none'
  document.getElementById('viewcode').style.display='block';
  let output = document.getElementById("txtarea");
  let author = document.getElementById("author").value;
  let content = quill.root.innerHTML;
  let title = document.getElementById("title").value;
  let dateo = document.getElementById("date").value;
  let date = getdate(dateo)
  let datetxt = date;
  let c = `
    <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>BLOG - RICHCODE</title>
      <link rel="icon" type="image/x-icon" href="/resources/img/favicon.ico" />

      <!-- Google fonts -->
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <!-- My CSS -->
      <link href="/resources/css/index.css" type="text/css" rel="stylesheet" />
      <link href="/resources/css/blog.css" type="text/css" rel="stylesheet" />
      <link href="/resources/css/tailwind.css" type="text/css" rel="stylesheet" />

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">

      <script src="/nav.js" defer></script>
    </head>

    <body>
    <header id="header"></header>
      <main class="main">
        <div class="spacer-s"></div>
        <a class="ml-8 font-semibold text-inherit no-underline" href="/index.html">←
          Go back</a>
        <div class="blog-container">
          <div class="spacer-m"></div>
          <p clas="font-medium"><span id='date-display'>${datetxt}</p>
          <h1 class="text-5xl">${title}</h1>
          <p class="font-medium">By <span id='author'>${author}</span></p>
          <div class="spacer-s"></div>
          <div id='main'>
            ${content}
          </div>
          <div class="spacer-l"></div>
        </div>
      </main>

      <script src='/blogpage.js'></script>
    </body>
  </html>

  `;
  
  output.value = c;
  c=txt50(content)
  console.log(content)
  console.log(c)
  let jsonp=JSON.stringify({title:title, author:author, date:datetxt, content:c, url:'/articles/'+dateo+"-"+makeurl(title)+'.html'})+","
  document.getElementById('blogjson').value=jsonp
  document.getElementById('filename').innerHTML='/articles/'+dateo+"-"+makeurl(title)+'.html'
  console.log(dateo+"-"+makeurl(title))
  
}


function load(){
  document.getElementById('loadcode').style.display='block'
  document.getElementById('viewcode').style.display='none'
  document.getElementById('savecode').style.display='none'
  let a=JSON.parse(document.getElementById('load').value)
  quill.root.innerHTML= a.content
  document.getElementById('author').value=a.author;
  document.getElementById('title').value=a.title; 
}
function saveToLocal(){
    let author = document.getElementById("author").value;
    let content = quill.root.innerHTML;
    let title = document.getElementById("title").value;
    let date = document.getElementById("date").value;
    date = date.split("-");
    date = [date[1], date[2], date[0]].join("/");
    let compiled = JSON.stringify({
      "author":author,
      "title":title,
      "content":content
    })
  localStorage.setItem('file', compiled)
}

function loadFromLocal(){
  let obj=JSON.parse(localStorage.getItem('file'), 'text/html')
  quill.root.innerHTML = obj.content
  document.getElementById('author').value=obj.author;
  document.getElementById('title').value=obj.title;
}

function saveAsTxt(){
    document.getElementById('loadcode').style.display='none'
    document.getElementById('viewcode').style.display='none'
    document.getElementById('savecode').style.display='block'
    let output = document.getElementById("save");
    let author = document.getElementById("author").value;
    let content = quill.root.innerHTML;
    let title = document.getElementById("title").value;
    let date = document.getElementById("date").value;
    date = date.split("-");
    date = [date[1], date[2], date[0]].join("/");
    let compiled = JSON.stringify({
      "author":author,
      "title":title,
      "content":content
    })
  output.value=compiled
}


// LEGACY SET ^^^







































function elem(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}
function codeformat(){
  const copyButtonLabel = "Copy Code";

  // use a class selector if available
  let blocks = document.querySelectorAll("pre");

  blocks.forEach((block) => {
    // only add button if browser supports Clipboard API
    if (navigator.clipboard) {
       let button = elem(`<div style='background-color:#343434;text-align:left;padding:10px;border-radius:10px 10px 10px 10px;'><b style='color:black;background-color:white;border-radius:5px;border:none;padding:3px;' onclick=''>${copyButtonLabel}</b></div>`)

      block.insertBefore(button, block.firstChild);

      button.addEventListener("click", async () => {
        await copyCode(block, button.firstChild);
      });
    }
  });
}


async function copyCode(block, button) {
  let text = block.innerText;
  text=text.split("Copy Code").join('')
  await navigator.clipboard.writeText(text);

  // visual feedback that task is completed
  button.innerText = "Code Copied";

  setTimeout(() => {
    button.innerText = copyButtonLabel;
  }, 700);
}
let tabs={}
tabs.idmin=0
tabs.current = 0
tabs.raw={}
tabs.to=function(num){
  tabs.current=num
  if(tabs.raw['item'+num].content.predefined=='metadata'){
    let output = document.getElementById("save");
    let author = document.getElementById("author").value;
    let content = quill.root.innerHTML;
    let title = document.getElementById("title").value;
    let date = document.getElementById("date").value;
    date = date.split("-");
    date = [date[1], date[2], date[0]].join("/");
    let compiled ={
      "author":author,
      "title":title,
      "content":content
    }
    tabs.raw['item'+num].metadata=compiled
  }
  
  
}

function newtab(){
  let ls = localStorage.getItem('memory')
  if(!ls){
    ls="{}"
  }
  let lsjson=JSON.parse(ls)
  if(!lsjson){
    lsjson={}
  }
  let prev = document.getElementById('display')
  prev.innerHTML=`
  <div>
  <h1>New Tab</h1>
  Load an existing post or create new:
    <div id='memload-nt'>
    Load from memory:
    <select id='memoryslot_select'>
      <option value='1'>1: ${lsjson.item1?lsjson.item1:'Empty'}</option>
      <option value='2'>2: ${lsjson.item2?lsjson.item2:'Empty'}</option>
      <option value='3'>3: ${lsjson.item3?lsjson.item3:'Empty'}</option>
      <option value='4'>4: ${lsjson.item4?lsjson.item4:'Empty'}</option>
      <option value='5'>5: ${lsjson.item5?lsjson.item5:'Empty'}</option>
      <option value='6'>6: ${lsjson.item6?lsjson.item6:'Empty'}</option>
      <option value='7'>7: ${lsjson.item7?lsjson.item7:'Empty'}</option>
      <option value='8'>8: ${lsjson.item8?lsjson.item8:'Empty'}</option>
      <option value='9'>9: ${lsjson.item9?lsjson.item9:'Empty'}</option>
      <option value='10'>10: ${lsjson.item10?lsjson.item10:'Empty'}</option>
    </select>
    <button id='memoryslot_load' onclick='ntmemload(${tabid})' class='rvbtn'>Load</button>
    </div><br><br>
    <div id='txtload-nt'>
    Load from txt:
      <textarea id='txtarea_slot'></textarea>
      <button id='memoryslot_load' onclick='nttxtload(${tabid})' class='rvbtn'>Load</button>
    </div>
    <div id='newpost-nt'>
      Load empty new post:
      <button onclick='newpost(${tabid})' class='rvbtn'>New Post</button>
    </div>
      
  </div>
  `
  
}



function ntmemload() {
  let slot = document.getElementById('memoryslot_select').value
  let mem = localStorage.getItem('memory')
  if(!mem){
    mem="{}"
  }
  let rawjson=JSON.parse(mem)
  if(!rawjson){
    rawjson={}
  }
  if(rawjson['item'+slot]){
    console.log(slot, rawjson)
  let obj = rawjson["item"+slot]
    obj=JSON.parse(obj)
    console.log(obj)
  quill.root.innerHTML = obj.content
  document.getElementById('author').value=obj.author;
  document.getElementById('title').value=obj.title;
  document.getElementById('tab-title').innerHTML=obj.title;
    updatememslots('memslotselectdiv', true, slot)
    preview()
  } else {
    newpost()
    
  }
}

function newpost(){
      document.getElementById('urlpreview').value='https://blog.richcode.org/newpost.html'
  
  let prev = document.getElementById('display')
  prev.innerHTML=`
  <h1>New Blog Post</h1> 
  <p>← Start writing, then click reload button above this text. to preview. </p>
  <p>Write something amazing!</p>
  <p>When you are ready to publish, press publish on the top right corner ↗</p>
  
  `
  document.getElementById('tab-title').innerHTML="New Post";

}





function startup(){

  let prev = document.getElementById('display')
  prev.innerHTML=`
  <div>
  <h1>New Tab</h1>
  Load an existing post or create new:
    <div id='memload-nt'>
    Load from memory:
    <div id='memsslot-select-div'>
    
    </select>
    </div>
    <button id='memoryslot_load' onclick='ntmemload()' class='rvbtn'>Load</button>
    </div><br><br>
    <div id='txtload-nt'>
    Load from txt:
      <textarea id='txtarea_slot'></textarea>
      <button id='memoryslot_load' onclick='nttxtload()' class='rvbtn'>Load</button>
    </div>
    <div id='newpost-nt'>
      Load empty new post:
      <button onclick='newpost()' class='rvbtn'>New Post</button>
    </div>

  </div>
  `
  updatememslots('memslotselectdiv', true)
  updatememslots('memsslot-select-div', false)
}


function settings(){
  updatememslots('deletememory', true, 11, true)
  document.getElementById('loadcode').style.display='block'
}


function updatememslots(elem, bool, item, adv){
  
  let ls = localStorage.getItem('memory')
  if(!ls){
    ls="{}"
  }
  let lsjson=JSON.parse(ls)
  if(!lsjson){
    lsjson={}
  }
  console.log(typeof lsjson)
  Array.from(Object.keys(lsjson)).map((e)=>{
    a=lsjson[e]
    if(typeof a=='string'&&a){
      console.log(lsjson, e, a)
      lsjson[e]=JSON.parse(a)
    }
  })
  let prev = document.getElementById(elem)
  if(!prev){return;}
  console.log(lsjson)
  let appender='_editor'
  if(adv){appender='_delete'}
  prev.innerHTML=`
    <select id='memoryslot_select${bool?appender:""}'>
      <option value='1'${item==1?' selected':''}>1: ${lsjson.item1?lsjson.item1.title:'Empty'}</option>
      <option value='2'${item==2?' selected':''}>2: ${lsjson.item2?lsjson.item2.title:'Empty'}</option>
      <option value='3'${item==3?' selected':''}>3: ${lsjson.item3?lsjson.item3.title:'Empty'}</option>
      <option value='4'${item==4?' selected':''}>4: ${lsjson.item4?lsjson.item4.title:'Empty'}</option>
      <option value='5'${item==5?' selected':''}>5: ${lsjson.item5?lsjson.item5.title:'Empty'}</option>
      <option value='6'${item==6?' selected':''}>6: ${lsjson.item6?lsjson.item6.title:'Empty'}</option>
      <option value='7'${item==7?' selected':''}>7: ${lsjson.item7?lsjson.item7.title:'Empty'}</option>
      <option value='8'${item==8?' selected':''}>8: ${lsjson.item8?lsjson.item8.title:'Empty'}</option>
      <option value='9'${item==9?' selected':''}>9: ${lsjson.item9?lsjson.item9.title:'Empty'}</option>
      <option value='10'${item==10?' selected':''}>10: ${lsjson.item10?lsjson.item10.title:'Empty'}</option>
    </select>
  `
console.log(item)
}

function updatememory(slot){

  let author = document.getElementById("author").value;
  let content = quill.root.innerHTML;
  let title = document.getElementById("title").value;
  let dateo = document.getElementById("date").value;
  let date = getdate(dateo)
  let datetxt = date;
  let ls = localStorage.getItem('memory')
  if(!ls){
    ls="{}"
  }
  let lsjson=JSON.parse(ls)
  if(!lsjson){
    lsjson={}
  }
  let val = {title:title, content:content, author:author}
  
  //START HERE
  val = JSON.stringify(val)
  lsjson['item'+slot]=val
  localStorage.setItem('memory', JSON.stringify(lsjson))
  document.getElementById('autosaved-time').innerHTML=new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(new Date());
}



function delmem(slot, all){
  if(all){
    localStorage.setItem('memory', '')
    updatememslots('memslotselectdiv', true)
    updatememslots('memsslot-select-div', false)
    updatememslots('deletememory', true, 11, true)
    return;
  }
  let ls = localStorage.getItem('memory')
  if(!ls){
    ls="{}"
  }
  let lsjson=JSON.parse(ls)
  if(!lsjson){
    lsjson={}
  }
  lsjson['item'+slot]=''
  localStorage.setItem('memory', JSON.stringify(lsjson))
  updatememslots('memslotselectdiv', true)
  updatememslots('memsslot-select-div', false)
  updatememslots('deletememory', true, 11, true)
}





startup()
document.getElementById('date').value=new Date().toISOString().substring(0, 10)
codeformat()
