import React, { useRef, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PDFDocumentInfo } from '../types/pdf';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  scale: number;
  currentPage: number;
  onDocumentLoad: (info: PDFDocumentInfo) => void;
  onCanvasClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  scale,
  currentPage,
  onDocumentLoad,
  onCanvasClick,
  children
}) => {
  const [url, setUrl] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);
    setUrl(fileUrl);

    // Clean up the URL when the component unmounts
    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [file]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    onDocumentLoad({ numPages });
  };

  return (
    <div 
      className="flex justify-center p-4 bg-gray-100 min-h-full"
      ref={containerRef}
    >
      <div 
        className="relative bg-white shadow-lg"
        onClick={onCanvasClick}
      >
        {url && (
          <Document
            file={url}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<div className="text-center py-10">Loading PDF...</div>}
            error={<div className="text-center py-10 text-red-500">Failed to load PDF</div>}
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={<div className="text-center py-10">Loading page...</div>}
              error={<div className="text-center py-10 text-red-500">Failed to load page</div>}
            />
            {children}
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;