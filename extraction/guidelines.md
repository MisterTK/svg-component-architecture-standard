# SVG Component Extraction Guidelines

## Overview

This document provides technical guidelines for building applications that extract components from SVG diagrams created according to the SVG Component Architecture Standard 1.0.

## Extraction Process

### 1. Parsing the SVG Document

```javascript
// Example using DOM parser (JavaScript)
function parseSVG(svgString) {
  const parser = new DOMParser();
  return parser.parseFromString(svgString, "image/svg+xml");
}
```

### 2. Extracting Component Definitions

```javascript
function extractComponentDefinitions(svgDoc) {
  // Find all symbol elements with the extractable-component class
  const componentElements = svgDoc.querySelectorAll('symbol.extractable-component');
  
  const components = [];
  
  componentElements.forEach(symbol => {
    const component = {
      id: symbol.getAttribute('id'),
      type: symbol.getAttribute('data-component-type'),
      name: symbol.getAttribute('data-component-name'),
      viewBox: symbol.getAttribute('viewBox'),
      content: symbol.innerHTML,
      // Create a standalone SVG from the symbol
      svg: createStandaloneSVG(symbol)
    };
    
    components.push(component);
  });
  
  return components;
}

function createStandaloneSVG(symbolElement) {
  const viewBox = symbolElement.getAttribute('viewBox');
  const content = symbolElement.innerHTML;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
    ${content}
  </svg>`;
}
```

### 3. Extracting Component Instances

```javascript
function extractComponentInstances(svgDoc) {
  const instanceElements = svgDoc.querySelectorAll('g.component-instance');
  
  const instances = [];
  
  instanceElements.forEach(instance => {
    const useElement = instance.querySelector('use');
    const componentRef = useElement.getAttribute('href');
    
    const instanceData = {
      id: instance.getAttribute('id'),
      type: instance.getAttribute('data-instance-type'),
      name: instance.getAttribute('data-instance-name'),
      componentRef: componentRef.replace('#', ''),
      position: extractTransform(instance.getAttribute('transform')),
      width: useElement.getAttribute('width'),
      height: useElement.getAttribute('height')
    };
    
    instances.push(instanceData);
  });
  
  return instances;
}

function extractTransform(transformAttr) {
  // Extract x,y from transform="translate(x,y)"
  const match = transformAttr.match(/translate\\((\\d+),(\\d+)\\)/);
  if (match) {
    return {
      x: parseInt(match[1]),
      y: parseInt(match[2])
    };
  }
  return { x: 0, y: 0 };
}
```

### 4. Extracting Connections

```javascript
function extractConnections(svgDoc) {
  const connectionElements = svgDoc.querySelectorAll('g.diagram-connection');
  
  const connections = [];
  
  connectionElements.forEach(connection => {
    const pathElement = connection.querySelector('path');
    const labelElement = connection.querySelector('text.connection-label');
    
    const connectionData = {
      id: connection.getAttribute('id'),
      from: connection.getAttribute('data-connection-from'),
      to: connection.getAttribute('data-connection-to'),
      type: connection.getAttribute('data-connection-type'),
      path: pathElement.getAttribute('d'),
      label: labelElement ? labelElement.textContent : ''
    };
    
    connections.push(connectionData);
  });
  
  return connections;
}
```

### 5. Extracting Diagram Metadata

```javascript
function extractDiagramMetadata(svgDoc) {
  const svgElement = svgDoc.querySelector('svg');
  
  return {
    id: svgElement.getAttribute('data-diagram-id'),
    name: svgElement.getAttribute('data-diagram-name'),
    version: svgElement.getAttribute('data-diagram-version'),
    viewBox: svgElement.getAttribute('viewBox')
  };
}
```

### 6. Combining Everything into a Complete Extractor

```javascript
function extractDiagram(svgString) {
  const svgDoc = parseSVG(svgString);
  
  return {
    metadata: extractDiagramMetadata(svgDoc),
    components: extractComponentDefinitions(svgDoc),
    instances: extractComponentInstances(svgDoc),
    connections: extractConnections(svgDoc)
  };
}
```

## Using the Extracted Data

### Component Library Management

Extracted components can be stored in a component library for reuse:

```javascript
function storeComponentLibrary(components, libraryName) {
  // Create a library object
  const library = {
    name: libraryName,
    lastUpdated: new Date().toISOString(),
    components: {}
  };
  
  // Add components to library
  components.forEach(component => {
    library.components[component.id] = component;
  });
  
  // Store library (e.g., in localStorage, IndexedDB, or server)
  localStorage.setItem(`component-library-${libraryName}`, JSON.stringify(library));
}
```

### Re-rendering a Diagram

```javascript
function renderDiagram(diagramData, targetElement) {
  const { metadata, components, instances, connections } = diagramData;
  
  // Create SVG root element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", metadata.viewBox);
  svg.setAttribute("data-diagram-id", metadata.id);
  svg.setAttribute("data-diagram-name", metadata.name);
  svg.setAttribute("data-diagram-version", metadata.version);
  
  // Add components to defs section
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  components.forEach(component => {
    const symbol = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    symbol.setAttribute("id", component.id);
    symbol.setAttribute("viewBox", component.viewBox);
    symbol.setAttribute("class", "extractable-component");
    symbol.setAttribute("data-component-type", component.type);
    symbol.setAttribute("data-component-name", component.name);
    symbol.innerHTML = component.content;
    defs.appendChild(symbol);
  });
  svg.appendChild(defs);
  
  // Create content group
  const content = document.createElementNS("http://www.w3.org/2000/svg", "g");
  content.setAttribute("id", "diagram-content");
  
  // Add instances
  instances.forEach(instance => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", instance.id);
    g.setAttribute("class", "component-instance");
    g.setAttribute("data-instance-type", instance.type);
    g.setAttribute("data-instance-name", instance.name);
    g.setAttribute("transform", `translate(${instance.position.x},${instance.position.y})`);
    
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${instance.componentRef}`);
    use.setAttribute("width", instance.width);
    use.setAttribute("height", instance.height);
    
    g.appendChild(use);
    content.appendChild(g);
  });
  
  svg.appendChild(content);
  
  // Add connections
  // Add annotations
  // ... (similar approach for other elements)
  
  // Add svg to target element
  targetElement.innerHTML = '';
  targetElement.appendChild(svg);
}
```

## Best Practices for Extraction Applications

1. **Validate SVG Structure**: Always validate that the SVG follows the Component Architecture Standard before attempting extraction.

2. **Handle Missing Attributes**: Build robustness by handling cases where attributes might be missing.

3. **Preserve IDs**: When extracting components, preserve original IDs to maintain referential integrity.

4. **Support Different Platforms**: Consider implementing extraction libraries for different languages (JavaScript, Python, etc.).

5. **Optimize for Performance**: For large diagrams, use efficient parsing and traversal methods.

## Cross-Browser Compatibility

When building extraction applications for web browsers, consider these compatibility issues:

- Internet Explorer does not support inline SVG in all versions
- Use `href` attribute instead of deprecated `xlink:href` for modern browsers
- Test with multiple browsers and implement appropriate polyfills

## Security Considerations

1. **Sanitize SVG Content**: Always sanitize SVG content before processing or rendering to prevent XSS attacks.

2. **Validate Input**: Ensure input SVGs are properly formed and don't contain malicious scripts.

3. **Restrict Script Execution**: Disable script execution in extracted SVGs if they will be displayed in a web context.

## Complete Example Application

For a complete implementation example, see the companion code in the `sample-implementation` directory.
