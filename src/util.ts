export function validatorCreator(rule: (params: any) => boolean) {
  return (params: any) => {
    try {
      return rule(params);
    } catch (e) {
      console.error(e);
      throw Error("validate fail");
    }
  };
}

const emptyRule = (params: any) => {
  if (params == null) {
    throw "not empty";
  }
  return true;
};

export function validateNotEmpty(params: any) {
  const validation = validatorCreator(emptyRule);
  return validation(params);
}

// retry
export async function retry(
  handler: (params: any) => any,
  params: any,
  times = 3
): Promise<any> {
  try {
    return await handler(params);
  } catch (e) {
    console.error(e)
    return await retry(handler, params, times - 1);
  }
}

// path
export function getPathValue<T = any>(data: any, path?: string) {
  validateNotEmpty(data);
  if (path == null) {
    return data as T;
  }
  try {
    const pathParts = path.split(".");
    let value = data;
    for (let i = 0; i < pathParts.length; i++) {
      const currentPathPart = pathParts[i];
      value = value[currentPathPart];
    }
    return value as T;
  } catch (e) {
    console.error(e);
    throw `data ${data} did not contains path ${path}`;
  }
}
