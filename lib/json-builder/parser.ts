type TypeInfo = {
  name: string;
  type: string;
  isArray?: boolean;
  isOptional?: boolean;
  enumValues?: string[];
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
      
      // Clean up type declaration by removing semicolon and extra spaces
      const cleanType = typeDeclaration.replace(';', '').trim();
      
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

      // Handle Record with interface value type
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