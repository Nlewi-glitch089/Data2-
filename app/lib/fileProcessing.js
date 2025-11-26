import Papa from 'papaparse';

/**
 * Parse CSV, JSON, or Excel file and return array of objects
 * @param {File} file - File from input
 * @param {Object} opts - Optional config (Papa, etc)
 * @returns {Promise<Array>} Array of objects
 */
export async function parseFile(file, opts = {}) {
  if (!file) throw new Error('No file provided');

  const ext = (file.name || '').split('.').pop().toLowerCase();
  const Pap = opts.Papa || Papa;

  // JSON files
  if (ext === 'json') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (Array.isArray(parsed)) {
            resolve(parsed);
          } else if (parsed && parsed.data && Array.isArray(parsed.data)) {
            resolve(parsed.data);
          } else if (parsed && typeof parsed === 'object') {
            resolve([parsed]);
          } else {
            reject(new Error('JSON must be an array or object'));
          }
        } catch (err) {
          reject(new Error(`JSON parse error: ${err.message}`));
        }
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsText(file);
    });
  }

  // CSV/TXT files
  if (ext === 'csv' || ext === 'txt') {
    return new Promise((resolve, reject) => {
      Pap.parse(file, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            reject(new Error(`CSV parse error: ${results.errors[0].message}`));
          } else {
            resolve(results.data || []);
          }
        },
        error: (err) => reject(new Error(`CSV parse error: ${err.message}`)),
      });
    });
  }

  // Excel files (optional) — use `exceljs` instead of `xlsx` (safer alternative)
  if (ext === 'xlsx' || ext === 'xls') {
    try {
      return (async () => {
        let ExcelJS;
        try {
          const excelModule = await import('exceljs');
          ExcelJS = excelModule.default || excelModule;
        } catch (importErr) {
          throw new Error(
            'Excel support requires the exceljs package. Install with: npm install exceljs'
          );
        }

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const arrayBuffer = e.target.result;
              const workbook = new ExcelJS.Workbook();
              // exceljs accepts ArrayBuffer in the browser
              await workbook.xlsx.load(arrayBuffer);

              const worksheet = workbook.worksheets && workbook.worksheets[0];
              if (!worksheet) {
                throw new Error('No sheets found in Excel file');
              }

              // Extract header row
              const headerRow = worksheet.getRow(1);
              const headers = [];
              headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
                headers.push(String(cell.value ?? '').trim());
              });

              if (headers.length === 0) {
                throw new Error('Excel header row is empty');
              }

              // Read rows starting at row 2
              const rows = [];
              worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber === 1) return; // skip header
                const obj = {};
                headers.forEach((h, i) => {
                  const cell = row.getCell(i + 1);
                  obj[h] = cell && cell.value != null ? cell.value : null;
                });
                rows.push(obj);
              });

              if (!Array.isArray(rows) || rows.length === 0) {
                throw new Error('Excel sheet is empty or contains no data rows');
              }

              resolve(rows);
            } catch (err) {
              reject(new Error(`Excel parse error: ${err.message}`));
            }
          };
          reader.onerror = () => reject(new Error('File read failed'));
          reader.readAsArrayBuffer(file);
        });
      })();
    } catch (err) {
      throw err;
    }
  }

  throw new Error(`Unsupported file type: .${ext}`);
}

/**
 * Normalize dataset — convert all values to strings or null
 * @param {Array} data - Parsed dataset
 * @returns {Array} Normalized dataset
 */
export function normalizeData(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  return data.map((row) => {
    if (typeof row !== 'object' || row === null) return row;
    const normalized = {};
    Object.keys(row).forEach((key) => {
      const value = row[key];
      normalized[key] =
        value === null || value === undefined || value === '' ? null : String(value);
    });
    return normalized;
  });
}

/**
 * Extract column names from dataset
 * @param {Array} data - Parsed dataset
 * @returns {Array<string>} Column names
 */
export function getColumnNames(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  const firstRow = data[0];
  if (typeof firstRow !== 'object' || firstRow === null) return [];
  return Object.keys(firstRow);
}
