import {storyArticles,guideSources} from './dr1-guides.js';
export const sources = [
  {id:'presents',title:'StrategyWiki · Presents',url:'https://strategywiki.org/wiki/Danganronpa%3A_Trigger_Happy_Havoc/Presents',note:'PC / Vita 礼物编号与纪念品获取；101–114 为学院模式结局奖励。'},
  {id:'altema',title:'アルテマ · 礼物一览',url:'https://altema.jp/danganronpa/present',note:'礼物 001–100 与非常喜欢偏好。已与 PC 资料对齐 058 / 061。'},
  {id:'prefs',title:'Steam 社区 · Gift Guide',url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3766454604',note:'作者 unititledem；收录编号化的喜欢 / 非常喜欢表。仅用于核对礼物偏好。'},
  {id:'choices',title:'Steam 社区 · Free Time Events',url:'https://steamcommunity.com/sharedfiles/filedetails/?id=627170946',note:'作者 HeeHo；交叉检查礼物偏好，不把该文笼统的 Liked 当作偏好等级。'},
  {id:'walkthrough',title:'3DM · 全关卡流程攻略',url:'https://www.3dmgame.com/gl/3548499.html',note:'原来源 3DM 论坛 nick72，编辑售梦者，2016-02-19。早期版本攻略，仅整理可适用的游戏机制与操作事实，不沿用 PSP 按键。'},
  {id:'kyoko',title:'Danganronpa Wiki · 雾切自由行动',url:'https://danganronpa.fandom.com/wiki/Free_Time_Events/Kyoko_Kirigiri',note:'对照雾切礼物偏好等级。'},
  {id:'sayaka',title:'Danganronpa Wiki · 舞园自由行动',url:'https://danganronpa.fandom.com/wiki/Free_Time_Events/Sayaka_Maizono',note:'核对舞园礼物偏好。'},
  {id:'format',title:'muxira / dr1-psp2pc · 存档格式研究',url:'https://github.com/muxira/dr1-psp2pc/blob/main/docs/FORMAT.md',note:'容器结构与 core 校验；礼物 001–100 已用开发者个人存档及游戏内数量逐项对照。'},
  {id:'sprites',title:'Danganronpa Wiki · Sprite Gallery',url:'https://danganronpa.fandom.com/wiki/Category:Sprite_Galleries',note:'角色立绘与学院模式像素头像；下载后的文件及原始 URL 记录在 assets/SOURCES.json。图像权利归原权利人。'},
  {id:'gift-names-en',title:'Danganronpa Wiki · MonoMono Machine / Danganronpa 1',url:'https://danganronpa.fandom.com/wiki/MonoMono_Machine/Danganronpa_1',note:'英语礼物名称对照；只补充显示名称，不更改原有礼物编号与偏好。'},
  {id:'gift-names-ja',title:'GameLine · プレゼント一覧',url:'https://gameline.jp/danganronpa/present/',note:'日语礼物名称与学院模式纪念品 101–114 名称对照。'},
  ...guideSources
];
export const sourceGroups = [
 {id:'walkthroughs',title:'流程攻略',ids:sources.filter(s=>!['presents','altema','prefs','choices','kyoko','sayaka','format','sprites','gift-names-en','gift-names-ja'].includes(s.id)).map(s=>s.id)},
 {id:'gifts',title:'礼物数据',ids:['presents','altema','prefs','choices','kyoko','sayaka','gift-names-en','gift-names-ja']},
 {id:'artwork',title:'角色与界面素材',ids:['sprites']},
 {id:'saves',title:'存档研究',ids:['format']}
];
export const articles = [
 ...storyArticles,
 {id:'collections',chapter:null,title:'特殊礼物与限时事件',kind:'隐藏收集',sources:['presents','gallery','tt-ch3'],intro:'按触发时点准备道具。位置与获取条件采用文字说明。',sections:[
 ['第 3 章 · 大浴场额外场景',['在第 3 章日常、大浴场电脑剧情之后的浴场场景前，背包中持有 091 男人的浪漫（A Man’s Fantasy）。建议第 2 章结束前就从扭蛋机备好，避免推进后错过。','随主线调查更衣室、电脑和浴场门，满足持有条件时触发额外场景。错过后可通过章节选择重玩第三章日常，并使用保留有该道具的游戏记录。']],
 ['第 5 章 · 分支鉴赏内容',['裁判末尾追究雾切的谎言可进入坏结局并解锁对应影片；看完后返回选择，不追究即可继续主线。具体论破顺序见第五章裁判后半场。']],
 ['通关后 · 追加影片与纪念品',['092 逃脱按钮：通关后从扭蛋机取得，对应追加影片；获取后到鉴赏室查看。','093–100 依次对应序章、六个章节和尾声的完成纪念品；101–114 对应学院模式的角色结局纪念。']]
 ]},
 {id:'trial-help',chapter:null,title:'裁判操作与查阅说明',kind:'玩法说明',sources:['trial-mechanics'],intro:'先按当前游戏阶段找到对应步骤；本页不提前列出案件答案。',sections:[
 ['怎么看步骤',['论破：选择前面的言弹，击中后面所述含义的弱点。选择：回答普通选择题。出示：从证据列表提交指定物件。','记忆：对准指定发言，长按游戏当前设置的记忆操作，把它转成临时言弹；之后再击中目标发言。这和在原有言弹列表中切换证据不同。','字谜：拼出答案所对应的字词；英文字母提示仅用于英文版，不要在中文版里寻找同样的字母。']],
 ['操作卡住时',['先确认正在玩前半场还是后半场，再按当前发言的含义定位。各语言对同一证据的译名可能不同，可以核对物件与言弹说明。','简单难度可能减少候选言弹或字谜操作。出现记忆发言的步骤时，先记忆再射击；不必强行使用手上不相干的证据。','机关枪论战按游戏提示的节奏锁定、击破并装填；攻略中的终击表示最后提交的证据。按键以 Steam PC 当前设置为准。']],
 ['章节与漫画',['每章裁判按休庭分成前后两页。点击对应页面显示整个半场内容，不需要逐条解锁；页内目录只负责跳转位置。','高潮推理按漫画空白格的阅读顺序列出图像特征，只填写空白格，跳过已有画面。第五章没有该环节。','页面会保留阅读位置。页内目录与返回顶部不会跳到别的攻略，也不会更改背包记录。']]
 ]},
 {id:'gifting',chapter:null,title:'礼物偏好与赠送',kind:'玩法说明',sources:['prefs','presents'],intro:'先选角色查偏好，再对照自己的数量。',sections:[['查找合适的礼物',['在通讯录选择角色，“非常喜欢”优先于“喜欢”；“只看持有”仅显示你已经记录数量大于零的物品。未录入并不代表没有。','点击礼物名称可查看获取方式；礼物详情也能反查喜欢它的角色。']],['记录实际赠送',['在游戏实际送出后，点击本站“记为已赠送”，只扣除一件礼物。数量为零或未录入时不可扣除。','赠礼仅更新浏览器中的背包数量。重新导入存档时，确认后以所选记录覆盖礼物数量。']]]}
];
