import "./JournalForm.css";
import React, { useState, useEffect } from 'react';

function JournalForm() {
    const [name, setNewName] = useState(""); 
    const [entries, setEntries] = useState([]); 
    const [message, setMessage] = useState(""); //
    const [frontPage, setFrontPage] = useState("first");

    useEffect(() => {
        const savedEntries = localStorage.getItem('entries');
        if (savedEntries) {
            setEntries(JSON.parse(savedEntries)); // 
        }
    }, []);

    function handleBrowse() {
        setFrontPage("browse");{/*for browse button*/}
    }
    function handleSubmitPage() {
        setFrontPage("submitBrowse");{/*for submit button*/}
    }

    function handleChange(event) {
        setNewName(event.target.value);
    }
    function handleEntry(event) {
        setMessage(event.target.value);
    }
    async function handleSubmit(event) {
        event.preventDefault(); 
        const newEntry = { name, message, date: new Date().toLocaleString() };//
        if (name && message) { 
            const newEntries = [...entries, newEntry]; // will have updated list of entries kasasma ang mga bagong entries
            setEntries(newEntries); // Update the state with new entries
            localStorage.setItem('entries', JSON.stringify(newEntries)); // punta ang journal entries ko sssa local storage
            setFrontPage("first");
        };
        try {
            const response = await fetch("https://vilgeraapi.azurewebsites.net/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEntry),
            });

            if (response.ok) {
                const result = await response.json();
                alert("message submitted!");
                console.log("API Response:", result);
                console.log("message submission successful");
            } else {
                alert("message submission failed");
                console.error(`API Error:, ${response.statusText}`);
            }
        } catch (error) {
            alert("An error occured while submitting the message");
            console.error("error:", error);
        }
    }
    return (
        <div className="title">
            {frontPage === "first" && (
                <div>
                <h1>Journal</h1>
                    <button className="submit-button" onClick={handleSubmitPage}>Submit your first message!</button>{/*for submitting messages button*/}
                    <button className="browse-button" onClick={handleBrowse}>Browse messages</button>{/*for browsing messages button*/}
                </div>
            )}
            {frontPage === "submitBrowse" && (
                <div>{/*when u click the sub button, input boxes will appear*/}
                    <input
                        className="input-name"
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={handleChange}
                    /><br/>
                    <input
                        className="input-message"
                        type="text"
                        id="message"
                        placeholder="Enter your message"
                        value={message}
                        onChange={handleEntry}
                    /><br/>
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>{/*submitting ur messages*/}
                    <button className="go-back" onClick={() => setFrontPage("first")}>Go Back</button>{/*HERE go back 2 da frontpage*/}
                </div>
            )}
            {/*conditional check*/}{frontPage === "browse" && ( 
                <div>
                <h1>Messages</h1> 
                {entries.length > 0 ? ( 
                    entries.map((message, index) => ( 
                        <div key={index} className="entry"> {/* iterates or loop through yung msg entries */}
                            <p>Name:{message.name}</p> 
                            <p>Message:{message.message}</p>
                            <p><small>Date:{message.date}</small></p>
                        </div>
                    ))
                ) : (
                    <p>No entries available. Submit your first entry!</p> 
                )}
                <button className="back-button" onClick={() => setFrontPage("first")}>
                    Go Back</button>
                </div>
                )}
                <footer>
                    <small>&copy; Anonymous Journal</small>
                    </footer>
      </div>
    );
}

export default JournalForm;
