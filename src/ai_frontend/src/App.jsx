import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent'; // Import necessary modules
// import { idlFactory } from '../declarations/ai_backend';
// import { idlFactory } from './declarations/ai_backend/ai_backend.did.js'; // Import your canister IDL
// import { idlFactory } from './declarations/ai_backend/ai_backend.did.js';import { idlFactory } from '../declarations/ai_backend';
// import { idlFactory } from '../declarations/ai_backend';
import { idlFactory } from '../../declarations/ai_backend/ai_backend.did.js'; // Import your canister IDL



function App() {
  const [greeting, setGreeting] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;

    try {
      const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' }); // Adjust for your network
      await agent.fetchRootKey(); // Only required for local development
      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.AI_BACKEND_CANISTER_ID, // Use environment variable
      });

      const result = await actor.greet(name); // Await the result
      setGreeting(result);
    } catch (error) {
      console.error('Error calling greet:', error);
      setGreeting('Error fetching greeting.'); // Display an error message to the user
    }
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;