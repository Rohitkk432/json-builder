type TypeInfo = {
  name: string;
  type: string;
  isArray?: boolean;
  isOptional?: boolean;
  enumValues?: string[];
};

export function parseTypeDefinitions(typeString: string): any[] {
  const interfaces: { [key: string]: TypeInfo[] } = {};
  const lines = typeString.split('\n');
  let currentInterface = '';
  
  // First pass: collect all interfaces
  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('interface ')) {
      currentInterface = line.split(' ')[1];
      interfaces[currentInterface] = [];
    } else if (line.match(/^[a-zA-Z_]/)) {
      const [field, type] = line.split(':').map(s => s.trim());
      const fieldName = field.replace('?', '');
      const isOptional = field.includes('?');
      
      // Handle array types
      const isArray = type.endsWith('[]');
      const baseType = type.replace('[]', '').replace(';', '');
      
      // Handle enum types (union types)
      const enumMatch = baseType.match(/"([^"]+)"/g);
      const enumValues = enumMatch?.map(v => v.replace(/"/g, ''));
      
      interfaces[currentInterface].push({
        name: fieldName,
        type: baseType,
        isArray,
        isOptional,
        enumValues
      });
    }
  });

  // Convert to field structure
  function convertToField(typeInfo: TypeInfo): any {
    if (typeInfo.isArray) {
      return {
        name: typeInfo.name,
        type: 'array',
        value: [],
        isOptional: typeInfo.isOptional,
        itemType: {
          type: interfaces[typeInfo.type] ? 'object' : 'string',
          ...(interfaces[typeInfo.type] && {
            fields: interfaces[typeInfo.type].map(convertToField)
          })
        }
      };
    }

    if (interfaces[typeInfo.type]) {
      return {
        name: typeInfo.name,
        type: 'object',
        value: {},
        isOptional: typeInfo.isOptional,
        fields: interfaces[typeInfo.type].map(convertToField)
      };
    }

    if (typeInfo.enumValues) {
      return {
        name: typeInfo.name,
        type: 'enum',
        value: typeInfo.enumValues[0],
        enumValues: typeInfo.enumValues,
        isOptional: typeInfo.isOptional
      };
    }

    const typeMap: { [key: string]: string } = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'Record<string, InsightResponse>': 'record'
    };

    return {
      name: typeInfo.name,
      type: typeMap[typeInfo.type] || 'string',
      value: typeInfo.type === 'boolean' ? false : typeInfo.type === 'number' ? 0 : '',
      isOptional: typeInfo.isOptional
    };
  }

  return interfaces['ChatState'].map(convertToField);
}