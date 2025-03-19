# SVG Component Architecture Standard - Example Prompts

The following examples demonstrate how to request various types of diagrams using the SVG Component Architecture Standard.

## Example 1: Basic Network Diagram

```
Create an SVG diagram of a basic network architecture with the following components:
- Router
- Firewall
- Web Server
- Database Server
- Client Devices (2)

You MUST strictly follow the SVG Component Architecture Standard 1.0:

1. ROOT SVG ELEMENT:
   - Include all required attributes: xmlns, viewBox, data-diagram-id, data-diagram-name, data-diagram-version="1.0"
   - Use appropriate canvas dimensions for the complexity of the diagram

2. COMPONENT DEFINITIONS:
   - Define ALL components as <symbol> elements within <defs> section
   - Use ID format: "component-[TYPE]" (e.g., component-router)
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

Arrange the components in a logical network flow with the router at the top, client devices at the bottom, and servers in the middle. Use a blue-themed color scheme that is visually professional.
```

## Example 2: Software Architecture Diagram

```
Create an SVG diagram of a microservices architecture with the following components:
- API Gateway
- User Service
- Authentication Service
- Product Service
- Order Service
- Payment Service
- Database (MongoDB)
- Message Queue (Kafka)
- Frontend Client

You MUST strictly follow the SVG Component Architecture Standard 1.0:

1. ROOT SVG ELEMENT:
   - Include all required attributes: xmlns, viewBox, data-diagram-id, data-diagram-name, data-diagram-version="1.0"
   - Use appropriate canvas dimensions for the complexity of the diagram

2. COMPONENT DEFINITIONS:
   - Define ALL components as <symbol> elements within <defs> section
   - Use ID format: "component-[TYPE]" (e.g., component-service, component-database)
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
   - Add data-connection-type attribute for connection type (REST, DB, etc)
   - Use <path> elements with marker-end for arrows

5. MARKERS AND ANNOTATIONS:
   - Define arrow markers in <defs> section
   - Group annotations in <g id="diagram-annotations">
   - Use text elements for labels and titles

Arrange the components with the API Gateway at the top, connecting to the various microservices, which connect to the database and message queue. Show the frontend client connected to the API Gateway. Use different colors for different types of services to make the diagram easy to understand.
```

## Example 3: Process Flow Diagram

```
Create an SVG diagram of an e-commerce order processing flow with the following components:
- Start/End (circular nodes)
- Process Steps (rectangles)
- Decision Points (diamonds)
- Document (document shape)

The flow should include these specific instances:
- Start
- User Places Order
- Payment Verification (decision)
- Order Processing
- Inventory Check (decision)
- Shipping Preparation
- Generate Invoice (document)
- Order Fulfillment
- End

You MUST strictly follow the SVG Component Architecture Standard 1.0:

1. ROOT SVG ELEMENT:
   - Include all required attributes: xmlns, viewBox, data-diagram-id, data-diagram-name, data-diagram-version="1.0"
   - Use appropriate canvas dimensions for the complexity of the diagram

2. COMPONENT DEFINITIONS:
   - Define ALL components as <symbol> elements within <defs> section
   - Use ID format: "component-[TYPE]" (e.g., component-process, component-decision)
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
   - Add data-connection-type attribute for connection type (flow, conditional)
   - Use <path> elements with marker-end for arrows
   - Include text labels for Yes/No on decision connections

5. MARKERS AND ANNOTATIONS:
   - Define arrow markers in <defs> section
   - Group annotations in <g id="diagram-annotations">
   - Use text elements for labels and titles

Arrange the flow from top to bottom with decision branches flowing to the right or continuing downward. Use a clean, professional visual style with pastel colors.
```
