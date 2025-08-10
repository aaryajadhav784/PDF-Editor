import React, { useState, useRef, useEffect } from 'react';
import { TextAnnotation as TextAnnotationType } from '../types/pdf';

interface TextAnnotationProps {
  annotation: TextAnnotationType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TextAnnotationType>) => void;
  onDelete: (id: string) => void;
}

const TextAnnotation: React.FC<TextAnnotationProps> = ({
  annotation,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If this is a new annotation, start in editing mode
    if (annotation.text === 'New Text') {
      setIsEditing(true);
    }
  }, [annotation.text]);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      textRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(annotation.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    e.stopPropagation();
    onSelect(annotation.id);
    
    if (isSelected) {
      setIsDragging(true);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      e.stopPropagation();
      e.preventDefault();
      
      const parentRect = containerRef.current.parentElement?.getBoundingClientRect();
      if (parentRect) {
        const newX = e.clientX - parentRect.left - dragOffset.x;
        const newY = e.clientY - parentRect.top - dragOffset.y;
        
        onUpdate(annotation.id, { x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(annotation.id, { text: e.target.value });
  };

  const handleBlur = () => {
    setIsEditing(false);
    // If text is empty after editing, delete the annotation
    if (!annotation.text.trim()) {
      onDelete(annotation.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
    if (e.key === 'Delete' && isSelected && !isEditing) {
      e.preventDefault();
      e.stopPropagation();
      onDelete(annotation.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(annotation.id);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (containerRef.current) {
          const parentRect = containerRef.current.parentElement?.getBoundingClientRect();
          if (parentRect) {
            const newX = e.clientX - parentRect.left - dragOffset.x;
            const newY = e.clientY - parentRect.top - dragOffset.y;
            onUpdate(annotation.id, { x: newX, y: newY });
          }
        }
      };
      
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragOffset, annotation.id, onUpdate]);

  return (
    <div
      ref={containerRef}
      className={`absolute cursor-pointer select-none ${isSelected ? 'z-50' : 'z-10'}`}
      style={{
        left: `${annotation.x}px`,
        top: `${annotation.y}px`,
        color: annotation.color,
        fontSize: `${annotation.fontSize}px`,
        pointerEvents: 'auto',
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {isEditing ? (
        <textarea
          ref={textRef}
          value={annotation.text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`border ${isSelected ? 'border-blue-500' : 'border-transparent'} p-1 bg-white bg-opacity-50 resize-none outline-none`}
          style={{
            color: annotation.color,
            fontSize: `${annotation.fontSize}px`,
            minWidth: '100px',
            minHeight: '30px',
          }}
          autoFocus
        />
      ) : (
        <div 
          className={`p-1 border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} whitespace-pre-wrap relative group bg-white bg-opacity-50`}
        >
          {annotation.text}
          {isSelected && (
            <button
              onClick={handleDeleteClick}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-100 shadow-md transform hover:scale-110 transition-all duration-200"
              aria-label="Delete annotation"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TextAnnotation;