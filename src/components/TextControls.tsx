import React from 'react';
import { TextAnnotation } from '../types/pdf';

interface TextControlsProps {
  selectedAnnotation: TextAnnotation;
  onUpdate: (id: string, updates: Partial<TextAnnotation>) => void;
}

const TextControls: React.FC<TextControlsProps> = ({ selectedAnnotation, onUpdate }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(selectedAnnotation.id, { text: e.target.value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fontSize = parseInt(e.target.value, 10);
    onUpdate(selectedAnnotation.id, { fontSize });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(selectedAnnotation.id, { color: e.target.value });
  };

  return (
    <div className="text-controls">
      <h3 className="text-lg font-semibold mb-4">Text Properties</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Content
        </label>
        <textarea
          value={selectedAnnotation.text}
          onChange={handleTextChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size
        </label>
        <div className="flex items-center">
          <input
            type="range"
            min="8"
            max="72"
            value={selectedAnnotation.fontSize}
            onChange={handleFontSizeChange}
            className="w-full mr-2"
          />
          <span className="text-sm w-8 text-right">{selectedAnnotation.fontSize}px</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex items-center">
          <input
            type="color"
            value={selectedAnnotation.color}
            onChange={handleColorChange}
            className="w-8 h-8 p-0 border-0 rounded-md mr-2"
          />
          <span className="text-sm">{selectedAnnotation.color}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-4">
        <p>Tip: Double-click on text to edit directly on the PDF.</p>
        <p>Tip: Click and drag to move text.</p>
      </div>
    </div>
  );
};

export default TextControls;