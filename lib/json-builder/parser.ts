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
};

export function parseTypeDefinitions(typeString: string): any[] {
  const interfaces: { [key: string]: TypeInfo[] } = {};
  let currentInterface = '';
  
  // Split by lines and filter out empty lines
  const lines = typeString.split('\n').filter(line => line.trim());
  
  // First pass: collect all interfaces
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Match interface declaration
    if (line.startsWith('export interface ')) {
      currentInterface = line.split(' ')[2];
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
    if (typeInfo.type === 'enum' && typeInfo.enumValues) {
      return {
        name: typeInfo.name,
        type: 'enum' as const,
        value: typeInfo.enumValues[0],
        enumValues: typeInfo.enumValues,
        isOptional: typeInfo.isOptional
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
        isOptional: typeInfo.isOptional
      };
    }

    // Handle Record type
    if (typeInfo.type === 'record') {
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
            type: 'string' as const,
            value: ''
          };

      return {
        name: typeInfo.name,
        type: 'array' as const,
        value: [],
        isOptional: typeInfo.isOptional,
        itemType
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
      isOptional: typeInfo.isOptional
    };
  }

  // Start conversion from ChatState interface
  if (!interfaces['ChatState']) {
    throw new Error('ChatState interface not found in type definitions');
  }

  return interfaces['ChatState'].map(convertToField);
}