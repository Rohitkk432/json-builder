type TypeInfo = {
  name: string;
  type: string;
  isArray?: boolean;
  isOptional?: boolean;
  enumValues?: string[];
  unionTypes?: Array<{
    type: string;
    isInterface?: boolean;
  }>;
  keyType?: string;
  valueType?: string;
  isDirectType?: boolean;
};

export function parseTypeDefinitions(typeString: string): any[] {
  const interfaces: { [key: string]: TypeInfo[] } = {};
  let currentInterface = '';
  
  // Parse comments first
  const fields = parseInterfaceWithComments(typeString);
  
  // Split by lines and filter out empty lines
  const lines = typeString.split('\n').filter(line => line.trim());
  
  // First pass: collect all interfaces and type assignments
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Match interface declaration or type assignment (with or without export)
    if (line.startsWith('export interface ') || 
        line.startsWith('interface ') || 
        line.startsWith('export type ') || 
        line.startsWith('type ')) {
      
      const isTypeAssignment = line.includes('=');
      const isInterfaceWithType = line.includes(':') && !line.includes('{');
      
      let interfaceName = '';
      let typeDeclaration = '';
      
      if (isTypeAssignment) {
        // Handle: [export] type RootState = Record<string,Discount>
        const parts = line.split('=').map(p => p.trim());
        interfaceName = parts[0]
          .replace('export type', '')
          .replace('type', '')
          .trim();
        typeDeclaration = parts[1]?.replace(';', '')?.trim();
      } else if (isInterfaceWithType) {
        // Handle: [export] interface RootState : Record<string,Discount>
        const parts = line.split(':').map(p => p.trim());
        interfaceName = parts[0]
          .replace('export interface', '')
          .replace('interface', '')
          .trim();
        typeDeclaration = parts[1]?.replace(';', '')?.trim();
      } else {
        // Handle: [export] interface RootState { ... }
        interfaceName = line
          .replace('export interface', '')
          .replace('interface', '')
          .split('{')[0]
          .trim();
      }

      if (!interfaceName) {
        throw new Error(`Could not determine interface/type name from line: ${line}`);
      }

      currentInterface = interfaceName;

      // Handle direct type assignments
      if (typeDeclaration) {
        // Handle Record type
        if (typeDeclaration.startsWith('Record<')) {
          const [keyType, valueType] = typeDeclaration
            .replace('Record<', '')
            .replace('>', '')
            .split(',')
            .map(t => t.trim());
            
          if (!valueType) {
            throw new Error(`Invalid Record type declaration: ${typeDeclaration}`);
          }

          interfaces[currentInterface] = [{
            name: '',
            type: 'record',
            keyType,
            valueType,
            isDirectType: true
          }];
          currentInterface = '';
          continue;
        }
        
        // Handle array type
        if (typeDeclaration.endsWith('[]')) {
          const baseType = typeDeclaration.replace('[]', '');
          interfaces[currentInterface] = [{
            name: '',
            type: baseType,
            isArray: true,
            isDirectType: true
          }];
          currentInterface = '';
          continue;
        }
        
        // Handle direct interface assignment (e.g., RootState : Discount)
        if (interfaces[typeDeclaration] || typeDeclaration.match(/^[A-Z][a-zA-Z0-9]*$/)) {
          interfaces[currentInterface] = [{
            name: '',
            type: typeDeclaration,
            isDirectType: true
          }];
          currentInterface = '';
          continue;
        }
        
        // Handle other direct type assignments
        interfaces[currentInterface] = [{
          name: '',
          type: typeDeclaration
        }];
        currentInterface = '';
        continue;
      }
      
      interfaces[currentInterface] = [];
      continue;
    }
    
    // Skip if we're not in an interface or line is a closing brace
    if (!currentInterface || line === '}') continue;
    
    // Match field declaration
    if (line.match(/^[a-zA-Z_]/)) {
      const [field, typeDeclaration] = line.split(':').map(s => s.trim());
      const fieldName = field.replace('?', '');
      const isOptional = field.includes('?');
      
      // Clean up type declaration
      const cleanType = typeDeclaration.replace(';', '').trim();
      
      // Handle literal union types (enums with string literals)
      if (cleanType.includes('"') || cleanType.includes("'")) {
        const enumValues = cleanType
          .split('|')
          .map(t => t.trim().replace(/['"]/g, ''));
        
        interfaces[currentInterface].push({
          name: fieldName,
          type: 'enum',
          enumValues,
          isOptional
        });
        continue;
      }
      
      // Handle type unions (e.g., string | number | SomeInterface)
      if (cleanType.includes('|')) {
        const unionTypes = cleanType
          .split('|')
          .map(t => t.trim())
          .map(t => ({
            type: t,
            isInterface: !['string', 'number', 'boolean'].includes(t) && 
                        !t.startsWith('"') && 
                        !t.startsWith("'")
          }));
        
        // If all types are string literals, treat as enum
        if (unionTypes.every(t => t.type.startsWith('"') || t.type.startsWith("'"))) {
          const enumValues = unionTypes.map(t => t.type.replace(/['"]/g, ''));
          interfaces[currentInterface].push({
            name: fieldName,
            type: 'enum',
            enumValues,
            isOptional
          });
        } else {
          // Remove quotes from string literals in union types
          const cleanUnionTypes = unionTypes.map(t => ({
            ...t,
            type: t.type.replace(/['"]/g, '')
          }));

          interfaces[currentInterface].push({
            name: fieldName,
            type: 'union',
            unionTypes: cleanUnionTypes,
            isOptional
          });
        }
        continue;
      }

      // Handle array types
      const isArray = cleanType.endsWith('[]');
      const baseType = cleanType.replace('[]', '');
      
      // Handle Record type
      if (baseType.startsWith('Record<')) {
        const [keyType, valueType] = baseType
          .replace('Record<', '')
          .replace('>', '')
          .split(',')
          .map(t => t.trim());
          
        interfaces[currentInterface].push({
          name: fieldName,
          type: 'record',
          isOptional,
          keyType,
          valueType
        });
        continue;
      }
      
      // Handle regular types
      interfaces[currentInterface].push({
        name: fieldName,
        type: baseType,
        isArray,
        isOptional
      });
    }
  }

  // Convert TypeInfo to Field structure
  function convertToField(typeInfo: TypeInfo): any {
    // Get description from comments if available
    const description = fields[typeInfo.name];

    if (typeInfo.type === 'enum' && typeInfo.enumValues) {
      return {
        name: typeInfo.name,
        type: 'enum' as const,
        value: typeInfo.enumValues[0],
        enumValues: typeInfo.enumValues,
        isOptional: typeInfo.isOptional,
        description
      };
    }

    if (typeInfo.type === 'union' && typeInfo.unionTypes) {
      const unionFields = typeInfo.unionTypes.map(ut => {
        if (ut.isInterface) {
          return {
            type: 'object' as const,
            fields: interfaces[ut.type]?.map(convertToField) || []
          };
        }
        return {
          type: ut.type as 'string' | 'number' | 'boolean',
          value: ut.type === 'boolean' ? false : 
                 ut.type === 'number' ? 0 : ''
        };
      });

      return {
        name: typeInfo.name,
        type: 'union' as const,
        value: '',
        unionTypes: unionFields,
        isOptional: typeInfo.isOptional,
        description
      };
    }

    // Handle Record type
    if (typeInfo.type === 'record') {
      // Ensure valueType exists
      if (!typeInfo.valueType) {
        throw new Error('Record type must have a value type');
      }

      // Check if value type is a primitive type
      const isPrimitiveValueType = ['string', 'number', 'boolean'].includes(typeInfo.valueType);
      
      if (isPrimitiveValueType) {
        return {
          name: typeInfo.name,
          type: 'record' as const,
          value: {},
          isOptional: typeInfo.isOptional,
          itemType: {
            name: 'recordItem',
            type: typeInfo.valueType as 'string' | 'number' | 'boolean',
            value: typeInfo.valueType === 'boolean' ? false : 
                   typeInfo.valueType === 'number' ? 0 : ''
          }
        };
      }

      // For direct Record types, return a different structure
      if (typeInfo.isDirectType) {
        return {
          type: 'record' as const,
          value: {},
          itemType: {
            name: 'recordItem',
            type: 'object' as const,
            value: {},
            fields: interfaces[typeInfo.valueType]?.map(convertToField) || []
          }
        };
      }

      // For nested Record types
      return {
        name: typeInfo.name,
        type: 'record' as const,
        value: {},
        isOptional: typeInfo.isOptional,
        itemType: {
          name: 'recordItem',
          type: 'object' as const,
          value: {},
          fields: interfaces[typeInfo.valueType]?.map(convertToField) || []
        }
      };
    }

    // Handle array types
    if (typeInfo.isArray) {
      const itemType = interfaces[typeInfo.type]
        ? {
            name: 'item',
            type: 'object' as const,
            value: {},
            fields: interfaces[typeInfo.type].map(convertToField)
          }
        : {
            name: 'item',
            type: typeInfo.type as 'string' | 'number' | 'boolean',
            value: typeInfo.type === 'boolean' ? false : 
                   typeInfo.type === 'number' ? 0 : ''
          };

      // For direct array types, return array structure directly
      if (typeInfo.isDirectType) {
        return {
          type: 'array' as const,
          value: [],
          itemType
        };
      }

      return {
        name: typeInfo.name,
        type: 'array' as const,
        value: [],
        isOptional: typeInfo.isOptional,
        itemType
      };
    }

    // Handle direct type assignments
    if (typeInfo.isDirectType && interfaces[typeInfo.type]) {
      return {
        type: 'object' as const,
        value: {},
        fields: interfaces[typeInfo.type].map(convertToField)
      };
    }

    // Handle object types (interfaces)
    if (interfaces[typeInfo.type]) {
      return {
        name: typeInfo.name,
        type: 'object' as const,
        value: {},
        isOptional: typeInfo.isOptional,
        fields: interfaces[typeInfo.type].map(convertToField)
      };
    }

    // Handle primitive types
    const typeMap: { [key: string]: 'string' | 'number' | 'boolean' } = {
      string: 'string',
      number: 'number',
      boolean: 'boolean'
    };

    return {
      name: typeInfo.name,
      type: typeMap[typeInfo.type] || 'string',
      value: typeInfo.type === 'boolean' ? false : typeInfo.type === 'number' ? 0 : '',
      isOptional: typeInfo.isOptional,
      description
    };
  }

  // Start conversion from RootState
  if (!interfaces['RootState']) {
    throw new Error('RootState type/interface not found in type definitions');
  }

  // Special handling for direct types - return the field directly
  const rootFields = interfaces['RootState'].map(convertToField);
  if (rootFields.length === 1 && !rootFields[0].name) {
    return [rootFields[0]];
  }

  return rootFields;
}

export function parseInterfaceWithComments(interfaceString: string) {
  const lines = interfaceString.split('\n');
  const fields: Record<string, string> = {};

  lines.forEach((line, index) => {
    // Match field name and inline comment
    const match = line.match(/(\w+)[\s\:]+[^;]+;?\s*\/\/\s*(.+)/);
    if (match) {
      const [_, fieldName, comment] = match;
      fields[fieldName.trim()] = comment.trim();
    }
  });

  return fields;
}