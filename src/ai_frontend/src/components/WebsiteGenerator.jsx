// ai_frontend/src/components/WebsiteGenerator.jsx

import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent'; // Import necessary modules
import { idlFactory } from '../declarations/ai_backend'; // Import your canister IDL

const WebsiteGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [websites, setWebsites] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Please enter a website description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' }); // Adjust for your network
      await agent.fetchRootKey(); // Only required for local development
      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.AI_BACKEND_CANISTER_ID, // Use environment variable
      });

      const deployment = await actor.createWebsite(prompt);

      setResult({
        deploymentDetails: deployment,
        websiteRequirements: {
          prompt,
          type: 'landing-page', // default type
        },
      });

      fetchWebsites();
    } catch (err) {
      setError(`Failed to generate website: ${err.message || err}`);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWebsites = async () => {
    try {
      const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' }); // Adjust for your network
      await agent.fetchRootKey(); // Only required for local development
      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.AI_BACKEND_CANISTER_ID, // Use environment variable
      });
      const userWebsites = await actor.getUserWebsites();
      setWebsites(userWebsites);
    } catch (err) {
      console.error('Error fetching websites:', err);
    }
  };

  React.useEffect(() => {
    fetchWebsites();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Website Generator</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Describe your website
          </label>
          <textarea
            id="prompt"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
            rows="5"
            placeholder="Describe the website you want to create. For example: 'Create a portfolio website for a photographer with a dark theme, gallery section, about me, and contact form.'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Website'}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
          <h2 className="font-bold text-xl mb-2">Website Created!</h2>
          <p className="mb-2">Your website is now available at:</p>
          <a
            href={result.deploymentDetails.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {result.deploymentDetails.url}
          </a>

          <div className="mt-4 p-3 bg-white rounded shadow-inner">
            <h3 className="font-semibold mb-1">Website Details:</h3>
            <ul className="list-disc list-inside text-sm">
              <li>Canister ID: {result.deploymentDetails.canisterId}</li>
              <li>Type: {result.websiteRequirements.type || 'landing-page'}</li>
              <li>
                Deployed: {new Date(Number(result.deploymentDetails.timestamp) / 1000000).toLocaleString()}
              </li>
            </ul>
          </div>
        </div>
      )}

      {websites.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Websites</h2>
          <div className="space-y-4">
            {websites.map((website, index) => (
              <div key={index} className="p-4 border rounded-md">
                <h3 className="font-bold">{website.requirements.title}</h3>
                <p className="text-gray-600">{website.requirements.type_}</p>
                <a
                  href={website.deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {website.deployment.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteGenerator;