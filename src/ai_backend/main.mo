import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Nat32 "mo:base/Nat32";  // Fixing the import
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Hash "mo:base/Hash";  // Correctly importing hash function

actor WebsiteGenerator {
  
  // Types
  type WebsiteRequirements = {
    prompt: Text;
    type_: Text;
    title: Text;
    sections: [Text];
    style: Text;
    color: Text;
  };

  type DeploymentDetails = {
    canisterId: Text;
    url: Text;
    timestamp: Int;
    status: Text;
  };

  type Website = {
    requirements: WebsiteRequirements;
    deployment: DeploymentDetails;
    owner: Principal;
  };

  // State
private stable var nextId: Nat32 = 0;  // Changed to Nat32 for compatibility
  
  private func nat32Hash(n: Nat32): Hash.Hash {
  return n;
};

private let websites = HashMap.HashMap<Nat32, Website>(0, Nat32.equal, nat32Hash);


  private let userWebsites = HashMap.HashMap<Principal, [Nat32]>(0, Principal.equal, Principal.hash);  

  // Create a new website from a prompt
  public shared(msg) func createWebsite(prompt: Text) : async DeploymentDetails {
    let caller = msg.caller;
    
    // 1. Process prompt to extract requirements
    let requirements = await processPrompt(prompt);
    
    // 2. Generate website (in a real implementation, this would create the actual files)
    let _ = await generateWebsite(requirements);
    
    // 3. Deploy to a new or existing canister
    let deployment = await deployWebsite(caller);
    
    // 4. Save the website details
    let websiteId = nextId;
    nextId += 1;
    
    let website: Website = {
      requirements = requirements;
      deployment = deployment;
      owner = caller;
    };
    
    websites.put(websiteId, website);
    
    // Update user's website list
    switch (userWebsites.get(caller)) {
      case (null) {
        userWebsites.put(caller, [websiteId]);
      };
      case (?existingIds) {
        userWebsites.put(caller, Array.append(existingIds, [websiteId]));
      };
    };
    
    return deployment;
  };
  
  // Get websites for a user
  public query(msg) func getUserWebsites() : async [Website] {
    let caller = msg.caller;
    
    switch (userWebsites.get(caller)) {
      case (null) { return []; };
      case (?ids) {
        var result: [Website] = [];
        for (id in ids.vals()) {
          switch (websites.get(id)) {
            case (null) {};
            case (?website) {
              result := Array.append(result, [website]);
            };
          };
        };
        return result;
      };
    };
  };
  
  // Helper functions (mock implementations for now)
  private func processPrompt(prompt: Text) : async WebsiteRequirements {
    return {
      prompt = prompt;
      type_ = "landing-page";
      title = "AI Generated Website";
      sections = ["header", "about", "services", "contact"];
      style = "modern";
      color = "blue";
    };
  };
  
  private func generateWebsite(requirements: WebsiteRequirements) : async Bool {
    Debug.print("Generating website with title: " # requirements.title);
    return true;
  };
  
  private func deployWebsite(owner: Principal) : async DeploymentDetails {
    let mockCanisterId = "aaaaa-bbbbb-ccccc-ddddd";
    
    return {
      canisterId = mockCanisterId;
      url = "https://" # mockCanisterId # ".ic0.app";
      timestamp = Time.now();
      status = "deployed";
    };
  };
}
