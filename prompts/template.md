# LLM Prompt Template for SVG Component Generation

## Instructions for User

Copy this entire template when requesting SVG diagram generation from an LLM.

---

## Prompt Template

```
Create an SVG diagram of [DESCRIBE YOUR DIAGRAM] with the following components:
[LIST COMPONENTS]

You MUST strictly follow the SVG Component Architecture Standard 1.0:

1. ROOT SVG ELEMENT:
   - Include all required attributes: xmlns, viewBox, data-diagram-id, data-diagram-name, data-diagram-version="1.0"
   - Use appropriate canvas dimensions for the complexity of the diagram

2. COMPONENT DEFINITIONS:
   - Define ALL components as <symbol> elements within <defs> section
   - Use ID format: "component-[TYPE]" (e.g., component-database)
   - Include class="extractable-component" on all symbols
   - Define proper viewBox for each component
   - Add data-component-type and data-component-name attributes

3. COMPONENT INSTANCES:
   - Group with <g id="instance-[ID]" class="component-instance">
   - Include data-instance-type and data-instance-name attributes
   - Position with transform="translate(x,y)"
   - Reference components using <use href="#component-[TYPE]">

4. CONNECTIONS:
   - Group in <g id="connections">
   - Each connection must have id="connection-[ID]" and class="diagram-connection"
   - Include data-connection-from and data-connection-to attributes referencing instance IDs
   - Add data-connection-type attribute for connection type
   - Use <path> elements with marker-end for arrows

5. MARKERS AND ANNOTATIONS:
   - Define arrow markers in <defs> section
   - Group annotations in <g id="diagram-annotations">
   - Use text elements for labels and titles

I need this diagram to be machine-extractable, where each component can be isolated as its own standalone SVG.

[ADDITIONAL REQUIREMENTS OR SPECIFICATIONS]
```

## Example Request

```
Create an SVG diagram of a three-tier web application architecture with the following components:
- Web Server
- Application Server
- Database Server
- Load Balancer
- Firewall

You MUST strictly follow the SVG Component Architecture Standard 1.0:

1. ROOT SVG ELEMENT:
   - Include all required attributes: xmlns, viewBox, data-diagram-id, data-diagram-name, data-diagram-version="1.0"
   - Use appropriate canvas dimensions for the complexity of the diagram

2. COMPONENT DEFINITIONS:
   - Define ALL components as <symbol> elements within <defs> section
   - Use ID format: "component-[TYPE]" (e.g., component-database)
   - Include class="extractable-component" on all symbols
   - Define proper viewBox for each component
   - Add data-component-type and data-component-name attributes

3. COMPONENT INSTANCES:
   - Group with <g id="instance-[ID]" class="component-instance">
   - Include data-instance-type and data-instance-name attributes
   - Position with transform="translate(x,y)"
   - Reference components using <use href="#component-[TYPE]">

4. CONNECTIONS:
   - Group in <g id="connections">
   - Each connection must have id="connection-[ID]" and class="diagram-connection"
   - Include data-connection-from and data-connection-to attributes referencing instance IDs
   - Add data-connection-type attribute for connection type
   - Use <path> elements with marker-end for arrows

5. MARKERS AND ANNOTATIONS:
   - Define arrow markers in <defs> section
   - Group annotations in <g id="diagram-annotations">
   - Use text elements for labels and titles

I need this diagram to be machine-extractable, where each component can be isolated as its own standalone SVG.

Make the diagram visually clean with a professional color scheme and clear component relationships.
```

---

## Notes for Optimal Results

- Be specific about the diagram requirements
- List all components needed in the diagram
- Include any special positioning or relationship requirements
- Specify desired visual style or color scheme
- If extracting for a specific tool, mention any special requirements for that tool
