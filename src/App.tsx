import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, rgb } from 'pdf-lib';
import { FileText, Upload } from 'lucide-react';
import PDFViewer from './components/PDFViewer';
import Toolbar from './components/Toolbar';
import TextAnnotation from './components/TextAnnotation';
import TextControls from './components/TextControls';
import { TextAnnotation as TextAnnotationType, PDFDocumentInfo } from './types/pdf';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [annotations, setAnnotations] = useState<TextAnnotationType[]>([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [isAddingText, setIsAddingText] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId) || null;

  const handleSelectPDF = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setAnnotations([]);
      setSelectedAnnotationId(null);
      setCurrentPage(1);
    }
  };

  const handleFileUpload = (newFile: File) => {
    setFile(newFile);
    setAnnotations([]);
    setSelectedAnnotationId(null);
    setCurrentPage(1);

    alert('PDF uploaded successfully!');
  };
  

  const handleDocumentLoad = (info: PDFDocumentInfo) => {
    setTotalPages(info.numPages);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedAnnotationId(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedAnnotationId(null);
    }
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const handleAddText = () => {
    setIsAddingText(true);
    // Change cursor to indicate text placement mode
    document.body.style.cursor = 'text';
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAddingText) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newAnnotation: TextAnnotationType = {
        id: uuidv4(),
        text: 'New Text',
        x,
        y,
        fontSize: 16,
        color: '#000000',
        pageNumber: currentPage,
      };

      setAnnotations([...annotations, newAnnotation]);
      setSelectedAnnotationId(newAnnotation.id);
      setIsAddingText(false);
      
      // Reset cursor
      document.body.style.cursor = 'default';
    } else {
      // Only deselect if clicking on the canvas background, not on an annotation
      if (e.target === e.currentTarget) {
        setSelectedAnnotationId(null);
      }
    }
  };

  const handleHighlight = () => {
    // Placeholder for highlight functionality
    alert('Highlight functionality will be implemented in a future update.');
  };

  const handleDraw = () => {
    // Placeholder for drawing functionality
    alert('Drawing functionality will be implemented in a future update.');
  };

  const handleUpdateAnnotation = (id: string, updates: Partial<TextAnnotationType>) => {
    setAnnotations(
      annotations.map(annotation => 
        annotation.id === id ? { ...annotation, ...updates } : annotation
      )
    );
  };

  const handleDeleteAnnotation = (id: string) => {
    // Get the annotation to be deleted
    const annotationToDelete = annotations.find(a => a.id === id);
    
    if (annotationToDelete) {
      // Remove the annotation from the state
      setAnnotations(annotations.filter(annotation => annotation.id !== id));
      
      // If the deleted annotation was selected, clear the selection
      if (selectedAnnotationId === id) {
        setSelectedAnnotationId(null);
      }
    }
  };

  const handleSavePDF = async () => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Sort annotations by page number to process them efficiently
      const sortedAnnotations = [...annotations].sort((a, b) => a.pageNumber - b.pageNumber);
      
      sortedAnnotations.forEach(annotation => {
        if (annotation.pageNumber <= pages.length) {
          const page = pages[annotation.pageNumber - 1];
          page.drawText(annotation.text, {
            x: annotation.x,
            y: page.getHeight() - annotation.y - annotation.fontSize,
            size: annotation.fontSize,
            color: rgb(0, 0, 0), // You can convert annotation.color to rgb if needed
          });
        }
      });

      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited-' + file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('PDF downloaded with annotations.');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error saving PDF. Please try again.');
    }
  };

  // Handle escape key to cancel text addition mode
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddingText) {
        setIsAddingText(false);
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAddingText]);

  return (
    <div className="min-h-screen bg-[#f7fafc]">
      {file ? (
        <div className="flex flex-col h-screen bg-gray-50 pt-16">
          <Toolbar
            onSelectPDF={handleSelectPDF}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onAddText={handleAddText}
            onHighlight={handleHighlight}
            onDraw={handleDraw}
            onSavePDF={handleSavePDF}
            currentPage={currentPage}
            totalPages={totalPages}
            scale={scale}
            file={file}
          />
          
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <PDFViewer
                file={file}
                scale={scale}
                onDocumentLoad={handleDocumentLoad}
                currentPage={currentPage}
                onCanvasClick={handleCanvasClick}
              >
                {annotations
                  .filter(annotation => annotation.pageNumber === currentPage)
                  .map(annotation => (
                    <TextAnnotation
                      key={annotation.id}
                      annotation={annotation}
                      isSelected={selectedAnnotationId === annotation.id}
                      onSelect={setSelectedAnnotationId}
                      onUpdate={handleUpdateAnnotation}
                      onDelete={handleDeleteAnnotation}
                    />
                  ))}
              </PDFViewer>
            </div>
            
            {selectedAnnotation && (
              <div className="w-64 p-4 border-l border-gray-200 overflow-y-auto">
                <TextControls
                  selectedAnnotation={selectedAnnotation}
                  onUpdate={handleUpdateAnnotation}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#383e45] mb-4">
              Every tool you need to work with PDFs in one place
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All the tools you'll need to be more productive and work smarter with documents.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <div className="flex justify-center mb-4">
                    <Upload className="w-16 h-16 text-blue-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Select PDF file
                  </p>
                  <p className="text-sm text-gray-500">
                    or drag and drop it here
                  </p>
                </label>
              </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 text-blue-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Edit PDF</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Add text, images, shapes or freehand annotations to your PDF document.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">View PDF</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Open and view PDF files directly in your browser with our fast PDF viewer.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />
    </div>
  );
}

export default App;