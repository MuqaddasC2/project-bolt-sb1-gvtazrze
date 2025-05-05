import { Network, Person, Link, InfectionStatus, SimulationParams } from '../types';

/**
 * Generates a synthetic social network using the Barabási-Albert model
 * This model creates scale-free networks with preferential attachment
 * where some nodes become "hubs" with many connections
 */
export function generateNetwork(params: SimulationParams): Network {
  const { 
    populationSize, 
    initialInfections, 
    connectionsPerPerson,
    communityCount 
  } = params;
  
  // Initialize people array with communities
  const people: Person[] = Array.from({ length: populationSize }, (_, id) => ({
    id,
    status: InfectionStatus.SUSCEPTIBLE,
    connections: [],
    daysInfected: 0,
    daysExposed: 0,
    community: Math.floor(Math.random() * communityCount),
    age: Math.floor(20 + Math.random() * 60) // Age between 20-80
  }));

  // Set initial infected people
  const initialInfectedIds = getRandomIndices(populationSize, initialInfections);
  initialInfectedIds.forEach(id => {
    people[id].status = InfectionStatus.INFECTIOUS;
  });

  // Create links using Barabási-Albert model
  const links: Link[] = [];
  
  // Start with a small complete graph
  const startSize = Math.min(connectionsPerPerson + 1, populationSize);
  
  // Create initial complete graph
  for (let i = 0; i < startSize; i++) {
    for (let j = i + 1; j < startSize; j++) {
      people[i].connections.push(j);
      people[j].connections.push(i);
      links.push({ 
        source: i, 
        target: j, 
        strength: calculateLinkStrength(people[i], people[j]) 
      });
    }
  }
  
  // Add remaining nodes with preferential attachment
  for (let i = startSize; i < populationSize; i++) {
    const newConnections = selectNodesPreferentially(
      people.slice(0, i),
      connectionsPerPerson,
      people[i].community
    );
    
    newConnections.forEach(target => {
      people[i].connections.push(target);
      people[target].connections.push(i);
      links.push({ 
        source: i, 
        target, 
        strength: calculateLinkStrength(people[i], people[target]) 
      });
    });
  }
  
  return { people, links };
}

/**
 * Selects nodes for connection using preferential attachment
 * Nodes with more connections are more likely to be selected
 * Community membership influences connection probability
 */
function selectNodesPreferentially(
  existingPeople: Person[], 
  count: number,
  community: number
): number[] {
  const selected: number[] = [];
  const totalEdges = existingPeople.reduce((sum, p) => sum + p.connections.length, 0);
  
  // Create weighted selection based on degree and community
  const weights: number[] = existingPeople.map(person => {
    const degree = person.connections.length;
    const communityFactor = person.community === community ? 3 : 1;
    return (degree / totalEdges) * communityFactor;
  });
  
  // Normalize weights
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map(w => w / totalWeight);
  
  // Perform weighted selection without replacement
  while (selected.length < count && selected.length < existingPeople.length) {
    let r = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < existingPeople.length; i++) {
      if (selected.includes(existingPeople[i].id)) continue;
      
      cumulativeWeight += normalizedWeights[i];
      if (r <= cumulativeWeight) {
        selected.push(existingPeople[i].id);
        break;
      }
    }
  }
  
  return selected;
}

/**
 * Calculates link strength based on community membership
 * Links within the same community are stronger
 */
function calculateLinkStrength(personA: Person, personB: Person): number {
  // Base strength
  let strength = 0.5;
  
  // Community factor: stronger connections within same community
  if (personA.community === personB.community) {
    strength += 0.3;
  }
  
  // Add some randomness
  strength += Math.random() * 0.2;
  
  return Math.min(strength, 1.0);
}

/**
 * Generates an array of random unique indices
 */
function getRandomIndices(max: number, count: number): number[] {
  const indices: number[] = [];
  while (indices.length < count) {
    const index = Math.floor(Math.random() * max);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  return indices;
}