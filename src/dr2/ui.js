import {copy} from './guides.js';
for(const row of [
 ['上一件礼物','Previous present','前のプレゼント'],
 ['下一件礼物','Next present','次のプレゼント'],
 ['宠物玩法','Pet guide','電子ペットの遊び方'],
 ['例如：001、矿泉水、七海','Try: 001, Mineral Water, Chiaki','例：001、ミネラルウォーター、七海'],
 ['Windows 常见位置：文档 / My Games / Danganronpa2。使用游戏已正常保存的文件。','Windows: Documents / My Games / Danganronpa2. Use a normally saved game file.','Windows：ドキュメント / My Games / Danganronpa2。正常に保存したセーブを使用。'],
 ['3DM · 隐藏黑白熊位置','3DM · Hidden Monokumas','3DM · カクレモノクマ'],
 ['游民星空 · 超级弹丸论破 2 全流程','GamerSky · DR2 walkthrough','GamerSky · 2作目の攻略'],
 ['以日向的视角，与同学们一起探索贾巴沃克岛。','Explore Jabberwock Island through Hajime’s eyes.','日向の視点でジャバウォック島を探索しよう。'],
 ['选择《超级弹丸论破 2》Steam PC 版的','Select Danganronpa 2’s Steam PC','Steam PC版スーパーダンガンロンパ2の'],
 ["当前读取 001–140，已与玩家提供的全部数量及未解锁位置逐项核对。0xFF 对应此存档的未解锁条目，网站保留为未录入。", "Reads 001–140, individually matched to the player’s quantities and locked entries. In this save, 0xFF marks locked entries and remains unrecorded here.", "001～140はプレイヤー提供の数量と未解放の位置を個別照合済み。このセーブの0xFFは未解放を表し、サイトでは未記録のまま保持。"],
 ['当前支持已核对的中文版 2 代 Steam PC 布局；其他布局会拒绝导入。','Supports the checked Chinese DR2 Steam PC layout. Other layouts are rejected.','照合した中国語Steam PC版2作目の構造に対応。他の構造は取り込めません。'],
 ['文件大小异常。请选择当前作品的 Steam PC 存档。','Unexpected file size. Select the current game’s Steam PC save.','サイズが不正です。現在の作品のSteam PCセーブを選択してください。'],
 ['确认覆盖当前作品记录？','Replace this game’s records?','現在の作品の記録を置換しますか？'],
 ['会将当前作品所有未知数量设为 0；已经填写的数量不变。请确认未录入的礼物确实没有持有。','Sets this game’s unknown quantities to zero, keeping existing values. Confirm you do not own these presents.','現在の作品の未記録を0にします。入力済みは維持。該当品を持っていないことを確認してください。'],
 ['提供 1 代与 2 代的资料、攻略和背包工具，支持简体中文、英语与日语。V3 入口预留。角色页面提供资料与礼物偏好。','Data, guides and inventory tools for DR1 and DR2 in Chinese, English and Japanese. V3 is planned. Character pages include profiles and gift preferences.','1・2作目の資料、攻略、所持品ツールを中英日で提供。V3は今後の対象。人物ページにプロフィールと好みを掲載。'],
 ["2 代读取 001–140；全部 140 项的数量及未解锁位置已由玩家列表核对。12 个未解锁条目的 0xFF 保留为未录入。", "DR2 reads 001–140. All 140 quantities and locked positions match the player’s list. The twelve locked entries use 0xFF and remain unrecorded.", "2作目の001～140は全項目の数量と未解放の位置をプレイヤーのリストで照合済み。未解放12項目の0xFFは未記録のまま保持。"],
 ['文档 / My Games / Danganronpa2。使用游戏已正常保存的文件。','Documents / My Games / Danganronpa2. Use a normally saved game file.','ドキュメント / My Games / Danganronpa2。正常に保存したファイルを使用。']
])copy(...row);
