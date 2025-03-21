import { useState } from "react";

const WebsiteGenerator = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");

    const handleGenerate = async () => {
        try {
            const res = await fetch("http://localhost:8000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setResponse(data.message);
        } catch (error) {
            console.error("Error generating project:", error);
        }
    };

    const handleDeploy = async () => {
        try {
            const res = await fetch("http://localhost:8000/deploy", {
                method: "POST",
            });

            const data = await res.json();
            setResponse(data.message);
        } catch (error) {
            console.error("Deployment failed:", error);
        }
    };

    return (
        <div className="container">
            <h2>AI Website Generator</h2>
            <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter project idea..."
            />
            <button onClick={handleGenerate}>Generate</button>
            <button onClick={handleDeploy}>Deploy</button>
            <p>{response}</p>
        </div>
    );
};

export default WebsiteGenerator;
