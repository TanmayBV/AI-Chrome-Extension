const chat = document.getElementById("chat")
const input = document.getElementById("question")
const sendBtn = document.getElementById("sendBtn")

function addMessage(text, type){

const msg = document.createElement("div")
msg.classList.add("message")
msg.classList.add(type)

msg.innerText = text

chat.appendChild(msg)

chat.scrollTop = chat.scrollHeight

return msg
}

async function sendMessage(){

const question = input.value.trim()

if(!question) return

addMessage(question,"user")

input.value=""

const loadingMsg = addMessage("Thinking...","ai")
loadingMsg.classList.add("loading")

const [tab] = await chrome.tabs.query({
active:true,
currentWindow:true
})

const url = tab.url

try{

const response = await fetch("http://127.0.0.1:8000/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
url:url,
question:question
})

})

const data = await response.json()

loadingMsg.classList.remove("loading")
loadingMsg.innerText = data.answer

}catch(err){

loadingMsg.innerText="Backend error"

}

}

sendBtn.addEventListener("click",sendMessage)

input.addEventListener("keypress",function(e){
if(e.key==="Enter"){
e.preventDefault()
sendMessage()
}
})
