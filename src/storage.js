// The mini-program preloads its local store before starting the shared app.
// Browser builds continue using the existing localStorage keys and format.
export const appStorage={
 getItem(key){return globalThis.danganmatePlatform?globalThis.danganmatePlatform.getItem(key):localStorage.getItem(key);},
 async setItem(key,value){
  if(globalThis.danganmatePlatform)await globalThis.danganmatePlatform.setItem(key,value);
  else localStorage.setItem(key,value);
 }
};
