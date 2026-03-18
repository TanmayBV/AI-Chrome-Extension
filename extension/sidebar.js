const chat=document.getElementById("chat")
const input=document.getElementById("question")
const btn=document.getElementById("sendBtn")

function addMsg(text,type){

const div=document.createElement("div")
div.classList.add("message",type)
div.innerText=text

chat.appendChild(div)
chat.scrollTop=chat.scrollHeight

return div
}

function typeEffect(el,text){

let i=0

function typing(){
if(i<text.length){
el.innerText+=text.charAt(i)
i++
setTimeout(typing,10)
}
}

typing()
}

async function sendQuestion(question){

addMsg(question,"user")

const loading=addMsg("Thinking...","ai")

const url=window.location.href

try{

const res=await fetch("http://127.0.0.1:8000/chat",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
url:url,
question:question
})

})

const data=await res.json()

loading.innerText=""

typeEffect(loading,data.answer)

}catch{

loading.innerText="Error contacting backend"

}

}

btn.addEventListener("click",()=>{

const q=input.value.trim()

if(!q)return

input.value=""

sendQuestion(q)

})

input.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){
e.preventDefault()
btn.click()
}

})

window.addEventListener("message",(event)=>{

if(event.data.type==="selection"){

sendQuestion("Explain this: "+event.data.text)

}

})