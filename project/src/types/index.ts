export interface Person {
  id: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  status: InfectionStatus;
  connections: number[];
  daysInfected: number;
  daysExposed: number;
  community: number;
  age: number;
}

export interface Link {
  source: number;
  target: number;
  strength: number;
}

export interface Network {
  people: Person[];
  links: Link[];
}

export enum InfectionStatus {
  SUSCEPTIBLE = 'SUSCEPTIBLE',
  EXPOSED = 'EXPOSED',
  INFECTIOUS = 'INFECTIOUS',
  RECOVERED = 'RECOVERED'
}

export interface SimulationParams {
  populationSize: number;
  initialInfections: number;
  transmissionRate: number;
  exposedDays: number;
  recoveryDays: number;
  immunityDays: number | null;
  connectionsPerPerson: number;
  communityCount: number;
}

export interface SimulationStats {
  day: number;
  susceptible: number;
  exposed: number;
  infectious: number;
  recovered: number;
  newCases: number;
  totalCases: number;
}

export interface SimulationState {
  network: Network;
  params: SimulationParams;
  stats: SimulationStats[];
  currentDay: number;
  isRunning: boolean;
  speed: number;
}