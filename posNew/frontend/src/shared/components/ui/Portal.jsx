import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal Component
 * Renders children in a portal outside the normal component tree
 * Useful for modals, tooltips, and other overlay components
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Content to render in the portal
 * @param {string} props.containerId - ID of the container element (default: 'portal-root')
 */
const Portal = ({ children, containerId = 'portal-root' }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    // Find or create the portal container
    let portalContainer = document.getElementById(containerId);
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = containerId;
      portalContainer.style.position = 'relative';
      portalContainer.style.zIndex = '9999';
      document.body.appendChild(portalContainer);
    }

    setContainer(portalContainer);

    // Cleanup function to remove the container if it was created by this component
    return () => {
      // Only remove if it's empty and was created by us
      if (portalContainer && portalContainer.children.length === 0 && portalContainer.id === containerId) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  // Don't render anything until we have a container
  if (!container) {
    return null;
  }

  return createPortal(children, container);
};

export default Portal;