const AJV = require('ajv');

const ajv = new AJV({ schemaId: 'auto', allErrors: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

const valid = (schema: any, data: any) => {
  const validate = ajv.compile(schema);
  const isValid = validate(data);
  if (!isValid) {
    console.error(`Invalid: ${ajv.errorsText(validate.errors)}`);
  }
  return isValid;
};

describe('schema validation', () => {
  it('simple validation', () => {
    const schema = {
      $schema: 'http://json-schema.org/draft-06/schema#',
      title: 'Product',
      description: 'A product from Acme\'s catalog',
      type: 'object',
      properties: {
        id: {
          description: 'The unique identifier for a product',
          type: 'integer',
        },
        name: {
          description: 'Name of the product',
          type: 'string',
        },
        price: {
          type: 'number',
          exclusiveMinimum: 0,
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
          uniqueItems: true,
        },
      },
      required: ['id', 'name', 'price'],
    };

    const data = {
      id: 1,
      name: 'A green door',
      price: 12.5,
      tags: ['home', 'green'],
    };

    expect(valid(schema, data)).toBe(true);
  });
});
