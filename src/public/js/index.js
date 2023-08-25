const socket = io();

Swal.fire({
    title:"idenficate",
    input: "text",
    text: "ingresa nombre de usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && 'ingresa un nombre de usuario para continuar'
    },
    allowOutsideClick:false //impide salir de la alerta al tocar fuera
}).then(result=>(
    user=result.value
));

chatBox.addEventListener('keyup', evt=>{
    if(evt.key==="Enter"){ //el mensaje se envia cuando el usuario aprieta enter
        if(chatBox.value.trim().length>0){ //corrobora que el mensaje no este vacio o con espacios unicamente
            socket.emit("message", {user:user,message:chatBox.value});//emite el evento
            chatBox.value="";
        }
    }
})

//socket listener de "messageLogs"
socket.on("messageLogs", data=>{
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message=>{
        messages = messages+`${message.user} dice: ${message.message}</br>`
    })
    log.innerHTML = messages;
})