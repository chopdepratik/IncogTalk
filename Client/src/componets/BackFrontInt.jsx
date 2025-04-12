import React, {useEffect, useState} from "react";
import {io} from "socket.io-client"

//Connect to backend
const socket = io("http://localhost:5000")

const BackFrontint = ()=>{
    const [message, setMessage] = useState("")
    const [received, setReceived] = useState("")

    useEffect(()=>{
        //listen for the message from server
        socket.on("receive-message", (data)=>{
            setReceived(data);
        })

        //Clean up when component unmount
        // return ()=>socket.disconnect()

    }, [received])

    const sendMessage = ()=>{
        //Emit message to backend
        socket.emit("send-message", message)

    }

    return(
        <div>
            <h1>Basic Scket.io Chat</h1>
            <input 
                type="text"
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                placeholder="Type message"
            />

            <button onClick={sendMessage}> Send </button>
            <p> {received}</p>
        </div>
    )
}

export default BackFrontint;