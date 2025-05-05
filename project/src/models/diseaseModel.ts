import { Person, InfectionStatus, Network, SimulationParams, SimulationStats } from '../types';

/**
 * Updates the disease state for the entire network for one time step (day)
 */
export function simulateDay(
  network: Network,
  params: SimulationParams,
  currentDay: number
): {
  updatedNetwork: Network;
  stats: SimulationStats;
} {
  const { people, links } = network;
  const { transmissionRate, exposedDays, recoveryDays } = params;
  
  // Deep copy people to track changes
  const updatedPeople = structuredClone(people);
  
  // Track new infections for statistics
  let newCases = 0;
  
  // Process each person
  updatedPeople.forEach(person => {
    switch (person.status) {
      case InfectionStatus.SUSCEPTIBLE:
        // Check if susceptible person gets exposed
        const infectedContacts = getInfectiousContacts(person, people);
        
        // For each infectious contact, calculate transmission
        infectedContacts.forEach(contactId => {
          // Find the link to determine connection strength
          const link = links.find(l => 
            (l.source === person.id && l.target === contactId) || 
            (l.source === contactId && l.target === person.id)
          );
          
          // Apply transmission probability based on link strength
          const contactStrength = link?.strength || 0.5;
          const adjustedTransmissionRate = transmissionRate * contactStrength;
          
          // If transmission occurs, change status to exposed
          if (Math.random() < adjustedTransmissionRate && 
              person.status === InfectionStatus.SUSCEPTIBLE) {
            person.status = InfectionStatus.EXPOSED;
            person.daysExposed = 0;
            newCases++;
          }
        });
        break;
        
      case InfectionStatus.EXPOSED:
        // Increment days exposed
        person.daysExposed++;
        
        // Check if exposure period is over
        if (person.daysExposed >= exposedDays) {
          person.status = InfectionStatus.INFECTIOUS;
          person.daysInfected = 0;
        }
        break;
        
      case InfectionStatus.INFECTIOUS:
        // Increment days infected
        person.daysInfected++;
        
        // Check if recovery occurs
        if (person.daysInfected >= recoveryDays) {
          person.status = InfectionStatus.RECOVERED;
        }
        break;
        
      case InfectionStatus.RECOVERED:
        // Currently no reinfection in this model
        // Could implement waning immunity here
        break;
    }
  });
  
  // Calculate statistics
  const stats = calculateStatistics(updatedPeople, currentDay, newCases);
  
  return {
    updatedNetwork: { people: updatedPeople, links },
    stats
  };
}

/**
 * Returns an array of infectious contacts for a given person
 */
function getInfectiousContacts(person: Person, people: Person[]): number[] {
  return person.connections.filter(contactId => 
    people[contactId].status === InfectionStatus.INFECTIOUS
  );
}

/**
 * Calculates statistics for the current simulation state
 */
function calculateStatistics(
  people: Person[],
  day: number,
  newCases: number
): SimulationStats {
  // Count people in each state
  const susceptible = people.filter(p => p.status === InfectionStatus.SUSCEPTIBLE).length;
  const exposed = people.filter(p => p.status === InfectionStatus.EXPOSED).length;
  const infectious = people.filter(p => p.status === InfectionStatus.INFECTIOUS).length;
  const recovered = people.filter(p => p.status === InfectionStatus.RECOVERED).length;
  
  // Calculate total cases (everyone who's been exposed/infected/recovered)
  const totalCases = people.length - susceptible;
  
  return {
    day,
    susceptible,
    exposed,
    infectious,
    recovered,
    newCases,
    totalCases
  };
}