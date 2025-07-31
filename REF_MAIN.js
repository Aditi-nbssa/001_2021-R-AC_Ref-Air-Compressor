(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"REF_MAIN_atlas_1", frames: [[0,0,1268,819],[0,821,1264,819]]},
		{name:"REF_MAIN_atlas_2", frames: [[0,1171,1217,335],[0,834,1220,335],[0,1508,1201,335],[0,444,1262,388],[0,0,1253,442]]},
		{name:"REF_MAIN_atlas_3", frames: [[0,1365,1235,227],[0,314,1255,281],[0,1594,1224,227],[0,1136,1271,227],[0,907,1281,227],[0,0,1151,312],[0,597,1041,308]]},
		{name:"REF_MAIN_atlas_4", frames: [[1195,264,813,120],[1209,1296,79,120],[0,244,1193,120],[0,976,1007,120],[0,0,1204,120],[0,732,1159,120],[0,1098,1219,66],[0,1234,350,113],[1840,880,110,120],[1840,1002,110,120],[627,1234,110,120],[1952,864,96,120],[0,1166,1205,66],[1191,386,645,120],[1126,1296,81,120],[1522,928,96,120],[1952,986,96,120],[0,122,1198,120],[0,366,1189,120],[1031,1234,93,120],[1522,1050,96,120],[739,1234,96,120],[0,488,1183,120],[1185,508,645,120],[1940,620,105,120],[1940,742,105,120],[837,1234,95,120],[934,1234,95,120],[0,610,1182,120],[0,854,1059,120],[1184,630,475,151],[1161,783,459,143],[1061,928,459,143],[1207,1174,516,120],[1661,630,277,248],[1374,1296,113,53],[1986,1163,60,60],[1838,386,160,118],[1290,1296,82,108],[1838,506,160,112],[1221,1073,240,92],[1061,854,66,60],[1640,0,398,262],[1206,0,432,260],[1622,880,216,292],[1725,1174,259,203],[1952,1108,68,53],[352,1234,273,134]]},
		{name:"REF_MAIN_atlas_5", frames: [[0,687,1201,173],[0,0,1217,227],[0,1213,1223,173],[0,1860,1215,120],[0,1738,1220,120],[0,1038,1256,173],[0,229,1213,227],[0,1388,1220,173],[0,1563,1216,173],[0,458,1209,227],[0,862,1107,173],[1258,1038,674,246],[1211,524,472,512],[1219,0,464,522],[1225,1286,394,380]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_103 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_102 = function() {
	this.initialize(ss["REF_MAIN_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_101 = function() {
	this.initialize(ss["REF_MAIN_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_100 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_99 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_98 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_97 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_96 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_95 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_94 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_93 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_92 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_91 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_90 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_89 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_88 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_87 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_86 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_85 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_84 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_83 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_82 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_81 = function() {
	this.initialize(ss["REF_MAIN_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_80 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_79 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_78 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_77 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_76 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_75 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_74 = function() {
	this.initialize(ss["REF_MAIN_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_73 = function() {
	this.initialize(ss["REF_MAIN_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_72 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_71 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_70 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_69 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_68 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_66 = function() {
	this.initialize(ss["REF_MAIN_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["REF_MAIN_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["REF_MAIN_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["REF_MAIN_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["REF_MAIN_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["REF_MAIN_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["REF_MAIN_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["REF_MAIN_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["REF_MAIN_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.image11 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.image118 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.image12 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.image137 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.image144 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.image2 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.image54 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.image57 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.image59 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.image63 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.image78 = function() {
	this.initialize(ss["REF_MAIN_atlas_5"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.image8 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.image83 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.image95 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.image98 = function() {
	this.initialize(ss["REF_MAIN_atlas_4"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.sprite75 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#666666").s().p("EggfAAyQgUAAAAgUIAAg7QAAgUAUAAMBA/AAAQAUAAAAAUIAAA7QAAAUgUAAg");
	this.shape.setTransform(220,20);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// レイヤー_2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FFFFFF").ss(2,1,1).p("EgiDgDHMBEHAAAQAUAAAAAUIAAFnQAAAUgUAAMhEHAAAQgUAAAAgUIAAlnQAAgUAUAAg");
	this.shape_1.setTransform(220,20);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000066").s().p("EgiDADIQgUAAAAgUIAAlnQAAgUAUAAMBEHAAAQAUAAAAAUIAAFnQAAAUgUAAg");
	this.shape_2.setTransform(220,20);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sprite75, new cjs.Rectangle(-1,-1,442,42), null);


(lib.text143 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_103();
	this.instance.setTransform(-3.4,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,399.79999999999995,57.6);


(lib.text142 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_102();
	this.instance.setTransform(-3.45,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,411.09999999999997,75.60000000000001);


(lib.text141 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_101();
	this.instance.setTransform(-3.45,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,417.7,93.60000000000001);


(lib.text140 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_100();
	this.instance.setTransform(-3.75,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,270.59999999999997,40);


(lib.text136 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_99();
	this.instance.setTransform(-2.7,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.7,-2.9,26.3,40);


(lib.text135 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_98();
	this.instance.setTransform(-3.6,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-2.9,397.1,40);


(lib.text134 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_97();
	this.instance.setTransform(-3.45,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,405.09999999999997,75.60000000000001);


(lib.text133 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_96();
	this.instance.setTransform(-3.5,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-2.9,407.1,57.6);


(lib.text127 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_95();
	this.instance.setTransform(-3.7,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,404.4,40);


(lib.text126 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_94();
	this.instance.setTransform(-3.35,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-2.9,406.1,40);


(lib.text125 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_93();
	this.instance.setTransform(-3.75,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,335.2,40);


(lib.text124 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_92();
	this.instance.setTransform(-3.35,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-2.9,400.7,40);


(lib.text123 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_91();
	this.instance.setTransform(-3.9,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-2.9,418.09999999999997,57.6);


(lib.text122 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_90();
	this.instance.setTransform(-2.85,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.8,-2.9,385.8,40);


(lib.text121 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_89();
	this.instance.setTransform(-3.6,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-2.9,405.8,22);


(lib.text117 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_88();
	this.instance.setTransform(-2.85,-3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.8,-3,116.5,37.6);


(lib.text116 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_87();
	this.instance.setTransform(-3.5,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-2.9,36.6,40);


(lib.text115 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_86();
	this.instance.setTransform(-2.3,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.3,-2.9,36.599999999999994,40);


(lib.text114 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_85();
	this.instance.setTransform(-2.95,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.9,-2.9,36.6,40);


(lib.text113 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_84();
	this.instance.setTransform(-3.45,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,31.9,40);


(lib.text112 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_83();
	this.instance.setTransform(-2.8,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.8,-2.9,401.1,22);


(lib.text111 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_82();
	this.instance.setTransform(-3.7,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,403.8,75.60000000000001);


(lib.text110 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_81();
	this.instance.setTransform(-3.5,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-2.9,405.1,111.5);


(lib.text109 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_80();
	this.instance.setTransform(-3.35,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-2.9,406.1,57.6);


(lib.text108 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_79();
	this.instance.setTransform(-3.35,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-3.1,214.70000000000002,40);


(lib.text105 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_78();
	this.instance.setTransform(-3.8,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.8,-2.9,27,40);


(lib.text104 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_77();
	this.instance.setTransform(-3.4,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,32,40);


(lib.text103 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_76();
	this.instance.setTransform(-3.45,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,31.9,40);


(lib.text102 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_75();
	this.instance.setTransform(-3.2,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.2,-2.9,398.8,40);


(lib.text101 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_74();
	this.instance.setTransform(-3.8,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.8,-2.9,406.1,111.5);


(lib.text100 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_73();
	this.instance.setTransform(-3.95,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-2.9,407.4,75.60000000000001);


(lib.text92 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_72();
	this.instance.setTransform(-3.7,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,395.8,40);


(lib.text91 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_71();
	this.instance.setTransform(-3.75,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,404.7,57.6);


(lib.text90 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_70();
	this.instance.setTransform(-3.35,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-2.9,30.900000000000002,40);


(lib.text89 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_69();
	this.instance.setTransform(-2.95,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.9,-2.9,31.9,40);


(lib.text88 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_68();
	this.instance.setTransform(-3.4,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,32,40);


(lib.text87 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_67();
	this.instance.setTransform(-3.7,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,393.8,40);


(lib.text86 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_66();
	this.instance.setTransform(-3.45,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,423,75.60000000000001);


(lib.text85 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_65();
	this.instance.setTransform(-3.25,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.2,-2.9,214.7,40);


(lib.text77 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_64();
	this.instance.setTransform(-2.95,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.9,-3.1,34.9,40);


(lib.text76 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_63();
	this.instance.setTransform(-3.3,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-3.1,35,40);


(lib.text75 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_62();
	this.instance.setTransform(-3.7,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-3.1,402.4,75.6);


(lib.text74 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_61();
	this.instance.setTransform(-3.45,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-3.1,368.4,57.6);


(lib.text73 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_60();
	this.instance.setTransform(-3.7,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-3.1,426.4,75.6);


(lib.text70 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_59();
	this.instance.setTransform(-3,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3,-3.1,31.6,40);


(lib.text69 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_58();
	this.instance.setTransform(-3.95,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-3.1,31.599999999999998,40);


(lib.text68 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_57();
	this.instance.setTransform(-3.8,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.8,-3.1,393.5,40);


(lib.text67 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_56();
	this.instance.setTransform(-3.7,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-3.1,399.8,111.5);


(lib.text66 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_55();
	this.instance.setTransform(-3.9,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-3.1,420.09999999999997,129.2);


(lib.text65 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_54();
	this.instance.setTransform(-3.35,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-3.1,352.5,40);


(lib.text61 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_53();
	this.instance.setTransform(-3.95,-3.35,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-3.3,417,147.10000000000002);


(lib.text56 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_52();
	this.instance.setTransform(-3.95,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-3.1,422,272.6);


(lib.text32 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_51();
	this.instance.setTransform(0,0,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,158.1,50.3);


(lib.text14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_50();
	this.instance.setTransform(-3.5,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-3.4,152.8,47.6);


(lib.text10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_49();
	this.instance.setTransform(-3,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3,-3.4,152.8,47.6);


(lib.text7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_48();
	this.instance.setTransform(-3.95,-3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-3,420.7,272.6);


(lib.text5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_47();
	this.instance.setTransform(-3.95,-3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-3,171.70000000000002,40);


(lib.shape792 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgdCWQgUAAAAgUIAAkDQAAgUAUAAIA7AAQAUAAAAAUIAAEDQAAAUgUAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5,-15,10,30);


(lib.shape145 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],41);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.517,0,0,1.517,-50,-45.5)).s().p("An0HHIAAuNIPoAAIAAONg")
	}.bind(this);
	this.shape.setTransform(60.6,-5.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.471)").s().p("Egj6AbnMAAAg3NMBH1AAAMAAAA3Ng");

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-229.9,-176.7,459.8,353.4);


(lib.shape138 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],40);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.307,0,0,1.307,-156.9,-60.1)).s().p("A4gJZIAAyxMAxBAAAIAASxg")
	}.bind(this);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-156.9,-60.1,313.8,120.30000000000001);


(lib.shape132 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_3
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],38);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.334,0,0,1.334,-54.7,-72)).s().p("AoiLRIAA2gIRFAAIAAWgg")
	}.bind(this);
	this.shape.setTransform(231.6,-106.45);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.471)").s().p("EgkIAanMAAAg1NMBIRAAAMAAAA1Ng");
	this.shape_1.setTransform(199.125,19.15);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],45);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(1.803,0,0,1.803,-233.5,-183)).s().p("EgkeAcmMAAAg5LMBI9AAAMAAAA5Lg")
	}.bind(this);
	this.shape_2.setTransform(201.8,15.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-32.2,-178.5,467.5,377);


(lib.shape130 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(3,1,0,3).p("AhuiXIgWATIgVAYABhihQgZgPgegHACvhGQgLgcgVgXAAAi7QgeAAgbAJAC3AvQAFgWAAgZIAAgMAB5CQIAMgLQAPgPALgRAAJC8QAggBAcgLAixA/QAKAdAUAZAizg2QgIAaAAAcIAAAEAhoCdQAaARAeAI");
	this.shape.setTransform(288.9,2.45);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(268.6,-17.8,40.599999999999966,40.6);


(lib.shape129 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(3,1,0,3).p("AtHAIQgNAcgJAdAsEhYIgNAPIgYAfAqjifQgbAMgZATAlFhAIgsguAoTi2IgcgBIg7AGAmhiRQgagQgcgJAkKAnQgLgcgPgZAjxCbQgCgfgGgcAH8nSIgDAFQgPAYgLAaAJQomQgZANgXAYAG5jqIAAA8AHeAAQAMAaAPAYQAQAbASAUAG+hyQAFAeAIAcAHLliQgIAdgEAfALEovQgXgIgZAAIgLABAMfnmQgTgagUgRANVl8IgWg2AMbBRIAig2ANukIIgJg7ANtiRIADg8ANUgbIAQg5AK7CXQAcgIAZgTAJJCIQAbAQAfADAlnHmIAoguAj4EWQAGgdACgfAkfGGQAOgaAKgcAnMInQAcgLAagRApAI3IARABIAogDAq0IYQAbAOAdAIAsQHMQAUAXAWATAtPFnQAMAbAQAaAtsDyQADAfAHAdAtqB8QgEAdgBAf");
	this.shape.setTransform(260.15,-16.3243);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(170.7,-74.6,179,116.6);


(lib.shape128 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],46);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.459,0,0,1.459,-49.6,-38.7)).s().p("AnvGDIAAsFIPfAAIAAMFg")
	}.bind(this);
	this.shape.setTransform(191.9,-35.125);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.instance = new lib.CachedBmp_46();
	this.instance.setTransform(-5.25,1.95,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5.2,-73.8,383.09999999999997,179.6);


(lib.shape119 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],38);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.345,0,0,1.229,-55.1,-66.3)).s().p("AonKXIAA0tIRPAAIAAUtg")
	}.bind(this);
	this.shape.setTransform(26.9,-101.45);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.443)").s().p("EgjBAb8MAAAg33MBGDAAAMAAAA33g");
	this.shape_1.setTransform(0.025,0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-224.2,-178.8,448.5,357.70000000000005);


(lib.shape106 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(3,1,0,3).p("AEGhFQgMgagUgXAEOAxQAHgYAAgZIgBgKADLCRQAYgUAQgXAghjTQgfADgcAHABYjKQgdgHgfgCAkUAEQAAAfALAbAjvhrQgTAYgJAcAgTDUIA7gBABiDHQAegIAZgOAiJC5QAbANAfAGAjrBxQARAUAWARIAHAFAiUi0QgZANgXARADDiWQgYgSgagN");
	this.shape.setTransform(306.35,68.825);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(277.2,46.1,58.400000000000034,45.49999999999999);


(lib.shape99 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(3,1,0,3).p("Ah3CMQAaAOAeAHABuCRQAXgLAUgQIAHgGADHBEQAPgbACgfADQgwQgKgbgWgXACAiHQgZgPgdgIAANinIgNAAIg6AGAgDCoIADAAIA2gFAhziNQgTAKgSANIgNALAjKg8QgMAbgBAgAjLA5QAMAaAYAX");
	this.shape.setTransform(176.45,82.325);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_3
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(1,0,0,3).p("AAujbIAnAKIgdgwIgwAbIAmALIiIHj");
	this.shape_1.setTransform(192.2961,35.0807);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF0000").s().p("AAAAOIgmgLIAvgaIAeAvg");
	this.shape_2.setTransform(196.925,11.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(1));

	// Layer_2
	this.shape_3 = new cjs.Shape();
	var sprImg_shape_3 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],47);
	sprImg_shape_3.onload = function(){
		this.shape_3.graphics.bf(sprImg_shape_3, null, new cjs.Matrix2D(0.708,0,0,0.708,-96.6,-47.4)).s().p("AvFHaIAAuzIeLAAIAAOzg")
	}.bind(this);
	this.shape_3.setTransform(195.85,0.225);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

	// Layer_1
	this.shape_4 = new cjs.Shape();
	var sprImg_shape_4 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],45);
	sprImg_shape_4.onload = function(){
		this.shape_4.graphics.bf(sprImg_shape_4, null, new cjs.Matrix2D(1.803,0,0,1.803,-233.5,-183)).s().p("EgkeAcmMAAAg5LMBI9AAAMAAAA5Lg")
	}.bind(this);
	this.shape_4.setTransform(201.8,15.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-31.7,-167.5,467,366);


(lib.shape96 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],46);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.459,0,0,1.459,-49.6,-38.7)).s().p("AnvGDIAAsFIPfAAIAAMFg")
	}.bind(this);
	this.shape.setTransform(184.8,-32.125);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.instance = new lib.CachedBmp_45();
	this.instance.setTransform(10.35,6.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(10.4,-70.8,346.5,179.6);


(lib.shape94 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_44();
	this.instance.setTransform(-36.55,30.3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36.5,30.3,92.2,82.60000000000001);


(lib.shape93 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(3,1,0,3).p("ABzi4QgbgNgdgFADOhvQgOgTgUgRIgGgFADVBlQARgZAHgdAB9C0QAZgNAWgTIABgCADzAAQAAgegKgbAjShoQgRAagIAcAh1i3QgaAMgXATAgCjQIg7AGAhpC9QAbAMAeAFAjHB3IAcAdIAOALAjyAKQACAfALAbAAKDRIA8gH");
	this.shape.setTransform(160.85,152.75);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(135.1,130.3,51.5,44.89999999999998);


(lib.shape84 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],45);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.803,0,0,1.803,-233.5,-183)).s().p("EgkeAcmMAAAg5LMBI9AAAMAAAA5Lg")
	}.bind(this);
	this.shape.setTransform(201.8,15.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-31.7,-167.5,467,366);


(lib.shape80 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(1,0,0,3).p("AAoAVIgogmIgnAm");
	this.shape.setTransform(-0.0022,-14.5191);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(1,0,0,3).p("AAAivIAoAAAAAivIAAFkAgnivIAnAA");
	this.shape_1.setTransform(0,5.175);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF0000").s().p("AAAATIgnAAIAnglIAoAlg");
	this.shape_2.setTransform(0,-14.35);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5,-17.3,10,41.6);


(lib.shape79 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_5"],14);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.065,0,0,1.065,-209.9,-202.4)).s().p("EggyAfpMAAAg/QMBBlAAAMAAAA/Qg")
	}.bind(this);
	this.shape.setTransform(6.1,7.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-203.8,-194.9,419.8,404.9);


(lib.shape72 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(2,0,0,3).p("AQ2D6Qm+Bnp4AAQp2AAm/hnQm/hnAAiTQAAiRG/hnQG/hoJ2AAQJ4AAG+BoQG/BnAACRQAACTm/Bng");
	this.shape.setTransform(-36.2,127.85);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_5"],13);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.759,0,0,0.759,-176.1,-198.1)).s().p("A7ge+MAAAg97MA3BAAAMAAAA97g")
	}.bind(this);
	this.shape_1.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-189.6,-198.1,365.79999999999995,396.29999999999995);


(lib.shape71 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(2,0,0,3).p("AAAEOQqvAAnmhPQnmhPAAhwQAAhvHmhPQHmhPKvAAQKwAAHmBPQHmBPAABvQAABwnmBPQnmBPqwAAg");
	this.shape.setTransform(2.4,-28.85);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(2,0,0,3).p("AIlBdQgnAog3AAQg3AAgngoQgmgmAAg3QAAg2AmgnQAngnA3AAQA3AAAnAnQAnAnAAA2QAAA3gnAmgAB2BdQgmAog3AAQg2AAgngoQgngmAAg3QAAg2AngnQAngnA2AAQA3AAAmAnQAoAnAAA2QAAA3goAmgAlpBdQgmAog3AAQg3AAgngoQgngmAAg3QAAg2AngnQAngnA3AAQA3AAAmAnQAnAnAAA2QAAA3gnAmg");
	this.shape_1.setTransform(72.15,-179.65);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_5"],13);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.759,0,0,0.759,-176.1,-198.1)).s().p("A7ge+MAAAg97MA3BAAAMAAAA97g")
	}.bind(this);
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-176.1,-198.1,352.29999999999995,396.29999999999995);


(lib.shape64 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(2,0,0,3).p("AIlBdQgnAog3AAQg3AAgngoQgmgmAAg3QAAg2AmgnQAngnA3AAQA3AAAnAnQAnAnAAA2QAAA3gnAmgAB2BdQgmAog3AAQg2AAgngoQgngmAAg3QAAg2AngnQAngnA2AAQA3AAAmAnQAoAnAAA2QAAA3goAmgAlpBdQgmAog3AAQg3AAgngoQgngmAAg3QAAg2AngnQAngnA3AAQA3AAAmAnQAnAnAAA2QAAA3gnAmg");
	this.shape.setTransform(72.15,-179.65);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_5"],13);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.759,0,0,0.759,-176.1,-198.1)).s().p("A7ge+MAAAg97MA3BAAAMAAAA97g")
	}.bind(this);
	this.shape_1.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-176.1,-198.1,352.29999999999995,396.29999999999995);


(lib.shape60 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_5"],12);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.735,0,0,0.798,-173.6,-204.2)).s().p("A7Hf6MAAAg/zMA2PAAAMAAAA/zg")
	}.bind(this);
	this.shape.setTransform(0.025,-8.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-173.5,-212.3,347.1,408.4);


(lib.shape58 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_5"],11);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.829,0,0,0.838,-451.2,-103.1)).s().p("AwxQHMAAAggNMAhjAAAMAAAAgNg")
	}.bind(this);
	this.shape.setTransform(0.875,107.425);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_5"],11);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.837,0,0,0.837,-172.4,-102.9)).s().p("A67QFMAAAggKMA14AAAMAAAAgKg")
	}.bind(this);
	this.shape_1.setTransform(-2.45,-94.65);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-174.9,-197.6,344.9,408.1);


(lib.shape55 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],43);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.041,0,0,1.072,-224.7,-139.3)).s().p("EgjGAVxMAAAgrhMBGNAAAMAAAArhg")
	}.bind(this);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-224.7,-139.3,449.5,278.6);


(lib.shape13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AKzDBI1lAAIAAmBIVlAAg");
	this.shape.setTransform(142.225,163.95);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.831)").s().p("AqyDBIAAmAIVlAAIAAGAg");
	this.shape_1.setTransform(142.225,163.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FF0000").ss(1,0,0,3).p("Am1jzIAbgwIhLAWIAUBKIAcgwIOfIb");
	this.shape_2.setTransform(14.1459,131.9777);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FF0000").s().p("AglgZIBLgWIgcAvIgbAwg");
	this.shape_3.setTransform(-30.725,107.575);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// Layer_2
	this.shape_4 = new cjs.Shape();
	var sprImg_shape_4 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],37);
	sprImg_shape_4.onload = function(){
		this.shape_4.graphics.bf(sprImg_shape_4, null, new cjs.Matrix2D(1.531,0,0,1.531,-122.5,-90.3)).s().p("AzIOIIAA8OMAmRAAAIAAcOg")
	}.bind(this);
	this.shape_4.setTransform(-93.9,92.85);

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

	// Layer_1
	this.shape_5 = new cjs.Shape();
	var sprImg_shape_5 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],39);
	sprImg_shape_5.onload = function(){
		this.shape_5.graphics.bf(sprImg_shape_5, null, new cjs.Matrix2D(1.64,0,0,1.64,-131.2,-91.8)).s().p("A0fOWIAA8sMAo/AAAIAAcsg")
	}.bind(this);
	this.shape_5.setTransform(103.3,-95.95);

	this.timeline.addTween(cjs.Tween.get(this.shape_5).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-216.4,-187.8,450.9,372);


(lib.shape9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AKzDBI1lAAIAAmBIVlAAg");
	this.shape.setTransform(41.175,-180.85);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.831)").s().p("AqyDAIAAl/IVlAAIAAF/g");
	this.shape_1.setTransform(41.175,-180.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],44);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(1.218,0,0,1.218,-131.6,-177.9)).s().p("A0jbzMAAAg3lMApHAAAMAAAA3lg")
	}.bind(this);
	this.shape_2.setTransform(7.95,16.3);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-123.6,-201.1,263.2,395.29999999999995);


(lib.shape3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["REF_MAIN_atlas_4"],42);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.098,0,0,1.098,-218.4,-143.8)).s().p("EgiHAWeMAAAgs7MBEPAAAMAAAAs7g")
	}.bind(this);
	this.shape.setTransform(0,27);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-218.4,-116.8,436.9,287.6);


(lib.button94 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_2
	this.instance = new lib.CachedBmp_43();
	this.instance.setTransform(5,12,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_42();
	this.instance_1.setTransform(58,10,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(4));

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FFFFFF").ss(2,1,1).p("AnAj5IOBAAQAyAAAAAyIAAGPQAAAygyAAIuBAAQgyAAAAgyIAAmPQAAgyAyAAg");
	this.shape.setTransform(50.0378,24.9974,1.0012,0.9999);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000066").s().p("AnAD6QgyAAAAgyIAAmPQAAgyAyAAIOBAAQAyAAAAAyIAAGPQAAAygyAAg");
	this.shape_1.setTransform(50.0378,24.9974,1.0012,0.9999);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#0099FF").s().p("AnAD6QgyAAAAgyIAAmPQAAgyAyAAIOBAAQAyAAAAAyIAAGPQAAAygyAAg");
	this.shape_2.setTransform(49.9878,24.9974,1.0012,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape,p:{x:50.0378}}]}).to({state:[{t:this.shape_2},{t:this.shape,p:{x:49.9878}}]},1).to({state:[{t:this.shape_2},{t:this.shape,p:{x:49.9878}}]},1).to({state:[{t:this.shape_2},{t:this.shape,p:{x:49.9878}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,102,52);


(lib.button87 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AiVAAIEriVIAAErg");
	this.shape.setTransform(28,25);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(4));

	// Layer 4
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FFFFFF").ss(2,1,1).p("Aj5j5IHzAAQAyAAAAAyIAAGPQAAAygyAAInzAAQgyAAAAgyIAAmPQAAgyAyAAg");
	this.shape_1.setTransform(30.0418,25.0474,1.0013,0.9999);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000066").s().p("Aj5D6QgxAAAAgyIAAmPQAAgyAxAAIHzAAQAxAAAAAyIAAGPQAAAygxAAg");
	this.shape_2.setTransform(30.0418,25.0474,1.0013,0.9999);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#0099FF").s().p("Aj5D6QgxAAAAgyIAAmPQAAgyAxAAIHzAAQAxAAAAAyIAAGPQAAAygxAAg");
	this.shape_3.setTransform(29.9918,24.9974,1.0013,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1,p:{x:30.0418,y:25.0474}}]}).to({state:[{t:this.shape_3},{t:this.shape_1,p:{x:29.9918,y:24.9974}}]},1).to({state:[{t:this.shape_3},{t:this.shape_1,p:{x:29.9918,y:24.9974}}]},1).to({state:[{t:this.shape_3},{t:this.shape_1,p:{x:29.9918,y:24.9974}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,62.1,52.1);


(lib.button76 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhJBqQgmgrAAg+IgmAAIBBiWIBBCWIgpAAQAAAkAYAcQAVAZAhAAQAhAAAWgZQAYgcAAgkQAAgmgYgaQgUgZgggBIAAg8QA0AAAmAsQAnArAAA/QAAA+gnArQgmAsg2AAQg2AAgmgsg");
	this.shape.setTransform(19,20);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(4));

	// Layer 3
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FFFFFF").ss(2,1,1).p("AizjHIFnAAQAUAAAAAUIAAFnQAAAUgUAAIlnAAQgUAAAAgUIAAlnQAAgUAUAAg");
	this.shape_1.setTransform(20,20);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000066").s().p("AizDIQgUAAAAgUIAAlnQAAgUAUAAIFnAAQAUAAAAAUIAAFnQAAAUgUAAg");
	this.shape_2.setTransform(20,20);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#0099FF").s().p("AizDIQgUAAAAgUIAAlnQAAgUAUAAIFnAAQAUAAAAAUIAAFnQAAAUgUAAg");
	this.shape_3.setTransform(20,20);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).to({state:[{t:this.shape_3},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,42,42);


(lib.button69 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AAaBkIAAjHIBKAAIAADHgAhjBkIAAjHIBKAAIAADHg");
	this.shape.setTransform(20,20);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(4));

	// Layer 1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FFFFFF").ss(2,1,1).p("AizjHIFnAAQAUAAAAAUIAAFnQAAAUgUAAIlnAAQgUAAAAgUIAAlnQAAgUAUAAg");
	this.shape_1.setTransform(20,20);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000066").s().p("AizDIQgUAAAAgUIAAlnQAAgUAUAAIFnAAQAUAAAAAUIAAFnQAAAUgUAAg");
	this.shape_2.setTransform(20,20);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#0099FF").s().p("AizDIQgUAAAAgUIAAlnQAAgUAUAAIFnAAQAUAAAAAUIAAFnQAAAUgUAAg");
	this.shape_3.setTransform(20,20);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).to({state:[{t:this.shape_3},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,42,42);


(lib.button67 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhjhjIDHBjIjHBkg");
	this.shape.setTransform(20,20);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(4));

	// Layer 1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FFFFFF").ss(2,1,1).p("AizjHIFnAAQAUAAAAAUIAAFnQAAAUgUAAIlnAAQgUAAAAgUIAAlnQAAgUAUAAg");
	this.shape_1.setTransform(20,20);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000066").s().p("AizDIQgUAAAAgUIAAlnQAAgUAUAAIFnAAQAUAAAAAUIAAFnQAAAUgUAAg");
	this.shape_2.setTransform(20,20);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#0099FF").s().p("AizDIQgUAAAAgUIAAlnQAAgUAUAAIFnAAQAUAAAAAUIAAFnQAAAUgUAAg");
	this.shape_3.setTransform(20,20);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).to({state:[{t:this.shape_3},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,42,42);


(lib.sprite146 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_877 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(877).call(this.frame_877).wait(1));

	// Masked_Layer_12___2
	this.instance = new lib.text90("synched",0);
	this.instance.setTransform(-555.1,-9.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(878));

	// Masked_Layer_11___2
	this.instance_1 = new lib.text89("synched",0);
	this.instance_1.setTransform(-555.1,-47.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(878));

	// Masked_Layer_10___2
	this.instance_2 = new lib.text88("synched",0);
	this.instance_2.setTransform(-555.1,-115.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(878));

	// Masked_Layer_9___2
	this.instance_3 = new lib.text143("synched",0);
	this.instance_3.setTransform(-541.1,-9.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(878));

	// Masked_Layer_8___2
	this.instance_4 = new lib.text124("synched",0);
	this.instance_4.setTransform(-541.1,-47.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(878));

	// Masked_Layer_7___2
	this.instance_5 = new lib.text142("synched",0);
	this.instance_5.setTransform(-541.1,-115.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(878));

	// Masked_Layer_6___2
	this.instance_6 = new lib.text141("synched",0);
	this.instance_6.setTransform(-555.1,62.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(878));

	// Masked_Layer_5___2
	this.instance_7 = new lib.text140("synched",0);
	this.instance_7.setTransform(-555.1,-146.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(878));

	// Masked_Layer_4___2
	this.instance_8 = new lib.text122("synched",0);
	this.instance_8.setTransform(-557.1,-171.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(878));

	// Masked_Layer_3___2
	this.instance_9 = new lib.text5("synched",0);
	this.instance_9.setTransform(-554.9,-200.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(878));

	// Layer_15
	this.instance_10 = new lib.shape145("synched",0);
	this.instance_10.setTransform(203.4,18.45);
	this.instance_10.alpha = 0;
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(581).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(282));

	// Layer_1
	this.instance_11 = new lib.shape84("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(878));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.9,-203.9,995.2,402.4);


(lib.sprite139 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_639 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(639).call(this.frame_639).wait(1));

	// Masked_Layer_12___5
	this.instance = new lib.text136("synched",0);
	this.instance.setTransform(-552.2,-80.35);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(640));

	// Masked_Layer_11___5
	this.instance_1 = new lib.text104("synched",0);
	this.instance_1.setTransform(-554.2,-150.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(640));

	// Masked_Layer_10___5
	this.instance_2 = new lib.text135("synched",0);
	this.instance_2.setTransform(-538.2,-80.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(640));

	// Masked_Layer_9___5
	this.instance_3 = new lib.text134("synched",0);
	this.instance_3.setTransform(-552.2,-41.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(640));

	// Masked_Layer_8___5
	this.instance_4 = new lib.text133("synched",0);
	this.instance_4.setTransform(-537.2,-148.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(640));

	// Masked_Layer_7___5
	this.instance_5 = new lib.text122("synched",0);
	this.instance_5.setTransform(-556.2,-171.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(640));

	// Masked_Layer_6___5
	this.instance_6 = new lib.text5("synched",0);
	this.instance_6.setTransform(-556,-200.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(640));

	// Layer_4
	this.instance_7 = new lib.shape138("synched",0);
	this.instance_7.setTransform(188.75,139.45);
	this.instance_7.alpha = 0;
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(225).to({_off:false},0).to({alpha:0.9102},10).wait(1).to({alpha:1},0).wait(404));

	// Layer_3
	this.instance_8 = new lib.shape132("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(640));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.9,-203.9,995.2,403.5);


(lib.sprite131 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_871 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(871).call(this.frame_871).wait(1));

	// Masked_Layer_15___3
	this.instance = new lib.text103("synched",0);
	this.instance.setTransform(-553.2,60.05);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(872));

	// Masked_Layer_14___3
	this.instance_1 = new lib.text127("synched",0);
	this.instance_1.setTransform(-539.2,60.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(872));

	// Masked_Layer_13___3
	this.instance_2 = new lib.text90("synched",0);
	this.instance_2.setTransform(-553.2,16.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(872));

	// Masked_Layer_12___3
	this.instance_3 = new lib.text89("synched",0);
	this.instance_3.setTransform(-553.2,-28.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(872));

	// Masked_Layer_11___3
	this.instance_4 = new lib.text88("synched",0);
	this.instance_4.setTransform(-553.2,-73.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(872));

	// Masked_Layer_10___3
	this.instance_5 = new lib.text126("synched",0);
	this.instance_5.setTransform(-539.2,-73.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(872));

	// Masked_Layer_9___3
	this.instance_6 = new lib.text125("synched",0);
	this.instance_6.setTransform(-554.2,-101.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(872));

	// Masked_Layer_8___3
	this.instance_7 = new lib.text124("synched",0);
	this.instance_7.setTransform(-539.2,-28.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(872));

	// Masked_Layer_7___3
	this.instance_8 = new lib.text123("synched",0);
	this.instance_8.setTransform(-554.2,-153.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(872));

	// Masked_Layer_6___3
	this.instance_9 = new lib.text122("synched",0);
	this.instance_9.setTransform(-556.2,-171.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(872));

	// Masked_Layer_5___3
	this.instance_10 = new lib.text5("synched",0);
	this.instance_10.setTransform(-556,-200.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(872));

	// Masked_Layer_4___3
	this.instance_11 = new lib.text121("synched",0);
	this.instance_11.setTransform(-539.2,16.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(872));

	// Layer_18
	this.instance_12 = new lib.shape128("synched",0);
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(357).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},87).wait(408));

	// Layer_17
	this.instance_13 = new lib.shape130("synched",0);
	this.instance_13._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(557).to({_off:false},0).to({_off:true},6).wait(6).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(293));

	// Layer_2
	this.instance_14 = new lib.shape129("synched",0);
	this.instance_14._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(464).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(388));

	// Layer_1
	this.instance_15 = new lib.shape84("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(872));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.9,-203.9,995.2,402.4);


(lib.sprite120 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_205 = function() {
		//this.gotoAndPlay(210);
	}
	this.frame_499 = function() {
		//this.gotoAndPlay(505);
	}
	this.frame_1139 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(205).call(this.frame_205).wait(294).call(this.frame_499).wait(640).call(this.frame_1139).wait(1));

	// Masked_Layer_13___2
	this.instance = new lib.text117("synched",0);
	this.instance.setTransform(-555.45,-43.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1140));

	// Masked_Layer_12___2
	this.instance_1 = new lib.text116("synched",0);
	this.instance_1.setTransform(-556.45,-0.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1140));

	// Masked_Layer_11___2
	this.instance_2 = new lib.text115("synched",0);
	this.instance_2.setTransform(-556.45,-27.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1140));

	// Masked_Layer_10___2
	this.instance_3 = new lib.text114("synched",0);
	this.instance_3.setTransform(-555.45,-108.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1140));

	// Masked_Layer_9___2
	this.instance_4 = new lib.text113("synched",0);
	this.instance_4.setTransform(-555.45,-153.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1140));

	// Masked_Layer_8___2
	this.instance_5 = new lib.text112("synched",0);
	this.instance_5.setTransform(-542.45,-27.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1140));

	// Masked_Layer_7___2
	this.instance_6 = new lib.text111("synched",0);
	this.instance_6.setTransform(-541.45,-108.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1140));

	// Masked_Layer_6___2
	this.instance_7 = new lib.text110("synched",0);
	this.instance_7.setTransform(-542.45,-0.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(1140));

	// Masked_Layer_5___2
	this.instance_8 = new lib.text109("synched",0);
	this.instance_8.setTransform(-541.45,-151.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(1140));

	// Masked_Layer_4___2
	this.instance_9 = new lib.text108("synched",0);
	this.instance_9.setTransform(-556.45,-171.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(1140));

	// Masked_Layer_3___2
	this.instance_10 = new lib.text5("synched",0);
	this.instance_10.setTransform(-555.25,-200.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(1140));

	// Layer_3
	this.instance_11 = new lib.shape119("synched",0);
	this.instance_11.setTransform(203.35,2.1);
	this.instance_11.alpha = 0;
	this.instance_11._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(213).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(912));

	// Layer_1
	this.instance_12 = new lib.shape84("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(1140));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.9,-203.9,995.2,402.4);


(lib.sprite107 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_438 = function() {
		//this.gotoAndPlay(430);
	}
	this.frame_1177 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(438).call(this.frame_438).wait(739).call(this.frame_1177).wait(1));

	// Masked_Layer_13___5
	this.instance = new lib.text105("synched",0);
	this.instance.setTransform(-554.35,-21.25);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1178));

	// Masked_Layer_12___5
	this.instance_1 = new lib.text104("synched",0);
	this.instance_1.setTransform(-554.7,-69.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1178));

	// Masked_Layer_11___5
	this.instance_2 = new lib.text103("synched",0);
	this.instance_2.setTransform(-554.7,-153.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1178));

	// Masked_Layer_10___5
	this.instance_3 = new lib.text102("synched",0);
	this.instance_3.setTransform(-537.7,-69.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1178));

	// Masked_Layer_9___5
	this.instance_4 = new lib.text101("synched",0);
	this.instance_4.setTransform(-538.35,-21.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1178));

	// Masked_Layer_8___5
	this.instance_5 = new lib.text100("synched",0);
	this.instance_5.setTransform(-536.7,-152.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1178));

	// Masked_Layer_7___5
	this.instance_6 = new lib.text85("synched",0);
	this.instance_6.setTransform(-556.7,-171.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1178));

	// Masked_Layer_6___5
	this.instance_7 = new lib.text5("synched",0);
	this.instance_7.setTransform(-555.5,-200.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(1178));

	// Layer_5
	this.instance_8 = new lib.shape106("synched",0);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(449).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(709));

	// Layer_4
	this.instance_9 = new lib.shape99("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(1178));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.9,-203.9,995.2,402.4);


(lib.sprite97 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_408 = function() {
		//this.gotoAndPlay(445);
	}
	this.frame_979 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(408).call(this.frame_408).wait(571).call(this.frame_979).wait(1));

	// Masked_Layer_11___2
	this.instance = new lib.text92("synched",0);
	this.instance.setTransform(-541.75,-13.85);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(980));

	// Masked_Layer_10___2
	this.instance_1 = new lib.text91("synched",0);
	this.instance_1.setTransform(-541.75,28.15);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(980));

	// Masked_Layer_9___2
	this.instance_2 = new lib.text90("synched",0);
	this.instance_2.setTransform(-555.75,28.15);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(980));

	// Masked_Layer_8___2
	this.instance_3 = new lib.text89("synched",0);
	this.instance_3.setTransform(-555.75,-13.85);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(980));

	// Masked_Layer_7___2
	this.instance_4 = new lib.text88("synched",0);
	this.instance_4.setTransform(-555.75,-60.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(980));

	// Masked_Layer_6___2
	this.instance_5 = new lib.text87("synched",0);
	this.instance_5.setTransform(-541.75,-60.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(980));

	// Masked_Layer_5___2
	this.instance_6 = new lib.text86("synched",0);
	this.instance_6.setTransform(-555.7,-153.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(980));

	// Masked_Layer_4___2
	this.instance_7 = new lib.text85("synched",0);
	this.instance_7.setTransform(-556.7,-171.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(980));

	// Masked_Layer_3___2
	this.instance_8 = new lib.text5("synched",0);
	this.instance_8.setTransform(-555.5,-200.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(980));

	// Layer_5
	this.instance_9 = new lib.shape96("synched",0);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(759).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(201));

	// Layer_3
	this.instance_10 = new lib.shape94("synched",0);
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(589).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(371));

	// Layer_2
	this.instance_11 = new lib.shape93("synched",0);
	this.instance_11._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(423).to({_off:false},0).to({_off:true},4).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(538));

	// Layer_1
	this.instance_12 = new lib.shape84("synched",0);
	this.instance_12.setTransform(0,-1);

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(980));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.9,-203.9,995.2,401.4);


(lib.sprite81 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.shape80("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sprite81, new cjs.Rectangle(-5,-17.3,10,41.6), null);


(lib.sprite78 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.button76();
	new cjs.ButtonHelper(this.instance, 0, 1, 2, false, new lib.button76(), 3);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sprite78, new cjs.Rectangle(-1,-1,42,42), null);


(lib.sprite71 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.button67();
	new cjs.ButtonHelper(this.instance, 0, 1, 2, false, new lib.button67(), 3);

	this.instance_1 = new lib.button69();
	new cjs.ButtonHelper(this.instance_1, 0, 1, 2, false, new lib.button69(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,42.1,42.1);


(lib.sprite62 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_1091 = function() {
		//this.gotoAndPlay(1015);
	}
	this.frame_1885 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1091).call(this.frame_1091).wait(794).call(this.frame_1885).wait(1));

	// Masked_Layer_6___4
	this.instance = new lib.text56("synched",0);
	this.instance.setTransform(-555.1,-171.95);

	this.instance_1 = new lib.text61("synched",0);
	this.instance_1.setTransform(-555.1,-171.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1239).wait(647));

	// Masked_Layer_5___4
	this.instance_2 = new lib.text5("synched",0);
	this.instance_2.setTransform(-556,-200.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1886));

	// Layer_3
	this.instance_3 = new lib.shape58("synched",0);
	this.instance_3.setTransform(196.55,-8.95);
	this.instance_3.alpha = 0;
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(736).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(483).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(639));

	// Layer_1
	this.instance_4 = new lib.shape55("synched",0);
	this.instance_4.setTransform(196.55,-8.95);

	this.instance_5 = new lib.shape60("synched",0);
	this.instance_5.setTransform(200.85,-0.1);
	this.instance_5.alpha = 0;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(736).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(1135));
	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1233).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).wait(640));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.9,-212.4,981.2,414);


(lib.sprite15 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {"2b":482};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_1112 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1112).call(this.frame_1112).wait(1));

	// Masked_Layer_11___9
	this.instance = new lib.text7("synched",0);
	this.instance.setTransform(-555.15,-171.95);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1113));

	// Masked_Layer_10___9
	this.instance_1 = new lib.text5("synched",0);
	this.instance_1.setTransform(-556,-200.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1113));

	// Layer_8
	this.instance_2 = new lib.text10("synched",0);
	this.instance_2.setTransform(171.6,-194.9);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(269).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).wait(211).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(605));

	// Layer_7
	this.instance_3 = new lib.shape9("synched",0);
	this.instance_3.setTransform(190.25,1.65);
	this.instance_3.alpha = 0;
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(269).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).wait(211).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(605));

	// Layer_5
	this.instance_4 = new lib.text14("synched",0);
	this.instance_4.setTransform(272.65,149.9);
	this.instance_4.alpha = 0;
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(493).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(606));

	// Layer_4
	this.instance_5 = new lib.shape13("synched",0);
	this.instance_5.setTransform(190.25,1.65);
	this.instance_5.alpha = 0;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(493).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(606));

	// Layer_1
	this.instance_6 = new lib.shape3("synched",0);
	this.instance_6.setTransform(190.25,1.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(269).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(830));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-559.9,-203.9,984.7,399.8);


(lib.sprite822 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		MoveSlider();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// Layer_1
	this.instance = new lib.shape792("synched",0);
	this.instance.setTransform(0,0,1.0064,1.0012);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5,-15,10.1,30);


(lib.sprite82 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_600 = function() {
		//this.gotoAndPlay(660);
	}
	this.frame_1024 = function() {
		//this.gotoAndPlay(1085);
	}
	this.frame_1245 = function() {
		//this.gotoAndPlay(1305);
	}
	this.frame_1461 = function() {
		//this.gotoAndPlay(1520);
	}
	this.frame_1652 = function() {
		//this.gotoAndPlay(1765);
	}
	this.frame_2032 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(600).call(this.frame_600).wait(424).call(this.frame_1024).wait(221).call(this.frame_1245).wait(216).call(this.frame_1461).wait(191).call(this.frame_1652).wait(380).call(this.frame_2032).wait(1));

	// Masked_Layer_18___10
	this.instance = new lib.text70("synched",0);
	this.instance.setTransform(-552.4,111.8);

	this.instance_1 = new lib.text77("synched",0);
	this.instance_1.setTransform(-556.65,37.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1230).wait(803));

	// Masked_Layer_17___10
	this.instance_2 = new lib.text69("synched",0);
	this.instance_2.setTransform(-552.4,2.1);

	this.instance_3 = new lib.text76("synched",0);
	this.instance_3.setTransform(-556.65,-10);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2}]}).to({state:[{t:this.instance_3}]},1230).wait(803));

	// Masked_Layer_16___10
	this.instance_4 = new lib.text68("synched",0);
	this.instance_4.setTransform(-534.85,111.8);

	this.instance_5 = new lib.text75("synched",0);
	this.instance_5.setTransform(-539.1,37.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4}]}).to({state:[{t:this.instance_5}]},1230).wait(803));

	// Masked_Layer_15___10
	this.instance_6 = new lib.text67("synched",0);
	this.instance_6.setTransform(-534.85,2.1);

	this.instance_7 = new lib.text74("synched",0);
	this.instance_7.setTransform(-539.1,-10);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_6}]}).to({state:[{t:this.instance_7}]},1230).wait(803));

	// Masked_Layer_14___10
	this.instance_8 = new lib.text66("synched",0);
	this.instance_8.setTransform(-555.2,-153.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(2033));

	// Masked_Layer_13___10
	this.instance_9 = new lib.text73("synched",0);
	this.instance_9.setTransform(-560,93.9);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(1230).to({_off:false},0).wait(803));

	// Masked_Layer_12___10
	this.instance_10 = new lib.text65("synched",0);
	this.instance_10.setTransform(-556.2,-171.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(2033));

	// Masked_Layer_11___10
	this.instance_11 = new lib.text5("synched",0);
	this.instance_11.setTransform(-556,-200.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(2033));

	// Layer_9
	this.instance_12 = new lib.shape72("synched",0);
	this.instance_12.setTransform(194.1,-5.45);
	this.instance_12.alpha = 0;
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(1037).to({_off:false},0).to({alpha:0.9492},17).wait(1).to({alpha:1},0).wait(608).to({startPosition:0},0).to({alpha:0},16).to({_off:true},1).wait(353));

	// Layer_6
	this.instance_13 = new lib.sprite81();
	this.instance_13.setTransform(313.9,8.25,1.969,1.969,-135);
	this.instance_13.alpha = 0;
	this.instance_13._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(1663).to({_off:false},0).to({scaleX:1.9657,rotation:0,skewX:-135,skewY:-135.0943,x:314,y:8.3,alpha:0.0586},1).to({scaleX:1.969,rotation:-135,skewX:0,skewY:0,x:313.9,y:8.25,alpha:0.9414},14).wait(1).to({alpha:1},0).wait(354));

	// Layer_5
	this.instance_14 = new lib.shape64("synched",0);
	this.instance_14.setTransform(194.1,-5.45);

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(623).to({startPosition:0},0).to({alpha:0},7).to({_off:true},1).wait(1402));

	// Layer_4
	this.instance_15 = new lib.sprite81();
	this.instance_15.setTransform(208,-124.65,1.9691,1.9691,-165);
	this.instance_15.alpha = 0;
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(1663).to({_off:false},0).to({scaleX:1.9674,scaleY:1.9674,rotation:-165.1739,x:207.95,alpha:0.0586},1).to({scaleX:1.9691,scaleY:1.9691,rotation:-165,x:208,alpha:0.9414},14).wait(1).to({alpha:1},0).wait(354));

	// Layer_3
	this.instance_16 = new lib.shape71("synched",0);
	this.instance_16.setTransform(194.1,-5.45);
	this.instance_16.alpha = 0;
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(615).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(407).to({startPosition:0},0).to({alpha:0},18).to({_off:true},1).wait(977));

	// Layer_2
	this.instance_17 = new lib.sprite81();
	this.instance_17.setTransform(28.2,25.45,1.969,1.969,135);
	this.instance_17.alpha = 0;
	this.instance_17._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(1663).to({_off:false},0).to({alpha:0.9414},15).wait(1).to({alpha:1},0).wait(354));

	// Layer_1
	this.instance_18 = new lib.shape79("synched",0);
	this.instance_18.setTransform(194.1,-5.45);
	this.instance_18.alpha = 0;
	this.instance_18._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(1663).to({_off:false},0).to({alpha:0.9414},15).wait(1).to({alpha:1},0).wait(354));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-563.7,-203.9,973.8000000000001,408.4);


// stage content:
(lib.REF_MAIN = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {p1:0,p2:1122,p3:2982,p4:5004,p5:5982,p6:7175,p7:8315,p8:9187,p9:9827};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,1,1120,1121,1122,1123,2980,2981,2982,2983,5002,5003,5004,5005,5980,5981,5982,5983,7173,7174,7175,7176,8313,8314,8315,8316,9185,9186,9187,9188,9825,9826,9827,9828,10704];
	this.streamSoundSymbolsList[1] = [{id:"ref_main1_rrrrr",startFrame:1,endFrame:1120,loop:1,offset:160}];
	this.streamSoundSymbolsList[1123] = [{id:"ref_main2_rrrrr",startFrame:1123,endFrame:2981,loop:1,offset:0}];
	this.streamSoundSymbolsList[2983] = [{id:"ref_main3",startFrame:2983,endFrame:5003,loop:1,offset:0}];
	this.streamSoundSymbolsList[5005] = [{id:"ref_main4_rrrrr",startFrame:5005,endFrame:5981,loop:1,offset:0}];
	this.streamSoundSymbolsList[5983] = [{id:"ref_main5_rrrrr",startFrame:5983,endFrame:7174,loop:1,offset:0}];
	this.streamSoundSymbolsList[7176] = [{id:"ref_main6",startFrame:7176,endFrame:8314,loop:1,offset:0}];
	this.streamSoundSymbolsList[8316] = [{id:"ref_main7",startFrame:8316,endFrame:9186,loop:1,offset:0}];
	this.streamSoundSymbolsList[9188] = [{id:"ref_main8",startFrame:9188,endFrame:9826,loop:1,offset:0}];
	this.streamSoundSymbolsList[9828] = [{id:"ref_main9",startFrame:9828,endFrame:10704,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		/*
		function enablePauseall()
		{
		    _root.ani1.aniA.stop();
		    _root.ani1.ani.aniQ.stop();
		} // End of the function
		function disablePauseall()
		{
		    _root.ani1.aniA.play();
		    _root.ani1.aniB.play();
		 } // End of the function
		*/
		InitPage(9);
		Next(1);
		Prev(0);
		InitAnim();
		
		//-------------------------------------
		//ページ移動
		//-------------------------------------
		// NEXTボタンクリック
		this.next.addEventListener("click", ClickNext);
		// PREVボタンクリック
		this.previous.addEventListener("click", ClickPrev);
		
		//-------------------------------------
		// スライダー操作関連
		//-------------------------------------
		// 再生/停止ボタンクリック
		this.playpau.addEventListener("click", ClickPlayPau);
		// リプレイボタンクリック
		this.replay.addEventListener("click", ClickReplay);
	}
	this.frame_1 = function() {
		var soundInstance = playSound("ref_main1_rrrrr",0,160);
		this.InsertIntoSoundStreamData(soundInstance,1,1120,1,160);
	}
	this.frame_1120 = function() {
		this.stop();
	}
	this.frame_1121 = function() {
		this.stop();
	}
	this.frame_1122 = function() {
		Prev(1);
		InitAnim();
	}
	this.frame_1123 = function() {
		var soundInstance = playSound("ref_main2_rrrrr",0);
		this.InsertIntoSoundStreamData(soundInstance,1123,2981,1);
	}
	this.frame_2980 = function() {
		this.stop();
	}
	this.frame_2981 = function() {
		this.stop();
	}
	this.frame_2982 = function() {
		InitAnim();
	}
	this.frame_2983 = function() {
		var soundInstance = playSound("ref_main3",0);
		this.InsertIntoSoundStreamData(soundInstance,2983,5003,1);
	}
	this.frame_5002 = function() {
		this.stop();
	}
	this.frame_5003 = function() {
		this.stop();
	}
	this.frame_5004 = function() {
		InitAnim();
	}
	this.frame_5005 = function() {
		var soundInstance = playSound("ref_main4_rrrrr",0);
		this.InsertIntoSoundStreamData(soundInstance,5005,5981,1);
	}
	this.frame_5980 = function() {
		this.stop();
	}
	this.frame_5981 = function() {
		this.stop();
	}
	this.frame_5982 = function() {
		InitAnim();
	}
	this.frame_5983 = function() {
		var soundInstance = playSound("ref_main5_rrrrr",0);
		this.InsertIntoSoundStreamData(soundInstance,5983,7174,1);
	}
	this.frame_7173 = function() {
		this.stop();
	}
	this.frame_7174 = function() {
		this.stop();
	}
	this.frame_7175 = function() {
		InitAnim();
	}
	this.frame_7176 = function() {
		var soundInstance = playSound("ref_main6",0);
		this.InsertIntoSoundStreamData(soundInstance,7176,8314,1);
	}
	this.frame_8313 = function() {
		this.stop();
	}
	this.frame_8314 = function() {
		this.stop();
	}
	this.frame_8315 = function() {
		InitAnim();
	}
	this.frame_8316 = function() {
		var soundInstance = playSound("ref_main7",0);
		this.InsertIntoSoundStreamData(soundInstance,8316,9186,1);
	}
	this.frame_9185 = function() {
		this.stop();
	}
	this.frame_9186 = function() {
		this.stop();
	}
	this.frame_9187 = function() {
		Next(1);
		InitAnim();
	}
	this.frame_9188 = function() {
		var soundInstance = playSound("ref_main8",0);
		this.InsertIntoSoundStreamData(soundInstance,9188,9826,1);
	}
	this.frame_9825 = function() {
		this.stop();
	}
	this.frame_9826 = function() {
		this.stop();
	}
	this.frame_9827 = function() {
		Next(0);
		InitAnim();
	}
	this.frame_9828 = function() {
		var soundInstance = playSound("ref_main9",0);
		this.InsertIntoSoundStreamData(soundInstance,9828,10704,1);
	}
	this.frame_10704 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1119).call(this.frame_1120).wait(1).call(this.frame_1121).wait(1).call(this.frame_1122).wait(1).call(this.frame_1123).wait(1857).call(this.frame_2980).wait(1).call(this.frame_2981).wait(1).call(this.frame_2982).wait(1).call(this.frame_2983).wait(2019).call(this.frame_5002).wait(1).call(this.frame_5003).wait(1).call(this.frame_5004).wait(1).call(this.frame_5005).wait(975).call(this.frame_5980).wait(1).call(this.frame_5981).wait(1).call(this.frame_5982).wait(1).call(this.frame_5983).wait(1190).call(this.frame_7173).wait(1).call(this.frame_7174).wait(1).call(this.frame_7175).wait(1).call(this.frame_7176).wait(1137).call(this.frame_8313).wait(1).call(this.frame_8314).wait(1).call(this.frame_8315).wait(1).call(this.frame_8316).wait(869).call(this.frame_9185).wait(1).call(this.frame_9186).wait(1).call(this.frame_9187).wait(1).call(this.frame_9188).wait(637).call(this.frame_9825).wait(1).call(this.frame_9826).wait(1).call(this.frame_9827).wait(1).call(this.frame_9828).wait(876).call(this.frame_10704).wait(1));

	// Layer_126_page
	this.page = new cjs.Text("Page number", "italic bold 15px 'Arial'", "#FF9900");
	this.page.name = "page";
	this.page.lineHeight = 17;
	this.page.lineWidth = 193;
	this.page.parent = this;
	this.page.setTransform(23,658,1.4989,1.4989);

	this.timeline.addTween(cjs.Tween.get(this.page).wait(10705));

	// Layer_116_next
	this.next = new lib.button94();
	this.next.name = "next";
	this.next.setTransform(1496.1,5.1,0.9998,0.9999,0,0,0,0.1,0.1);
	new cjs.ButtonHelper(this.next, 0, 1, 2, false, new lib.button94(), 3);

	this.timeline.addTween(cjs.Tween.get(this.next).wait(10705));

	// Layer_111_previous
	this.previous = new lib.button87();
	this.previous.name = "previous";
	this.previous.setTransform(1432,5,1.0003,0.9993);
	new cjs.ButtonHelper(this.previous, 0, 1, 2, false, new lib.button87(), 3);

	this.timeline.addTween(cjs.Tween.get(this.previous).wait(10705));

	// Layer_108_slider
	this.slider = new lib.sprite822();
	this.slider.name = "slider";
	this.slider.setTransform(610.1,670.1,0.9937,0.9983,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.slider).wait(10705));

	// Layer_101_replay
	this.replay = new lib.sprite78();
	this.replay.name = "replay";
	this.replay.setTransform(1045.1,650.1,0.9999,0.9999,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.replay).wait(10705));

	// Layer_95_slider_base
	this.instance = new lib.sprite75();
	this.instance.setTransform(600,650,1,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(10705));

	// Layer_89_playpau
	this.playpau = new lib.sprite71();
	this.playpau.name = "playpau";
	this.playpau.setTransform(555,650,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.playpau).wait(10705));

	// Layer_36
	this.instance_1 = new lib.text32("synched",0);
	this.instance_1.setTransform(10,0,1.5021,1.5021);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(10705));

	// Mask_Layer_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("Eh8/AyyMAAAhfTMD5/AAAMAAABfTg");
	mask.setTransform(800,325);

	// Masked_Layer_2___1
	this.ani1 = new lib.sprite15();
	this.ani1.name = "ani1";
	this.ani1.setTransform(860,355,1.5021,1.5021);

	this.ani2 = new lib.sprite62();
	this.ani2.name = "ani2";
	this.ani2.setTransform(860,355,1.5021,1.5021);

	this.ani3 = new lib.sprite82();
	this.ani3.name = "ani3";
	this.ani3.setTransform(860,355,1.5021,1.5021);

	this.ani4 = new lib.sprite97();
	this.ani4.name = "ani4";
	this.ani4.setTransform(860,355,1.5021,1.5021);

	this.ani5 = new lib.sprite107();
	this.ani5.name = "ani5";
	this.ani5.setTransform(860,355,1.5021,1.5021);

	this.ani6 = new lib.sprite120();
	this.ani6.name = "ani6";
	this.ani6.setTransform(860,355,1.5021,1.5021);

	this.ani7 = new lib.sprite131();
	this.ani7.name = "ani7";
	this.ani7.setTransform(860,355,1.5021,1.5021);

	this.ani8 = new lib.sprite139();
	this.ani8.name = "ani8";
	this.ani8.setTransform(860,355,1.5021,1.5021);

	this.ani9 = new lib.sprite146();
	this.ani9.name = "ani9";
	this.ani9.setTransform(860,355,1.5021,1.5021);

	var maskedShapeInstanceList = [this.ani1,this.ani2,this.ani3,this.ani4,this.ani5,this.ani6,this.ani7,this.ani8,this.ani9];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.ani1}]}).to({state:[{t:this.ani2}]},1122).to({state:[{t:this.ani3}]},1860).to({state:[{t:this.ani4}]},2022).to({state:[{t:this.ani5}]},978).to({state:[{t:this.ani6}]},1193).to({state:[{t:this.ani7}]},1140).to({state:[{t:this.ani8}]},872).to({state:[{t:this.ani9}]},640).wait(878));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(810,350,787,341);
// library properties:
lib.properties = {
	id: '786DCE5F8407AE4380EFB6EA9159D292',
	width: 1600,
	height: 700,
	fps: 25,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/REF_MAIN_atlas_1.png", id:"REF_MAIN_atlas_1"},
		{src:"images/REF_MAIN_atlas_2.png", id:"REF_MAIN_atlas_2"},
		{src:"images/REF_MAIN_atlas_3.png", id:"REF_MAIN_atlas_3"},
		{src:"images/REF_MAIN_atlas_4.png", id:"REF_MAIN_atlas_4"},
		{src:"images/REF_MAIN_atlas_5.png", id:"REF_MAIN_atlas_5"},
		{src:"sounds/ref_main1_rrrrr.mp3", id:"ref_main1_rrrrr"},
		{src:"sounds/ref_main2_rrrrr.mp3", id:"ref_main2_rrrrr"},
		{src:"sounds/ref_main3.mp3", id:"ref_main3"},
		{src:"sounds/ref_main4_rrrrr.mp3", id:"ref_main4_rrrrr"},
		{src:"sounds/ref_main5_rrrrr.mp3", id:"ref_main5_rrrrr"},
		{src:"sounds/ref_main6.mp3", id:"ref_main6"},
		{src:"sounds/ref_main7.mp3", id:"ref_main7"},
		{src:"sounds/ref_main8.mp3", id:"ref_main8"},
		{src:"sounds/ref_main9.mp3", id:"ref_main9"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['786DCE5F8407AE4380EFB6EA9159D292'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;