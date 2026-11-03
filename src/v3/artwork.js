// Each native symbol has a colored base AND a white detail layer.
export const v3Themes={gifts:'#e7eb35',characters:'#ff46b3',guides:'#67b7ff',bag:'#66d9e8',system:'#a4e66a'};
const symbols={
 gifts:{name:'present',point:[56,22,95,157]},
 bag:{name:'present',point:[56,22,95,157]},
 characters:{name:'tsusinbo',point:[78,14,64,82]},
 guides:{name:'rules',point:[40,77,108,64]},
 system:{name:'system',point:[62,0,123,128]}
};
export function v3Dial(id,hero=false){
 const {name,point:[x,y,w,h]}=symbols[id],key=`v3-${hero?'hero':'menu'}-${id}`;
 // Project each ribbon across the top face and down to the cube's sloped
 // bottom edge. Scaling the original overlay leaves exposed box edges.
 const detail=['gifts','bag'].includes(id)
  ? `<g fill="#fff"><path d="M56 52 71 45 135 75.5V160.3L120 167.1V81.8Z"/><path d="M120 45 135 52 71 81.4V167L56 160.2V75.1Z"/></g><svg x="55.5" y="27" width="95" height="36" viewBox="0 0 105 25" preserveAspectRatio="none"><image href="assets/v3/ui/category_present_point_DXT1.webp" width="105" height="174" filter="url(#${key}-point)"/></svg>`
  : id==='characters' 
  ? `<svg x="60" y="72" width="18" height="37" viewBox="0 45 18 37"><image href="assets/v3/ui/category_tsusinbo_point_DXT1.webp" width="64" height="82" filter="url(#${key}-point)"/></svg><svg x="106" y="13" width="30" height="24" viewBox="34 0 30 24"><image href="assets/v3/ui/category_tsusinbo_point_DXT1.webp" width="64" height="82" filter="url(#${key}-point)"/></svg>`
  : `<image href="assets/v3/ui/category_${name}_point_DXT1.webp" x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#${key}-point)"/>`;
 const rgb=v3Themes[id].slice(1).match(/../g).map(n=>parseInt(n,16)/255*(hero ? .3 : 1));
 // Turn the native black image background transparent; preserve the symbol's
 // luminosity as alpha, and keep detail artwork above its colored base.
 const ink=(r,g,b)=>`0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} .2126 .7152 .0722 0 0`;
 return `<svg class="${hero?'v3-hero-dial':'v3-orb-dial'}" viewBox="0 0 198 204" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><filter id="${key}-base" color-interpolation-filters="sRGB"><feColorMatrix values="${ink(...rgb)}"/></filter><filter id="${key}-point" color-interpolation-filters="sRGB"><feColorMatrix values="${ink(1,1,1)}"/></filter>${hero?`<clipPath id="${key}-inner"><circle cx="96" cy="96" r="84"/></clipPath>`:''}</defs><g${hero?` clip-path="url(#${key}-inner)"`:''}><image href="assets/v3/ui/category_${name}_base_DXT1.webp" width="198" height="204" filter="url(#${key}-base)"/>${detail}</g></svg>`;
}
export function v3BannerTexture(id){
 const name={gifts:'present',bag:'present',characters:'tsusinbo',guides:'kousoku',system:'system'}[id];
 const src=`assets/v3/ui/icon_${name}_DXT1.webp`,rotation=id==='bag'?125:id==='system'?65:id==='guides'?-75:0;
 // Keep the original academy emblem intact on the guide banner.
 // Replace the other baked-in right symbols with an equal-size, unscaled sample
 // of the same native panel. The complete symbol is rendered in its own slot.
 return `<svg class="v3-home-texture" id="home-art" viewBox="60 48 1369 360" preserveAspectRatio="none" aria-hidden="true" style="filter:hue-rotate(${rotation}deg)"><image href="${src}" width="1489" height="512"/>${id==='guides'?'':`<svg x="1020" y="48" width="350" height="400" viewBox="600 48 350 400" preserveAspectRatio="none"><image href="${src}" width="1489" height="512"/></svg>`}</svg>`;
}
