/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from 'papaparse';

export async function parseCsvFileClient(file: File): Promise<Record<string, any>[]> {
  const parsed = await new Promise<{ data: any[]; errors: Papa.ParseError[] }>((resolve) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      worker: false,
      complete: (res) => resolve({ data: res.data as any[], errors: res.errors }),
    });
  });

  if (parsed.errors?.length) {
    console.warn('CSV parse warnings:', parsed.errors.slice(0, 5));
  }
  return parsed.data as Record<string, any>[];
}
