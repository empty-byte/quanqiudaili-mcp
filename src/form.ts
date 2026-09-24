/** 把嵌套对象编码成 PHP 能解析的表单键：content[0][id]=32、ids[0]=2 */
export function toForm(data: Record<string, unknown>): URLSearchParams {
  const out = new URLSearchParams();
  const walk = (value: unknown, key: string): void => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${key}[${i}]`));
    } else if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) walk(v, `${key}[${k}]`);
    } else {
      out.append(key, String(value));
    }
  };
  for (const [k, v] of Object.entries(data)) walk(v, k);
  return out;
}
