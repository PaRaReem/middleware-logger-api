export function formatQuery([sql, params]:any) {
    params.forEach((param:any, index:number) => {
      const placeholder = `$${index + 1}`;
      let value;
  
      if (param instanceof Date) {
        // Format Date to ISO string
        value = `'${param.toISOString()}'`;
      } else if (typeof param === 'string') {
        // Add quotes around strings
        value = `'${param}'`;
      } else {
        // Leave numbers and other types as-is
        value = param;
      }
  
      sql = sql.replace(placeholder, value);
    });
  
    return sql;
  }
  export default formatQuery