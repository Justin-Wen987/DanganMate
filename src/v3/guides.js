export const translations={en:{},ja:{}};
export const articles=[];
function text(zh,en,ja){translations.en[zh]=en;translations.ja[zh]=ja;return zh;}
function add(id,chapter,kind,title,sections,sources,part){
 const intro=text('打开本页即显示对应剧情。依游戏中的物件与发言含义核对；字谜和按钮以当前游戏语言及键位为准。','This page reveals the selected story segment. Match objects and statement meanings; word puzzles and controls depend on your game language and bindings.','このページには該当箇所のネタバレがあります。物品と発言の意味を照合し、文字問題と操作はゲームの言語・キー設定に従ってください。');
 const terminologySource=kind==='学级裁判'?({3:'v3-rpg-trial-3',4:'v3-trial-terms',5:'v3-rpg-trial-5',6:'v3-trial-finale'})[chapter]:null;
 articles.push({id,chapter,kind,title:text(...title),intro,sections:sections.map(([h,steps])=>[text(...h),steps.map(row=>text(...row))]),sources:[...sources,...(terminologySource?[terminologySource]:[])],...(part?{part,related:`trial-${chapter}${part===1?'-2':''}`}:{})});
}
const main='主线流程',trial='学级裁判',hidden='隐藏收集',how='玩法说明';
const flow=['推进与搜查','Progression and investigation','進行と捜査'];
const answers=['依次核对','Answers in order','回答の順序'];
add('prologue',0,main,['序章 · 学园探索','Prologue · Explore the academy','プロローグ・学園探索'],[[flow,[
 ['离开教室，与遇到的同学交谈；按提示探索校舍和中庭。','Leave the classroom, meet the students and explore the school and courtyard.','教室を出て生徒に話しかけ、校舎と中庭を探索する。'],
 ['完成各处介绍后前往体育馆，听取黑白熊的说明，再返回宿舍。','Finish the introductions, attend the gym briefing, then return to the dormitory.','自己紹介を終え、体育館で説明を聞いてから寄宿舎へ。'],
 ['之后按剧情进入第 1 章。各章的日常、搜查和裁判在目录中分开查阅。','Continue into Chapter 1. Daily life, investigation and trials have separate chapter entries.','その後第1章へ。日常・捜査と学級裁判は章ごとに参照できる。']
 ]]],['v3-prologue']);
const mainRows=[
 [
 ['日常：认识同学，探索小卖部、地下图书室与仓库；按最原的计划安装相机，再推进倒计时剧情。','Daily life: meet the students; explore the store, library and warehouse, then set up the cameras with Shuichi.','日常：生徒と会い、購買部・図書室・倉庫を探索。最原とカメラを設置する。'],
 ['图书室：检查遗体、砲丸、通风口、堆积的书、活动书架和读卡器；询问白银、最原、星。','Library: inspect the body, shot put ball, vent, stacked books, moving bookcase and card reader; speak to Tsumugi, Shuichi and Ryoma.','図書室：死体・砲丸・通気口・積み上がった本・動く本棚・カードリーダーを確認。白銀・最原・星に聞く。'],
 ['游戏室和影音室：询问春川，检查装配不良的拉门。教室 A：检查监视地点与通风口，询问机望、真宫寺。','Game/AV rooms: speak to Maki and inspect the faulty sliding door. Classroom A: inspect the lookout and vent; question Keebo and Korekiyo.','ゲーム室とAVルーム：春川の証言と建て付けの悪い扉を確認。教室A：見張り場所・通気口、キーボと真宮寺の証言。'],
 ['返回图书室与白银交谈，到仓库取得三个相机位置的照片；搜查齐全后去裁决之祠。','Return to Tsumugi, collect the three camera photographs in the warehouse, then go to the Shrine of Judgment.','白銀と話し倉庫で3か所の写真を入手。調査完了後、裁きの祠へ。']
 ],[
 ['日常：使用新道具开放区域，探索研究教室、赌场及泳池；推进动机影片与魔术表演。','Daily life: use the new items to open areas; explore research labs, the casino and pool, then advance the motive-video and magic-show events.','日常：新しい道具で区域を開放。研究教室・カジノ・プールを探索し、動機ビデオとマジックショーへ。'],
 ['体育馆：检查水槽、玻璃板、手铐、食人鱼、遗体、窗框、绳索及舞台后的湿阶梯。','Gym: inspect the tanks, glass pane, handcuffs, piranhas, body, window frame, rope and wet backstage stairs.','体育館：水槽・ガラス板・手錠・ピラニア・死体・窓枠・ロープ・濡れた階段を調べる。'],
 ['魔术师研究教室：向王马取证并检查水槽机关；三楼询问东条与春川。','Magician lab: question Kokichi and inspect the tank mechanism; on floor 3, question Kirumi and Maki.','マジシャンの研究教室：王馬と水槽の仕掛け。3階：東条と春川の証言。'],
 ['网球研究教室：检查淋浴室的洗手台、手铐、窗框和网线。泳池：检查布片、泳圈、校规与两侧窗户。最后去星的房间。','Tennis lab: inspect the shower-room sink, cuffs, window and net cable. Pool: inspect the cloth, inner tube, rules and windows; finish at Ryoma’s room.','テニス教室：シャワールームのシンク・手錠・窓・ネット。プール：布切れ・浮き輪・校則・窓。最後に星の部屋へ。']
 ],[
 ['日常：探索新开放楼层与研究教室，推进学生会、死者之书及降灵术剧情。','Daily life: explore the new floors and labs, then advance the student-council, Necronomicon and séance events.','日常：新しい階と研究教室を探索し、生徒会・屍者の書・降霊術のイベントを進める。'],
 ['美术教室：检查遗体、头部伤口、染血胶带、死者之书、蜡像、武士刀与两扇门。','Art lab: inspect the body, head wound, bloody tape, book, wax figures, katana and both doors.','美術教室：死体・前頭部の傷・血濡れのテープ・屍者の書・蝋人形・刀・両方の扉。'],
 ['民俗学教室：检查展示柜，确认刀与笼犬村仪式的资料。中央空房：检查布、木像、魔法阵、石头、铁笼和地板。','Anthropology lab: inspect the display and ritual references. Middle room: inspect the cloth, statue, circle, stone, cage and floorboards.','民俗学教室：展示と儀式の資料。真ん中の部屋：布・木像・魔法陣・石・鉄カゴ・床板を確認。'],
 ['搜查地板下的横木、干燥血迹及房间角落缝隙；询问参与降灵术的同学后，前往裁决之祠。','Check the crosspiece, dried blood and corner gap beneath the floor; question the séance participants before the trial.','床下の横木・乾いた血痕・部屋の隅の隙間を調べ、参加者に聞いて裁きの祠へ。']
 ],[
 ['日常：探索新研究教室并前往电脑室，了解虚拟世界的规则和登录方法。','Daily life: explore the new labs and reach the computer room; learn the virtual-world and login rules.','日常：新しい研究教室とコンピュータルームを探索し、仮想世界とログイン方法を確認。'],
 ['电脑室：检查遗体、头戴装置、毒药及登录／登出记录；询问在场同学。','Computer room: inspect the body, headset, poison and login/logout record; question the students.','コンピュータルーム：死体・頭の装置・毒薬・ログイン／ログアウト記録を確認。'],
 ['重新进入虚拟世界，分别搜查洋馆、屋顶、仓库、河流、告示牌、桥及教会。','Re-enter the virtual world; inspect the mansion, roof, storage room, river, signboard, bridge and chapel.','再び仮想世界へ。館・屋上・倉庫・川・看板・橋・教会を調べる。'],
 ['核对地图边界、入间设置的墙、角色设定、厕纸与目击证词，再返回现实推进裁判。','Compare the map edges, Miu’s wall, avatar settings, toilet paper and witness accounts, then return to reality.','地図の境界・入間の壁・アバター設定・トイレットペーパー・目撃証言を照合して現実へ。']
 ],[
 ['日常：使用电子锤推进逃脱与机库剧情，探索五楼研究教室。','Daily life: use the Electrohammers to advance the escape and hangar events; explore the fifth-floor labs.','日常：エレクトハンマーで脱出と格納庫のイベントを進め、5階の研究教室を探索。'],
 ['机库：检查压机操作台、安全装置、制服袖、拖拽血迹及驾驶舱电子锁。','Hangar: inspect the press controls, safety sensor, uniform sleeve, drag marks and locked cockpit hatch.','格納庫：プレス機の操作パネル・安全装置・制服の袖・血痕・電子ロックされたハッチ。'],
 ['机库厕所：检查弩、三支箭、空瓶、血迹、黑箱与窗户；中庭询问机望并检查用过的电子锤。','Hangar bathroom: inspect the crossbow, three arrows, bottle, blood, case and window. Courtyard: question Keebo and inspect the used hammer.','格納庫トイレ：クロスボウ・3本の矢・小ビン・血痕・ケース・窓。中庭：キーボと使用済みハンマー。'],
 ['刺客教室核对弩的黑箱；侦探教室检查药品。回机库检查王马衣服，并向白银更新证词。','Compare the crossbow case in the assassin lab and poison in the detective lab. Return for Kokichi’s clothes and Tsumugi’s account.','暗殺者教室でケース、探偵教室で薬品を確認。格納庫で王馬の服と白銀の証言を更新。']
 ],[
 ['本章直接开始限时搜查。先从玄关破洞进入总统研究教室，取得希望峰资料集，再去王马房间和后院。','This chapter starts with a timed investigation. Enter the supreme-leader lab through the entrance-hall hole, obtain the academy book, then visit Kokichi’s room and the backyard.','本章は時間制限付き捜査から。玄関の穴から総統教室へ進み資料集を入手。王馬の部屋と裏庭へ。'],
 ['五楼天海研究教室：保险柜左转盘选双子座，右转盘选午（马）；调查电脑与柜内资料。','Rantaro’s lab: set the safe’s left dial to Gemini and the right to Horse; inspect the computer and contents.','天海の研究教室：金庫は左がふたご座、右が午。パソコンと中身を調べる。'],
 ['随羁绊之力提升开放道路：六楼航天员教室 → 冷冻睡眠室 → 地下图书室的隐藏房间。','As Bond Power increases, open the route through the astronaut lab, cryosleep room and library’s hidden room.','絆のチカラに応じて宇宙飛行士教室、コールドスリープルーム、図書室の隠し部屋へ。'],
 ['隐藏房间检查手册、垃圾桶砲丸、半坏的门与黑白熊妈妈。教室 C：选择新记忆 → 生存者 → 生存者在其他星球 → 是。','Hidden room: inspect the pad, shot put ball, broken door and Motherkuma. Classroom C: new memory → survivors → another planet → yes.','隠し部屋のモノパッド・砲丸・壊れた扉・マザーモノクマを確認。教室C：新たな記憶→生存者→他の星→はい。'],
 ['检查女子厕所工具柜并走隐藏通道；完成剩余取证后进入最终裁判。','Inspect the girls’ bathroom closet and follow the hidden passage; finish gathering evidence for the final trial.','女子トイレの用具入れから隠し通路へ。残りの証拠を集め最終裁判へ。']
 ]
];
for(let ch=1;ch<=6;ch++)add(`main-${ch}`,ch,main,[`第 ${ch} 章 · ${ch===6?'最终搜查':'日常与搜查'}`,`Chapter ${ch} · ${ch===6?'Final investigation':'Daily life and investigation'}`,`第${ch}章・${ch===6?'最終捜査':'日常と捜査'}`],[[flow,mainRows[ch-1]]],[`v3-${ch}-hi-nichijou`,...(ch<6?[`v3-${ch}-nichijou`]:[])]);

// Concise solution sequences; recess boundaries follow the chapter walkthroughs.
const trialRows=[
 [[
 ['论破“天海是主谋”→天海的持有物；“没去图书室”→真宫寺证词。白银变装的选择题→起疹子。','Refute Rantaro as mastermind with his belongings; refute never visiting the library with Korekiyo’s account. Disguise question: cospox.','天海が首謀者→持ち物。図書室に行っていない→真宮寺の証言。変装の根拠→キモいブツブツ。'],
 ['恐慌讨论“只有天海离开”→春川证词。拉门进出→装配不良的门；点击投影幕。','Mass Panic: only Rantaro left → Maki’s account. Sliding-door access → faulty door; select the screen.','天海だけ退室→春川の証言。引き戸の出入り→建て付けの悪い扉。スクリーンを指定。'],
 ['“没有障碍物”→活动书架；出示隐藏门照片。“进了隐藏门”→读卡器灰尘。','No obstacles → moving bookcase; present the hidden-door photo. Entered the hidden door → card-reader dust.','障害物なし→動く本棚。隠し扉の写真を提示。扉の中→カードリーダーの埃。'],
 ['反论“在现场会合”→图书室正门照片；出示堆积的书，随后休庭。','Rebut meeting at the scene with the library front-door photo; present stacked books. Recess follows.','その場で合流→図書室正面口の写真。積み上がった本を提示して休廷。']
 ],[
 ['选择警报响起时间；“活动书架”→隐藏门照片。“最原带着接收器”→长按接收器言弹进行必要伪证。','Choose the alarm timing. Moving bookcase → hidden-door photo. Lie using Shuichi’s receiver against the receiver claim.','ブザーのタイミングを選択。動く本棚→隠し扉の写真。受信機の主張には最原の受信機をウソダマにする。'],
 ['议论争辩关键词：间隔／不在场证明／一起／接收器／谎言。选择闪光灯、引诱；指认赤松枫。','Debate Scrum: interval / alibi / together / receiver / lie. Choose flash and luring; identify Kaede.','スクラム：インターバル／アリバイ／一緒／受信機／嘘。フラッシュ・おびき寄せる・赤松楓。'],
 ['“凶手在图书室”→监视用教室；字谜→通风口。“沿书架滚动”→堆积的书。此处也可走第 1 章伪证分支。','Library location → lookout classroom. Word puzzle: vent. Rolled along the bookcase → stacked books; an optional Back Route is available here.','図書室→見張りに使った教室。字謎→通気口。本棚を転がる→積み上がった本。ここで裏ルートも可能。'],
 ['选择入间、离开教室时；“图书室很安静”→杀人促进 BGM；藏凶器位置→背包；理论武装→杀害主谋。','Choose Miu and leaving the classroom. Quiet library → killing-game music. Hiding place: backpack. Argument Armament: kill the mastermind.','入間・教室を出る時。静かな図書室→コロシアイ促進BGM。凶器の場所→リュック。理論武装→首謀者の殺害。'],
 ['漫画按作案顺序补齐：下跪委托、仓库砲丸、通风口与书、闪光设置、警报、投掷和活动书架。','Complete the comic chronologically: camera request, shot put ball, vent/books, flash setting, alarm, throw and moving bookcase.','漫画は依頼、砲丸、通気口と本、フラッシュ、ブザー、投下、本棚の順を照合。']
 ]],[[
 ['“被鱼吃死”→黑白熊档案 2；死亡时间→演出前。水槽逃生口→水槽机关；反论水浸→湿阶梯。','Eaten alive → Monokuma File 2; death occurred before the show. Tank escape → tank mechanism; flooding rebuttal → wet stairs.','食べられて死亡→モノクマファイル2。死亡はショー前。抜け穴→水槽の仕掛け。水浸し→濡れた階段。'],
 ['制服未湿→换过衣服；“没人看见”→权太证词；尸体与鱼分隔→方形玻璃板，再出示增加的食人鱼。','Dry uniform: changed clothes. Nobody saw → Gonta’s account. Separating body/fish → square glass pane; present the increased piranhas.','制服は着替えた。誰も見ていない→ゴン太の証言。分断→四角いガラス板。増えたピラニアを提示。'],
 ['改装时间→昨晚夜间之前；出示星的目击资料。恐慌“始终在体育馆”→王马证词；排除入间；动机影片→春川。休庭。','Tank setup: before nighttime. Present Ryoma’s sighting. Stayed in the gym → Kokichi’s account; exclude Miu; motive video: Maki. Recess.','細工は昨日の夜時間前。星の目撃情報。体育館にいた→王馬の証言。入間を除外、動機ビデオは春川。休廷。']
 ],[
 ['指认王马；“不能证明两人见面”→将独自一人的春川言弹变成谎言。争辩：广播／看漏／校规／水槽／禁止／证词。','Identify Kokichi. Lie with Maki being alone. Scrum: announcement / overlooked / rules / tank / forbidden / testimony.','王馬を指定。一人だった春川をウソダマに。スクラム：アナウンス／見逃し／校則／水槽／禁止／証言。'],
 ['梯子→够不到窗；“只能走泳池”→泳池校规；依次出示受损洗手台、手铐，点击窗户。','Ladder: cannot reach window. Pool route → pool rules. Present damaged sink and cuffs; select the window.','脚立は窓に届かない。プール経由→プールの校則。傷付いたシンクと手錠を提示し窓を指定。'],
 ['脑内驾车：教室窗／体育馆窗／两窗之间直接运输。点击绳索，出示网球网钢线；字谜→索道；挖掘→泳圈。','Psyche Taxi: classroom window / gym window / directly between them. Select rope, present tennis-net cable; puzzle: ropeway; excavate inner tube.','ブレインドライブ：教室の窓／体育館の窓／窓から窓へ直接。ロープ、ネットのワイヤー、字謎はロープウェイ、発掘は浮き輪。'],
 ['泳圈没丢弃→夜间限制；指认东条。“谁都能做”→昨晚所有人的不在场证明；反论无证据→窗框伤痕；出示黑布；理论武装→东条的手套。','Inner tube: nighttime rules; identify Kirumi. Anyone could do it → alibis. Rebut lack of proof with window scratches; present black cloth; finish with Kirumi’s gloves.','浮き輪は夜時間のため。東条を指名。誰でも可能→昨日のアリバイ。証拠なし→窓枠の傷。黒い布切れ、最後は東条の手袋。'],
 ['漫画依次核对：手铐沉水、水槽盖、绳索、窗框、被铐的星、泳圈运输、手套摩擦与食人鱼。','Comic order: submerged cuffs, tank lid, rope, window frame, restrained Ryoma, inner-tube transport, glove friction and piranhas.','漫画：沈む手錠、水槽のフタ、ロープ、窓枠、手錠の被害者、浮き輪、手袋の摩擦、ピラニア。']
 ]],[[
 ['“仪式成功”→死者之书；“强行闯入”→白银证词；恐慌讨论“只有学生会成员”→王马撬锁。上锁的门选美术教室后门，挖掘选择金箔日本刀。','Ritual succeeded → Necronomicon; broke in → Tsumugi’s account; Mass Panic, only student-council members → Kokichi’s lockpicking. Select the art lab’s back door, then uncover the Gold Leaf Katana.','儀式が成功→屍者の書。押し入って→白銀の証言。生徒会メンバーだけ→王馬のピッキング。扉は美術教室の裏扉、発掘は金箔の日本刀。'],
 ['脑内驾车：刀柄／刺入蜡像／旋转，说明美术教室滑闩的上锁方法。','Psyche Taxi: Katana’s Hilt / stabbed into the effigy / spinning it, explaining the art lab’s sliding lock.','ブレインドライブ：日本刀の柄／刀を蝋人形に刺した／回転させた。美術教室のスライド錠を説明する。'],
 ['降灵术参加者→真宫寺、王马、最原、梦野；点击左后方地板。“床下照明”→角落缝隙。','Participants: Korekiyo, Kokichi, Shuichi and Himiko; select the rear-left floor. Light beneath floor → corner gap.','参加者は真宮寺・王馬・最原・夢野。左奥の床。床下の明かり→部屋の隅の隙間。'],
 ['“开笼时”→白布；反论够不到脖子→标记石头；指认茶柱，再用“并非即死”的言弹进行伪证。','Opening the cage → white sheet. Neck reach → marker stone. Identify Tenko; lie using the non-instant-death statement.','カゴを開ける→白い布。首筋まで→目印の石。茶柱を指定し、即死でなかった茶柱をウソダマに。'],
 ['“东西掉下”→仪式中的声响；出示脱落地板；“踩穿地板”→床下横木。字谜→跷跷板；镰刀位置→铁笼底部。休庭。','Something fell → séance noise; present loose floorboard. Breaking through → crosspiece. Gambit: SEESAW EFFECT; sickle location: cage bottom. Recess.','落下物→降霊術の物音。外れた床板。踏み抜く→床下の横木。字謎はシーソー、カマは鉄カゴの底。休廷。']
 ],[
 ['“别的房间也有”→浑身血的王马；出示真宫寺的魔法阵，指认真宫寺。黑暗中定位→触觉；字谜→盐画的魔法阵。','Other rooms → bloody Kokichi; present Korekiyo’s circle and identify him. Navigation: touch; Gambit: MAGIC CIRCLE.','他の部屋にも→血まみれの王馬。真宮寺の魔法陣、真宮寺を指定。移動は触覚、字謎は塩の魔法陣。'],
 ['点击伸向角落的盐线；反论无法两案兼顾→白布。争辩：真宫寺／安琪／研究教室／凶手／规则／谜。','Select the salt line toward the corner; rebut with the white sheet. Scrum: Korekiyo / Angie / research lab / culprit / rules / mystery.','隅へ続く塩の線を指定。反論は白い布。スクラム：真宮寺／アンジー／研究教室／クロ／ルール／謎。'],
 ['出示床下干血；时间→仪式前，血属于安琪。“来找蜡烛”→死者之书；出示额头伤口。','Present dried blood: before the séance, belonging to Angie. Came for candles → Necronomicon; present the forehead injury.','床下の乾いた血は降霊術前のアンジーのもの。ロウソク目的→屍者の書。前頭部の裂傷を提示。'],
 ['反论“没有证据”→染血胶带；再次指认真宫寺；意外遇害者→安琪；理论武装→脱落的地板。','No evidence → bloody tape; identify Korekiyo again. Accidental victim: Angie. Argument Armament: loose floorboard.','証拠なし→血濡れのテープ。再び真宮寺。偶発的被害者はアンジー。理論武装は外れた床板。'],
 ['漫画：切横木、松地板、贴胶带、刀插蜡像并旋转上锁；准备石头与镰刀，熄灯后沿盐线踩下机关。','Comic: cut crosspiece, loosen floor, tape, rotate the katana-bearing wax figure to lock; prepare stone/sickle, extinguish light and follow salt to the lever.','漫画：横木を切り床板とテープを準備。刀を刺した蝋人形を回して施錠。石とカマを置き、消灯後に塩の道から床板を踏む。']
 ]],[[
 ['“毒杀”→毒药小瓶；出示杀人模拟器。“绞杀”→入间遗体；出示厕纸，反论易断→模拟器规则。','Poisoning → poison bottle; present the simulator. Strangling → Miu’s body; present toilet paper, then rebut tearing with simulator rules.','毒殺→毒の小ビン、シミュレーター。絞殺→入間の死体。トイレットペーパー。破れる→シミュレーター。'],
 ['锤子准备者→入间，目的→杀王马。脑内驾车：入间／程序世界／伪装；不能放毒→登录登出记录；出示手机。','Hammer: prepared by Miu to kill Kokichi. Taxi: Miu / virtual world / staging. Poison placement → login/logout log; present phone.','ハンマーは入間、王馬を殺すため。ドライブ：入間／プログラム世界／偽装。毒を置けない→ログ。携帯電話を提示。'],
 ['“一直在教会”→白银证词；“专用隐藏路线”→入间设置的墙；反论不是物件→入间角色设定。','Stayed by chapel → Tsumugi’s account. Secret route → Miu’s wall; rebut not an object with Miu’s avatar settings.','教会付近→白銀の証言。隠しルート→入間の壁。物ではない→入間のアバター。'],
 ['出示巨大声响；挖掘告示牌。驾车：大河／教会侧／洋馆侧／逆流；出示墙，选择上下游相连、同一堵墙；字谜→循环世界；在地图上点击波浪线标出的切换边界，再进入休庭。','Present loud noise; excavate signboard. Taxi: large river / chapel / mansion / upstream. Present wall; choose connected river ends and one wall. Gambit: WORLD LOOPS. Select the map’s wavy boundary line before recess.','物音、看板。ドライブ：太い川／教会側／館側／逆流。壁を提示し上下流が接続・同じ壁。字謎はループせかい。地図の波線で示された切り替えポイントを指定して休廷。']
 ],[
 ['声音→角色撞墙；字谜→滑梯。“没有那种道具”→教会旁木板；指认王马，挖掘他没上屋顶的发言。','Noise: avatar hitting wall. Gambit: SLID OFF ROOF. No such tool → chapel lattice; identify Kokichi and select his never-visiting-the-roof claim.','音はアバターと壁。字謎は滑り台。道具なし→教会のスノコ。王馬を指定し屋上に行っていない発言を選ぶ。'],
 ['“一直在沙龙”→将沙龙里的王马变为谎言；“可以一直勒”→王马的角色设定。','Always in the salon → lie with Kokichi in the salon. Could keep strangling → Kokichi’s avatar settings.','サロンにいた王馬をウソダマに。締め続ける→王馬のアバター設定。'],
 ['争辩：凶手／温柔的人／屋顶／玄关／黑白熊／王马／入间。记忆异常发生在登出后；出示角色错误；字谜→失忆。','Scrum: culprit / kind person / rooftop / entrance / Monokuma / Kokichi / Miu. Memory issue: after logout; present avatar error; Gambit: MEMORY LOSS.','スクラム：犯人／優しい人／屋上／玄関／モノクマ／王馬／入間。ログアウト後のエラー、字謎は記憶喪失。'],
 ['恐慌“没错误”→头戴装置说明。排除原因依次为去不了现场／已登出／互为证人／无法杀入间；指认狱原权太。','No error → headset instructions. Exclude suspects by access, logout, mutual alibi and inability to kill Miu; identify Gonta.','エラーなし→装置の仕様。除外理由は現場に行けない／ログアウト／互いのアリバイ／入間を殺せない。獄原ゴン太を指定。'],
 ['理论武装→洋馆外的厕纸；点击望远镜。漫画核对接反电线、毒瓶、地图、告示牌、电话、厕纸、木板雪橇与望远镜支柱。','Armament: toilet paper outside mansion; select telescope. Comic: reversed cables, poison, map, sign, phone, paper, lattice sled and telescope support.','理論武装は館の外のトイレットペーパー、望遠鏡を指定。漫画はコード逆接続・毒・地図・看板・電話・紙・スノコ・望遠鏡支柱。']
 ]],[[
 ['“没有一件”→王马衣服；选择衣袖；反论没穿袖→百田制服。压死→安全装置；出示拖拽血迹。','Nothing there → Kokichi’s clothes; select sleeve. Not wearing it → Kaito’s uniform. Crushed → safety sensor; present drag marks.','何もない→王馬の服。袖を選択。腕を通してない→百田の制服。圧死→安全装置。引きずった血痕。'],
 ['点击衣袖破洞、出示弩。“必须进机库”→厕所窗；恐慌空手→机望证词；“没用弩”→弩。','Select sleeve hole and crossbow. Must enter hangar → bathroom window. Empty-handed → Keebo’s account; no crossbow → crossbow.','袖の穴、クロスボウ。格納庫に入る必要→トイレの窓。手ぶら→キーボの証言。未使用→クロスボウ。'],
 ['委托梦野的人→百田；出示王马衣服，选择百田。争辩：黑白兽／伤／压机／箭伤／主谋／活着。','Himiko’s requester: Kaito; present Kokichi’s clothes and select Kaito. Scrum: Exisal / injury / press / arrow wound / mastermind / alive.','夢野への依頼は百田。王馬の服、百田。スクラム：エグイサル／ケガ／プレス／矢の傷／首謀者／生きてる。'],
 ['“一支箭”→三支箭；驾车：一支／不是／第三者；字谜→黑白兽；“所有锤都充电”→用过的电子锤。','One arrow → three arrows. Taxi: one / no / third party. Puzzle: Exisal. All hammers charging → used hammer.','矢1本→3本の矢。ドライブ：1本／ない／第三者。字謎はエグイサル。全ハンマー充電中→使用済みハンマー。'],
 ['指认春川；反论不致命→毒药；牺牲→幸存者的性命，随后休庭。','Identify Maki; rebut nonfatal with poison. Sacrifice: surviving students’ lives. Recess follows.','春川を指定。致命傷でない→毒薬。犠牲は生き残った全員の命。休廷。']
 ],[
 ['选择操作台划痕。“安全装置百分百有效”→电子炸弹；用途→解除安全装置；被推翻的是百田死因。','Choose control-panel scratches. Sensor always works → Electrobomb; purpose: disable sensor; disputed premise: Kaito’s cause of death.','パネルの傷。必ず作動→エレクトボム。目的は安全装置解除、覆るのは百田の死因。'],
 ['出示压机，选择无法判断；本轮投票任意。四台黑白兽是在监视；出示尸体影片；字谜→受害者。','Present press; cause cannot be determined. Any vote works here. Exisals were monitoring; present video; puzzle: victim.','プレス機、判断不能。この投票は誰でも可。エグイサルは見張り。死体映像、字謎は被害者。'],
 ['“压机停了一瞬”→压机；挖掘操作台、摄像机，点击黄色操作台平台；交换的人→机库内两人；字谜→受害者配合。','Brief press stop → press. Excavate controls/camera; select the yellow platform. Swap: the two in hangar. Gambit: VICTIM HELPED.','一瞬停止→プレス機。操作パネルとカメラを発掘、黄色い足場を指定。交換は格納庫の2人。字謎は被害者の協力。'],
 ['指认百田；理论武装→假装喝药。漫画按弩箭、毒与解药、电子炸弹、影片拍摄和压机互换的顺序整理。','Identify Kaito; Armament: pretend to drink. Comic: arrows, poison/antidote, bomb, recording and press swap.','百田を指名。理論武装は飲んだフリ。漫画は矢・毒と解毒薬・ボム・撮影・プレス機の入れ替え。'],
 ['漫画后仍有讨论：“死的是王马”→将消失的王马言弹变为谎言，完成本章。','One debate follows the comic: lie using Kokichi’s disappearance against the claim he died.','漫画後の議論：死んだのは王馬→消えた王馬をウソダマにして完了。']
 ]]
];
for(let ch=1;ch<=5;ch++)for(let part=1;part<=2;part++)add(`trial-${ch}${part===2?'-2':''}`,ch,trial,[`第 ${ch} 章 · 学级裁判${part===1?'前':'后'}半场`,`Chapter ${ch} · Trial, part ${part}`,`第${ch}章・学級裁判${part===1?'前半':'後半'}`],[[answers,trialRows[ch-1][part-1]]],[`v3-${ch}-saiban`],part);
add('trial-6',6,trial,['第 6 章 · 最终学级裁判','Chapter 6 · Final class trial','第6章・最終学級裁判'],[[['重审第一案','Revisit the first case','最初の事件の再審'],[
 ['目的→重审过去案件；天海才能→生存者；发现隐藏门→生存者特典。用特典手册反驳“只有天海”。','Purpose: retry old cases. Rantaro: survivor; hidden door: survivor perk. Refute only Rantaro with the Survivor Perk Monopad.','目的は過去事件の再審。天海は生存者、扉は生存者特典。天海だけ→特典のモノパッド。'],
 ['反论没带特典→死亡前照片；驾车：两台／特典手册／隐藏房间／主谋。不能观察图书室→第六只黑白熊仔。','Perk not carried → final photo. Taxi: two / perk pad / hidden room / mastermind. Cannot see library → sixth Monokub.','特典なし→死ぬ直前の写真。ドライブ：2つ／特典パッド／隠し部屋／首謀者。図書室を見られない→6体目のモノクマーズ。'],
 ['真凶→主谋；赤松的砲丸→带粉色纤维的砲丸；它被主谋带走。第十七人→主谋线索；真凶在参加者中，核对不在场证明。','Killer: mastermind. Kaede’s ball → pink-fiber ball, taken by mastermind. Seventeenth person → mastermind clue; investigate participants’ alibis.','真犯人は首謀者。赤松の砲丸→ピンクの繊維。首謀者が持ち去った。17人目→首謀者の手掛かり。参加者のアリバイを調べる。'],
 ['白银无法作案→隐藏通道；反论主谋证据→黑白熊妈妈声纹认证；指认白银。漫画重建第一案的真实过程。','Tsumugi could not kill → secret passage. Proof of mastermind → Motherkuma voiceprint. Identify Tsumugi; reconstruct the first case.','白銀の不可能→隠し通路。首謀者の証拠→マザーモノクマの声紋認証。白銀を指名し最初の事件を再構成。']
 ]],[['终局与等待操作','Finale and deliberate inaction','終盤と待機操作'],[
 ['接下来的三段讨论使用希望峰官方资料集；出示王马动机影片；字谜→植入、53；挖掘→TEAM DANGANRONPA。','Use the academy book in the next three debates; present Kokichi’s motive video. Gambits: IMPLANT, 53. Excavate TEAM DANGANRONPA.','続く3議論は希望ヶ峰公式資料集。王馬の動機ビデオ。字謎は植え付ける・53。TEAM DANGANRONPAを発掘。'],
 ['选择虚构存在、普通人。假结局询问是否保存时选否；是否救济选是。内心声音→观众投票。','Choose fictional beings and ordinary people. At the fake ending, decline saving and accept rescue; inner voice: audience survey.','フィクション・普通の一般人。仮の結末では保存しない、救済する。内なる声は視聴者のアンケート。'],
 ['恐慌讨论及反论用“希望”。最后惩罚→参加下一场自相残杀；对“希望”使用希望言弹的谎言版本。','Use Hope in Mass Panic and rebuttal. Punishment: another killing game; lie with Hope against the hope statement.','パニックと反論は希望。最後のおしおきは次のコロシアイ。希望に対して希望のウソダマ。'],
 ['之后用“使用生命”赞同对抗外界和结束自相残杀。接下来的讨论、字谜、驾车、选择题都等待倒计时结束。','Agree with fighting the outside world and ending the game using Use Our Lives. Then deliberately time out the debate, word puzzle, taxi and choice.','命を使うで外の世界との戦いと終結に賛成。その後の議論・字謎・ドライブ・選択肢は時間切れまで待つ。'],
 ['最终理论武装依次选择：虚构也能改变世界／自相残杀是错的／不是白费、用生命作为武器／亲手结束弹丸论破。最后投票不投给任何人，等待超时；字幕后在标题画面等待尾声。','Final Argument Armament, in order: fiction can change the world; the killing game is wrong; our lives are our weapons; end Danganronpa with our own hands. Abstain until timeout, then wait at the title screen after credits for the epilogue.','最後の理論武装は、フィクションだって変えられる／コロシアイは間違い／無駄ではなく命を使う／みんなの手でダンガンロンパを終わらせる、の順。投票せず時間切れを待ち、スタッフロール後はタイトルでエピローグを待つ。']
 ]]],['v3-6-saiban']);
const hiddenRows=[
 [
 ['日常第 1 天：地下二楼游戏室，右后方游戏机背后；一楼女厕，洗手台右侧。','Day 1: behind the rear-right game machine in the B2 game room; right of the girls’ bathroom sink.','1日目：B2ゲームルーム右奥のゲーム機裏、1F女子トイレ洗面台の右。'],
 ['日常第 3 天：中庭校舍正门左侧长椅；一楼小卖部东侧桌上。','Day 3: courtyard bench left of the school entrance; table east of the first-floor store.','3日目：中庭の校舎正面左のベンチ、1F購買部東の机。'],
 ['裁判：闪耀字谜中，黑白熊混在球体里经过。','Trial: spot Monokuma among the spheres in Hangman’s Gambit.','裁判：閃きアナグラムの球に混ざって流れる。']
 ],[
 ['日常第 1 天：三楼走廊长椅下；中庭校舍正门右侧道路尽头。','Day 1: under a third-floor corridor bench; far end of the path right of the main entrance.','1日目：3F廊下のベンチ下、中庭の校舎正面右の突き当たり。'],
 ['日常第 2 天：发明家研究教室沙发后；一楼仓库左侧架子第五层。','Day 2: behind the inventor-lab sofa; fifth shelf on the left in the first-floor warehouse.','2日目：発明家教室のソファ奥、1F倉庫左棚の5段目。'],
 ['裁判：脑内驾车 PHASE 3 的双车道区域。','Trial: Psyche Taxi, phase 3, in the two-lane section.','裁判：ブレインドライブPHASE3の2車線区間。']
 ],[
 ['日常第 1 天：中庭裁决之祠前。第 2 天：后院校舍后的建筑。','Day 1: courtyard, before the Shrine of Judgment. Day 2: building behind the school in the backyard.','1日目：中庭の裁きの祠前。2日目：裏庭の校舎裏の建物。'],
 ['日常第 2 天：赌场区域爱情旅馆前；钢琴家研究教室钢琴前。','Day 2: in front of the Love Suite in the casino area; in front of the piano in the pianist lab.','2日目：カジノ区域のラブアパート前、ピアニスト教室のピアノ前。'],
 ['裁判：挖掘想象中埋藏的一只。','Trial: uncover Monokuma during Mind Mine.','裁判：発掘イマジネーションに埋まっている。']
 ],[
 ['日常第 1 天：合气道教室入口下方；二楼中央挑空处栏杆；宿舍楼梯。','Day 1: below the aikido-lab entrance; second-floor atrium railing; dormitory stairs.','1日目：合気道教室に入ってすぐ下、2F吹き抜けの手すり、寄宿舎の階段。'],
 ['日常第 2 天：地下一楼走廊楼梯旁桌上。','Day 2: on the table next to the basement corridor stairs.','2日目：B1F廊下の階段横の机。'],
 ['裁判：第二次闪耀字谜的球体中。','Trial: in the second Hangman’s Gambit.','裁判：2回目の閃きアナグラム。']
 ],[
 ['日常第 1 天：五楼侦探教室前；角色扮演家教室拍摄布景上。','Day 1: outside the fifth-floor detective lab; atop the cosplayer-lab photo set.','1日目：5F探偵教室前、コスプレイヤー教室の撮影セット上。'],
 ['日常第 2 天：机器人教室中央地板；四楼楼梯前地藏像上。','Day 2: center floor of the robot lab; on the statue before the fourth-floor stairs.','2日目：ロボット教室中央の床、4F階段前の地蔵上。'],
 ['裁判：第一次脑内驾车 PHASE 2，从左数第二条车道。','Trial: first Psyche Taxi, phase 2, second lane from the left.','裁判：最初のブレインドライブPHASE2、左から2車線目。']
 ],[
 ['搜查：五楼楼梯扶手；螺旋楼梯中央柱的扶手部分。','Investigation: fifth-floor stair railing; railing on the spiral staircase’s central column.','捜査：5F階段の手すり、螺旋階段の中央柱の手すり。'],
 ['搜查：中庭泳池到后院的道路；一楼玄关大厅瓦砾处。','Investigation: courtyard path between pool and backyard; rubble in the first-floor entrance hall.','捜査：中庭のプール〜裏庭の道、1F玄関ホールの瓦礫。'],
 ['裁判：挖掘想象左上角。','Trial: upper-left area of Mind Mine.','裁判：発掘イマジネーション左上。']
 ]
];
for(let ch=1;ch<=6;ch++)add(`hidden-${ch}`,ch,hidden,[`第 ${ch} 章 · 五只隐藏黑白熊`,`Chapter ${ch} · Five Hidden Monokumas`,`第${ch}章・隠れモノクマ5体`],[[['位置与时段','Locations and timing','場所と時期'],hiddenRows[ch-1]]],['v3-hidden']);
const branches=[
 ['第 1 章 PHASE 13：对“不要迷失真相”使用图书室通风口的谎言版本。','Chapter 1, phase 13: lie with the library vent against the warning not to lose sight of truth.','第1章PHASE13：「真実を見失わないでね」に図書室の通気口のウソダマ。'],
 ['第 2 章 PHASE 1：对“没有机关”使用水槽机关的谎言版本。PHASE 13：对“几乎没人有”使用昨晚所有人不在场证明的谎言版本。','Chapter 2: phase 1, no trick → lie with tank mechanism; phase 13, almost nobody has one → lie with everyone’s alibis.','第2章：PHASE1「トリックなどない」に水槽の仕掛け、PHASE13「ほとんどの人がない」に昨日のアリバイのウソダマ。'],
 ['第 3 章 PHASE 6：对“用那个功能在床下移动”使用机望照明功能的谎言版本。PHASE 13：对“被人引导”使用笼犬村仪式资料的谎言版本。','Chapter 3: phase 6, moving beneath floor with that function → lie with Keebo’s light; phase 13, being led → lie with the Caged Child document.','第3章：PHASE6「あの機能で床下を移動」にキーボのライト、PHASE13「誰かに誘導された」に籠犬村のかごのこのウソダマ。'],
 ['第 4 章 PHASE 1：对“被毒药杀死”使用毒药小瓶的谎言版本。PHASE 14：对“没有那种道具”使用桥用告示牌的谎言版本。','Chapter 4: phase 1, killed by poison → lie with poison bottle; phase 14, no such tool → lie with signboard used as bridge.','第4章：PHASE1「毒薬で殺害」に毒の小ビン、PHASE14「そんな道具はない」に橋の看板のウソダマ。'],
 ['第 5 章 PHASE 3：对“被压机压死”使用尸体影片的谎言版本。PHASE 11：对“无法坐进去”使用驾驶舱电子锁的谎言版本。','Chapter 5: phase 3, crushed by press → lie with body video; phase 11, cannot board it → lie with locked cockpit hatch.','第5章：PHASE3「プレスして殺された」に死体映像、PHASE11「乗り込むのは無理」に電子ロックされたハッチのウソダマ。']
];
add('back-routes',null,how,['九处伪证隐藏分支','Nine optional Back Routes','9か所の裏ルート'],[[['进入方式','How to enter','入り方'],[
 ['在指定不间断讨论中，长按发射键把正确言弹变为谎言，再射击对应发言。可选分支改变紧随其后的对话，不改变主线结局。','In the specified Nonstop Debate, hold the fire control to turn the listed Truth Bullet into a lie, then hit the relevant claim. Optional branches change nearby dialogue, not the story ending.','該当するノンストップ議論で長押ししてウソダマにし、指定発言に撃つ。直後の会話が変わるが物語の結末は変わらない。'],
 ['这里列出可选分支；剧情必需的伪证另见各章裁判。第 6 章没有可选隐藏分支。PHASE 是攻略中的讨论次序。','These are optional branches; mandatory lies are covered in trial guides. Chapter 6 has no optional Back Route. Phase numbers follow the reference debate order.','ここでは任意の裏ルートを掲載。必須の偽証は各章を参照。第6章に裏ルートはなく、PHASEは資料の議論順。']
 ]],[['各章时机','Chapter triggers','各章のタイミング'],branches]],['v3-back']);
add('gifting',null,how,['送礼与数量记录','Gifts and inventory records','プレゼントと所持数の記録'],[[['查找合适的礼物','Find suitable gifts','好みのプレゼントを探す'],[
 ['通讯录提供“非常喜欢”和“喜欢”两种偏好；勾选“只看持有”，按当前背包数量筛选。','The directory separates Loved and Liked gifts. Enable Owned only to match your inventory.','通信簿では「大好き」と「好き」を区別。「所持のみ」で所持品と照合できる。'],
 ['礼物图鉴可搜索中文、日文、英文、编号或角色名。未录入表示未知，数量 0 表示确认没有。','Search by Chinese, Japanese, English, ID or student name. Unrecorded is unknown; zero means confirmed absent.','中国語・日本語・英語・番号・生徒名で検索。未記録は不明、0は所持していないことを表す。'],
 ['“记为已赠送”只会把浏览器记录减 1，不会修改游戏。重新导入存档会覆盖当前作品的数量；阅读位置保留。','Mark as given subtracts one browser record only. A new save import replaces this game’s inventory and preserves reading position.','贈呈済みにするとブラウザーの記録だけ1個減る。再取込は作品の所持数を置換し、読書位置は保持。']
 ]]],['v3-prefs','v3-rpg-prefs']);
add('special-events',null,how,['特殊礼物与限时场景','Special presents and timed scenes','特定プレゼントのイベント'],[[['持有后按时交谈','Keep the item and talk at the right time','所持して指定時期に会話'],[
 ['028 指甲刷：第 1 章第 2 天早晨，在一楼走廊与白银交谈。','028 Nail Brush: chapter 1, morning of day 2; talk to Tsumugi in the first-floor corridor.','028ネイルブラシ：第1章2日目朝、1F通路の白銀。'],
 ['078 随身阳伞：第 2 章第 1 天早晨，与玄关大厅的茶柱交谈。062 纪念徽章组：第 2 章第 4 天早晨，与宿舍出口右侧中庭的入间交谈。','078 Parasol: chapter 2, day 1 morning, Tenko in entrance hall. 062 Medal Set: chapter 2, day 4 morning, Miu right of the dormitory exit.','078パラソル：第2章1日目朝の玄関の茶柱。062記念メダル：第2章4日目朝、寄宿舎を出て右の入間。'],
 ['111 男人的浪漫炮：第 3 章第 3 天早晨，与中庭梦野交谈。','111 Man’s Passion: chapter 3, day 3 morning; talk to Himiko in the courtyard.','111男のロマン砲：第3章3日目朝、中庭の夢野。'],
 ['113 黑带：第 4 章第 2 天早晨，与中庭梦野交谈。112 纯白模拟刀：第 4 章第 3 天早晨，与中庭百田交谈。','113 Dark Belt: chapter 4, day 2 morning, Himiko in courtyard. 112 Practice Sword: day 3 morning, Kaito in courtyard.','113ダークベルト：第4章2日目朝の中庭の夢野。112模擬刀：3日目朝の中庭の百田。'],
 ['130 爱情钥匙：第 2 章起在赌场花 10,000 金币兑换；持有后于夜间触发黑白熊说明。以上场景需要持有道具，提前送掉可能错过。','130 Love Key: exchange 10,000 casino coins from chapter 2; keep it for Monokuma’s nighttime event. Keep event items until their trigger to avoid missing scenes.','130愛の鍵：第2章以降カジノで1万枚交換し、夜に所持イベント。必要な品を先に贈るとイベントを逃すことがある。']
 ]]],['v3-events']);
add('casino-gifts',null,how,['赌场与礼物获取','Casino and present acquisition','カジノとプレゼント入手'],[[['获取渠道','Acquisition channels','入手方法'],[
 ['普通礼物在小卖部黑白熊扭蛋机随机获得；赌场限定品需要赌场金币，不能把徽章数当成赌场余额。','Normal gifts come from the store’s MonoMono Machine. Casino exclusives use casino coins, a separate balance from Monocoins.','通常品は購買部のモノモノマシーン。カジノ限定品はコインを使い、モノクマメダルとは別残高。'],
 ['部分赌场商品随章节补货。示例：019 水晶手镯，第 2 章起 1,000 金币；045 高级耳机，第 3 章起 2,000；018 银耳环，第 5 章起 1,000。','Casino stock expands by chapter: 019 Crystal Bangle, chapter 2, 1,000; 045 Headphones, chapter 3, 2,000; 018 Silver Earring, chapter 5, 1,000.','章で入荷が変わる。019バングルは2章1000枚、045ヘッドホンは3章2000枚、018ピアスは5章1000枚。'],
 ['通关奖励、交流纪念品和特殊道具另有条件。142 外出票、143 黑白维他命 V3 在红鲑团中兑换，分别需 100、50 金币。','Chapter rewards, friendship mementos and special items have separate conditions. Salmon mode tickets 142 and vitamins 143 cost 100 and 50 casino coins.','章報酬・交流記念品・特殊品は別条件。紅鮭団の142デートチケットは100枚、143モノナミンV3は50枚。']
 ]]],['v3-presents','v3-casino']);
add('death-road',null,how,['绝望死亡之路','Death Road of Despair','絶望のデスロード'],[[['挑战与奖励','Challenge and reward','挑戦と報酬'],[
 ['第 1 章剧情中首次进入，失败也能推进故事；自由行动开放后可从后院井盖反复挑战。','The first chapter introduces this challenge; failing advances the story. During free time, retry through the backyard manhole.','第1章の初回は失敗でも進行。自由行動後は裏庭のマンホールから再挑戦できる。'],
 ['队伍人数就是剩余机会；后方同学碰到陷阱也会损失人数。尽量在第 1 章全员在场时挑战。','Your party is your life pool, including followers who hit traps. Chapter 1 gives the largest party.','生徒人数が残機。後続が罠に触れても減る。人数の多い第1章で挑戦しやすい。'],
 ['躲避机关到达终点，可获得对应的游戏内手册外观；本站保持 01 默认外观。','Reach the goal past the traps to unlock an in-game handbook skin. This website uses preset 01.','罠を避けゴールするとゲーム内の手帳着せ替えを入手。当サイトは01プリセット。']
 ]]],['v3-deathroad']);
add('postgame',null,how,['通关后的额外模式','Postgame modes','クリア後のおまけモード'],[[['保存通关记录','Keep your clear save','クリアデータを保存'],[
 ['完成最终裁判并保存通关记录后，标题菜单开放额外内容。可重选章节补收隐藏道具。','Complete the final trial and keep the clear save to unlock extra modes. Chapter Select helps revisit missed collectibles.','最終裁判を終えてクリアデータを保存すると追加モードが開放。チャプター選択で収集を補える。'],
 ['红鲑团：在没有主线杀人事件的环境中与同学交流，继续收集个人纪念品；外出票与维他命使用赌场兑换。','Salmon mode supports student interaction and memento collection without story murders; date tickets and vitamins are casino rewards.','紅鮭団：コロシアイのない交流と記念品集め。デートチケットとモノナミンはカジノで交換。'],
 ['才能育成计划：通过棋盘培养角色；黑白熊的试炼：使用培养的角色探索地下城。图鉴与素材资料可从 EXTRA 查看。','Development Plan trains characters on boards; Despair Dungeon uses those characters in dungeon exploration. EXTRA contains galleries.','才能育成計画でボード育成し、モノクマの試練で育成キャラを使って探索。EXTRAはギャラリー。']
 ]]],['v3-clear']);
