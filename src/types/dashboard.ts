export type NodeStatus = 'Healthy' | 'Warning' | 'Critical';

export interface ClusterInstance {
  id: string;
  host: string;
  region: string;
  status: NodeStatus;
  load: number; // percentage 0-100
  uptime: string;
  ipAddress: string;
  cpuCores: number;
  memoryGb: number;
  memoryUsedPercent: number;
  activeRequests: number;
  lastReboot: string;
  role: string;
}

export interface ThroughputDay {
  day: string;
  fullDate: string;
  val: number; // k req
  peakRps: number;
  errorCount: number;
}

export interface RegionCapacity {
  region: string;
  displayName: string;
  utilization: number; // percentage
  nodeCount: number;
  maxNodes: number;
}

export type SortField = 'id' | 'host' | 'region' | 'status' | 'load' | 'uptime';
export type SortDirection = 'asc' | 'desc';
