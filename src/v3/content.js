import {articles,translations} from './guides.js';
export {articles,translations};
export const sources=[
 {id:'v3-trial-terms',title:'PlayStation LifeStyle · V3 Trial 4',url:'https://www.playstationlifestyle.net/2017/09/25/danganronpa-v3-class-trial-guide-complete-walkthrough/5',note:'裁判答案与语言差异交叉核对。'},
 {id:'v3-rpg-trial-3',title:'RPG Site · V3 Trial 3',url:'https://www.rpgsite.net/feature/6165-danganronpa-v3-class-trial-3-guide-spoiler-free-walkthrough',note:'裁判答案与语言差异交叉核对。'},
 {id:'v3-rpg-trial-5',title:'RPG Site · V3 Trial 5',url:'https://www.rpgsite.net/feature/6172-danganronpa-v3-class-trial-5-guide-spoiler-free-walkthrough',note:'裁判答案与语言差异交叉核对。'},
 {id:'v3-trial-finale',title:'PlayStation LifeStyle · V3 Trial 6',url:'https://www.playstationlifestyle.net/2017/09/25/danganronpa-v3-class-trial-guide-complete-walkthrough/7',note:'裁判答案与语言差异交叉核对。'},
 {id:'v3-prefs',title:'GameLine · プレゼント',url:'https://gameline.jp/danganronpa3/data/present/',note:'16 位同学的喜欢、非常喜欢编号表。'},
 {id:'v3-rpg-prefs',title:'RPG Site · V3 Gift Guide',url:'https://www.rpgsite.net/feature/6163-danganronpa-v3-gift-guide-a-spoiler-free-walkthrough-to-impressing-every-student-with-presents',note:'交叉核对礼物偏好层级。'},
 {id:'v3-presents',title:'Danganronpa Wiki · V3 Presents',url:'https://danganronpa.fandom.com/wiki/MonoMono_Machine/Danganronpa_V3',note:'143 项礼物编号、获取方式与赌场兑换分类；名称和说明采用 Steam 游戏文本。'},
 {id:'v3-native',title:'Spike Chunsoft · Danganronpa V3',url:'https://www.spike-chunsoft.com/games/danganronpa-v3-killing-harmony/',note:'01 预设手册背景、菜单、礼物图、资料立绘和剪影取自本机正版游戏资源，未修改游戏文件。'},
 {id:'v3-hidden',title:'GameLine · 隠れモノクマ',url:'https://gameline.jp/danganronpa3/data/secret-monokuma/',note:'六章隐藏黑白熊的位置与出现时段。'},
 {id:'v3-back',title:'GameLine · 裏ルート',url:'https://gameline.jp/danganronpa3/chart/ura-root/',note:'九处可选伪证分支；与主线必要伪证分开。'},
 {id:'v3-events',title:'GameLine · プレゼント所持イベント',url:'https://gameline.jp/danganronpa3/data/present-event/',note:'特殊礼物的持有时机和触发人物。'},
 {id:'v3-casino',title:'GameLine · 景品交換',url:'https://gameline.jp/danganronpa3/casino/prize/',note:'赌场兑换与特殊道具。'},
 ...Array.from({length:6},(_,i)=>i+1).flatMap(ch=>['nichijou','hi-nichijou','saiban'].filter(kind=>ch!==6||kind!=='nichijou').map(kind=>({id:`v3-${ch}-${kind}`,title:`GameLine · Chapter ${ch} / ${kind}`,url:`https://gameline.jp/danganronpa3/chart/${ch}-${kind}/`,note:'按章节整理日常、搜查与学级裁判。'}))),
 {id:'v3-prologue',title:'GameLine · PROLOGUE',url:'https://gameline.jp/danganronpa3/chart/prologue/',note:'序章流程。'},
 {id:'v3-clear',title:'GameLine · クリア特典',url:'https://gameline.jp/danganronpa3/chart/clear/',note:'通关奖励和额外模式。'},
 {id:'v3-deathroad',title:'GameLine · 絶望のデスロード',url:'https://gameline.jp/danganronpa3/chart/death-road/',note:'绝望死亡之路的进入方式与操作。'}
];
export const sourceGroups=[
 {id:'walkthroughs',title:'流程攻略',ids:sources.filter(s=>!['v3-prefs','v3-rpg-prefs','v3-presents','v3-native'].includes(s.id)).map(s=>s.id)},
 {id:'gifts',title:'礼物数据',ids:['v3-prefs','v3-rpg-prefs','v3-presents']},
 {id:'artwork',title:'角色与界面素材',ids:['v3-native']}
];
