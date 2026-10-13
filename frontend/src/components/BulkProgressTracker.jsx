'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { X, Pause, Play } from 'lucide-react';

/**
 * BulkProgressTracker Component
 * 
 * Real-time progress tracking for bulk update operations.
 * Features:
 * - Progress bar with percentage
 * - Real-time item count updates
 * - Estimated time remaining calculation
 * - Operation speed indication
 * - Pause/resume capability
 * - Cancellation option
 * 
 * Props:
 * - isVisible: Boolean to show/hide tracker
 * - totalItems: Total number of items to process
 * - processedItems: Number of items currently processed
 * - status: Current operation status ('processing', 'paused', 'completed', 'error')
 * - onPause: Callback when pause is clicked
 * - onResume: Callback when resume is clicked
 * - onCancel: Callback when cancel is clicked
 * - successCount: Number of successfully updated items
 * - failureCount: Number of failed items
 * - startTime: Timestamp when operation started
 */
export default function BulkProgressTracker({
  isVisible = false,
  totalItems = 0,
  processedItems = 0,
  status = 'processing',
  onPause = () => {},
  onResume = () => {},
  onCancel = () => {},
  successCount = 0,
  failureCount = 0,
  startTime = null
}) {
  const [pauseTime, setPauseTime] = useState(null);
  const [totalPausedDuration, setTotalPausedDuration] = useState(0);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (totalItems === 0) return 0;
    return Math.round((processedItems / totalItems) * 100);
  }, [processedItems, totalItems]);

  // Calculate processing speed (items per second)
  const processingSpeed = useMemo(() => {
    if (!startTime || processedItems === 0) return 0;
    
    const elapsedMs = Date.now() - startTime.getTime() - totalPausedDuration;
    const elapsedSeconds = elapsedMs / 1000;
    
    if (elapsedSeconds === 0) return 0;
    return processedItems / elapsedSeconds;
  }, [startTime, processedItems, totalPausedDuration]);

  // Calculate estimated time remaining
  const estimatedTimeRemaining = useMemo(() => {
    if (processingSpeed === 0 || processedItems >= totalItems) return null;
    
    const itemsRemaining = totalItems - processedItems;
    const secondsRemaining = itemsRemaining / processingSpeed;
    
    return formatDuration(secondsRemaining);
  }, [processingSpeed, processedItems, totalItems]);

  // Format duration in human-readable format
  function formatDuration(seconds) {
    if (seconds < 0) return 'N/A';
    
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.ceil(seconds % 60);
    
    if (minutes < 60) {
      return `${minutes}m ${secs}s`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  }

  // Handle pause
  const handlePause = () => {
    setPauseTime(Date.now());
    onPause?.();
  };

  // Handle resume
  const handleResume = () => {
    if (pauseTime) {
      setTotalPausedDuration(prev => prev + (Date.now() - pauseTime));
      setPauseTime(null);
    }
    onResume?.();
  };

  // Determine if operation is complete
  const isComplete = status === 'completed' || progressPercentage === 100;

  // Don't render if not visible
  if (!isVisible) return null;

  // Status colors and icons
  const statusConfig = {
    processing: { color: 'bg-blue-500', text: 'Processing...' },
    paused: { color: 'bg-yellow-500', text: 'Paused' },
    completed: { color: 'bg-green-500', text: 'Completed' },
    error: { color: 'bg-red-500', text: 'Error occurred' }
  };

  const currentStatus = statusConfig[status] || statusConfig.processing;

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40 animate-slide-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${currentStatus.color} animate-pulse`} />
          <h3 className="font-semibold text-gray-900">Bulk Update</h3>
        </div>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Cancel operation"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-900">
            {currentStatus.text}
          </span>
          <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${currentStatus.color} transition-all duration-300 ease-out`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Item Count and Speed */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Items Processed</p>
          <p className="text-lg font-semibold text-gray-900">
            {processedItems.toLocaleString()} / {totalItems.toLocaleString()}
          </p>
        </div>
        
        <div>
          <p className="text-gray-600">Speed</p>
          <p className="text-lg font-semibold text-gray-900">
            {processingSpeed > 0 ? `${processingSpeed.toFixed(1)}/s` : '—'}
          </p>
        </div>
      </div>

      {/* Success/Failure Stats */}
      {(successCount > 0 || failureCount > 0) && (
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {successCount > 0 && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-green-700 text-xs font-medium">Success</p>
              <p className="text-lg font-bold text-green-600">{successCount.toLocaleString()}</p>
            </div>
          )}
          
          {failureCount > 0 && (
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <p className="text-red-700 text-xs font-medium">Failed</p>
              <p className="text-lg font-bold text-red-600">{failureCount.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Time Remaining */}
      {estimatedTimeRemaining && !isComplete && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
          <p className="text-xs text-gray-600 font-medium">Estimated Time Remaining</p>
          <p className="text-lg font-bold text-gray-900">{estimatedTimeRemaining}</p>
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <div className={`bg-${status === 'error' ? 'red' : 'green'}-50 rounded-lg p-3 mb-4 border border-${status === 'error' ? 'red' : 'green'}-200`}>
          <p className={`text-${status === 'error' ? 'red' : 'green'}-900 font-medium`}>
            {status === 'error' 
              ? '⚠️ Operation failed'
              : '✓ Bulk update completed successfully'}
          </p>
          {successCount > 0 && (
            <p className={`text-sm text-${status === 'error' ? 'red' : 'green'}-700 mt-1`}>
              {successCount} of {totalItems} items updated
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {status === 'processing' ? (
          <button
            onClick={handlePause}
            className="flex-1 px-4 py-2 flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 font-medium rounded-lg hover:bg-yellow-200 transition-colors"
            title="Pause operation"
          >
            <Pause size={16} />
            Pause
          </button>
        ) : status === 'paused' ? (
          <button
            onClick={handleResume}
            className="flex-1 px-4 py-2 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
            title="Resume operation"
          >
            <Play size={16} />
            Resume
          </button>
        ) : null}

        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
          title={isComplete ? 'Close tracker' : 'Cancel operation'}
        >
          {isComplete ? 'Done' : 'Cancel'}
        </button>
      </div>

      {/* Help Text */}
      {status === 'processing' && (
        <p className="text-xs text-gray-500 mt-3">
          Updating {totalItems} products. You can pause at any time.
        </p>
      )}
    </div>
  );
}

// Add animation to global styles if needed
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-in-up {
    animation: slide-in-up 0.3s ease-out;
  }
`;

if (typeof document !== 'undefined' && !document.querySelector('style[data-bulk-progress]')) {
  style.setAttribute('data-bulk-progress', 'true');
  document.head.appendChild(style);
}
