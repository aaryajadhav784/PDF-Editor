import React from 'react';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Highlighter, 
  Pencil, 
  Save 
} from 'lucide-react';

interface ToolbarProps {
  onSelectPDF: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onAddText: () => void;
  onHighlight: () => void;
  onDraw: () => void;
  onSavePDF: () => void;
  currentPage: number;
  totalPages: number;
  scale: number;
  file: File;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSelectPDF,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onAddText,
  onHighlight,
  onDraw,
  onSavePDF,
  currentPage,
  totalPages,
  scale,
  file
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onSelectPDF}
              className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Select PDF
            </button>
            <span className="text-gray-700 font-medium ml-2">
              {file.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                className={`p-1 rounded-md ${
                  currentPage <= 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-700">
                {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={onNextPage}
                disabled={currentPage >= totalPages}
                className={`p-1 rounded-md ${
                  currentPage >= totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={onZoomOut}
                disabled={scale <= 0.5}
                className={`p-1 rounded-md ${
                  scale <= 0.5
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-700 w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              
              <button
                onClick={onZoomIn}
                disabled={scale >= 3}
                className={`p-1 rounded-md ${
                  scale >= 3
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onAddText}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              title="Add Text"
            >
              <Type className="w-5 h-5" />
            </button>
            
            <button
              onClick={onHighlight}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              title="Highlight Text"
            >
              <Highlighter className="w-5 h-5" />
            </button>
            
            <button
              onClick={onDraw}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              title="Draw"
            >
              <Pencil className="w-5 h-5" />
            </button>
            
            <button
              onClick={onSavePDF}
              className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;