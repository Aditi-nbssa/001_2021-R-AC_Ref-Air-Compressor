// 2021/03/19 ポーズボタン無効処理追加
// 2021/03/04 不要箇所削除
// 2021/02/22 メインページ初期表示画面変更処理、Tracker処理追加
// 2021/02/17 ページ初期化にセクション指定追加
// 2021/02/16 シーン2用　next prevボタン処理追加
// 2021/02/11 InitAnimをライブラリに持ってくる
// 2021/02/10 最終フレームでplayバグ修正
// 2021/02/04 スライダー修正
// 2021/01/21 セッションストレージでデータ受け渡し処理追加
// 2021/01/18 Start()に開始位置の引数追加
// 2021/01/13 スライダー計算追加
// 2021/01/05 ページ遷移追加
// 2020/12/25 ページ処理追加
// 2020/12/23 スライダーの追従精度アップ

// 各ボタンは以下の名前で定義されている必要がある
// next       次ページ移動ボタン
// previous   前ページ移動ボタン
// playpau    再生/ポーズボタン(元データはPlayPau)
// replay     リプレイボタン
// slider     スライダーボタン(元データはScrollBox)
// back       BackTo系ボタン
// page       ページ番号のテキスト
// textbox    メニューのサブタイトル
// next2      シーン2 次ページ移動ボタン
// previous2  シーン2 前ページ移動ボタン

//-------------------------------------
// グローバル変数の初期化
//-------------------------------------
// HTML関連
const Htm			= ".html";

// ページ関連
var Sect		= 0;	// ページの一つ上の塊(指定が無ければ0)
var Page		= 1;	// ページ番号(1から)
var TotalPage	= 1;	// トータルページ数(1から)
var Tracker		= "";	// 一部ページで使う画面移動用のスイッチ

// アニメーション関連
var TotalAnim	= 1;	// 各ページのアニメーション枚数
var AnimPtr		= null;	// アニメーションハンドル
var SprPtr		= null;	// スプライトの再生停止ハンドル

// スライダー関連
const MaxW		= 420;	// スライダーの可動幅280
const AddX		= 610;	// スライダー初期位置452
var PlaySw		= 1;	// 1:再生/0:停止スイッチ
var PauseSw		= 1;	// 1:ポーズok/0:ポーズng
var SliderX		= 0;

// セッションストレージ関連
const SS_TEXT	= "sstext";	// テキストの受け渡し用のキー
const SS_JUMP	= "ssjump";	// 主にメニューページ移動指示の受け渡し用のキー
const SS_MAIN	= "ssmain";	// 主にメインページ初期表示ページ指示の受け渡し用のキー


//-------------------------------------
// デバッグ用
//-------------------------------------
function dbg(s)
{
	console.log(" p=",PlaySw,s);
}
function key(s)
{
	for( var i in s ) console.log(i+"="+s[i]);
}
//-------------------------------------
// ローカルのデータ送信
//-------------------------------------
function SendText(btext)
{
	// セッションストレージに保存
	if( window.sessionStorage ){
		sessionStorage.setItem( SS_TEXT, btext );
	}
}
function SendJump(btext)
{
	// セッションストレージに保存
	if( window.sessionStorage ){
		sessionStorage.setItem( SS_JUMP, btext );
	}
}
function SendMain(btext)
{
	// セッションストレージに保存
	if( window.sessionStorage ){
		sessionStorage.setItem( SS_MAIN, btext );
	}
}
//-------------------------------------
// ローカルのデータ受信
//-------------------------------------
function GetText()
{
	var r = "";
	
	// セッションストレージから取り出し
	if( window.sessionStorage ){
		r = sessionStorage.getItem( SS_TEXT );
	}
	return r;
}
function GetJump()
{
	var r = "";
	
	// セッションストレージから取り出し
	if( window.sessionStorage ){
		r = sessionStorage.getItem( SS_JUMP );
		sessionStorage.setItem( SS_JUMP, "" ); // 消去
	}
	return r;
}
function GetMain()
{
	var r = "";
	
	// セッションストレージから取り出し
	if( window.sessionStorage ){
		r = sessionStorage.getItem( SS_MAIN );
		sessionStorage.setItem( SS_MAIN, "" ); // 消去
	}
	return r;
}
//-------------------------------------
// ローカルのデータ受信を反映
//-------------------------------------
function SetJumpAndText(e)
{
	switch(e.key){
	case SS_JUMP:
	{// ラベルジャンプ
		exportRoot.gotoAndStop(e.newValue);
//		dbg("jump="+e.newValue);
	}
	break;
	
	case SS_TEXT:
	{// サブタイトル変更
		exportRoot.textbox.text = e.newValue;
//		dbg("text="+e.newValue);
	}
	break;
	}
}
//-------------------------------------
// メイン画面の初期表示画面セット
//-------------------------------------
function JumpMain()
{
	var r = "";
	
	r = GetMain();
	if( r != "" ){
		exportRoot.gotoAndStop(r);
	}
}
//-------------------------------------
// ページ移動
//-------------------------------------
function GetUrlMain(s)
{
	GetUrl( s, "mainFrame" );
}
function GetUrlTop(s)
{
	GetUrl( s, "topFrame" );
}
function GetUrl( s1, s2 )
{
//	var t = "/EngineSTARS/web/content/"+ s1 + Html;
	var t = s1 + Htm;
//	dbg(t+" "+s2);
	window.open( t, s2 );
}

//-------------------------------------
// アニメーション初期化 引数1=スプライト追加処理
//-------------------------------------
function InitAnim(sp)
{
	AnimPtr   = exportRoot["ani"+Page];
	TotalAnim = AnimPtr.totalFrames;
	if( sp != undefined ){
		SprPtr = sp;
	}
	else{
		SprPtr = null;
	}
	Start(0);
	PauseSw = 1;
}
//-------------------------------------
// ページ数初期化 引数1=ページ数,{引数2=セクション指定}
//-------------------------------------
function InitPage(tp,s)
{
	Page = 1;
	Sect = 0;
	TotalPage = tp;
	SetPageText();
	if( s != undefined ){
		Sect = (isNaN(s))?0:s;
	}
}
//-------------------------------------
// ページ数テキスト作成
//-------------------------------------
function SetPageText(p)
{
	if( p != undefined ){
		Page = (isNaN(p))?1:p;
	}
	if(exportRoot.hasOwnProperty("page")){
		exportRoot.page.text = "Page " + Page + " of " + TotalPage;
	}
}
//-------------------------------------
// NEXTボタンクリック
//-------------------------------------
function ClickNext()
{
	Page++;
	if( TotalPage < Page ) Page = TotalPage;
	SetPageText();
	GotoPage();
}
//-------------------------------------
// PREVボタンクリック
//-------------------------------------
function ClickPrev()
{
	Page--;
	if( Page < 1 ) Page = 1;
	SetPageText();
	GotoPage();
}
//-------------------------------------
// ページ移動
//-------------------------------------
function GotoPage()
{
	var str = "";
	if( Sect ){
		str = "s"+Sect;
	}
	str = str+"p"+Page;
	
	exportRoot.gotoAndPlay( str );
}
//-------------------------------------
// nextボタン使用/使用不可
//-------------------------------------
function Next(sw)
{
	if( sw == 1 ){
		exportRoot.next.mouseEnabled = true;
		exportRoot.next.alpha = 1.0;
	}
	else if( sw == 9 ){
		exportRoot.next.mouseEnabled = false;
		exportRoot.next.alpha = 0;
	}
	else{
		exportRoot.next.mouseEnabled = false;
		exportRoot.next.alpha = 0.3;
	}
}
//-------------------------------------
// prevボタン使用/使用不可
//-------------------------------------
function Prev(sw)
{
	if( sw == 1 ){
		exportRoot.previous.mouseEnabled = true;
		exportRoot.previous.alpha = 1.0;
	}
	else if( sw == 9 ){
		exportRoot.previous.mouseEnabled = false;
		exportRoot.previous.alpha = 0;
	}
	else{
		exportRoot.previous.mouseEnabled = false;
		exportRoot.previous.alpha = 0.3;
	}
}

//-------------------------------------
// 再生/停止ボタンをクリック
//-------------------------------------
function ClickPlayPau()
{
	// ポーズ禁止なら戻る
	if( PauseSw == 0 ){
		return;
	}
	
	// 再生中
	if( PlaySw ){
		Stop();
	}
	else{
		// 今最終フレームなら無視
		var now = AnimPtr.currentFrame + 1
		if( now < TotalAnim ){
			Start();
			exportRoot.play();
		}
	}
}
//-------------------------------------
// リプレイボタンをクリック
//-------------------------------------
function ClickReplay()
{
	AnimPtr.gotoAndPlay(0);
	Start();
	GotoPage();
}
//-------------------------------------
// 再生処理
//-------------------------------------
function Start(pos)
{
	PlaySw = 1;
	exportRoot.playpau.gotoAndStop(1);
	
	if( isNaN(pos) ){
		AnimPtr.play();
	}
	else{
		AnimPtr.gotoAndPlay(pos);	// 再生場所指定
	}
	if(SprPtr != null){
		SprPtr(PlaySw);
	}
}
//-------------------------------------
// 一時停止処理
//-------------------------------------
function Stop()
{
	PlaySw = 0;
	exportRoot.playpau.gotoAndStop(0);
	AnimPtr.stop();
	exportRoot.stop();
	if(SprPtr != null){
		SprPtr(PlaySw);
	}
}
//-------------------------------------
// スライダー計算
//-------------------------------------
function MoveSlider()
{
	var now = AnimPtr.currentFrame + 1
	var perc = parseInt( now / TotalAnim * 100);
	exportRoot.slider.x = parseInt(perc * MaxW / 100) + AddX;
	if( SliderX != exportRoot.slider.x && now == TotalAnim ){
		Stop();
	}
	SliderX = exportRoot.slider.x
}
//-------------------------------------
// ポーズOK NG
//-------------------------------------
function PauseOk()
{
	PauseSw = 1;
}
function PauseNg()
{
	PauseSw = 0;
}
