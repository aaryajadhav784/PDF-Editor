export interface TextAnnotation {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  pageNumber: number;
}

export interface PDFDocumentInfo {
  numPages: number;
}