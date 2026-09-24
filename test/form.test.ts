import { describe, expect, it } from 'vitest';
import { toForm } from '../src/form.js';

const plain = (data: Record<string, unknown>) => decodeURIComponent(toForm(data).toString());

describe('toForm', () => {
  it('对象数组编码为 PHP 括号格式', () => {
    expect(plain({ product_type_id: 1, content: [{ id: 32, customUsername: 'u1' }, { id: 33 }] }))
      .toBe('product_type_id=1&content[0][id]=32&content[0][customUsername]=u1&content[1][id]=33');
  });

  it('标量数组编码为带下标的键', () => {
    expect(plain({ ids: [1, 2] })).toBe('ids[0]=1&ids[1]=2');
  });

  it('跳过 undefined 与 null，保留 0 与空串', () => {
    expect(plain({ a: undefined, b: null, c: 0, d: '' })).toBe('c=0&d=');
  });
});
