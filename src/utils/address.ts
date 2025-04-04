
export function addrEq(a: string, b: string) {
    return a?.toLowerCase() == b?.toLowerCase();
  }
  
  export function addrInclude(addrList: string[], addr: string) {
    return addrList?.some(a => addrEq(a, addr));
  }
  