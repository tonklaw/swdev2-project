"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface RequestContextType {
  requests: Request[];
  setRequests: (requests: Request[]) => void;
  editingRequest: Request | null;
  setEditingRequest: (request: Request | null) => void;
  editModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (open: boolean) => void;
  deleteRequestId: string | null;
  setDeleteRequestId: (id: string | null) => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

interface RequestContextProviderProps {
  children: ReactNode;
  initialRequests?: Request[];
}

export function RequestContextProvider({
  children,
  initialRequests = [],
}: RequestContextProviderProps) {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);

  useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  return (
    <RequestContext.Provider
      value={{
        requests,
        setRequests,
        editingRequest,
        setEditingRequest,
        editModalOpen,
        setEditModalOpen,
        deleteConfirmOpen,
        setDeleteConfirmOpen,
        deleteRequestId,
        setDeleteRequestId,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequestContext() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error(
      "useRequestContext must be used within RequestContextProvider",
    );
  }
  return context;
}
