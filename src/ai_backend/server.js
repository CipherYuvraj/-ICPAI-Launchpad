const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/generate", (req, res) => {
    const { prompt } = req.body;

    console.log(`Generating project for: ${prompt}`);

    // Simulate AI-based project generation
    exec(`echo "Generated ${prompt}" > project_output.txt`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).json({ message: "Error generating project" });
        }
        res.json({ message: `Project '${prompt}' generated successfully!` });
    });
});

app.post("/deploy", (req, res) => {
    console.log("Deploying project...");

    // Run deployment command
    exec("dfx deploy", (error, stdout, stderr) => {
        if (error) {
            console.error(`Deployment Error: ${stderr}`);
            return res.status(500).json({ message: "Deployment failed" });
        }
        res.json({ message: "Deployment successful!" });
    });
});

app.listen(8000, () => console.log("Backend AI API running on port 8000"));
