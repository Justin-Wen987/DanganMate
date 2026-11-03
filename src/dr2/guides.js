// Independently organized guide copy. Each entry is Chinese / English / Japanese.
export const translations={en:{},ja:{}};
export function copy(zh,en,ja){
 translations.en[zh]=en;translations.ja[zh]=ja;
 if(zh.includes('｜'))for(const [i,key] of zh.split('｜',2).entries()){
  translations.en[key]=en.split('｜',2)[i];translations.ja[key]=ja.split('｜',2)[i];
 }
 return zh;
}
export const articles=[];
const main='主线流程',trial='学级裁判';
function add(id,chapter,part,title,intro,sections,sourcePages=[],kind=part||id.startsWith('trial-')?trial:main){
 articles.push({id,chapter,...(part?{part,related:`trial-${chapter}${part===1?'-2':''}`} :{}),title:copy(...title),intro:copy(...intro),kind,sources:[...sourcePages.map(n=>'dr2-gs-'+n),...(kind===trial?['dr2-trials',`dr2-gl-trial-${chapter}`]:[])],sections:sections.map(([heading,steps])=>[copy(...heading),steps.map(row=>copy(...row))])});
}
const intro=[
 '本页直接显示该章节剧情。按顺序核对物件、发言含义与选择；蓝色弱点需要赞同，反论使用言刃。字谜按游戏当前语言作答，难度可能减少部分步骤。',
 'This page reveals this chapter’s story. Follow objects, statement meanings and choices in order. Agree with blue weak points; use Truth Blades in Rebuttal Showdowns. Solve word puzzles in your game language; difficulty can change some steps.',
 'このページには本章の展開を記載する。物、発言の意味、選択を順に照合する。青い弱点は賛成、反論ショーダウンはコトノハを使う。文字問題はプレイ言語に合わせ、難度による省略にも注意。'
];
const storyIntro=['日常与搜查按地点顺序整理；搜查部分包含本章案件。隐藏黑白熊另有按章位置清单。','Daily life and investigations are organized by location. Investigation sections reveal the current case. Hidden Monokumas have a separate chapter checklist.','日常と捜査を場所順に整理。捜査部分には本章の事件を記載する。カクレモノクマは章別一覧を参照。'];
function story(ch,sections,pages){add('chapter-'+ch,ch,null,[`第 ${ch} 章 · ${ch===6?'最终搜查':'日常与搜查'}`,`Chapter ${ch} · ${ch===6?'Final investigation':'Daily life and investigation'}`,`第${ch}章 · ${ch===6?'最終捜査':'日常編と捜査編'}`],storyIntro,sections,pages);}
function court(ch,part,sections,pages){add(`trial-${ch}${part===2?'-2':''}`,ch,part,[`第 ${ch} 章 · 学级裁判${part===1?'前半场':part===2?'后半场':''}`,`Chapter ${ch} · Class Trial${part?', Part '+part:''}`,`第${ch}章 · 学級裁判${part===1?'前半':part===2?'後半':''}`],intro,sections,pages);}

add('prologue',0,null,['序章 · 贾巴沃克岛','Prologue · Jabberwock Island','序章 · ジャバウォック島'],['先完成同学介绍，再跟随广播集合；本页不涉及后续案件。','Meet your classmates, then follow the assembly announcements. This page does not reveal later cases.','同級生の紹介を終え、放送に従って集合する。後の事件には触れない。'],[
 [['沙滩与第一座岛','Beach and the first island','砂浜と1番目の島'],[
  ['在沙滩调查显示器、摄像机和棕榈树，与狛枝对话，领取电子学生手册。','Inspect the monitor, camera and palms on the beach; talk to Nagito and receive the e-Handbook.','砂浜のモニター、カメラ、ヤシを調べ、狛枝と話して電子生徒手帳を受け取る。'],
  ['依次探索机场、火箭飞拳超市、酒店和牧场。与每位同学对话；酒店需要检查泳池、大堂和二楼餐厅，留意可能被场景遮住的终里。','Visit the airport, Rocketpunch Market, hotel and ranch, speaking to every classmate. Check the pool, lobby and upstairs restaurant; Akane can be obscured by scenery.','空港、ロケットパンチマーケット、ホテル、牧場で全員と話す。プール、ロビー、2階レストランも確認し、背景に隠れやすい終里を見落とさない。']
 ]],
 [['中央岛与集合','Central island and assembly','中央の島と集合'],[
  ['过桥到中央岛的贾巴沃克公园，与十神和狛枝交谈。广播后返回沙滩，把仍在场同学的对话补齐。','Cross to Jabberwock Park and speak to Byakuya and Nagito. Return to the beach when summoned and finish the remaining conversations.','橋を渡ってジャバウォック公園で十神、狛枝と話す。放送後は砂浜へ戻り、残っている人物との会話を終える。'],
  ['新广播后去公园，继续兔美与黑白熊的剧情。完成序章获得 133 折断的魔杖，随后进入第一章。','Return to the park for the new announcement and continue the Usami/Monokuma events. Clearing the prologue awards present 133, the broken wand, before Chapter 1.','新たな放送で公園へ行き、ウサミとモノクマのイベントを進める。序章クリアで133の折れたステッキを入手し、第1章へ。']
 ]]
],[3]);

story(1,[
 [['日常 · 旧馆派对','Daily life · Old-building party','日常編 · 旧館のパーティー'],[
  ['回小屋后寻找黑白熊，完成隐藏收集的教学。按酒店餐厅、公园与自由行动推进；派对前与十神等人确认安排。','Complete the hidden-Monokuma tutorial in your cottage. Follow restaurant meetings, park events and Free Time; check the party arrangements with Byakuya.','コテージでカクレモノクマの説明を受ける。レストラン、公園、自由行動を進め、パーティーの準備を十神らに確認する。'],
  ['进入酒店旧馆，检查大厅、厨房、事务室、仓库和厕所附近，逐一交谈。停电后检查桌下，正式搜查开始。','Explore the old building’s hall, kitchen, office, storage room and restroom area; talk to everyone. After the blackout, inspect beneath the table to begin the investigation.','旧館のホール、厨房、事務室、倉庫、トイレ付近を調べて全員と話す。停電後、テーブルの下を調べて捜査開始。']
 ]],
 [['搜查 · 旧馆内部','Investigation · Inside the old building','捜査編 · 旧館内部'],[
  ['桌下调查尸体、刀子、荧光标记、夜视镜和血迹；检查地板缝隙、大箱子、空调定时器，听取罪木和田中的说明。','Inspect the body, knife, glowing marks, night-vision goggles and blood beneath the table. Check floor gaps, the case and A/C timer; hear Mikan and Gundham’s explanations.','遺体、ナイフ、発光する印、暗視ゴーグル、血痕を調べる。床の隙間、ケース、エアコンのタイマーを確認し、罪木と田中に聞く。'],
  ['走廊问澪田与索尼娅，核对听到的声音和防火门。厨房调查派对菜肴、设备清单，向花村问话。','Question Ibuki and Sonia about the sounds and fire door. In the kitchen, inspect the party dishes and equipment list and speak to Teruteru.','廊下で澪田とソニアから声と防火扉を聞く。厨房の料理、設備リストを調べ、花村に話す。'],
  ['仓库调查三台熨斗、桌布和箱子；事务室检查断路器、空调定时器，再向边古山和左右田询问。','Inspect the three irons, tablecloth and boxes in storage. Check the office breaker and A/C timer, then question Peko and Kazuichi.','倉庫の3台のアイロン、テーブルクロス、箱を調べる。事務室のブレーカーとタイマーを確認し、辺古山と左右田に聞く。']
 ]],
 [['搜查 · 证言与恐吓信','Investigation · Accounts and threat','捜査編 · 証言と脅迫状'],[
  ['旧馆外向七海取得证言。进入十神小屋调查恐吓信，顺便检查本章限时黑白熊位置。','Get Chiaki’s account outside. Inspect the threatening letter in Byakuya’s cottage, checking its time-limited Hidden Monokuma as well.','旧館の外で七海の証言を得る。十神のコテージで脅迫状を調べ、期間限定のカクレモノクマも確認する。'],
  ['回旧馆向贰大取得厕所相关证言，向罪木取得验尸结果。线索齐全后去中央岛的黑白熊岩进入裁判。','Return for Nekomaru’s restroom account and Mikan’s autopsy results. Once all clues are complete, enter the trial through Monokuma Rock on the central island.','旧館で弐大のトイレの証言と罪木の検死結果を得る。手掛かりをそろえ、中央の島のモノクマロックから裁判へ。']
 ]]
],[4,5,6]);

story(2,[
 [['日常 · 第二座岛与游戏','Daily life · Second island and game','日常編 · 2番目の島とゲーム'],[
  ['探索废墟、药店、餐馆、沙滩小屋和图书馆；图书馆与索尼娅对话两次后跟随七海调查废墟入口。','Explore the ruins, drugstore, diner, beach house and library. Talk to Sonia twice in the library, then follow Chiaki to the ruins entrance.','遺跡、ドラッグストア、ダイナー、ビーチハウス、図書館を探索。図書館でソニアに2回話し、七海と遺跡入口を確認する。'],
  ['按集合与自由行动推进，给旧馆中被绑的狛枝送食物。夜间与七海到公园体验“黄昏症候群杀人事件”。','Continue meetings and Free Time, deliver food to the restrained Nagito, then play Twilight Syndrome Murder Case with Chiaki at night.','集合と自由行動を進め、旧館で縛られた狛枝に食事を届ける。夜は七海と公園でトワイライトシンドローム殺人事件を遊ぶ。'],
  ['与左右田在超市、餐馆集合后去沙滩，沿小屋入口与剧情进入案件。小游戏出现失败提示时记下向下五次的隐藏输入。','Meet Kazuichi at the market and diner, then visit the beach house for the incident. Note the minigame’s hidden five-down input after its failure prompt.','マーケットとダイナーで左右田と合流し、ビーチハウスの事件へ。ミニゲームの失敗表示で下を5回入力する操作を覚えておく。']
 ]],
 [['搜查 · 沙滩小屋','Investigation · Beach house','捜査編 · ビーチハウス'],[
  ['检查尸体、面具、金属球棒、垃圾桶与冰箱。进入淋浴间检查停水情况和小窗，再调查壁橱内的黄色软糖。','Inspect the body, mask, metal bat, trash can and refrigerator. Check the shower’s water supply and small window, then the yellow gummy in the closet.','遺体、仮面、金属バット、ゴミ箱、冷蔵庫を調べる。シャワーの断水と小窓、クローゼットの黄色いグミを確認する。'],
  ['与七海核对沙滩脚印。返回公园，在小游戏开头按下五次，调查二楼音乐室的尸体、碎窗与花瓶，完成真相路线取得通关奖励。','Check beach footprints with Chiaki. Replay the game using five down inputs at the start; inspect the upstairs music-room body, window and vase to obtain the Ending Prize.','七海と砂浜の足跡を照合。ゲーム開始時に下を5回入力し、2階音楽室の遺体、割れた窓と花瓶を調べ、クリア特典を得る。']
 ]],
 [['搜查 · 照片与信','Investigation · Photos and letters','捜査編 · 写真と手紙'],[
  ['与机场众人对话，再进入小泉小屋检查床上的照片；本章小屋黑白熊位于电视后方。','Speak to the group at the airport, then inspect the photos on Mahiru’s bed. Her cottage’s Hidden Monokuma is behind the television.','空港で全員と話し、小泉のコテージの写真を調べる。カクレモノクマはテレビの後ろ。'],
  ['回沙滩小屋向罪木取得验尸报告和小泉的信，向狛枝核对脚印、软糖包装袋和另一封信的差异，最后去黑白熊岩。','Return for Mikan’s autopsy report and Mahiru’s letter. Compare footprints, gummy packaging and the letters with Nagito, then go to Monokuma Rock.','ビーチハウスで罪木の検死結果と小泉の手紙を得る。狛枝と足跡、グミ袋、手紙の違いを確認してモノクマロックへ。']
 ]]
],[8,9,10,11]);

story(3,[
 [['日常 · 第三座岛','Daily life · Third island','日常編 · 3番目の島'],[
  ['在餐厅确认小泉纪念台，再探索电器街、电影院、汽车旅馆、医院和音乐会场；与各地同学对话，医院进入九头龙所在病房。','Check Mahiru’s memorial in the restaurant, then explore Electric Ave, the theater, motel, hospital and music venue. Speak to everyone and visit Fuyuhiko’s ward.','レストランの小泉の祭壇を確認。電気街、映画館、モーテル、病院、ライブハウスを回り、全員と話して九頭龍の病室へ。'],
  ['按医院探望、自由行动、音乐会场聚会推进。绝望病发生后，区分住院组与旅馆隔离组，完成监视设备和病房对话。','Continue hospital visits, Free Time and the music-venue gathering. After Despair Disease appears, distinguish the hospital and motel groups; complete surveillance and ward conversations.','見舞い、自由行動、ライブハウスの集まりを進める。絶望病後は病院側とモーテル側を区別し、監視装置と病室の会話を終える。']
 ]],
 [['搜查 · 音乐会场','Investigation · Music venue','捜査編 · ライブハウス'],[
  ['看到监视画面后前往音乐会场，按剧情破门。检查两具尸体、柱子与壁纸、灯架、绳子、梯子、蜡烛、舞台幕布、地板污迹和半透明物。','After the surveillance video, go to the venue and force entry. Inspect both bodies, pillar and wallpaper, lighting baton, rope, stepladder, candle, curtain, floor smudge and translucent glob.','監視映像後にライブハウスへ行き、扉を破る。2体の遺体、柱と壁紙、照明、ロープ、脚立、ろうそく、幕、床の汚れ、半透明の塊を調べる。'],
  ['检查鞋底血迹并听取验尸、目击与不在场证明；留意现场第一次与再次进入时的变化，不要先假定监视画面就是音乐会场。','Check blood on the soles and collect autopsy, witness and alibi accounts. Compare your first and second entries; do not assume the video was filmed at the venue.','靴底の血と検死・目撃・アリバイを確認。最初と再入場時の変化を比べ、映像の撮影場所を先にライブハウスと決めつけない。']
 ]],
 [['搜查 · 医院、旅馆与电影','Investigation · Hospital, motel and movie','捜査編 · 病院・モーテル・映画'],[
  ['医院检查监控设备、会议室和帘子等可布置场景的位置；与罪木、终里和九头龙核对探病时间。','Inspect the hospital surveillance equipment and conference-room setup. Check visiting times with Mikan, Akane and Fuyuhiko.','病院の監視装置と会議室の配置を調べ、罪木、終里、九頭龍に見舞いの時刻を聞く。'],
  ['汽车旅馆调查西园寺房间、钥匙与镜子相关情况，并向索尼娅询问。到电影院确认电影内容、邀请券和特典袋，再补齐音乐会场线索去裁判。','Inspect Hiyoko’s motel room, key and mirror circumstances; question Sonia. Check the movie, invitation ticket and bonus bag at the theater, then finish the venue clues before the trial.','西園寺の部屋、鍵、鏡の事情を調べ、ソニアに聞く。映画の内容、招待券、特典袋を確認し、ライブハウスの証拠を補って裁判へ。']
 ]]
],[14,15,16,17,18,19]);

story(4,[
 [['日常 · 游乐园与惊奇屋','Daily life · Amusement park and Funhouse','日常編 · 遊園地とドッキリハウス'],[
  ['探索第四座岛的老鼠城堡、恐怖屋、过山车和惊奇屋。进入惊奇屋后，记清草莓之家与葡萄之家的楼层、房型、电梯和塔门。','Explore the fourth island’s castle, horror house, rollercoaster and Funhouse. Inside, note Strawberry/Grape House floors, room types, elevator and tower doors.','4番目の島の城、ホラーハウス、ジェットコースター、ドッキリハウスを探索。入館後はイチゴ・マスカットハウスの階、部屋、エレベーター、塔の扉を覚える。'],
  ['跟随食堂集合、断粮和太极活动推进。所有人分组住宿后，按提示寻找缺席的贰大并进入葡萄塔。','Follow gatherings, food deprivation and Tai Chi events. After the room assignments, search for the absent Nekomaru and enter Grape Tower.','集合、食料不足、太極拳のイベントを進める。宿泊先が決まったら、不在の弐大を探してマスカットタワーへ。']
 ]],
 [['搜查 · 葡萄塔','Investigation · Grape Tower','捜査編 · マスカットタワー'],[
  ['调查机器身体、头胸部、油迹、倒下的柱子及碎片、铁锤、铁丝和地上的门把。向在场同学核对声音、时间和门锁状态。','Inspect the robotic body, head/chest, oil, fallen pillar and fragments, hammer, wire and loose doorknob. Ask everyone about sounds, times and door locks.','機械の遺体、頭と胸、油、倒れた柱と破片、ハンマー、ワイヤー、ドアノブを調べる。音、時刻、扉の状態を全員に聞く。'],
  ['电梯与塔之间的路线要实际走过；取得左右田的调查结果前，先把可调查物和证言补齐。不要把两座塔相似的内装当作结论。','Walk the elevator/tower routes and complete all available checks before Kazuichi’s results. Similar interiors alone do not establish how the towers connect.','エレベーターと塔の経路を実際に通り、左右田の調査結果を待つ前に物と証言をそろえる。内装が似ているだけで構造を断定しない。']
 ]],
 [['狛枝视角 · 最终死亡之屋','Nagito’s route · Final Dead Room','狛枝視点 · ファイナルデッドルーム'],[
  ['切换狛枝后，检查草莓之家电梯、塔门按钮、时钟与九头龙的证言，进入最终死亡之屋。完整解谜另见本章的密室逃脱说明。','As Nagito, inspect the Strawberry House elevator, tower-door button and clock, and hear Fuyuhiko’s account. Enter the Final Dead Room; its puzzle has a separate guide.','狛枝視点でイチゴハウスのエレベーター、塔のボタン、時計、九頭龍の証言を確認。ファイナルデッドルームへ進む。脱出手順は専用ページを参照。'],
  ['脱出后检查八角屋窗外和室内设备，完成剧情再切回日向。向狛枝接收调查资料，向左右田取得修理、闹钟和电波钟结果。','After escaping, inspect the Octagon window and equipment. Return to Hajime, receive Nagito’s findings and Kazuichi’s repair, alarm and radio-clock results.','脱出後はオクタゴンの窓と設備を調べる。日向へ戻り、狛枝の資料と左右田の修理・アラーム・電波時計の結果を受け取る。'],
  ['重返草莓塔，与九头龙交谈并检查葡萄门、门把和锁链，更新“塔中的违和感”等证据后进入裁判。','Revisit Strawberry Tower; question Fuyuhiko and check the Grape door, knob and chain. Update the tower-discrepancy evidence before starting the trial.','イチゴタワーで九頭龍に話し、マスカット側の扉、ドアノブ、鎖を調べる。塔の違和感などを更新して裁判へ。']
 ]]
],[22,23,24,25]);

story(5,[
 [['日常 · 第五座岛','Daily life · Fifth island','日常編 · 5番目の島'],[
  ['探索海王工业、军事基地、黑白熊工厂、仓库和小吃街；工厂的输送带、电脑、卡车、纸板与休息室都要留意。','Explore Sea King Industries, the military base, factory, warehouse and food street. Note the conveyor, laptop, truck, panels and factory break room.','シーキングインダストリー、軍事施設、工場、倉庫、屋台街を探索。ベルトコンベア、パソコン、トラック、パネル、休憩室を確認しておく。'],
  ['跟随狛枝的炸弹事件到第四座岛复查恐怖屋、老鼠城堡与过山车，再与七海、索尼娅等人汇合，回工厂检查电脑。','Follow Nagito’s bomb incident through the fourth island’s horror house, castle and rollercoaster. Meet Chiaki and Sonia, then recheck the factory laptop.','狛枝の爆弾事件で4番目の島のホラーハウス、城、コースターを再確認。七海とソニアらに会い、工場のパソコンを調べる。'],
  ['仓库起火后，从工厂休息室取灭火弹参与救火。洒水装置启动后进入仓库，按剧情发现尸体。','When the warehouse catches fire, take fire grenades from the break room. Enter after the sprinklers activate and continue to the body discovery.','倉庫の火災では休憩室から消火弾を取り、消火に参加。スプリンクラー作動後に倉庫へ入り、遺体発見を進める。']
 ]],
 [['搜查 · 尸体、火灾与入口','Investigation · Body, fire and entrance','捜査編 · 遺体・火災・入口'],[
  ['尸体调查伤口、长矛、胶带、燃烧的绳子、求生刀及左手血迹；分别记录右臂绳索与右袖情况。','Inspect wounds, spear, duct tape, burnt rope, survival knife and left-hand blood. Distinguish the right-arm rope from the sleeve’s condition.','傷、槍、ガムテープ、燃えたロープ、サバイバルナイフ、左手の血を調べる。右腕のロープと袖の状態を区別する。'],
  ['检查梁上的血迹、黑白熊玩偶、打火机、灭火弹、入口纸板和 MP3 播放器，并听索尼娅的证言。','Check girder blood, Monokuma plush, lighter, fire grenades, doorway panels and MP3 player. Hear Sonia’s account.','梁の血痕、モノクマぬいぐるみ、ライター、消火弾、入口のパネル、MP3プレーヤーを調べ、ソニアの証言を聞く。']
 ]],
 [['搜查 · 毒药与狛枝小屋','Investigation · Poison and Nagito’s cottage','捜査編 · 毒薬と狛枝のコテージ'],[
  ['军事基地检查卡车，工厂电脑前向索尼娅补问，取得黑白熊证言；老鼠城堡确认长矛来源。','Check the military trucks, question Sonia again by the factory computer for Monokuma’s account, and inspect the spear’s origin at the castle.','軍事施設のトラック、工場パソコン前のソニアを再確認してモノクマの証言を得る。城では槍の出所を調べる。'],
  ['与七海进入狛枝小屋，检查宝箱里的兔美日记、床上的防毒面具与手套、蓝纸、冰箱的毒药和书架的学园档案，随后去裁判。','Enter Nagito’s cottage with Chiaki. Inspect Monomi’s notebook in the chest, gas mask/gloves, blue paper, refrigerator poison and academy file, then proceed to trial.','七海と狛枝のコテージへ。宝箱のモノミの日記、ガスマスクと手袋、青い紙、冷蔵庫の毒薬、学園資料を確認して裁判へ。']
 ]]
],[29,30,31,32]);

story(6,[
 [['崩坏的学园 · 五楼','Corrupted academy · Fifth floor','崩壊した学園 · 5階'],[
  ['醒来先检查教室和体育馆；随场景变化进入五楼武道场、5-A 教室和生物室，读取预备学科、学园惨案与史上最大最恶事件的资料。','Inspect the classroom and gym, then follow the changing scenery to the dojo, classroom 5-A and bio lab. Read the Reserve Course, academy tragedy and Tragedy files.','教室と体育館を確認し、変化する学園の武道場、5-A教室、生物室へ。予備学科、学園の事件、史上最大最悪の事件の資料を読む。'],
  ['5-B 教室与黑白熊、九头龙对话，更新学园生活与绝望相关言弹。本章五只隐藏黑白熊需在各地点尚可进入时收集。','Talk to Monokuma and Fuyuhiko in 5-B to update school-life and despair evidence. Collect this chapter’s five Hidden Monokumas while each location remains accessible.','5-Bでモノクマと九頭龍に話し、学園生活と絶望のコトダマを更新。各場所に入れるうちに本章のカクレモノクマ5体を集める。']
 ]],
 [['资料 · 音乐室、职员室与娱乐室','Files · Music, faculty and recreation rooms','資料 · 音楽室・職員室・娯楽室'],[
  ['音乐室读取石碑和绿色终端；职员室检查终端、参与者名单和学园创始者画像。','Read the music-room monument and green terminal. In the faculty room, inspect the terminal, participant list and academy founder’s portrait.','音楽室の石碑と緑の端末を読む。職員室では端末、被験者リスト、創立者の肖像を調べる。'],
  ['娱乐室调查棋桌文件与终端，取得希望培育计划并更新绝望残党资料；图书馆读取苗木诚的邮件。','Inspect the recreation-room board-game table and terminal for the Hope Cultivation Plan and updated Remnants information. Read Makoto’s email in the library.','娯楽室のゲーム台の資料と端末で希望育成計画、絶望の残党を確認。図書室で苗木へのメールを読む。']
 ]],
 [['程序与最终裁判','Program and final trial','プログラムと最終裁判'],[
  ['进入标作 2-B 的房间后实际到达洗衣房，读取桌上平板的新世界程序。','The room marked 2-B leads to the laundry. Read the Neo World Program information on its tablet.','2-Bと表示された部屋はランドリーにつながる。机のタブレットで新世界プログラムを読む。'],
  ['回 1-A 教室调查黑色柱状物，取得观察者、11037 和强制关机程序，补齐资料后从红门进入最后的裁判。','Inspect the black pillar in 1-A for the Observer, 11037 and Shutdown Sequence evidence. Enter the red door once the files are complete.','1-Aの黒い柱を調べ、観測者、11037、強制シャットダウンのコトダマを得る。資料をそろえて赤い扉から最後の裁判へ。']
 ]]
],[36]);

court(1,1,[
 [['桌下与刀子','Under the table and the knife','テーブルの下とナイフ'],[
  ['论破｜桌下的血迹 → 尸体被移动到桌下的推断；随后出示刀子。','Refute｜Bloodstain Under the Table → the claim that the body was moved there. Then present the Knife.','論破｜テーブル下の血痕 → 遺体をそこへ動かしたという推測。続いてナイフを提示。'],
  ['论破｜夜视镜 → 十神也无法在黑暗中看见的说法；对小泉的反论用硬铝箱，指出不是把刀带进现场。','Refute｜Night-vision Goggles → the claim that Byakuya also could not see. In Mahiru’s Showdown use Duralumin Case against bringing the knife into the scene.','論破｜暗視ゴーグル → 十神も暗闇で見えないという発言。小泉への反論はジュラルミンケースで持ち込みの主張を斬る。'],
  ['选择｜刀子固定在桌下靠胶带；出示恐吓信，定位刀子的方法选荧光涂料。','Choose｜Duct tape secured the knife. Present Murder Threat; choose glowing paint for locating it.','選択｜ナイフの固定はガムテープ。脅迫状を提示し、場所を知る方法は蛍光塗料。']
 ]],
 [['停电与狛枝的准备','Blackout and Nagito’s preparations','停電と狛枝の準備'],[
  ['赞同｜贰大的证言 → 停电之前；派对的菜肴论破下泻药的猜测；仓库的熨斗赞同用电超负荷。','Agree｜Nekomaru’s Account → the period before the blackout. Refute laxatives with Party Dishes; agree with a power surge using Irons in Storage Room.','賛成｜弐大の証言 → 停電前。料理で下剤説を論破し、倉庫のアイロンで電力超過に賛成。'],
  ['反论｜对贰大使用空调定时器，说明停电触发时点。指选台灯，接着选电源线作为黑暗中的引导。','Showdown｜Use A/C Timer against Nekomaru to explain the timing. Select the desk lamp, then its power cord as the guide in darkness.','反論｜弐大にはエアコンのタイマー。暗闇の移動手段は電気スタンド、続いて電源コード。'],
  ['指认｜狛枝凪斗；藏刀时机选清扫时，利用的才能选幸运。再用罪木的验尸结果反驳藏起来的刀就是凶器，出示澪田的证言，前半场结束。','Identify｜Nagito Komaeda. Choose the cleaning period and his luck. Use Mikan’s Autopsy Results against the hidden knife as murder weapon, then present Ibuki’s Account. Part 1 ends.','指名｜狛枝凪斗。隠した時期は掃除中、才能は幸運。罪木の検死結果で隠したナイフが凶器という説を論破し、澪田の証言を提示。前半終了。']
 ]]
],[7]);
court(1,2,[
 [['床下路线','Route beneath the floor','床下の経路'],[
  ['选择｜狛枝身上没有血；出示仓库的桌布说明挡血，字谜答案为地板下面（UNDER THE FLOOR），知道入口的人选田中。','Choose｜Nagito has no blood on him. Present Storage Room Tablecloth; solve UNDER THE FLOOR and choose Gundham as knowing the entrance.','選択｜狛枝に血が付いていない。倉庫のテーブルクロスを提示し、アナグラムは床下。入口を知る人物は田中。'],
  ['论破｜七海的证言 → 没有不在场证明；赞同厨房设备清单 → 使用灯火；对狛枝的反论使用防火门，否定左右田会看见灯光。','Refute｜Chiaki’s Account → lacking an alibi. Agree with a light source using Kitchen Equipment List; counter Nagito with Fire Door to explain why Kazuichi saw no light.','論破｜七海の証言 → アリバイがないという発言。厨房設備リストで明かりに賛成。狛枝への反論は防火扉で、左右田に光が見えない理由を示す。']
 ]],
 [['凶器与行凶者','Weapon and killer','凶器と実行犯'],[
  ['指认｜花村辉辉。出示刀子说明目标标记；地板缝隙论破他一直在餐厅的说法，随后出示罪木摔倒的姿势。','Identify｜Teruteru Hanamura. Present the Knife as the target mark; use Gaps in Floorboard against his dining-hall claim, then present Mikan’s embarrassing pose.','指名｜花村輝々。目印はナイフ。床板の隙間で食堂にいたという発言を論破し、罪木の恥ずかしい姿を提示。'],
  ['字谜｜铁串（IRON SKEWER）；机关枪论战终击排列为带骨肉（MEAT ON THE BONE）。','Gambit｜IRON SKEWER. Finish Panic Talk Action with MEAT ON THE BONE.','アナグラム｜鉄串。パニックトークアクションのトドメは骨付き肉。']
 ]],
 [['高潮推理 · 空白格顺序','Closing Argument · Blank-panel order','クライマックス推理 · 空欄の順番'],[
  ['漫画｜①七海守门；②启动的熨斗；③空调定时器；④空调启动；⑤十神戴夜视镜；⑥狛枝掀桌布。','Comic｜① Chiaki guarding the entrance; ② operating irons; ③ A/C timer; ④ A/C activating; ⑤ Byakuya’s goggles; ⑥ Nagito lifting the cloth.','漫画｜①入口の七海、②動くアイロン、③エアコンのタイマー、④エアコン作動、⑤ゴーグルを着ける十神、⑥布をめくる狛枝。'],
  ['漫画｜⑦点燃的便携炉；⑧肉；⑨犯人从门缝查看；⑩取桌布；⑪伸手拿带胶带的刀；⑫澪田。只填空格，略过已有画面。','Comic｜⑦ Lit portable stove; ⑧ meat; ⑨ culprit peeking through the door; ⑩ taking the cloth; ⑪ reaching for the taped knife; ⑫ Ibuki. Fill blanks only.','漫画｜⑦火の付いたコンロ、⑧肉、⑨隙間から見る犯人、⑩布を取る、⑪テープ付きナイフを取る手、⑫澪田。既存の絵は飛ばす。']
 ]]
],[7]);

court(2,1,[
 [['黄昏症候群的人物','Twilight Syndrome’s characters','トワイライトの登場人物'],[
  ['选择｜女生 A＝罪木，提出关键话语的是女生 B，女生 C＝澪田，女生 D＝小泉，男生 F＝九头龙。','Choose｜Girl A is Mikan; Girl B made the relevant remark; Girl C is Ibuki, Girl D is Mahiru and Guy F is Fuyuhiko.','選択｜女子Aは罪木、該当の発言は女子B、女子Cは澪田、女子Dは小泉、男子Fは九頭龍。'],
  ['选择｜九头龙姓氏出现两次因为有妹妹；妹妹是最初遇害的女高中生。女生 E 被杀的原因选她曾经杀人。','Choose｜The surname repeats because Fuyuhiko had a sister, the girl killed at the beginning. Girl E was killed because she had been the murderer.','選択｜名字が2回出るのは妹がいるため。妹は最初に死亡した女子高生。女子Eが殺された理由は彼女が犯人だったこと。'],
  ['论破｜碎花瓶照片 → 砸窗声；偷走的学校泳衣 → 用碎石殴打。女生 E 的凶手选男生 F，再出示金属球棒。','Refute｜Broken Vase Photo → the window-breaking sound. Stolen School Swimsuit → beating with gravel. Choose Guy F as Girl E’s killer, then present Metal Bat.','論破｜割れた花瓶の写真 → 窓の音。盗まれたスクール水着 → 砂利で殴る説。女子Eの犯人は男子F、続いて金属バットを提示。']
 ]],
 [['西园寺与两封信','Hiyoko and the two letters','西園寺と2通の手紙'],[
  ['论破｜沙滩脚印 → 没去过小屋；小泉的信 → 只是晨间散步。西园寺躲藏位置指选壁橱。','Refute｜Footprints on the Beach → denying a visit. Letter on Mahiru → only a morning walk. Select the closet as Hiyoko’s hiding place.','論破｜砂浜の足跡 → 行っていないという発言。小泉の手紙 → 朝の散歩。西園寺の隠れ場所はクローゼット。'],
  ['论破｜软糖袋 → 西园寺掉落黄色软糖；罪木验尸报告 → 被害者最后挣扎的推断。','Refute｜Gummy Bag → Hiyoko dropping the yellow gummy. Mikan’s Autopsy Report → the victim’s supposed final struggle.','論破｜グミの袋 → 西園寺が黄色いグミを落とした説。罪木の検死結果 → 被害者の最期の抵抗。'],
  ['反论｜对九头龙用淋浴间，否定洗掉血迹。选择西园寺无法自行穿衣；出示小泉的信与另一封比较，选择两封都被伪造，前半场结束。','Showdown｜Use Shower Room against Fuyuhiko. Choose Hiyoko cannot dress herself; compare Letter on Mahiru with the other letter and choose both were forged. Part 1 ends.','反論｜九頭龍にはシャワールーム。西園寺は自分で着付けできないを選び、小泉の手紙と比較。偽造は両方の手紙。前半終了。']
 ]]
],[12]);
court(2,2,[
 [['藏身与清洗','Hiding and cleaning','隠れ場所と洗浄'],[
  ['深潜｜到达时间：西园寺之前；离开时间：西园寺之后；藏身处：沙滩小屋。指选壁橱，再选里面的冲浪板盒。','Dive｜Arrival: before Hiyoko. Departure: after Hiyoko. Hiding place: beach house. Select the closet and then its surfboard case.','ダイブ｜到着は西園寺より前、退出は西園寺より後、隠れた場所はビーチハウス。クローゼット、続いてサーフボードケースを選ぶ。'],
  ['记忆｜吸收七海所说的淋浴以外的方法，击中不可能洗净的说法；清洗来源选冰箱内的饮料。','Memorize｜Absorb Chiaki’s alternative to the shower and refute the claim that washing was impossible. Choose the refrigerator drinks.','記憶｜七海のシャワー以外という発言を吸収し、洗浄不可能という発言へ。洗った物は冷蔵庫の飲み物。'],
  ['反论｜对边古山用垃圾桶，反驳没有水瓶；指认边古山佩子，逃出口选淋浴间小窗。字谜：竹刀（BAMBOO SWORD）；终击：竹刀袋。','Showdown｜Use Trash Can against Peko’s no-bottles claim. Identify Peko; choose the shower window. Gambit: BAMBOO SWORD. Final strike: BAMBOO SWORD BAG.','反論｜辺古山にはゴミ箱で水瓶がないという発言を斬る。辺古山ペコを指名し、出口はシャワールームの小窓。アナグラムは竹刀、トドメは竹刀袋。']
 ]],
 [['高潮推理与裁判后续','Closing Argument and aftermath','クライマックス推理とその後'],[
  ['漫画｜①西园寺吃红色软糖；②两个信封；③拆软糖袋；④小泉；⑤动画面具；⑥藏在冲浪板盒；⑦西园寺醒来；⑧沙滩脚印；⑨放黄色软糖；⑩竹刀绑结。','Comic｜① Hiyoko eating red gummies; ② two envelopes; ③ opening the gummy bag; ④ Mahiru; ⑤ anime mask; ⑥ surfboard case hiding place; ⑦ Hiyoko waking; ⑧ footprints; ⑨ planting yellow gummy; ⑩ tying the sword.','漫画｜①赤いグミを食べる西園寺、②2通の封筒、③袋を開ける、④小泉、⑤アニメの仮面、⑥サーフボードケース、⑦目覚める西園寺、⑧足跡、⑨黄色いグミ、⑩竹刀に結ぶ。'],
  ['选择｜边古山与连环杀手不同的是国籍；另有在场者的依据是尸体发现广播。指认九头龙，再出示小游戏通关奖励，继续章末剧情。','Choose｜Nationality distinguishes Peko from the serial killer. The body-discovery announcement proves another witness. Identify Fuyuhiko and present the Ending Prize, then continue the chapter ending.','選択｜連続殺人鬼との違いは国籍。もう1人いた根拠は死体発見アナウンス。九頭龍を指名し、クリア特典を提示して章末へ。']
 ]]
],[12,13]);

court(3,1,[
 [['影片模仿与密室','Movie imitation and locked room','映画の模倣と密室'],[
  ['论破｜电影邀请券 → 模仿电影的推断；半透明物 → 从内部上锁。半透明物的材质选胶水，字谜为壁纸（WALLPAPER）。','Refute｜Movie’s Invitation Ticket → the imitation claim. Semitransparent Glob → locking from inside. Choose glue; solve WALLPAPER.','論破｜映画の招待券 → 模倣の推測。半透明の塊 → 内側から施錠。材質は接着剤、アナグラムは壁紙。'],
  ['深潜｜突然出现的尸体：原本藏着；遮挡物：壁纸；方法：包住柱子。模仿电影的目的选混淆遇害顺序。','Dive｜The body had been hidden; the covering was wallpaper; it wrapped the pillar. Choose confusing the murder order as the reason for imitation.','ダイブ｜遺体は隠されていた、壁紙を使用、柱を覆った。映画模倣の目的は殺害順の混乱。']
 ]],
 [['血迹与不在场证明','Blood and alibis','血痕とアリバイ'],[
  ['论破｜鞋底血迹 → 有没有踩到东西；对田中的反论用地板污迹，说明地上曾有血。','Refute｜Blood on the Soles → whether anything was stepped on. Use Smudge on the Floor in Gundham’s Showdown to show there had been blood.','論破｜足裏の血痕 → 踏んだ跡についての発言。田中への反論は床の汚れで、血があったことを示す。'],
  ['赞同｜罪木的证言 → 所有人都没有不在场证明。到此进入后半场，重新核对拍摄地点和时间。','Agree｜Mikan’s Account → nobody having an alibi. Continue to Part 2 to revisit filming location and timing.','賛成｜罪木の証言 → 全員にアリバイがない。後半で撮影場所と時刻を再検討する。']
 ]]
],[20]);
court(3,2,[
 [['真正的拍摄地点','The real filming location','本当の撮影場所'],[
  ['论破｜汽车旅馆钥匙 → 西园寺自愿离开房间；对终里的反论用索尼娅的证言，否定与凶手打斗。','Refute｜Motel Room Key → Hiyoko leaving willingly. Use Sonia’s Account against Akane’s claim of a fight.','論破｜モーテルのルームキー → 自分から出たという発言。終里への反論はソニアの証言で、犯人との争いを否定する。'],
  ['出示｜梯子；异常位置指选梯子侧面。字谜：拍摄地点（FILMING LOCATION）。','Present｜Stepladder; select its side as the inconsistency. Gambit: FILMING LOCATION.','提示｜脚立。不自然な箇所は側面。アナグラムは撮影場所。'],
  ['深潜｜动过的是摄像机；来自音乐会场；被带走。剩下的监视器被破坏；字谜为会议室（CONFERENCE ROOM）。','Dive｜The camera was altered; it came from the music venue; it was taken away. The remaining monitor was destroyed. Gambit: CONFERENCE ROOM.','ダイブ｜細工したのはカメラ、ライブハウスのもの、持ち去った。残りのモニターは破壊。アナグラムは会議室。']
 ]],
 [['布景、替身与凶手','Set, stand-in and killer','セット・替え玉・犯人'],[
  ['论破｜音乐会场幕布 → 两处相似；再出示蜡烛。假的人物选会议室中的澪田，指认罪木蜜柑。','Refute｜Music Venue Curtain → the rooms’ similarity; then present Candle. The fake was the Ibuki in the conference room. Identify Mikan Tsumiki.','論破｜ライブハウスのカーテン → 部屋の類似。ろうそくを提示し、偽物は会議室の澪田。罪木蜜柑を指名。'],
  ['论破｜上吊用的绳子 → 大家被骗的说法。记忆凶手的失误，反驳仅凭摄像角度无法确认的说法；终击为电影院特典。','Refute｜Rope Used for Hanging → the alleged deception. Absorb the killer’s mistake and fire at the camera-angle objection. Final strike: Theater Bonus Prize.','論破｜首吊りのロープ → 誰かの嘘にだまされたという発言。犯人のミスを記憶し、カメラアングルへの反論に撃つ。トドメは映画館の特典。']
 ]],
 [['高潮推理 · 空白格顺序','Closing Argument · Blank-panel order','クライマックス推理 · 空欄の順番'],[
  ['漫画｜①假装上吊；②套上特典袋；③掀开壁纸；④照明架上的壁纸碎片；⑤监控设备碎片；⑥门内涂胶水。略过已经画出的格子。','Comic｜① Staging a hanging; ② putting on the bonus bag; ③ lifting wallpaper; ④ wallpaper scrap on the lighting baton; ⑤ broken surveillance unit; ⑥ glue inside the door. Skip filled panels.','漫画｜①首吊りの偽装、②特典袋をかぶる、③壁紙をめくる、④照明の壁紙片、⑤監視装置の破片、⑥扉の内側に接着剤。既存の絵は飛ばす。']
 ]]
],[20,21]);

court(4,1,[
 [['凶器与两座塔','Weapon and the two towers','凶器と2つの塔'],[
  ['论破｜崭新的铁锤 → 被铁锤打坏；真正带油的凶器选倒下的柱子。柱子碎片反驳直接推倒柱子的说法。','Refute｜New Looking Hammer → death by hammer blows. Choose the broken pillar as the oily weapon; use Pillar Fragments against merely tipping it over.','論破｜新品のハンマー → 殴り壊した説。油の付いた凶器は倒れた柱。柱の破片で押し倒しただけという説を論破。'],
  ['论破｜塔中的违和感 → 两处完全相同；对索尼娅反论用地板上的油，指出并非所有东西都随房间改变。','Refute｜Strange Feeling in Tower → the places being identical. Counter Sonia with Oil on the Floor to distinguish what remained.','論破｜タワーの違和感 → 同じ場所という発言。ソニアへの反論は床の油で、変わらない物を示す。'],
  ['选择｜狛枝通过的是赌命游戏；在图片中依次指选天空和树林。深潜：两座屋都存在、同一栋建筑、垂直排列；草莓之家在上方。','Choose｜The life-threatening game. Select the sky and forest in the picture. Dive: both exist; one building; stacked vertically. Strawberry House is above.','選択｜命懸けのゲーム。画像の空、森を順に選ぶ。ダイブは両方存在、同じ建物、縦に並ぶ。イチゴハウスが上。']
 ]],
 [['电梯与八角屋','Elevator and Octagon','エレベーターとオクタゴン'],[
  ['论破｜塔中的违和感 → 左右田所说的假尸体。字谜：电梯（ELEVATOR）；共同点选都在地板上，特殊结构选只有地板移动。','Refute｜Strange Feeling in Tower → Kazuichi’s claim about a dummy body. Gambit: ELEVATOR. Choose objects on the floor, then only the floor moves.','論破｜タワーの違和感 → 左右田の「ダミーの死体」。アナグラムはエレベーター。共通点は床の上、仕組みは床だけが動く。'],
  ['论破｜左右田的证言 → 电梯垂直移动。八角形选八条边，在结构图选葡萄之家上部的八角区域；休庭后进入后半场。','Refute｜Kazuichi’s Account → vertical elevator movement. Choose an eight-sided shape; select the Octagon at the top of Grape House. Continue after the recess.','論破｜左右田の証言 → 縦移動。八角形は8辺の形。図ではマスカットハウス上部のオクタゴンを選び、休廷後は後半へ。']
 ]]
],[26]);
court(4,2,[
 [['坠落装置与时钟','Fall mechanism and clocks','落下の仕掛けと時計'],[
  ['选择｜死因是坠落；用晚安按钮反驳睡眠时会被物体唤醒，用铁丝解释门把。对左右田的反论用闹钟定时器。','Choose｜Falling caused death. Use Good Night Button against movement waking him, Wire for the doorknob, and Clock’s Alarm Timer in Kazuichi’s Showdown.','選択｜死因は落下。動く物で起きる説にはおやすみボタン、ドアノブにはワイヤー、左右田への反論は時計のアラーム。'],
  ['选择｜落下时撞到柱子；电波钟反驳胸口时钟被改。深潜：误认建筑内时刻、改的是屋内时钟、两座屋都改过。','Choose｜He struck the pillar. Use Radio Clock against altering the chest clock. Dive: time in the building; building clocks; both houses.','選択｜柱に衝突した。電波時計で胸の時計の改変を論破。ダイブは建物内の時刻、建物の時計、両方のハウス。'],
  ['赞同｜终里的证言 → 听到坠落声。时差选两小时，诱出贰大的活动选黑白熊太极。此时先指认狛枝作为没有当时不在场证明的人。','Agree｜Akane’s Account → hearing the fall. Choose a two-hour difference and Monokuma Tai Chi. First identify Nagito as lacking an alibi for that time.','賛成｜終里の証言 → 落下音。ずれは2時間、誘い出した催しはモノクマ太極拳。その時刻のアリバイがない人物として、まず狛枝を選ぶ。']
 ]],
 [['房型与真正行凶者','Room types and the actual killer','部屋の種類と真犯人'],[
  ['字谜｜豪华客房（DELUXE ROOMS）；指认田中眼蛇梦。记忆秘密通道，反驳电梯是两屋唯一通路，再指认实际走过通道的狛枝。','Gambit｜DELUXE ROOMS. Identify Gundham. Absorb secret passageway and refute the elevator as the sole route; identify Nagito as having used the passage.','アナグラム｜デラックスルーム。田中眼蛇夢を指名。秘密の通路を記憶し、エレベーターしか移動手段がないという発言へ。通った人物は狛枝。'],
  ['反论｜对田中用铁丝；机关枪论战终击排列为破坏神暗黑四天王（THE FOUR DARK DEVAS）。','Showdown｜Use Wire against Gundham. Final Panic Talk Action phrase: THE FOUR DARK DEVAS.','反論｜田中にはワイヤー。パニックトークアクションのトドメは破壊神暗黒四天王。']
 ]],
 [['高潮推理 · 空白格顺序','Closing Argument · Blank-panel order','クライマックス推理 · 空欄の順番'],[
  ['漫画｜①时钟两点四十分；②九头龙醒来；③仓鼠按按钮；④铁丝拴门把；⑤拆掉草莓大厅按钮；⑥放下铁锤；⑦九头龙拿闹钟；⑧门把脱落。','Comic｜① Clock at 2:40; ② Fuyuhiko waking; ③ hamster pressing the button; ④ wire on the knob; ⑤ disabling Strawberry Hall’s button; ⑥ planting the hammer; ⑦ Fuyuhiko with the clock; ⑧ knob breaking off.','漫画｜①2時40分、②起きる九頭龍、③ボタンを押すハムスター、④ドアノブにワイヤー、⑤イチゴのボタンを外す、⑥ハンマーを置く、⑦時計を持つ九頭龍、⑧ドアノブが外れる。']
 ]]
],[27,28]);

court(5,1,[
 [['胶带、门与火灾','Tape, door and fire','テープ・扉・火災'],[
  ['论破｜胶带 → 凶手拷问狛枝；对左右田反论仍用胶带，否定死后才贴。赞同黑白熊纸板 → 开门引发火灾，再出示 MP3 播放器。','Refute｜Duct Tape → torture by the killer. Use it again against Kazuichi’s postmortem-taping claim. Agree with the door-triggered fire using Monokuma Panels, then present MP3 Player.','論破｜ガムテープ → 犯人の拷問。左右田への反論もテープで死後に貼った説を斬る。パネルで開扉による火災に賛成し、MP3を提示。'],
  ['选择｜问题是凶手无法离开；布置多米诺的人选狛枝。用燃烧的绳子赞同自行捆绑，右手陷阱的根据选右袖。','Choose｜The killer could not leave; Nagito set up the domino trap. Agree with self-tying using Burned Rope; choose the right sleeve as evidence of the right-arm trick.','選択｜犯人は出られない、仕掛けたのは狛枝。燃えたロープで自縛に賛成し、右腕の仕掛けの根拠は右袖。']
 ]],
 [['长矛与死因','Spear and cause of death','槍と死因'],[
  ['赞同｜黑白熊玩偶 → 固定刀子的推测；左手血迹反驳左手也无法使用。左手姿势选握住，握着的是长矛绳索。','Agree｜Monokuma Plushie → supporting the knife. Use Blood on Left Hand against the unusable-left-hand claim. Choose gripping, then the spear’s cord.','賛成｜モノクマぬいぐるみ → ナイフの固定。左手の血で左手も使えない説を論破。姿勢は握る、握ったのは槍の紐。'],
  ['深潜｜长矛在狛枝上方、上面还有天花板横梁、连接物是长矛绳索。出示黑白熊档案 5；字谜：死因（CAUSE OF DEATH），进入后半场。','Dive｜The spear was above Nagito; a ceiling girder was there; the spear’s cord joined them. Present Monokuma File #5. Gambit: CAUSE OF DEATH. Continue to Part 2.','ダイブ｜槍は狛枝の上、天井の梁、つなぐのは槍の紐。モノクマファイル5を提示し、アナグラムは死因。後半へ。']
 ]]
],[33]);
court(5,2,[
 [['毒药与灭火弹','Poison and fire grenades','毒薬と消火弾'],[
  ['赞同｜黑白熊特制毒药 → 看不见的死因。深潜：气体、从鼻子进入；大家没中毒的原因选洒水装置。','Agree｜Monokuma’s Special Poison → an unseen cause. Dive: gas; through the nose. Choose sprinklers as why the others did not inhale it.','賛成｜モノクマの特製毒薬 → 見えない死因。ダイブは気体、鼻から。全員が吸わなかった理由はスプリンクラー。'],
  ['选择｜遗留物是容器；字谜：灭火弹（FIRE GRENADE）。出示蓝色纸片，投毒时点选大家一起投掷灭火弹时。','Choose｜The missing trace is a container. Gambit: FIRE GRENADE. Present Piece of Blue Paper; choose the moment everyone threw the grenades.','選択｜残るはずの物は容器。アナグラムは消火弾。青い紙を提示し、全員で消火弾を投げた時を選ぶ。'],
  ['选择｜准备毒弹、放火的人都是狛枝；放火目的是让别人投出毒药。继续完成漫画后，裁判还没有结束。','Choose｜Nagito prepared the poisoned grenade and started the fire to make someone throw it. Complete the comic; the trial continues afterward.','選択｜毒入り消火弾の準備も放火も狛枝。他人に毒を投げさせるため。漫画の後も裁判は続く。']
 ]],
 [['高潮推理 · 空白格顺序','Closing Argument · Blank-panel order','クライマックス推理 · 空欄の順番'],[
  ['漫画｜①毒药瓶；②掀灭火弹瓶盖；③灭火弹瓶；④打火机；⑤右手绑绳；⑥固定左手；⑦贴嘴部胶带；⑧玩偶与刀；⑨电脑视讯；⑩灭火弹和毒药；⑪手部与细线。','Comic｜① Poison bottle; ② opening the grenade; ③ grenade container; ④ lighter; ⑤ rope on right arm; ⑥ securing left hand; ⑦ mouth tape; ⑧ plush and knife; ⑨ laptop broadcast; ⑩ grenade and poison; ⑪ hand and fine line.','漫画｜①毒瓶、②消火弾の蓋、③消火弾容器、④ライター、⑤右腕のロープ、⑥左手を固定、⑦口のテープ、⑧ぬいぐるみとナイフ、⑨パソコン通信、⑩消火弾と毒薬、⑪手と細い糸。']
 ]],
 [['内奸与最后的证据','Traitor and final evidence','裏切り者と最後の証拠'],[
  ['选择｜狛枝相信自己的才能，锁定的目标是内奸；指认七海千秋。机关枪论战终击为兔美的笔记。','Choose｜Nagito trusted his talent and targeted the traitor. Identify Chiaki Nanami. Panic Talk Action final strike: MONOMI’S NOTEBOOK.','選択｜狛枝が信じたのは才能、標的は裏切り者。七海千秋を指名。トドメはモノミのノート。'],
  ['选择｜日记话题发生在最终死亡之屋。索尼娅的证言反驳引爆炸弹的人；对索尼娅的反论用黑白熊的证言，说明她事先知道炸弹是假的。','Choose｜The notebook discussion occurred in the Final Dead Room. Use Sonia’s Account against the detonation claim; counter Sonia with Monokuma’s Account about knowing the bomb was fake beforehand.','選択｜ノートの話題はファイナルデッドルーム。ソニアの証言で起爆の発言を論破し、ソニアへの反論はモノクマの証言で偽物と先に知ったことを示す。'],
  ['裁判后｜最后再次指认七海千秋，然后跟随章末剧情。不要把漫画结束当作本章最后一步。','After trial｜Identify Chiaki once more, then follow the chapter ending. The comic is not this chapter’s final step.','裁判後｜最後に再び七海千秋を指名し、章末の展開へ。漫画の終了で手順を終えない。']
 ]]
],[34,35]);

court(6,null,[
 [['虚拟世界与失去的记忆','Virtual world and lost memories','仮想世界と失われた記憶'],[
  ['字谜｜虚拟世界（VIRTUAL）；移除的东西选学园记忆。参与者名单赞同现实身体曾在学园生活，指认九头龙作为能察觉身体变化的人。','Gambit｜VIRTUAL. Choose school memories. Agree with List of Subjects about the real bodies’ school life; identify Fuyuhiko as able to notice a bodily difference.','アナグラム｜仮想世界。奪われたものは学園の記憶。被験者リストで現実の学園生活に賛成し、身体の違いに気づく人物は九頭龍。'],
  ['论破｜新世界程序 → 未来机关制造自相残杀游戏。兔美的职责选观察者，另一位观察者选七海千秋。','Refute｜Neo World Program → Future Foundation creating the killing game. Choose Observer for Usami and Chiaki for the other observer.','論破｜新世界プログラム → 未来機関がコロシアイを作った説。ウサミの役割は観測者、もう1人は七海千秋。'],
  ['深潜｜15 名幸存者＝日向等人；绝望残党＝日向等人；进入程序的目的＝从绝望恢复。字谜：杀死所有人（KILL US ALL）。','Dive｜The fifteen survivors are Hajime’s group; the Remnants are the same group; the program was for recovery from despair. Gambit: KILL US ALL.','ダイブ｜15人の生存者は日向たち、絶望の残党も日向たち、目的は絶望からの更生。アナグラムは全員殺すという意味の語。']
 ]],
 [['假苗木与毕业选择','False Makoto and graduation','偽の苗木と卒業'],[
  ['赞同｜狛枝的影像 → 伤害自身身体。接下来的选项先选省略号；苗木诚的邮件论破无法违抗未来机关，终击为 11037。','Agree｜Vision of Nagito → self-inflicted bodily destruction. Choose the ellipsis; refute obedience to Future Foundation using E-mail to Makoto Naegi. Final strike: 11037.','賛成｜狛枝の映像 → 自分の身体を傷つけたこと。次は「…」。苗木へのメールで未来機関に逆らえない説を論破し、トドメは11037。'],
  ['选择｜真正身份：江之岛盾子；目睹之地：贾巴沃克公园；当前提案：按毕业；依据：修学旅行规则；她所说的人：预备学科学生。','Choose｜Junko Enoshima; Jabberwock Park; press Graduate; school-trip rules; Reserve Course students, in order.','選択｜江ノ島盾子、ジャバウォック公園、卒業を押す、修学旅行のルール、予備学科の生徒たちの順。'],
  ['出示｜强制关机程序。启动不了的原因选人数不足，返回原身体的结果选回到超高校级的绝望。','Present｜Shutdown Sequence. Choose insufficient people, then returning to Ultimate Despairs.','提示｜強制シャットダウン。実行できない理由は人数不足、元の身体に戻る結果は超高校級の絶望に戻る。']
 ]],
 [['真正的计划','The real plan','本当の計画'],[
  ['深潜｜引诱目标：未来机关；诱饵：自相残杀；监视手段：摄像机。毕业的其他条件选教师最终决定，相关人物选学园创始者。','Dive｜Target: Future Foundation. Bait: the killings. Surveillance: cameras. Choose the teacher’s final decision as the other graduation condition, then the academy founder.','ダイブ｜標的は未来機関、餌はコロシアイ、監視はカメラ。卒業の別条件は教師の最終判断、関係者は学園創立者。'],
  ['赞同｜希望培育计划 → 创造希望。暂时选择毕业，随后跟随剧情；这不是让玩家永久停在毕业选项。','Agree｜Hope Cultivation Plan → creating hope. Choose Graduate for now, then follow the story; this is not the final resolution.','賛成｜希望育成計画 → 希望を生み出す。ここでは卒業を選び、続く展開へ。これが最終決着ではない。']
 ]],
 [['记忆言弹与创造未来','Memory bullets and creating a future','記憶と未来の創造'],[
  ['记忆｜从七海否认大家只是游戏一部分的发言中吸收言弹，射向永远留在游戏乐园的说法。接着吸收创造未来，逐轮反驳日向否定自身与未来的发言。','Memorize｜Absorb part of the game from Chiaki’s denial that you are just game characters; refute remaining in a permanent game paradise. Then absorb creating the future and answer each of Hajime’s self-denying rounds.','記憶｜2周目から七海の「ゲームなんかじゃない」を吸収し、永遠のゲームの楽園へ撃つ。次に未来を創るを記憶し、日向が自分と未来を否定する各発言へ撃つ。'],
  ['操作｜按游戏当前提示连续输入突破循环，随后长按蓄力“未来”言弹并发射。以屏幕键位为准，不固定使用 PSP 按键。','Controls｜Repeat the prompted input to break the loop, then hold to charge the Future bullet and fire. Follow your displayed Steam PC bindings.','操作｜画面の指示で連打してループを抜け、長押しで未来のコトダマをためて発射する。現在のSteam PC版の表示に従う。'],
  ['反论｜对江之岛使用未来，反驳没有希望的未来；最后机关枪论战终击为那是错的（THAT’S WRONG），观看结局和尾声。第六章没有高潮推理漫画。','Showdown｜Use Future against Junko’s hopeless-future claim. Finish Panic Talk Action with THAT’S WRONG, then watch the ending and epilogue. Chapter 6 has no Closing Argument.','反論｜江ノ島には未来で希望のない未来を斬る。最後のトドメはそれは違うぞ。結末とエピローグへ。第6章にクライマックス推理はない。']
 ]]
],[37]);

const hidden=[
 [
  ['日向小屋右侧墙上，随第一章教学发现。','Right wall of Hajime’s cottage, during the Chapter 1 tutorial.','日向のコテージ右壁。第1章の説明で発見。'],
  ['机场右侧的行李传送带上。','On the airport’s right-hand luggage conveyor.','空港右側の荷物ベルト。'],
  ['火箭飞拳超市自动贩卖机右侧。','Right of the Rocketpunch Market vending machine.','マーケットの自販機の右。'],
  ['搜查期：旧馆事务室左侧桌下柜内。','Investigation: cabinet beneath the left desk in the old-building office.','捜査中：旧館事務室、左の机の下の棚。'],
  ['搜查期：十神小屋天花板左侧暗窗内。','Investigation: dark window at the upper left of Byakuya’s cottage.','捜査中：十神のコテージ左上の暗い窓。']
 ],[
  ['月神沙滩海面，移动视角检查。','On the sea at Chandler Beach; adjust the view.','チャンドラービーチの海上。視点を動かして確認。'],
  ['药店右上方架子深处。','Deep in the upper-right shelves of the drugstore.','ドラッグストア右上の棚の奥。'],
  ['图书馆右侧二楼栏杆之间。','Between the upper-floor railings on the library’s right.','図書館右側2階の手すりの間。'],
  ['搜查期：沙滩小屋蓝色壁橱内左上角。','Investigation: upper-left corner inside the beach-house blue closet.','捜査中：ビーチハウスの青いクローゼット内、左上。'],
  ['搜查期：小泉小屋电视后方。','Investigation: behind the TV in Mahiru’s cottage.','捜査中：小泉のコテージ、テレビの裏。']
 ],[
  ['电器街最左侧建筑上方。','Above the leftmost building on Electric Ave.','電気街の一番左の建物の上。'],
  ['电影院右侧海报旁。','Beside the poster on the theater’s right.','映画館右側のポスターの脇。'],
  ['医院一楼走廊深处右侧窗户内。','In the right window at the far end of the hospital’s first-floor corridor.','病院1階廊下の奥、右の窓。'],
  ['医院二楼会议室天花板。','On the hospital second-floor conference-room ceiling.','病院2階会議室の天井。'],
  ['搜查期：汽车旅馆房间洗脸池左侧的马桶上。','Investigation: toilet left of the sink in the motel room.','捜査中：モーテルの部屋、洗面台左の便器。']
 ],[
  ['过山车倒数第二节车厢。','Second-to-last rollercoaster carriage.','ジェットコースターの後ろから2両目。'],
  ['老鼠城左侧城墙上，露出半个头。','Peeking over the castle’s left wall.','城の左の壁から半分見える頭。'],
  ['草莓之家三楼，下楼楼梯左侧大水桶上。','Strawberry House 3F: large barrel left of the stairs down.','イチゴハウス3階、下り階段の左の大きな桶。'],
  ['葡萄之家三楼黑白熊资料室，入口右侧铜像。','Grape House 3F Monokuma Archive: statue right of the entrance.','マスカットハウス3階のモノクマ資料室、入口右の像。'],
  ['草莓之家二楼普通客房的桌后；切换视角后再检查。','Behind the desk in the Strawberry House 2F standard room; check when that viewpoint becomes available.','イチゴハウス2階スタンダードルームの机の裏。該当視点で入れる時に確認。']
 ],[
  ['小吃街右侧拉面摊内。','Inside the ramen stall on the right of the food street.','屋台街右側のラーメン屋。'],
  ['工厂右侧玩具筐的右上角，与玩偶混在一起。','Upper-right of the factory’s toy basket, among the plushies.','工場右側の玩具かごの右上。ぬいぐるみに混ざっている。'],
  ['军事基地入口左侧的红色集装箱上。','On the red container left of the military-base entrance.','軍事施設入口左の赤いコンテナ。'],
  ['海王工业右侧平台的阴影里。','In the shadow on the right platform at Sea King Industries.','シーキングインダストリー右側足場の影。'],
  ['搜查期：狛枝小屋浴室的浴缸内。','Investigation: bathtub in Nagito’s cottage.','捜査中：狛枝のコテージの浴槽。']
 ],[
  ['醒来的教室天花板内。','In the ceiling of the classroom where you wake up.','目覚めた教室の天井。'],
  ['体育馆左侧看台。','Left-hand seating in the gym.','体育館左の観客席。'],
  ['生物室桌子下面。','Beneath the bio-lab table.','生物室の机の下。'],
  ['职员室最右侧铁板附近。','By the metal panel at the far right of the faculty room.','職員室一番右の鉄板付近。'],
  ['标为 2-B 的洗衣房，右侧自动贩卖机阴影内。','Laundry marked 2-B: shadow beside the right vending machine.','2-Bのランドリー、右の自販機の影。']
 ]
];
for(let ch=1;ch<=6;ch++){
 add(`hidden-${ch}`,ch,null,[`第 ${ch} 章 · 隐藏黑白熊`,`Chapter ${ch} · Hidden Monokumas`,`第${ch}章 · カクレモノクマ`],['本章共五只，按位置核对。搜查专属房间开放时及时收集；错过可通过游戏章节选择重玩相应阶段。','Five per chapter. Collect time-limited investigation locations while accessible; replay the relevant phase through Chapter Select if missed.','各章5体。捜査限定の場所は入れる間に回収する。逃したらチャプターセレクトで該当パートを再プレイ。'],[[['位置清单','Location checklist','場所の一覧'],hidden[ch-1]]],[],'隐藏收集');
 articles.at(-1).sources.push('dr2-hidden','dr2-walkthrough');
}

add('collections',null,null,['特殊礼物与限时事件','Special presents and timed events','特殊プレゼントと期間限定イベント'],['先准备道具，再在指定剧情推进前与对应人物交谈。以下六件道具可在超市贩卖机各用 50 枚徽章购买。','Prepare each item before the stated story moment, then talk to the specified person. These six items cost 50 Monocoins each at the market vending machine.','指定の進行前に品を用意し、相手に話す。下記6品はマーケットの自販機で各50メダル。'],[
 [['第一章','Chapter 1','第1章'],[
  ['104 金箔模仿刀：跟随十神前往公园前，与左右田交谈，之后自由行动触发额外场景。','104 Replica Sword: speak to Kazuichi before following Byakuya to the park; the bonus follows during Free Time.','104 金箔の模擬刀：十神を追って公園へ行く前に左右田と話す。自由行動で追加シーン。'],
  ['105 时尚杂志：黑白熊提供动机后的次日早晨，在进入餐厅前与小泉交谈；之后自由行动出现女子会准备场景。','105 An An Aan: on the morning after the motive, talk to Mahiru before entering the restaurant; the gathering-preparation scene follows in Free Time.','105 あんぁんぁあん：動機提示の翌朝、レストランに入る前に小泉と話す。自由行動で女子会準備のシーン。']
 ]],
 [['第二章与第三章','Chapters 2 and 3','第2章と第3章'],[
  ['106 男人的浪漫栗：第二章初期、探索第二座岛之前持有，并与小泉交谈，触发浴场额外场景。','106 Man’s Nut: have it near the start of Chapter 2 and speak to Mahiru before exploring the second island for the bathing bonus.','106 男のマロン：第2章序盤、2番目の島を探索する前に所持して小泉に話すと入浴シーン。'],
  ['061 玩具相机：第三座岛探索后的次日早晨与西园寺交谈；接下来的自由行动出现音乐合奏场景。','061 Toy Camera: talk to Hiyoko the morning after exploring the third island; the jam-session bonus follows in the next Free Time.','061 トイカメラ：3番目の島の探索翌朝に西園寺と話す。次の自由行動でセッションのシーン。'],
  ['111 夏祭之树：同一天早晨与澪田交谈，后续自由行动结束、当天结束前出现浴衣烟火场景。','111 Summer Festival Tree: speak to Ibuki that morning; the yukata/fireworks scene follows after Free Time before the day ends.','111 夏まトゥリー：同じ朝に澪田と話す。自由行動後、その日の終わりに浴衣と花火のシーン。'],
  ['113 遥控战斗四驱太郎：全员探望九头龙后的对话结束，优先与左右田交谈。先找其他人会推进剧情而错过触发时机。','113 R/C 4WD Battler Taro: speak to Kazuichi first immediately after the group hospital visit to Fuyuhiko. Talking to others advances the story past the trigger.','113 ラジコンバトラー四駆太郎：全員で九頭龍を見舞った直後、最初に左右田へ。先に別の人へ話すと進行して機会を逃す。']
 ]],
 [['140 项的组成与追加模式','Completing all 140 and bonus modes','全140品と追加モード'],[
  ['001–114 包括椰子扭蛋与六件贩卖机事件道具；115–129 为各角色希望碎片完成奖励。130 在第一章后解锁魔法少女兔美，131 与 132 在通关后解锁海岛模式及小说。','001–114 cover Yachine presents and six vending-machine event items. 115–129 reward completed Hope Fragment routes. 130 unlocks Monomi Mode after Chapter 1; 131/132 unlock Island/Novel modes after clearing.','001～114はヤシーンと自販機イベント6品。115～129は各希望のカケラ完成報酬。130は第1章後のモノミモード、131・132はクリア後のアイランド・ノベル解放。'],
  ['133–140 依次对应序章、第一至六章和尾声的纪念品。已消耗过的物品是否曾拥有不由本站推定；背包只记录当前数量。','133–140 commemorate the prologue, Chapters 1–6 and epilogue. This site does not infer past ownership from consumed items; inventory tracks current quantities only.','133～140は序章、第1～6章、エピローグの記念品。当サイトは消費済みの過去の所持を推定せず、現在数のみ記録する。']
 ]]
],[],'隐藏收集');articles.at(-1).sources.push('dr2-presents','dr2-events');

add('escape-room',4,null,['第四章 · 最终死亡之屋解谜','Chapter 4 · Final Dead Room','第4章 · ファイナルデッドルーム'],['本页包含密室密码与操作顺序，按游戏实际提示选用语言相关密码。','Includes the escape puzzle and codes. Choose the language-specific password from the clues in your game.','脱出手順と暗証番号を記載。言語によるパスワードはゲーム内のヒントで選ぶ。'],[
 [['工具与第一道密码','Tools and first code','道具と最初の暗証番号'],[
  ['桌子中间抽屉拿钳子，衣柜内拿衣架。用钳子把衣架变成铁丝钩，再从床底取桌钥匙；开左抽屉拿剪刀，右抽屉拿密码提示纸。','Take pliers from the desk’s middle drawer and a hanger from the closet. Make a wire hook, retrieve the desk key beneath the bed, then open the left drawer for scissors and right drawer for the password hint.','机中央の引き出しでペンチ、クローゼットでハンガー。針金に加工してベッド下の鍵を取り、左の引き出しでハサミ、右で暗号メモを得る。'],
  ['按 NEWS 的北、东、西、南排列墙上数字，密码为 3957。在床边密码装置输入后取得 USB 与数码相机。','Order the wall numbers North, East, West, South from NEWS: 3957. Enter it at the bedside keypad for the USB stick and camera.','NEWSを北・東・西・南の順と読み、壁の数字を並べると3957。ベッド脇の装置でUSBとデジカメを入手。']
 ]],
 [['电脑与最后装置','Laptop and final device','パソコンと最後の装置'],[
  ['用剪刀拆床边黑白熊玩偶取得电池，装入相机查看线索，再把 USB 插入电脑。行星英文缩写提示对应 SMVEMJS；日版等星期提示对应 MMMJVSS，中文界面也以实际线索为准。','Cut the plush for batteries and power the camera, then insert the USB in the laptop. English planet initials give SMVEMJS; the Japanese weekday clue gives MMMJVSS. Follow the game’s clue, not this website’s display language.','ぬいぐるみを切って電池を取り、カメラに入れてUSBをパソコンへ。英語の惑星ヒントはSMVEMJS、日本語の曜日ヒントはMMMJVSS。サイトの言語ではなくゲームのヒントで判断する。'],
  ['查看电脑和旁边闪灯装置，将提示换算为 9875，再在原密码装置输入。把 USB 用到电脑旁的最终装置，完成剧情中的赌命游戏。','Read the laptop and flashing device to derive 9875, then enter it at the original keypad. Use the USB on the final device beside the laptop and complete the story’s life-threatening game.','パソコンと点滅装置から9875を読み、最初の装置へ入力。USBをパソコン横の最終装置に使い、劇中の命懸けのゲームを進める。'],
  ['离开后调查八角屋的窗户、武器、冰箱与地板通道，听完说明再返回日向视角。','Afterward inspect the Octagon window, weapons, refrigerators and floor hatch before returning to Hajime.','その後はオクタゴンの窓、武器、冷蔵庫、床のハッチを調べて日向視点へ戻る。']
 ]]
],[24,25],'玩法说明');articles.at(-1).sources.push('dr2-escape');

add('gifting',null,null,['礼物偏好与赠送','Gift preferences and giving','プレゼントの好みと渡し方'],['按角色查偏好，再与当前所持数量核对。','Check the classmate’s preferences against your current inventory.','人物の好みと現在の所持数を照合する。'],[
 [['赠送与记录','Giving and recording','贈る・記録する'],[
  ['通讯录优先查看非常喜欢，再看喜欢；只看持有仅显示数量大于零的已记录物品。未录入不等于没有。','Check Loves before Likes. Owned only includes recorded quantities above zero; unrecorded does not mean absent.','大好き、好きの順に確認。所持品のみは記録数が1以上の品。未記録は未所持とは限らない。'],
  ['在游戏中实际赠送后，再点击记为已赠送扣除一件；网站只更新浏览器记录，不修改游戏。重新导入前确认覆盖。','After actually giving a present in-game, use Mark as given to deduct one here. This changes browser records only. Confirm replacement before reimporting a save.','ゲームで渡した後、渡したと記録で1個減らす。ブラウザーの記録のみを更新する。再取込前に置換を確認する。']
 ]]
],[],'玩法说明');articles.at(-1).sources.push('dr2-presents','dr2-prefs');
add('trial-help',null,null,['裁判操作与查阅说明','Trial controls and guide help','裁判の操作と攻略の読み方'],['先确认当前章节和前后半场，再按物件和发言含义找步骤。','Check the chapter and trial part, then match objects and statement meanings.','章と裁判パートを確認し、物と発言の意味を照合する。'],[
 [['论破、赞同与反论','Refute, agree and counter','論破・賛成・反論'],[
  ['橙色弱点用言弹论破，蓝色弱点用言弹赞同；记忆步骤先吸收发言再射击，不能用记忆言弹进行赞同。','Refute orange weak points and agree with blue ones. For memory steps, absorb before firing; memory bullets cannot be used for agreement.','オレンジは論破、青は賛成。記憶は吸収してから撃つ。記憶コトダマは賛成には使えない。'],
  ['反论先斩断普通发言推进，再用正确言刃切关键句；逻辑深潜按问题含义选路线，不依赖固定颜色。字谜按当前游戏语言完成。','In Showdowns, cut ordinary statements to advance, then use the correct Truth Blade. In Logic Dive, choose by meaning rather than a fixed color. Solve word puzzles in your game language.','反論は通常の発言を斬って進め、コトノハで決める。ダイブは色固定ではなく問題の意味で選ぶ。文字問題はプレイ言語に合わせる。'],
  ['机关枪论战跟随节奏锁定与击破，最后将词块排列为攻略中的终击。漫画仅填写空格；第五章漫画后还有裁判，第六章没有漫画。','Follow rhythm prompts in Panic Talk Action and arrange the final phrase. Fill only comic blanks. Chapter 5 continues after its comic; Chapter 6 has none.','パニックトークはリズムに従い、最後に語を並べる。漫画は空欄のみ。第5章は漫画後も続き、第6章に漫画はない。']
 ]]
],[],'玩法说明');articles.at(-1).sources.push('dr2-trials');
add('bonus-modes',null,null,['海岛模式与通关后内容','Island Mode and post-game content','アイランドモードとクリア後'],['主线通关后，从游戏主菜单进入追加模式。','After clearing the story, open bonus modes from the game’s main menu.','本編クリア後、ゲームのメニューから追加モードへ。'],[
 [['海岛模式','Island Mode','アイランドモード'],[
  ['在 50 天内分配采集、清扫与休息，按材料需求安排角色并留意体力。先补齐全部同学的希望碎片，再集中使用外出票培养目标角色。','Across 50 days, allocate gathering, cleaning and rest according to materials and stamina. Complete everyone’s Hope Fragments before focusing trip tickets on desired characters.','50日間、素材と体力に合わせて採集・掃除・休息を配分。全員の希望のカケラを完成させ、目標人物におでかけチケットを使う。'],
  ['角色外出好感度上限为十颗心，达成后在第 51 天与目标角色交谈取得个人结局；未收齐全员希望碎片会影响结局条件。本站不追踪好感度事件。','Trip affection caps at ten hearts. Speak to a maxed character on Day 51 for their ending; collecting everyone’s Hope Fragments is also required. This site does not track affection events.','外出の好感度は10ハート。全員の希望のカケラ完成も満たし、51日目に最大の人物へ話して個別エンド。当サイトではイベント進行を記録しない。']
 ]],
 [['兔美与小说模式','Monomi and Novel modes','モノミ・ノベルモード'],[
  ['第一章后可进入魔法少女兔美，主线推进解锁更多关卡。移动绕敌画圈、跳跃和魔法攻击配合使用，及时更换关卡取得的装备。','Monomi Mode opens after Chapter 1, with further stages as the story advances. Combine movement loops around enemies, jumps and magic, and equip collected gear.','第1章後にモノミモード、進行に応じてステージ追加。敵を囲む移動、ジャンプ、魔法を組み合わせ、入手装備を更新する。'],
  ['通关后小说模式解锁《弹丸论破 IF》，它是第一作的分支小说。不同平台的成就清单可能不同，以当前 Steam 版本显示为准。','Clearing unlocks Danganronpa IF, an alternate-story novel for the first game. Achievement lists differ by platform; use the current Steam list.','クリアで1作目の分岐小説ダンガンロンパIFを解放。実績は機種差があるため現在のSteam版を確認する。']
 ]]
],[],'玩法说明');articles.at(-1).sources.push('dr2-modes','dr2-presents');
add('pets',null,null,['电子宠物培养','Raising virtual pets','電子ペットの育成'],['电子宠物在游戏手册中培养；这里提供养成说明。','Raise pets in the game’s handbook; this page explains their care.','ペットはゲーム内の手帳で育てる。このページは育成の説明。'],[
 [['希望、绝望与成长','Hope, Despair and growth','希望・絶望・成長'],[
  ['步行推进成长：蛋约 100 步孵化，幼年约 1000 步后结茧，再约 100 步进入最终形态；进化取决于此前的希望和绝望。','Walking advances growth: about 100 steps to hatch, 1,000 as Chibimi, then 100 in the cocoon. The final form depends on prior Hope and Despair.','歩行で成長。卵は約100歩、チビミは約1000歩、さなぎは約100歩。最終形態はそれまでの希望と絶望による。'],
  ['赠送任意礼物都会提升希望；宠物没有角色的礼物偏好，可用贩卖机的一枚徽章矿泉水。及时清扫，绝望达到十点会死亡。','Any present raises Hope; pets have no gift preferences. Cheap one-Monocoin Mineral Water works. Clean regularly: ten Despair points kill the pet.','どのプレゼントでも希望が上がり、好みはない。自販機の1メダルの水でよい。こまめに掃除し、絶望10で死亡することに注意。'],
  ['成年后继续保持约 2000 步可取得徽章、物品和经验奖励。网站背包不会自动扣除游戏中喂给宠物的礼物，可重新导入存档同步。','Keep the adult alive for roughly 2,000 steps for coins, items and experience. This website does not automatically deduct pet gifts; reimport your save to synchronize.','成体で約2000歩生存するとメダル・品・経験値を得る。ゲームで与えた品は当サイトで自動減算されないため、セーブ再取込で同期する。']
 ]]
],[],'玩法说明');articles.at(-1).sources.push('dr2-pets');
