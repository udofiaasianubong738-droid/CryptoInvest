import { ClusterInstance, ThroughputDay, RegionCapacity } from '../types/dashboard';

export const INITIAL_DATASET: ClusterInstance[] = [
  {
    id: "i-091a1a7",
    host: "app-prod-01",
    region: "US-East",
    status: "Healthy",
    load: 23,
    uptime: "42d",
    ipAddress: "10.142.0.12",
    cpuCores: 16,
    memoryGb: 64,
    memoryUsedPercent: 34,
    activeRequests: 420,
    lastReboot: "2026-09-15 04:12 UTC",
    role: "Application Ingress"
  },
  {
    id: "i-088f2b3",
    host: "app-prod-02",
    region: "US-East",
    status: "Warning",
    load: 89,
    uptime: "12d",
    ipAddress: "10.142.0.15",
    cpuCores: 16,
    memoryGb: 64,
    memoryUsedPercent: 88,
    activeRequests: 1840,
    lastReboot: "2026-10-15 11:20 UTC",
    role: "Core API Worker"
  },
  {
    id: "i-033c4d5",
    host: "auth-core-01",
    region: "EU-Central",
    status: "Healthy",
    load: 44,
    uptime: "90d",
    ipAddress: "10.156.4.88",
    cpuCores: 32,
    memoryGb: 128,
    memoryUsedPercent: 49,
    activeRequests: 812,
    lastReboot: "2026-07-29 02:00 UTC",
    role: "Auth Token Service"
  },
  {
    id: "i-077e6f8",
    host: "db-replica-04",
    region: "AP-South",
    status: "Critical",
    load: 98,
    uptime: "4h",
    ipAddress: "10.160.1.201",
    cpuCores: 64,
    memoryGb: 256,
    memoryUsedPercent: 96,
    activeRequests: 3420,
    lastReboot: "2026-10-27 13:40 UTC",
    role: "PostgreSQL Read Replica"
  },
  {
    id: "i-012g9k0",
    host: "cache-redis-02",
    region: "EU-Central",
    status: "Healthy",
    load: 12,
    uptime: "15d",
    ipAddress: "10.156.2.14",
    cpuCores: 16,
    memoryGb: 64,
    memoryUsedPercent: 28,
    activeRequests: 620,
    lastReboot: "2026-10-12 09:15 UTC",
    role: "Redis Session Cache"
  },
  {
    id: "i-054h3j1",
    host: "ingress-gw-01",
    region: "US-East",
    status: "Healthy",
    load: 54,
    uptime: "108d",
    ipAddress: "10.142.1.5",
    cpuCores: 32,
    memoryGb: 64,
    memoryUsedPercent: 51,
    activeRequests: 2190,
    lastReboot: "2026-07-11 18:30 UTC",
    role: "Edge Load Balancer"
  },
  {
    id: "i-066m2p4",
    host: "queue-worker-08",
    region: "AP-South",
    status: "Warning",
    load: 76,
    uptime: "3d",
    ipAddress: "10.160.3.49",
    cpuCores: 16,
    memoryGb: 32,
    memoryUsedPercent: 79,
    activeRequests: 1140,
    lastReboot: "2026-10-24 16:50 UTC",
    role: "Asynchronous Job Runner"
  },
  {
    id: "i-041x8y9",
    host: "telemetry-agg-03",
    region: "US-West",
    status: "Healthy",
    load: 38,
    uptime: "64d",
    ipAddress: "10.148.0.77",
    cpuCores: 24,
    memoryGb: 96,
    memoryUsedPercent: 42,
    activeRequests: 950,
    lastReboot: "2026-08-24 07:14 UTC",
    role: "Metrics Collector"
  }
];

export const INITIAL_CHART_VALUES: ThroughputDay[] = [
  { day: "Mon", fullDate: "Oct 20", val: 42, peakRps: 4210, errorCount: 14 },
  { day: "Tue", fullDate: "Oct 21", val: 68, peakRps: 6890, errorCount: 8 },
  { day: "Wed", fullDate: "Oct 22", val: 85, peakRps: 8740, errorCount: 22 },
  { day: "Thu", fullDate: "Oct 23", val: 62, peakRps: 6310, errorCount: 11 },
  { day: "Fri", fullDate: "Oct 24", val: 94, peakRps: 9890, errorCount: 39 },
  { day: "Sat", fullDate: "Oct 25", val: 56, peakRps: 5820, errorCount: 5 },
  { day: "Sun", fullDate: "Oct 26", val: 78, peakRps: 8120, errorCount: 17 }
];

export const REGIONAL_CAPACITY_DATA: RegionCapacity[] = [
  { region: "US-East", displayName: "US-East (N. Virginia)", utilization: 84, nodeCount: 412, maxNodes: 490 },
  { region: "EU-Central", displayName: "EU-Central (Frankfurt)", utilization: 62, nodeCount: 320, maxNodes: 516 },
  { region: "AP-South", displayName: "AP-South (Mumbai)", utilization: 39, nodeCount: 198, maxNodes: 508 },
  { region: "US-West", displayName: "US-West (Oregon)", utilization: 51, nodeCount: 94, maxNodes: 184 }
];
