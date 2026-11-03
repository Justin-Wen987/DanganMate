import {articles,translations,copy} from './guides.js';
import './ui.js';
export {articles,translations};
export const sources=[
 ...[1,2,3,4,5,6].map(chapter=>({id:`dr2-gl-trial-${chapter}`,title:`GameLine · DR2 Chapter ${chapter}`,url:`https://gameline.jp/danganronpa2/kouryaku/chapter${chapter}_${chapter===6?2:3}/`,note:'裁判答案与语言差异交叉核对。'})),
 {id:'dr2-presents',title:'Danganronpa Wiki · MonoMono Yachine',url:'https://danganronpa.fandom.com/wiki/MonoMono_Machine/Danganronpa_2',note:'2 代 140 项礼物编号、英日名称与喜欢、非常喜欢偏好。'},
 {id:'dr2-prefs',title:'GameLine · プレゼント一覧',url:'https://gameline.jp/danganronpa2/present/',note:'日语编号与角色偏好交叉对照。'},
 {id:'dr2-walkthrough',title:'游民星空 · 超级弹丸论破 2 全流程',url:'https://www.gamersky.com/handbook/201604/742617.shtml',note:'按地点与证据事实整理主线、搜查与裁判。'},
 {id:'dr2-trials',title:'Danganronpa Wiki · Class Trials / Danganronpa 2',url:'https://danganronpa.fandom.com/wiki/Class_Trials/Danganronpa_2',note:'交叉核对论破、赞同、反论、逻辑深潜与前后半场分界。'},
 {id:'dr2-hidden',title:'3DM · 隐藏黑白熊位置',url:'https://www.3dmgame.com/gl/3559782.html',note:'六章各五只隐藏黑白熊的位置，按文字说明整理。'},
 {id:'dr2-sprites',title:'Danganronpa Wiki · Sprite Galleries',url:'https://danganronpa.fandom.com/wiki/Category:Sprite_Galleries',note:'2 代原版立绘和海岛模式像素头像，逐项 URL 保存在素材来源中。'}
];
export const sourceGroups=[
 {id:'walkthroughs',title:'流程攻略',ids:['dr2-walkthrough','dr2-trials','dr2-hidden',...Array.from({length:6},(_,i)=>`dr2-gl-trial-${i+1}`)]},
 {id:'gifts',title:'礼物数据',ids:['dr2-presents','dr2-prefs']},
 {id:'artwork',title:'角色与界面素材',ids:['dr2-sprites']}
];
sources.push(...Array.from({length:35},(_,i)=>({id:'dr2-gs-'+(i+3),title:'GamerSky · DR2 '+(i+3),url:`https://www.gamersky.com/handbook/201604/742617_${i+3}.shtml`,note:'annyroal36 · 2016-04-26'})),
 {id:'dr2-events',title:'GameLine · プレゼント',url:'https://gameline.jp/danganronpa2/present/',note:'Special presents'},
 {id:'dr2-escape',title:'StrategyWiki · Final Dead Room',url:'https://strategywiki.org/wiki/Danganronpa_2:_Goodbye_Despair/Chapter_4/Deadly_Life',note:'Escape puzzle'},
 {id:'dr2-modes',title:'Danganronpa Wiki · Island Mode',url:'https://danganronpa.fandom.com/wiki/Island_Mode',note:'Island Mode'},
 {id:'dr2-pets',title:'Danganronpa Wiki · Pets',url:'https://danganronpa.fandom.com/wiki/Pets',note:'Virtual pets'});
for(const s of sources)if(/[\u3400-\u9fff]/.test(s.note))copy(s.note,'Reference for DR2 '+(s.id.includes('sprites')?'original game artwork':s.id.includes('hidden')?'Hidden Monokuma locations':s.id.includes('trials')?'trial steps and recess boundaries':s.id.includes('presents')?'present IDs, names and preference tiers':'walkthrough and gift data')+'.','2作目の攻略・プレゼント・素材の照合資料。');
