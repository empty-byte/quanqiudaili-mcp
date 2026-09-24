export interface JsonSchema {
  type?: 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
  enum?: (string | number)[];
  items?: JsonSchema;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface ToolDef {
  name: string;
  title: string;
  description: string;
  readOnly: boolean;
  destructive: boolean;
  method: 'GET' | 'POST';
  path: string;
  /** 固定附加的参数，例如 pay_method=balance */
  fixed?: Record<string, string | number>;
  inputSchema: {
    type: 'object';
    properties: Record<string, JsonSchema>;
    required: string[];
    /** 写错的参数名直接被校验拒绝，而不是静默发给后端 */
    additionalProperties: false;
  };
}
