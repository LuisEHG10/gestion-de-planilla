import { MonthlyData } from "./MonthlyData";

export interface DataResponse{
    nombres?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    data: MonthlyData[];
    code?: string;
    message?: string;
  }