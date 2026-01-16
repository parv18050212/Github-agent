import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Batch {
  id: string;
  name: string;
  semester: string;
  year: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "archived";
  teamCount: number;
  studentCount: number;
}

interface BatchContextType {
  batches: Batch[];
  selectedBatch: Batch | null;
  setSelectedBatch: (batch: Batch | null) => void;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

// Mock batches data
const mockBatches: Batch[] = [
  {
    id: "4th-sem-2024",
    name: "4th Semester 2024",
    semester: "4th Sem",
    year: "2024",
    startDate: "2024-01-15",
    endDate: "2024-05-30",
    status: "active",
    teamCount: 12,
    studentCount: 48,
  },
  {
    id: "6th-sem-2024",
    name: "6th Semester 2024",
    semester: "6th Sem",
    year: "2024",
    startDate: "2024-01-15",
    endDate: "2024-05-30",
    status: "active",
    teamCount: 10,
    studentCount: 40,
  },
  {
    id: "4th-sem-2023",
    name: "4th Semester 2023",
    semester: "4th Sem",
    year: "2023",
    startDate: "2023-08-01",
    endDate: "2023-12-15",
    status: "completed",
    teamCount: 8,
    studentCount: 32,
  },
  {
    id: "6th-sem-2023",
    name: "6th Semester 2023",
    semester: "6th Sem",
    year: "2023",
    startDate: "2023-08-01",
    endDate: "2023-12-15",
    status: "archived",
    teamCount: 6,
    studentCount: 24,
  },
];

export function BatchProvider({ children }: { children: ReactNode }) {
  const [selectedBatch, setSelectedBatchState] = useState<Batch | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBatchId = localStorage.getItem("selectedBatchId");
    if (savedBatchId) {
      const batch = mockBatches.find((b) => b.id === savedBatchId);
      if (batch) {
        setSelectedBatchState(batch);
      }
    }
  }, []);

  const setSelectedBatch = (batch: Batch | null) => {
    setSelectedBatchState(batch);
    if (batch) {
      localStorage.setItem("selectedBatchId", batch.id);
    } else {
      localStorage.removeItem("selectedBatchId");
    }
  };

  return (
    <BatchContext.Provider
      value={{
        batches: mockBatches,
        selectedBatch,
        setSelectedBatch,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
}

export function useBatch() {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error("useBatch must be used within a BatchProvider");
  }
  return context;
}
