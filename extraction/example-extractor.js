/**
 * SVG Component Architecture Standard
 * Example Component Extractor
 * 
 * This file provides a simple JavaScript implementation for extracting components
 * from SVG diagrams that follow the SVG Component Architecture Standard 1.0.
 */

class SVGComponentExtractor {
  constructor() {
    this.parser = new DOMParser();
  }

  /**
   * Extract components from an SVG string
   * @param {string} svgString - The SVG diagram as a string
   * @returns {object} Extracted diagram data
   */
  extractFromString(svgString) {
    const svgDoc = this.parser.parseFromString(svgString, "image/svg+xml");
    return this.extractFromDocument(svgDoc);
  }

  /**
   * Extract components from an SVG DOM document
   * @param {Document} svgDoc - The parsed SVG document
   * @returns {object} Extracted diagram data
   */
  extractFromDocument(svgDoc) {
    // Check if the SVG follows the standard
    if (!this.validateStandard(svgDoc)) {
      throw new Error("SVG does not follow the Component Architecture Standard");
    }

    return {
      metadata: this.extractMetadata(svgDoc),
      components: this.extractComponents(svgDoc),
      instances: this.extractInstances(svgDoc),
      connections: this.extractConnections(svgDoc),
      annotations: this.extractAnnotations(svgDoc)
    };
  }

  /**
   * Validate that the SVG follows the Component Architecture Standard
   * @param {Document} svgDoc - The parsed SVG document
   * @returns {boolean} Whether the SVG follows the standard
   */
  validateStandard(svgDoc) {
    const svg = svgDoc.querySelector('svg');
    if (!svg) return false;

    // Check required attributes
    const requiredAttrs = ['data-diagram-id', 'data-diagram-name', 'data-diagram-version'];
    for (const attr of requiredAttrs) {
      if (!svg.hasAttribute(attr)) return false;
    }

    // Check for component definitions
    const hasComponents = svgDoc.querySelector('symbol.extractable-component');
    if (!hasComponents) return false;

    return true;
  }

  /**
   * Extract diagram metadata
   * @param {Document} svgDoc - The parsed SVG document
   * @returns {object} Diagram metadata
   */
  extractMetadata(svgDoc) {
    const svg = svgDoc.querySelector('svg');
    return {
      id: svg.getAttribute('data-diagram-id'),
      name: svg.getAttribute('data-diagram-name'),
      version: svg.getAttribute('data-diagram-version'),
      viewBox: svg.getAttribute('viewBox')
    };
  }

  /**
   * Extract component definitions
   * @param {Document} svgDoc - The parsed SVG document
   * @returns {Array} Array of component objects
   */
  extractComponents(svgDoc) {
    const components = [];
    const symbols = svgDoc.querySelectorAll('symbol.extractable-component');

    symbols.forEach(symbol => {
      const id = symbol.getAttribute('id');
      const viewBox = symbol.getAttribute('viewBox');
      const type = symbol.getAttribute('data-component-type');
      const name = symbol.getAttribute('data-component-name');

      // Create a standalone SVG
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
        ${symbol.innerHTML}
      </svg>`;

      components.push({
        id,
        type,
        name,
        viewBox,
        content: symbol.innerHTML,
        svg: svgContent
      });
    });

    return components;
  }

  /**
   * Extract component instances
   * @param {Document} svgDoc - The parsed SVG document
   * @returns {Array} Array of instance objects
   */
  extractInstances(svgDoc) {
    const instances = [];
    const instanceElements = svgDoc.querySelectorAll('g.component-instance');

    instanceElements.forEach(instance => {
      const useElement = instance.querySelector('use');
      if (!useElement) return;

      const href = useElement.getAttribute('href');
      const componentRef = href ? href.replace('#', '') : '';

      const transform = instance.getAttribute('transform') || '';
      const position = this.parseTransform(transform);

      instances.push({
        id: instance.getAttribute('id'),
        type: instance.getAttribute('data-instance-type'),
        name: instance.getAttribute('data-instance-name'),
        componentRef,
        position,
        width: useElement.getAttribute('width'),
        height: useElement.getAttribute('height')
      });
    });

    return instances;
  }

  /**
   * Extract connections between components
   * @param {Document} svgDoc - The parsed SVG document
   * @returns {Array} Array of connection objects
   */
  extractConnections(svgDoc) {
    const connections = [];
    const connectionElements = svgDoc.querySelectorAll('g.diagram-connection');

    connectionElements.forEach(connection => {
      const pathElement = connection.querySelector('path');
      const labelElement = connection.querySelector('text.connection-label');

      if (!pathElement) return;

      connections.push({
        id: connection.getAttribute('id'),
        from: connection.getAttribute('data-connection-from'),
        to: connection.getAttribute('data-connection-to'),
        type: connection.getAttribute('data-connection-type'),
        path: pathElement.getAttribute('d'),
        label: labelElement ? labelElement.textContent.trim() : ''
      });
    });

    return connections;
  }

  /**
   * Extract annotations from the diagram
   * @param {Document} svgDoc - The parsed SVG document
   * @returns {Array} Array of annotation objects
   */
  extractAnnotations(svgDoc) {
    const annotations = [];
    const annotationGroup = svgDoc.querySelector('g.diagram-annotations');
    if (!annotationGroup) return annotations;

    const textElements = annotationGroup.querySelectorAll('text');
    textElements.forEach(text => {
      annotations.push({
        x: text.getAttribute('x'),
        y: text.getAttribute('y'),
        content: text.textContent.trim(),
        fontSize: text.getAttribute('font-size'),
        fontWeight: text.getAttribute('font-weight'),
        textAnchor: text.getAttribute('text-anchor')
      });
    });

    return annotations;
  }

  /**
   * Parse transform attribute to extract position
   * @param {string} transform - The transform attribute value
   * @returns {object} Position object with x and y coordinates
   */
  parseTransform(transform) {
    const match = transform.match(/translate\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (match) {
      return {
        x: parseInt(match[1], 10),
        y: parseInt(match[2], 10)
      };
    }
    return { x: 0, y: 0 };
  }

  /**
   * Save a component as a standalone SVG file
   * @param {object} component - The component object
   * @returns {string} The SVG content
   */
  saveComponentAsSVG(component) {
    return component.svg;
  }

  /**
   * Export the full diagram data as JSON
   * @param {object} diagramData - The extracted diagram data
   * @returns {string} JSON string of the diagram data
   */
  exportAsJSON(diagramData) {
    return JSON.stringify(diagramData, null, 2);
  }
}

// Example usage:
/*
document.addEventListener('DOMContentLoaded', () => {
  const extractor = new SVGComponentExtractor();
  const svgString = document.getElementById('source-svg').textContent;
  
  try {
    const diagramData = extractor.extractFromString(svgString);
    console.log('Extracted diagram:', diagramData);
    
    // Save first component as SVG
    if (diagramData.components.length > 0) {
      const svgContent = extractor.saveComponentAsSVG(diagramData.components[0]);
      console.log('First component SVG:', svgContent);
    }
    
    // Export as JSON
    const jsonData = extractor.exportAsJSON(diagramData);
    console.log('JSON export:', jsonData);
  } catch (error) {
    console.error('Extraction error:', error);
  }
});
*/