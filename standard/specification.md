# SVG Component Architecture Standard 1.0

## Purpose
This document defines a strict standard for creating SVG diagrams with extractable components. Compliance with this standard ensures reliable extraction of individual components from complex SVG diagrams.

## Schema Requirements

### 1. Root SVG Element

```xml
<svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 [WIDTH] [HEIGHT]" 
     data-diagram-id="[UNIQUE_ID]" 
     data-diagram-name="[DIAGRAM_NAME]" 
     data-diagram-version="1.0">
  <!-- Content here -->
</svg>
```

#### 1.1 Required Attributes
| Attribute | Description | Example |
|-----------|-------------|---------|
| `xmlns` | SVG namespace | `xmlns="http://www.w3.org/2000/svg"` |
| `viewBox` | Canvas dimensions | `viewBox="0 0 1000 800"` |
| `data-diagram-id` | Unique identifier | `data-diagram-id="network-architecture-diagram"` |
| `data-diagram-name` | Human-readable name | `data-diagram-name="Network Architecture"` |
| `data-diagram-version` | Standard version | `data-diagram-version="1.0"` |

### 2. Component Library Section

```xml
<defs>
  <symbol id="component-[TYPE]" 
          class="extractable-component" 
          viewBox="0 0 [WIDTH] [HEIGHT]" 
          data-component-type="[TYPE]" 
          data-component-name="[NAME]">
    <!-- Component content -->
    
    <!-- Optional connection points -->
    <circle cx="[X]" cy="[Y]" r="0" 
            class="extractable-component-connection-point" 
            data-connection-point="[POSITION]"/>
  </symbol>
  
  <!-- Additional components -->
</defs>
```

#### 2.1 Required Symbol Attributes
| Attribute | Description | Example |
|-----------|-------------|---------|
| `id` | Component identifier | `id="component-database"` |
| `class` | Extraction marker | `class="extractable-component"` |
| `viewBox` | Component dimensions | `viewBox="0 0 100 100"` |
| `data-component-type` | Component type | `data-component-type="database"` |
| `data-component-name` | Display name | `data-component-name="PostgreSQL Database"` |

#### 2.2 Connection Point Attributes
| Attribute | Description | Example |
|-----------|-------------|---------|
| `class` | Connection point marker | `class="extractable-component-connection-point"` |
| `data-connection-point` | Position identifier | `data-connection-point="left"` |
| `r` | Zero radius (invisible) | `r="0"` |

### 3. Component Instances

```xml
<g id="diagram-content">
  <g id="instance-[ID]" 
     class="component-instance" 
     data-instance-type="[TYPE]" 
     data-instance-name="[NAME]" 
     transform="translate([X],[Y])">
    <use href="#component-[TYPE]" width="[WIDTH]" height="[HEIGHT]" />
  </g>
  
  <!-- Additional instances -->
</g>
```

#### 3.1 Required Instance Attributes
| Attribute | Description | Example |
|-----------|-------------|---------|
| `id` | Instance identifier | `id="instance-auth-db"` |
| `class` | Instance marker | `class="component-instance"` |
| `data-instance-type` | Instance type | `data-instance-type="database"` |
| `data-instance-name` | Instance name | `data-instance-name="Auth Database"` |
| `transform` | Positioning | `transform="translate(200,300)"` |

#### 3.2 Required Use Attributes
| Attribute | Description | Example |
|-----------|-------------|---------|
| `href` | Component reference | `href="#component-database"` |
| `width` | Display width | `width="120"` |
| `height` | Display height | `height="120"` |

### 4. Connections

```xml
<g id="connections">
  <g id="connection-[ID]" 
     class="diagram-connection" 
     data-connection-from="instance-[SOURCE]" 
     data-connection-to="instance-[TARGET]" 
     data-connection-type="[TYPE]">
    <path d="[PATH_DATA]" 
          fill="none" 
          stroke="[COLOR]" 
          stroke-width="[WIDTH]" 
          marker-end="url(#arrow-end)" />
    
    <!-- Optional label -->
    <text x="[X]" y="[Y]" class="connection-label">[LABEL]</text>
  </g>
  
  <!-- Additional connections -->
</g>
```

#### 4.1 Required Connection Attributes
| Attribute | Description | Example |
|-----------|-------------|---------|
| `id` | Connection identifier | `id="connection-api-to-db"` |
| `class` | Connection marker | `class="diagram-connection"` |
| `data-connection-from` | Source instance | `data-connection-from="instance-api"` |
| `data-connection-to` | Target instance | `data-connection-to="instance-db"` |
| `data-connection-type` | Connection type | `data-connection-type="request"` |

### 5. Markers and Annotations

```xml
<defs>
  <!-- Arrow markers -->
  <marker id="arrow-end" viewBox="0 0 10 10" refX="9" refY="5" 
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/>
  </marker>
</defs>

<g id="diagram-annotations" class="diagram-annotations">
  <text x="[X]" y="[Y]" font-size="[SIZE]" font-weight="bold" text-anchor="middle">
    [TITLE]
  </text>
  <!-- Additional annotations -->
</g>
```

## Layer Structure and Ordering

For proper rendering and extraction, SVG elements must follow this strict layer ordering:

1. **Definitions (`<defs>`)** - component templates and markers
2. **Component instances (`<g id="diagram-content">`)** - component placement
3. **Connections (`<g id="connections">`)** - all lines and arrows
4. **Annotations (`<g id="diagram-annotations">`)** - text and labels

This layering ensures that:
- Component definitions are available before instances
- Connections appear behind text layers to prevent overlap
- Annotations remain visible on top of other elements

For detailed guidelines on creating reliable lines and arrows, see the [Line and Arrow Guidelines](./line-arrow-guidelines.md) document.

## Naming Conventions

To ensure consistency and enable reliable processing:

1. **Component IDs**: `component-[TYPE]`
   - Use lowercase, hyphenated names: `component-database`, `component-web-server`

2. **Instance IDs**: `instance-[ID]`
   - Use semantic, descriptive IDs: `instance-auth-db`, `instance-payment-api`
   - Avoid numeric IDs like `instance-1`, `instance-2`

3. **Connection IDs**: `connection-[ID]`
   - Use descriptive IDs that indicate relationship: `connection-api-to-db`
   - Avoid numeric IDs like `connection-1`, `connection-2`

4. **Connection Points**: `data-connection-point="[POSITION]"`
   - Standard positions: `left`, `right`, `top`, `bottom`
   - For custom positions: `top-left`, `bottom-right`, etc.

5. **Class Names**:
   - Component: `extractable-component`
   - Component connection point: `extractable-component-connection-point`
   - Instance: `component-instance`
   - Connection: `diagram-connection`
   - Connection label: `connection-label`
   - Annotations: `diagram-annotations`

## Validation Checklist

- [ ] Root SVG has all required attributes
- [ ] All components defined as symbols in defs section
- [ ] Each symbol has required ID format and data attributes
- [ ] Each instance references component with proper use element
- [ ] Instances have required attributes and positioning
- [ ] Connections properly reference instances with data attributes
- [ ] Connections follow line and arrow best practices
- [ ] All paths use marker definitions for arrows
- [ ] Text is properly placed to avoid overlap with connections
- [ ] No inline styles (use attributes for styling)
- [ ] No hardcoded pixel values outside of viewBox attributes
- [ ] Layers are properly ordered (defs, components, connections, annotations)
- [ ] All IDs follow naming conventions

## Example Usage

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" 
     data-diagram-id="simple-architecture" 
     data-diagram-name="Simple System Architecture"
     data-diagram-version="1.0">
  
  <!-- Component Definitions -->
  <defs>
    <!-- Server Component -->
    <symbol id="component-server" class="extractable-component" viewBox="0 0 100 120"
            data-component-type="server" data-component-name="Server">
      <rect x="10" y="10" width="80" height="100" rx="5" ry="5" 
            fill="#E9F7EF" stroke="#2ECC71" stroke-width="2"/>
      <text x="50" y="65" text-anchor="middle" font-family="Arial" font-size="14">Server</text>
      
      <!-- Connection points -->
      <circle cx="10" cy="60" r="0" class="extractable-component-connection-point" data-connection-point="left"/>
      <circle cx="90" cy="60" r="0" class="extractable-component-connection-point" data-connection-point="right"/>
    </symbol>
    
    <!-- Database Component -->
    <symbol id="component-database" class="extractable-component" viewBox="0 0 100 120"
            data-component-type="database" data-component-name="Database">
      <ellipse cx="50" cy="30" rx="30" ry="15" fill="#EBF5FB" stroke="#3498DB" stroke-width="2"/>
      <path d="M20,30 L20,90 C20,105 80,105 80,90 L80,30" 
            fill="#EBF5FB" stroke="#3498DB" stroke-width="2"/>
      <text x="50" y="65" text-anchor="middle" font-family="Arial" font-size="14">Database</text>
      
      <!-- Connection points -->
      <circle cx="20" cy="60" r="0" class="extractable-component-connection-point" data-connection-point="left"/>
      <circle cx="80" cy="60" r="0" class="extractable-component-connection-point" data-connection-point="right"/>
    </symbol>
    
    <!-- Arrow markers -->
    <marker id="arrow-end" viewBox="0 0 10 10" refX="9" refY="5" 
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/>
    </marker>
  </defs>
  
  <!-- Component Instances -->
  <g id="diagram-content">
    <g id="instance-web-server" class="component-instance" 
       data-instance-type="server" data-instance-name="Web Server"
       transform="translate(200,200)">
      <use href="#component-server" width="100" height="120"/>
    </g>
    
    <g id="instance-main-db" class="component-instance" 
       data-instance-type="database" data-instance-name="Main Database"
       transform="translate(500,200)">
      <use href="#component-database" width="100" height="120"/>
    </g>
  </g>
  
  <!-- Connections -->
  <g id="connections">
    <g id="connection-server-to-db" class="diagram-connection" 
       data-connection-from="instance-web-server" 
       data-connection-to="instance-main-db"
       data-connection-type="query">
      <path d="M 300,250 L 500,250" 
            fill="none" stroke="#666" stroke-width="2" 
            marker-end="url(#arrow-end)"/>
      <text x="400" y="235" font-family="Arial" font-size="12" text-anchor="middle" 
            class="connection-label">DB Query</text>
    </g>
  </g>
  
  <!-- Annotations -->
  <g id="diagram-annotations" class="diagram-annotations">
    <text x="400" y="50" font-size="20" font-weight="bold" text-anchor="middle" 
          font-family="Arial">Simple System Architecture</text>
    <text x="400" y="550" font-size="12" text-anchor="middle" font-family="Arial">
      Created with SVG Component Architecture Standard 1.0
    </text>
  </g>
</svg>
```

## Extraction Process

1. Find all `symbol` elements with class `extractable-component`
2. For each component:
   - Create new SVG with same viewBox
   - Copy symbol contents
   - Extract metadata from data attributes
3. Extract instance relationships from connections

## Related Documents

- [Line and Arrow Guidelines](./line-arrow-guidelines.md) - Detailed guidelines for creating reliable connections

## Version History

- 1.0: Initial standard (2025-03-19)
- 1.1: Added layer ordering and connection guidelines (2025-03-22)
