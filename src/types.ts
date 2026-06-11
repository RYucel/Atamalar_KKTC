export interface Appointment {
  date: string;
  person: string;
  position: string;
  institution: string;
}

export interface GraphNode {
  id: string;
  group: 'person' | 'institution';
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
