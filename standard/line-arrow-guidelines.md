# SVG Line and Arrow Guidelines for LLMs

## Purpose
This document provides specific guidelines for LLMs to create reliable, consistent, and visually appealing SVG connections using lines and arrows.

## Line and Arrow Best Practices

### 1. Layer Management
- Always place connection lines and arrows in the middle layer:
  - Component definitions (`<defs>`) at the top
  - Component instances (`<g id="diagram-content">`) second
  - Connection lines in the middle (`<g id="connections">`)
  - Annotations on top (`<g id="diagram-annotations">`)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 [WIDTH] [HEIGHT]" 
     data-diagram-id="[UNIQUE_ID]" data-diagram-name="[DIAGRAM_NAME]" 
     data-diagram-version="1.0">
  <!-- Layer 1: Definitions -->
  <defs>...</defs>
  
  <!-- Layer 2: Component instances -->
  <g id="diagram-content">...</g>
  
  <!-- Layer 3: Connections (lines and arrows) -->
  <g id="connections">...</g>
  
  <!-- Layer 4: Text labels and annotations -->
  <g id="diagram-annotations">...</g>
</svg>
```

### 2. Judicious Use of Connections
- Use connections sparingly - less is better
- Each connection should convey meaningful relationships
- Consolidate similar connections where possible
- Avoid crossing connections when possible
- When connections must cross, use different stroke-dasharray patterns

### 3. Connection Points
- Connect to outermost containers rather than nested elements
- Use the edges of components rather than their centers
- Define standard connection points in component symbols:

```xml
<!-- Component definition with connection points -->
<symbol id="component-server" class="extractable-component" viewBox="0 0 100 120"
        data-component-type="server" data-component-name="Server">
  <rect x="10" y="10" width="80" height="100" rx="5" ry="5" 
        fill="#E9F7EF" stroke="#2ECC71" stroke-width="2"/>
  <text x="50" y="65" text-anchor="middle">Server</text>
  
  <!-- Define connection points -->
  <circle cx="10" cy="60" r="0" class="extractable-component-connection-point" data-connection-point="left"/>
  <circle cx="90" cy="60" r="0" class="extractable-component-connection-point" data-connection-point="right"/>
  <circle cx="50" cy="10" r="0" class="extractable-component-connection-point" data-connection-point="top"/>
  <circle cx="50" cy="110" r="0" class="extractable-component-connection-point" data-connection-point="bottom"/>
</symbol>
```

### 4. Routing Guidelines
- Use horizontal and vertical lines when possible (orthogonal routing)
- For diagonal connections, use consistent 45° angles
- Leave sufficient space (minimum 20px) between components
- Add bend points to route around obstacles:

```xml
<!-- Good: Routed connection with bend points -->
<path d="M 100,50 L 150,50 L 150,100 L 200,100" 
      fill="none" stroke="#666" stroke-width="2" 
      marker-end="url(#arrow-end)"/>
```

### 5. Text Placement
- Never allow connection lines to overlap text
- Place text labels above or below connection lines with sufficient spacing
- Use text-background elements when needed:

```xml
<!-- Connection with properly placed label -->
<g id="connection-request" class="diagram-connection" 
   data-connection-from="instance-api-server" 
   data-connection-to="instance-database" 
   data-connection-type="request">
  <path d="M 100,200 L 300,200" fill="none" stroke="#666" stroke-width="2" 
        marker-end="url(#arrow-end)"/>
  
  <!-- Text with background to prevent overlap -->
  <rect x="180" y="185" width="40" height="16" fill="white" fill-opacity="0.8" rx="2"/>
  <text x="200" y="197" text-anchor="middle" font-size="12" class="connection-label">Query</text>
</g>
```

## LLM Self-Correction Techniques

### 1. Coordinate Validation
Before finalizing SVG output, verify:

```javascript
// Pseudo-code for LLM to validate connection points
function validateConnection(connection, sourceComponent, targetComponent) {
  // 1. Identify proper edge connection points
  const sourcePoint = getEdgePoint(sourceComponent, targetComponent);
  const targetPoint = getEdgePoint(targetComponent, sourceComponent);
  
  // 2. Verify path data uses these points
  const path = connection.querySelector("path");
  const pathData = path.getAttribute("d");
  
  // 3. Check for text overlap
  const pathBounds = getPathBounds(pathData);
  const textElements = document.querySelectorAll("text");
  
  for (const text of textElements) {
    if (overlaps(pathBounds, getTextBounds(text))) {
      // Adjust path or text position
    }
  }
}
```

### 2. Self-Correction Checklist
- ✓ Lines connect to component edges, not centers
- ✓ Arrows point in the logical flow direction
- ✓ No line passes through or overlaps with text
- ✓ Connection lines do not cross unnecessarily
- ✓ Line styles (stroke-width, color) are consistent
- ✓ Connection paths use appropriate marker-end for arrows
- ✓ Complex connections use bend points for clarity
- ✓ Related connections are visually grouped (color, style)
- ✓ All required connection data attributes are present
- ✓ Connection IDs follow standard naming conventions (`connection-[SEMANTIC_ID]`)

### 3. Mental Debugging Process
When creating connections, follow this thought process:

1. Identify source and target components and their instance IDs
2. Determine appropriate connection points on each component's edge
3. Plan the path route, avoiding obstacles and text
4. Generate path data with proper bend points if needed
5. Create connection element with all required data attributes:
   - `id="connection-[SEMANTIC_ID]"`
   - `class="diagram-connection"`
   - `data-connection-from="instance-[SOURCE_ID]"`
   - `data-connection-to="instance-[TARGET_ID]"`
   - `data-connection-type="[TYPE]"`
6. Verify no overlap with text or other important elements
7. Apply consistent styling and arrow markers

## Example Implementation

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"
     data-diagram-id="server-communication" 
     data-diagram-name="Server Communication Diagram"
     data-diagram-version="1.0">
  <!-- Definitions -->
  <defs>
    <!-- Arrow marker -->
    <marker id="arrow-end" viewBox="0 0 10 10" refX="9" refY="5" 
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/>
    </marker>
    
    <!-- Components with connection points -->
    <symbol id="component-server" class="extractable-component" viewBox="0 0 100 120"
            data-component-type="server" data-component-name="Server">
      <rect x="10" y="10" width="80" height="100" rx="5" ry="5" 
            fill="#E9F7EF" stroke="#2ECC71" stroke-width="2"/>
      <text x="50" y="65" text-anchor="middle">Server</text>
      
      <!-- Invisible connection points -->
      <circle cx="10" cy="60" r="0" class="extractable-component-connection-point" data-connection-point="left"/>
      <circle cx="90" cy="60" r="0" class="extractable-component-connection-point" data-connection-point="right"/>
      <circle cx="50" cy="10" r="0" class="extractable-component-connection-point" data-connection-point="top"/>
      <circle cx="50" cy="110" r="0" class="extractable-component-connection-point" data-connection-point="bottom"/>
    </symbol>
  </defs>
  
  <!-- Diagram content: components -->
  <g id="diagram-content">
    <g id="instance-web-server" class="component-instance" 
       data-instance-type="server" data-instance-name="Web Server"
       transform="translate(200,200)">
      <use href="#component-server" width="100" height="120"/>
    </g>
    
    <g id="instance-api-server" class="component-instance" 
       data-instance-type="server" data-instance-name="API Server"
       transform="translate(500,200)">
      <use href="#component-server" width="100" height="120"/>
    </g>
  </g>
  
  <!-- Connections layer: all lines and arrows -->
  <g id="connections">
    <g id="connection-web-to-api" class="diagram-connection"
       data-connection-from="instance-web-server" 
       data-connection-to="instance-api-server"
       data-connection-type="http">
      <!-- Connection from right edge of web-server to left edge of api-server -->
      <path d="M 290,260 L 500,260" 
            fill="none" stroke="#666" stroke-width="2" 
            marker-end="url(#arrow-end)"/>
            
      <!-- Label with background to prevent overlap -->
      <rect x="380" y="245" width="30" height="16" fill="white" fill-opacity="0.8" rx="2"/>
      <text x="395" y="257" text-anchor="middle" font-size="12" class="connection-label">HTTP</text>
    </g>
  </g>
  
  <!-- Annotations layer: all top-level text -->
  <g id="diagram-annotations" class="diagram-annotations">
    <text x="400" y="50" font-size="20" font-weight="bold" text-anchor="middle">
      Server Communication
    </text>
  </g>
</svg>
```

By following these guidelines, LLMs can create more reliable and visually consistent SVG diagrams with properly positioned lines and arrows that respect layering, avoid text overlap, and communicate relationships clearly.
