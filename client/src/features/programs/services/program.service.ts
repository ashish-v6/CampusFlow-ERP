import api from "../../../api/axios.js";
import {
  Program,
  ProgramListResponse,
  ProgramQueryDto,
  CreateProgramDto,
  UpdateProgramDto,
  ProgramStats,
} from "../types/program.types";

export const getPrograms = async (
  query: ProgramQueryDto = {},
): Promise<ProgramListResponse> => {
  const params: Record<string, string | number> = {};
  if (query.page) params.page = query.page;
  if (query.limit) params.limit = query.limit;
  if (query.search) params.search = query.search;
  if (query.departmentId) params.departmentId = query.departmentId;
  if (query.status) params.status = query.status;

  const res = await api.get<ProgramListResponse>("/api/programs", { params });
  return res.data;
};

export const getProgramById = async (id: string): Promise<{ program: Program }> => {
  const res = await api.get<{ program: Program }>(`/api/programs/${id}`);
  return res.data;
};

export const createProgram = async (
  payload: CreateProgramDto,
): Promise<{ success: boolean; message: string; program: Program }> => {
  const res = await api.post<{ success: boolean; message: string; program: Program }>(
    "/api/programs",
    payload,
  );
  return res.data;
};

export const updateProgram = async (
  id: string,
  payload: UpdateProgramDto,
): Promise<{ success: boolean; message: string; program: Program }> => {
  const res = await api.patch<{ success: boolean; message: string; program: Program }>(
    `/api/programs/${id}`,
    payload,
  );
  return res.data;
};

export const getProgramStats = async (): Promise<{ result: ProgramStats }> => {
  const res = await api.get<{ result: ProgramStats }>("/api/programs/stats");
  return res.data;
};
