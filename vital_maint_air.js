(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"vital_maint_air_atlas_1", frames: [[0,0,1261,926],[0,928,1276,872]]},
		{name:"vital_maint_air_atlas_2", frames: [[0,0,1258,819],[0,821,1270,765]]},
		{name:"vital_maint_air_atlas_3", frames: [[717,863,425,120],[1144,907,425,120],[219,953,313,120],[0,576,657,120],[1510,746,394,159],[1980,0,49,85],[332,798,383,153],[534,985,213,153],[925,0,600,160],[1209,214,766,120],[0,910,217,180],[1013,586,255,275],[706,502,1012,82],[1209,336,710,120],[370,234,547,163],[0,454,704,120],[370,399,276,53],[1921,336,113,53],[1980,87,60,60],[494,0,429,232],[0,698,330,210],[749,985,152,139],[1906,746,132,128],[1527,0,451,212],[925,162,282,338],[1720,458,262,286],[1510,586,184,124],[0,208,368,244],[1571,907,200,216],[1773,907,250,167],[0,0,492,206],[1270,586,238,293],[659,586,352,210]]},
		{name:"vital_maint_air_atlas_4", frames: [[652,1896,1009,120],[652,1774,1032,120],[0,566,1263,227],[0,1774,650,195],[0,0,1263,281],[0,1652,1286,120],[0,983,1274,173],[0,1477,1118,173],[0,283,1256,281],[0,1158,653,317],[0,795,1226,186],[1288,1357,392,340],[1682,1357,364,301],[1276,955,444,400],[1265,467,368,486],[1265,0,412,465],[1679,0,336,397],[1635,467,338,387],[655,1158,432,309]]},
		{name:"vital_maint_air_atlas_5", frames: [[0,1332,1263,335],[0,942,1270,388],[0,498,1276,442],[0,0,1225,496],[0,1669,1266,281],[1272,942,432,969]]},
		{name:"vital_maint_air_atlas_6", frames: [[0,660,1261,550],[0,0,1255,658],[0,1212,952,690]]}
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



(lib.CachedBmp_41 = function() {
	this.initialize(ss["vital_maint_air_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["vital_maint_air_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["vital_maint_air_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["vital_maint_air_atlas_5"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["vital_maint_air_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["vital_maint_air_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["vital_maint_air_atlas_5"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["vital_maint_air_atlas_6"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["vital_maint_air_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["vital_maint_air_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["vital_maint_air_atlas_5"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.acs16 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.image10 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.image103 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.image112 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.image120 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.image125 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.image130 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.image131 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.image132 = function() {
	this.initialize(ss["vital_maint_air_atlas_6"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.image136 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.image137 = function() {
	this.initialize(ss["vital_maint_air_atlas_5"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.image2 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.image61 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.image66 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.image67 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.image77 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.image78 = function() {
	this.initialize(ss["vital_maint_air_atlas_4"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.image82 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.image83 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.image87 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.image88 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.image94 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.image95 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.image96 = function() {
	this.initialize(ss["vital_maint_air_atlas_3"]);
	this.gotoAndStop(32);
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


(lib.text139 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_41();
	this.instance.setTransform(-3.95,-2.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-2.8,420.4,111.5);


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
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(-1.45,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.4,-2.2,141.4,39.900000000000006);


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
	this.instance = new lib.CachedBmp_39();
	this.instance.setTransform(-3.55,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-2.2,422.7,129.1);


(lib.text128 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_38();
	this.instance.setTransform(-1.45,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.4,-2.2,141.4,39.900000000000006);


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
	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-3.35,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-2.2,419.7,183);


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
	this.instance = new lib.CachedBmp_36();
	this.instance.setTransform(-2.95,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.9,-2.2,104.2,39.900000000000006);


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
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(-3.85,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.8,-2.2,424.7,147.1);


(lib.text118 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_34();
	this.instance.setTransform(-2.65,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.6,-2.2,218.7,39.900000000000006);


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
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(-3.95,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-2.2,419.7,308.2);


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
	this.instance = new lib.CachedBmp_32();
	this.instance.setTransform(6,-3.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(6,-3.8,131.2,52.9);


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
	this.instance = new lib.CachedBmp_31();
	this.instance.setTransform(2.25,-2.9,0.364,0.364);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(2.3,-2.9,17.8,31);


(lib.text106 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_30();
	this.instance.setTransform(18.85,-3.95,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(18.9,-3.9,127.5,50.9);


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
	this.instance = new lib.CachedBmp_29();
	this.instance.setTransform(14.95,1.95,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(15,2,70.9,50.9);


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
	this.instance = new lib.CachedBmp_28();
	this.instance.setTransform(-2.55,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.5,-2.2,335.8,39.900000000000006);


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
	this.instance = new lib.CachedBmp_27();
	this.instance.setTransform(-3.95,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-2.2,418.7,272.59999999999997);


(lib.text99 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_26();
	this.instance.setTransform(-2.55,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.5,-2.2,343.5,39.900000000000006);


(lib.text98 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(-2.85,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.8,-2.2,420.40000000000003,75.5);


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
	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(-3.45,-2.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.8,407.7,165.10000000000002);


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
	this.instance = new lib.CachedBmp_23();
	this.instance.setTransform(32.4,1.45,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(32.4,1.5,199.7,53.2);


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
	this.instance = new lib.CachedBmp_22();
	this.instance.setTransform(10.1,-3.75,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(10.1,-3.7,216.4,64.9);


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
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(-2.2,-1.7,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.2,-1.7,255,40);


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
	this.instance = new lib.CachedBmp_20();
	this.instance.setTransform(-3.85,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.8,-2.2,420.40000000000003,93.5);


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
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(-2,-1.7,0.3327,0.3327);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2,-1.7,427.9,40);


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
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(-3.05,-1.7,0.3327,0.3327);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3,-1.7,417.6,219);


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
	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(-3.15,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.1,-2.2,424,57.6);


(lib.text72 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_16();
	this.instance.setTransform(-3.85,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.8,-2.2,424.7,290.2);


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
	this.instance = new lib.CachedBmp_15();
	this.instance.setTransform(6.6,-3.95,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(6.6,-3.9,72.30000000000001,59.9);


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
	this.instance = new lib.CachedBmp_14();
	this.instance.setTransform(2.45,-3.95,0.2579,0.2579);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(2.5,-3.9,65.8,70.9);


(lib.text64 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_13();
	this.instance.setTransform(-3.15,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.1,-2.2,372.1,57.6);


(lib.text63 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_12();
	this.instance.setTransform(-3.65,-2.25,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-2.2,422.70000000000005,254.6);


(lib.text19 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(0,0,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,336.9,27.3);


(lib.text16 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_10();
	this.instance.setTransform(-3.45,-2.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.8,418,93.6);


(lib.text15 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(-2.7,-2.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.7,-2.8,236.39999999999998,40);


(lib.text13 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_8();
	this.instance.setTransform(-3.65,-3.15,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-3.1,217.29999999999998,105.5);


(lib.text12 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_7();
	this.instance.setTransform(3.05,-2.55,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(3.1,-2.5,182,54.2);


(lib.text9 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_6();
	this.instance.setTransform(-0.25,-1.7,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.2,-1.7,234.29999999999998,40);


(lib.text8 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_5();
	this.instance.setTransform(-3.1,-1.7,0.3328,0.3328);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.1,-1.7,421.40000000000003,93.5);


(lib.text6 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_4();
	this.instance.setTransform(1,-3.15,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1,-3.1,408.1,61.9);


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

	// Layer_2
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_4"],15);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.449,0,0,0.468,-92.4,-108.8)).s().p("AubRAMAAAgh/Ic3AAMAAAAh/g")
	}.bind(this);
	this.shape.setTransform(90,7.95);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_5"],5);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.385,0,0,0.385,-83.3,-186)).s().p("AtAdFMAAAg6JIaBAAMAAAA6Jg")
	}.bind(this);
	this.shape_1.setTransform(-59.975,-9.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-143.2,-195.6,325.7,372.1);


(lib.shape133 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_5
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("ArerPIW9AAIAAWfI29AAg");
	this.shape.setTransform(95.65,-85.9);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_4
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_4"],14);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.367,0,0,0.366,-67.5,-89)).s().p("AqiN6IAA7zIVFAAIAAbzg")
	}.bind(this);
	this.shape_1.setTransform(89.525,90.025);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],22);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(1.141,0,0,1.14,-75.3,-72.9)).s().p("ArwLZIAA2yIXhAAIAAWyg")
	}.bind(this);
	this.shape_2.setTransform(96.5,-85);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_2
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#000000").ss(2,0,0,3).p("AAAy0QKuAAHkFhQHlFhAAHyQAAHznlFhQnkFhquAAQqtAAnllhQnklhAAnzQAAnyHklhQHllhKtAAg");
	this.shape_3.setTransform(-62.35,9.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

	// Layer_1
	this.shape_4 = new cjs.Shape();
	var sprImg_shape_4 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_6"],2);
	sprImg_shape_4.onload = function(){
		this.shape_4.graphics.bf(sprImg_shape_4, null, new cjs.Matrix2D(0.35,0,0,0.35,-166.8,-120.8)).s().p("A6DS4MAAAglvMA0HAAAMAAAAlvg")
	}.bind(this);
	this.shape_4.setTransform(-60.025,10);

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-228.8,-158.9,400.6,338);


(lib.shape126 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],21);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.232,0,0,1.232,-93.7,-85.6)).s().p("AuoNYIAA6vIdRAAIAAavg")
	}.bind(this);
	this.shape.setTransform(1.125,-42);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-92.5,-127.6,187.3,171.2);


(lib.shape121 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("EAg5AdnMhBxAAAMAAAg7NMBBxAAAg");
	this.shape.setTransform(-8.35,-9.425);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_4"],13);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.964,0,0,0.97,-214,-194)).s().p("EghbAeUMAAAg8nMBC3AAAMAAAA8ng")
	}.bind(this);
	this.shape_1.setTransform(-7,-8);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-221,-202,428,388);


(lib.shape113 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("AQpNrMghRAAAIAA7VMAhRAAAg");
	this.shape.setTransform(-6.35,98.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_4"],12);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.6,0,0,0.601,-109.3,-90.4)).s().p("AxEOIIAA8PMAiJAAAIAAcPg")
	}.bind(this);
	this.shape_1.setTransform(-6.45,99.95);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-115.7,9.6,218.60000000000002,180.8);


(lib.shape110 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#FFFFFF").s().p("Ao+C7IAAl2IR9AAIAAF2g");
	this.shape.setTransform(-7.85,-193.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.3,-212.4,115,37.5);


(lib.shape109 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("AcSQVMg4jAAAMAAAggpMA4jAAAg");
	this.shape.setTransform(-7.85,-102.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-189.8,-208,364,211);


(lib.shape104 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],20);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-138.5,-118.3)).s().p("Ay0OVIAAgKIgKAAIAAgKIAKAAIAAgKIAKAAIAAigIgKAAIAAgUIgIAAIgFgKIgGgJIgLAAIAAgVIgKAAIAAgKIgKAAIAAgKIgKAAIAAgeIgKAAIAAgoIAKAAIAAgoIAKAAIAAgUIgKAAIAAjLIAAgJIABgIIAJAAIAAgoIgFAAIABgIIAIg3IACgRIAEAAIAAgKIAKAAIAAgoIAKAAIAAgKIAKAAIAAgKIAoAAIAAgUIBaAAIAAAUIEEAAIAAgKIgKAAIAAgUIgKAAIAAgeIAKAAIAAgxIgUAAIAAhEQACgKAFgLIABAAIAAgBIACAAIAAgCIAMgIIBOAAIAAgBIAKABIAAAAICmAAQAGAFAIADIAAACIADAAIAHAIIAAACIAAAAIAKAaIAAAEIAFAAIAFADIAAAbIAKAAIAAAKIAKAAIAAAxIAKAAIAABGIAKAAIAAgKIAKAAIAAAKIAUAAIAAgKIAoAAIAAAKICqAAIAAgKIAKAAIAAgKIAKAAIAAAKIAKAAIAAgKIAKAAIAAk/IgKAAIAAgKIgKAAIAAAKIgKAAIAAAKIgKAAIAAAKIgeAAIAAgKIgKAAIAAgUIg8AAIAAAeIgeAAIAAgKIgKAAIAAiqIgGAAIAAgDIAAgDIgBgIIgBgEQABgBAAgBQAAAAgBgBQAAAAAAgBQAAAAgBAAIgBAAIAAgSIgKAAIAAAKIgKAAIAAgKIgKAAIAAgKIk2AAIAAAKIg1AAQgvgDgyABIAAgIIi+AAIAAAKIhQAAIAAgKIg8AAIAAAKIgJAAIgBgJIAAgBIgDgUIADAAIAAgeIgJAAIgBgEIAAgGIgEAAIgEgDIgCgEIAAgrIAKAAIAAgKIAUAAIAAAKIHgAAIAAgBIDSABIAAAAIAKAAIAAAAIB4ABQABgBAAgBQAAgBAAAAQAAgBgBAAQAAgBAAAAIgFgGIAFAAIAAgKIAKAAIAAgWIAUACIAAAKIAKAAIAAgJIAWAAQARABAPADIAQABIAAAEIAKAAIAAAUIAKAAIAAgKIAUAAIAAgKIAKAAIAAgKIAKgFIAAAFIAKAAIAAgIIAZAAIAdgGIABgGIAFAAIAAgaIABgFIAAgJIAJAAIAAgKIAUAAIAAgHIAeAAIAAAHIAyAAIAAgFIAyABIAAAEIA7AAIAAgCIBkADIAAAJIgUAAIAAAKIAeAAIAAgTIEEAIIAAALIAHAAIABA8IgIAAIAAAKIAJAAIAAAKIgJAAIAAAUIAJAAIABAKIgKAAIAAAUIAKAAIAAgKIABAUIgBAAIAAAUIgKAAIAABaIAKAAIAAB4IAKAAIAAgKIAKAAIAAAKIAyAAIAAAKIgKAAIAAAKIAeAAIAAAKIgUAAIAAAKIBkAAIAAgUIAKAAIAAAeIAKAAIAABQIAAAAIAAAKIAAAAIAABGIgUAAIAAgUIgKAAIAAg8IgKAAIAAgKIgKAAIAAAKIgKAAIAAgKIgeAAIAAAKIgKAAIAAgKIgKAAIAAAKIgKAAIAAgKIgKAAIAAAKIgKAAIAAgKIgKAAIAACfIAKAAIAAgJIA8AAIAAgBIAHACIAHACIAGAAIAAAGIAUAAIAAAKIAGAAIANBNIAVgCIAAAFIAKAAIAAAKIAKAAIAAAKIAKAAIAAgUIgKAAIAAgGIAEgCIABgCIAFAAIAAgIICgAFIAAANIAIAAIABAJIAUASIALAAIAAANIAUAAIAAgEIBGACIAAACIAUAAIAAgBIAKAAIAAABIAKAAIAAAAIBkADIAAAHIAUAAIAAgGIAKAAIAAAGIBQAAIAAAKIAeAAIAAAKIAUAAIAAAKIAKAAIAAAKIAKAAIAAAKIAUAAIAAAKIAJAAIABADIAAAHIACAAIAJAHIAJAKIAAADIACAAIAFAEQABAFACAEIAEAEIADAUIAKAQIAHAQIACABIAEAFIAAAFIAGAAIAEAEIAAASIgFABIAKApIAFABIAAAAIgEAAIgEBSIAIAGIAAAHIgeAAIAAADIgLgIIg/AAIgGgFIAAgKIgKAAIAAgKIgKAAIAAgKIgBAAIAFgGIAAgMQgBgKgDgKIAAg0IgKAAIAAgUIgUAAIAAgKIgKAAIAAgKIgKAAIAAgKIgDAAIgDgSIgOgJIAAgNIiWAAIAAAKIigAAIAAgKIgeAAIAAAKIgKAAIAAAKIACAAIAAAbIhkAHIACABIAABVIgpAEIgCgBIAAABIgBAAIABAAIAAA+IADgEIAqAEIAEBUIACAAIAAADIgBAbIgBAAIgFCtIgFAAQgDALACAOIAAADQAPAEAQABIAAAEIAIAAIgEAmQgEgBAEACIAAgBIAGAAQAGAAADgBIABgBIAAADIipAKIAFBHIgGAAIAAAKgANDOLIAAgKIgUAAIAAgBIAoABIAAAAIgKAAIAAAKgA1oK5IAAgPIAFAHIAGAIgASNJBIAAgUIALAAIgKAUgAz6IZIAAgGIAAAGgAShIPIgKAAIAAgUIASAAIgIAagAVoF5IAAgCIgDgIIAEAAIAAAKgATSF5IAAgGIgDgEIAEAAIAAAKgAzdCTIAAgKIABAAIAAAKgAtlBXIADAAIABgBIABgCIAAADgAtqBXIAAAAIABAAgAt+BXIAAgEIAKACIAAACgANMAsIhHglIhWg3QADgHgCgHICWhYIACACIACABQADAJACAJQABAEADACQAqAEAqAAIAAAHIAFAAIACACIAEAPIAAADIADAbIgDA1IgBAAIAAAMIhcgBIAAABIgBgBIgCAtIgDABIgDgBgAoMgqIAAgEIAKAAIAAAEgAMYiiQgGgPAAgPIAJAAIAAgKIgKAAIAAgKIAKAAIAAlKIgKAAIAAE2IgKAAIAAmaIgKAAIAAgKIAKAAIAAgoIAKAAIAAgKIgeAAIAAAeIgKAAIAAgUIgKAAIAAgKIgKAAIAAAKIgUAAIAAAKIgoAAIAAgKIgKAAIAAgKIAUAAIAAgUIg8AAIAAAKIhQAAIAAgKIknAAIhUgBQgpgBgoACIlnAAIAAAKIgeAAIAAAUIgKAAIAAAKIgJAAIABgDIgqgOIAAgDIgKAAIg+gUQABAPAGAPIgFAAIAABCIgDAGQAAADAAAEIADAcIAAADIgKAAIAAAMIgUAAIgCg+IACAAIAAgKIgCAAIgBgzIADgFQABgJgBgIIgCgRIACAAIAAgUIgDAAIAAgEIgBgQIAEAAIAAiMIAKAAIAAgEIAKABIAAANIADAAIAAAKIgDAAIAABuIACAAQABANAEAMIBFgZIAiAAIAAgHIAegCIAAATIgKAAIAAAKIgyAAIAAAKIBGAAIAAAKIAeAAIAAgKIAKAAIAAAKIAKAAIAAgKIMLAAIAAAKIB4AAIAAgKIhuAAIAAgKICCAAIAAgKIgKAAIAAgKIB4AAIAAgUIAKAAIAAgKIAKAAIAAhGIgKAAIAAgUIAKAAIAAgJIAUAAIAABFIAEAAIAAAoIgEAAIAAAKIAEAAIAAAoIgEAAIAAAKIAEAAIgCIIIgCAAIAAA8gAMRjUIgBgKIABAAIAAAKIAAAAgAmVkuIABgXIAAAXgAsfqAIgZgUIAAgZIgHADICPhQIAEAAIAAgCIAOgIIAGAAIAAAUIAEAAIACAUQAOAHAPABIAwAAIARAAIAAAMIAJAAIAABJIgDAIIgBAJIAAAAIhnADIAFAGIgBAugAmlo8IAAgBIAHgEIAAAFgAtCo8IAAgCIAHACgAIhqgIAAgKIgKAAIAAgKIAoAAIAAAKIgKAAIAAAKgAoAq0IAAgBIAAAAIABABgAH4r6IAFgBIADAAIAHgKIAGgDIAAAEIAKAAIAAAKgANDs2IAAgKIAKAAIAAAKgAm4s2IAFgEIABAAIAAAEgAF1teQgmgHgngDICaAAIgCAKg")
	}.bind(this);
	this.shape.setTransform(-21.65,-87.15);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.1,-178.8,277,183.4);


(lib.shape97 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("EAg+gdrMAAAAlzI4sAAMAAAglzgEAg+AdsMhB7AAAIAA0KMBB7AAAg");
	this.shape.setTransform(2.15,-16);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#000000").ss(2,0,0,3).p("ATnL4MgnNAAAIAA3vMAnNAAAg");
	this.shape_1.setTransform(-81.35,-41);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],30);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.858,0,0,0.632,-210.6,-65.1)).s().p("Egg5AKLIAA0VMBBzAAAIAAUVg")
	}.bind(this);
	this.shape_2.setTransform(2.5,109.975);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_2
	this.shape_3 = new cjs.Shape();
	var sprImg_shape_3 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],31);
	sprImg_shape_3.onload = function(){
		this.shape_3.graphics.bf(sprImg_shape_3, null, new cjs.Matrix2D(0.664,0,0,0.83,-79,-121.6)).s().p("AsVTAMAAAgl/IYrAAMAAAAl/g")
	}.bind(this);
	this.shape_3.setTransform(134.525,-84.05);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

	// Layer_1
	this.shape_4 = new cjs.Shape();
	var sprImg_shape_4 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],32);
	sprImg_shape_4.onload = function(){
		this.shape_4.graphics.bf(sprImg_shape_4, null, new cjs.Matrix2D(0.72,0,0,0.731,-126.4,-76.7)).s().p("AzvMAIAA3/MAnfAAAIAAX/g")
	}.bind(this);
	this.shape_4.setTransform(-81.5,-41.05);

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-209.8,-207,424,382.1);


(lib.shape89 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("ACBhtMAgDAAAIAAJYMggDAAAgEgiDgHqIf4AAIAAH/I/4AAg");
	this.shape.setTransform(-11.8,-123.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("ACCHrIAApYMAgCAAAIAAJYgEgiDAAVIAAn+If4AAIAAH+g");
	this.shape_1.setTransform(-11.8,-123.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#000000").ss(2,0,0,3).p("AkrwoMAAAAhRI+8AAMAAAghRgEAjogJcIAAZxMgm5AAAIAA5xg");
	this.shape_2.setTransform(2.15,-6.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_2
	this.shape_3 = new cjs.Shape();
	var sprImg_shape_3 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],28);
	sprImg_shape_3.onload = function(){
		this.shape_3.graphics.bf(sprImg_shape_3, null, new cjs.Matrix2D(1,0,0,1,-100,-108)).s().p("AvnQ4MAAAghwIfPAAMAAAAhwg")
	}.bind(this);
	this.shape_3.setTransform(-125.975,-6.05);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

	// Layer_1
	this.shape_4 = new cjs.Shape();
	var sprImg_shape_4 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],29);
	sprImg_shape_4.onload = function(){
		this.shape_4.graphics.bf(sprImg_shape_4, null, new cjs.Matrix2D(1.001,0,0,1,-125.1,-83.5)).s().p("AziNDIAA6FMAnFAAAIAAaFg")
	}.bind(this);
	this.shape_4.setTransform(105,15.975);

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-230.7,-173.1,461.9,275.1);


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

	// Layer_3
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],26);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-91.5,-62)).s().p("AuSJsIAAzXIclAAIAATXg")
	}.bind(this);
	this.shape.setTransform(2.5,75);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#000000").ss(2,0,0,3).p("A8gS/MAAAgl9MA5BAAAMAAAAl9g");
	this.shape_1.setTransform(-5.85,-78.85);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],27);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(1,0,0,1,-183.5,-122)).s().p("A8qTEMAAAgmHMA5VAAAMAAAAmHg")
	}.bind(this);
	this.shape_2.setTransform(-5.5,-78);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-189.3,-201.3,367.3,338.3);


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

	// Layer_2
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_4"],17);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.498,0,0,0.498,-84.2,-96.3)).s().p("AtJPDIAA+FIaTAAIAAeFg")
	}.bind(this);
	this.shape.setTransform(-3.275,76.975);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_4"],18);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.573,0,0,0.573,-123.4,-88.5)).s().p("AzRN1IAA7pMAmjAAAIAAbpg")
	}.bind(this);
	this.shape_1.setTransform(3.55,-126.05);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-119.8,-214.5,246.8,387.8);


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

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("Anum3MAAAAhHI7WAAMAAAghHgEAjFgaPMAAAAsXMgonAAAMAAAgsXg");
	this.shape.setTransform(-10.1,-25.05);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-235.6,-194,451,338);


(lib.shape68 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AF7paIAAJmIr1AAIAApmgAFoJbIrZAAIAAoAILZAAg");
	this.shape.setTransform(-195.775,33.15);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AlxJbIAAoAILZAAIAAIAgAl6AMIAApmIL1AAIAAJmg");
	this.shape_1.setTransform(-195.775,33.15);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_2
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],24);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.631,0,0,0.631,-89,-106.6)).s().p("At5QrMAAAghUIbzAAMAAAAhUg")
	}.bind(this);
	this.shape_2.setTransform(-147.025,36.95);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_1
	this.shape_3 = new cjs.Shape();
	var sprImg_shape_3 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],25);
	sprImg_shape_3.onload = function(){
		this.shape_3.graphics.bf(sprImg_shape_3, null, new cjs.Matrix2D(1,0,0,1,-130.5,-143)).s().p("A0YWWMAAAgsrMAoxAAAMAAAAsrg")
	}.bind(this);
	this.shape_3.setTransform(84.5,-51);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-236,-194,451,337.6);


(lib.shape62 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_4"],16);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.75,0,0,0.75,-125.7,-148.9)).s().p("AzoXRMAAAguiMAnRAAAMAAAAuig")
	}.bind(this);
	this.shape.setTransform(12.5,-37.05);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-113.2,-186,251.39999999999998,297.9);


(lib.shape14 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("ARRQzMgihAAAMAAAghlMAihAAAg");
	this.shape.setTransform(-93.35,-35);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-204.8,-143.5,223,217);


(lib.shape11 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#FFFFFF").s().p("AwePjIAA/FMAg9AAAIAAfFg");
	this.shape.setTransform(130.65,-51.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],19);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(1,0,0,1,-214.5,-116)).s().p("EghgASIMAAAgkPMBDBAAAMAAAAkPg")
	}.bind(this);
	this.shape_1.setTransform(6.5,-31);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-208,-150.5,444.2,235.5);


(lib.shape7 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("ACWtCMAgMAAAEAiigMuIAAZnMggMAAAIAA5nEgiNgNCMAg+AAAAhPsuIAAZxMgg+AAAEgihANDIAA6F");
	this.shape.setTransform(-5.35,-22.95);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-227.3,-107.4,444,169);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_air_atlas_3"],23);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-225.5,-106)).s().p("EgjOAQkMAAAghHMBGdAAAMAAAAhHg")
	}.bind(this);
	this.shape.setTransform(225.5,106);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,451,212);


(lib.button99 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_3();
	this.instance.setTransform(7.95,11.95,0.4999,0.4999);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(4));

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FFFFFF").ss(2,1,1).p("AqJj5IUTAAQBkAAAABkIAAErQAABkhkAAI0TAAQhkAAAAhkIAAkrQAAhkBkAAg");
	this.shape.setTransform(75,25);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000066").s().p("AqJD6QhkAAAAhkIAAkrQAAhkBkAAIUTAAQBkAAAABkIAAErQAABkhkAAg");
	this.shape_1.setTransform(75,25);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#0099FF").s().p("AqJD6QhkAAAAhkIAAkrQAAhkBkAAIUTAAQBkAAAABkIAAErQAABkhkAAg");
	this.shape_2.setTransform(75,25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape}]},1).to({state:[{t:this.shape_2},{t:this.shape}]},1).to({state:[{t:this.shape_2},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,152,52);


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
	this.instance = new lib.CachedBmp_2();
	this.instance.setTransform(5,12,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_1();
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


(lib.sprite782 = function(mode,startPosition,loop,reversed) {
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

}).prototype = getMCSymbolPrototype(lib.sprite782, new cjs.Rectangle(-1,-1,42,42), null);


(lib.sprite140 = function(mode,startPosition,loop,reversed) {
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
	this.frame_869 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(869).call(this.frame_869).wait(1));

	// Masked_Layer_9___6
	this.instance = new lib.text139("synched",0);
	this.instance.setTransform(-735.4,-35.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(870));

	// Masked_Layer_8___6
	this.instance_1 = new lib.text135("synched",0);
	this.instance_1.setTransform(-738.4,-202.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(870));

	// Masked_Layer_7___6
	this.instance_2 = new lib.text134("synched",0);
	this.instance_2.setTransform(-736.4,-169.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(870));

	// Layer_5
	this.instance_3 = new lib.shape133("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({_off:true},493).wait(377));

	// Layer_2
	this.instance_4 = new lib.shape138("synched",0);
	this.instance_4.setTransform(-12.6,11.05);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(493).to({_off:false},0).wait(377));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-204.7,911.7,392.2);


(lib.sprite129 = function(mode,startPosition,loop,reversed) {
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
	this.frame_624 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(624).call(this.frame_624).wait(1));

	// Masked_Layer_4___2
	this.instance = new lib.text128("synched",0);
	this.instance.setTransform(-738.5,-202.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(625));

	// Masked_Layer_3___2
	this.instance_1 = new lib.text127("synched",0);
	this.instance_1.setTransform(-736.5,-170.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(625));

	// Layer_1
	this.instance_2 = new lib.shape126("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(625));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-204.7,834.6999999999999,248.29999999999998);


(lib.sprite124 = function(mode,startPosition,loop,reversed) {
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
	this.frame_644 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(644).call(this.frame_644).wait(1));

	// Masked_Layer_5___3
	this.instance = new lib.text123("synched",0);
	this.instance.setTransform(-737,-202.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(645));

	// Masked_Layer_4___3
	this.instance_1 = new lib.text122("synched",0);
	this.instance_1.setTransform(-735,-171.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(645));

	// Layer_2
	this.instance_2 = new lib.shape121("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(645));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-204.7,946.9,390.7);


(lib.sprite119 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1765 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1765).call(this.frame_1765).wait(1));

	// Masked_Layer_4___2
	this.instance = new lib.text118("synched",0);
	this.instance.setTransform(-737.3,-202.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1766));

	// Masked_Layer_3___2
	this.instance_1 = new lib.text117("synched",0);
	this.instance_1.setTransform(-735.3,-167.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1766));

	// レイヤー_3
	this.instance_2 = new lib.acs16();
	this.instance_2.setTransform(-195,-187);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1766));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-204.7,936.9,357.7);


(lib.sprite114 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1354 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1354).call(this.frame_1354).wait(1));

	// Masked_Layer_12___10
	this.instance = new lib.text102("synched",0);
	this.instance.setTransform(-737.4,-202.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1355));

	// Masked_Layer_11___10
	this.instance_1 = new lib.text101("synched",0);
	this.instance_1.setTransform(-735.4,-169.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1355));

	// Layer_9
	this.instance_2 = new lib.text111("synched",0);
	this.instance_2.setTransform(-77.8,-206.3);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(79).to({_off:false},0).wait(1276));

	// Layer_8
	this.instance_3 = new lib.shape110("synched",0);
	this.instance_3.setTransform(0,2.6);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(79).to({_off:false},0).wait(1276));

	// Layer_7
	this.instance_4 = new lib.shape113("synched",0);
	this.instance_4.setTransform(6.95,-0.5);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(514).to({_off:false},0).wait(841));

	// Layer_5
	this.instance_5 = new lib.shape109("synched",0);
	this.instance_5.setTransform(0,2.6,1,1.0536);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(79).to({_off:false},0).wait(1276));

	// Layer_4
	this.instance_6 = new lib.text108("synched",0);
	this.instance_6.setTransform(168.6,2.45,0.9146,0.9146);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(79).to({_off:false},0).to({_off:true},435).wait(841));

	// Layer_3
	this.instance_7 = new lib.text106("synched",0);
	this.instance_7.setTransform(39.55,-117.25);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(79).to({_off:false},0).wait(1276));

	// Layer_2
	this.instance_8 = new lib.text105("synched",0);
	this.instance_8.setTransform(-179.6,-183.4);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(79).to({_off:false},0).wait(1276));

	// Layer_1
	this.instance_9 = new lib.shape104("synched",0);
	this.instance_9.setTransform(0,-2.4);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(79).to({_off:false},0).wait(1276));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-216.5,926.9,406.4);


(lib.sprite100 = function(mode,startPosition,loop,reversed) {
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
	this.frame_428 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(428).call(this.frame_428).wait(1));

	// Masked_Layer_7___5
	this.instance = new lib.text99("synched",0);
	this.instance.setTransform(-737.4,-202.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(429));

	// Masked_Layer_6___5
	this.instance_1 = new lib.text98("synched",0);
	this.instance_1.setTransform(-735.4,-170.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(429));

	// Layer_4
	this.instance_2 = new lib.shape97("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(429));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-207,954.0999999999999,382.1);


(lib.sprite93 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1350 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1350).call(this.frame_1350).wait(1));

	// Masked_Layer_10___7
	this.instance = new lib.text92("synched",0);
	this.instance.setTransform(-735.45,-80.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1351));

	// Masked_Layer_9___7
	this.instance_1 = new lib.text86("synched",0);
	this.instance_1.setTransform(-737.75,-206.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1351));

	// Masked_Layer_8___7
	this.instance_2 = new lib.text85("synched",0);
	this.instance_2.setTransform(-735.45,-173.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1351));

	// Layer_6
	this.instance_3 = new lib.text91("synched",0);
	this.instance_3.setTransform(-265.85,-163.35);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(529).to({_off:false},0).wait(822));

	// Layer_5
	this.instance_4 = new lib.text90("synched",0);
	this.instance_4.setTransform(-22.2,-121.4);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(529).to({_off:false},0).wait(822));

	// Layer_4
	this.instance_5 = new lib.shape89("synched",0);
	this.instance_5.setTransform(-5.85,4.75);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(529).to({_off:false},0).wait(822));

	// Layer_3
	this.instance_6 = new lib.shape84("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({_off:true},529).wait(822));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-207.9,965.2,344.9);


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

	// timeline functions:
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_841 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(841).call(this.frame_841).wait(1));

	// Layer_6
	this.instance = new lib.shape79("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(842));

	// Masked_Layer_3___1
	this.instance_1 = new lib.text76("synched",0);
	this.instance_1.setTransform(-737.95,-213.8,1.0003,1);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(842));

	// Masked_Layer_2___1
	this.instance_2 = new lib.text75("synched",0);
	this.instance_2.setTransform(-735.95,-161.8,1.0003,1);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(842));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-215.5,866.9,388.8);


(lib.sprite74 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1184 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1184).call(this.frame_1184).wait(1));

	// Masked_Layer_9___7
	this.instance = new lib.text73("synched",0);
	this.instance.setTransform(-736.8,-203.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1185));

	// Masked_Layer_8___7
	this.instance_1 = new lib.text72("synched",0);
	this.instance_1.setTransform(-735.65,-150.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1185));

	// Layer_6
	this.instance_2 = new lib.shape71("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1185));

	// Layer_5
	this.instance_3 = new lib.text70("synched",0);
	this.instance_3.setTransform(-238.6,47);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1185));

	// Layer_4
	this.instance_4 = new lib.text69("synched",0);
	this.instance_4.setTransform(-240.3,-23,1.2903,1);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1185));

	// Layer_3
	this.instance_5 = new lib.shape68("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1185));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-205.7,955.3,349.7);


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


(lib.sprite65 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1161 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1161).call(this.frame_1161).wait(1));

	// Masked_Layer_4___2
	this.instance = new lib.text64("synched",0);
	this.instance.setTransform(-736.8,-202.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1162));

	// Masked_Layer_3___2
	this.instance_1 = new lib.text63("synched",0);
	this.instance_1.setTransform(-734.8,-150.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1162));

	// Layer_1
	this.instance_2 = new lib.shape62("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1162));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-204.7,878.0999999999999,316.6);


(lib.sprite17 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1013 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1013).call(this.frame_1013).wait(1));

	// Masked_Layer_10___6
	this.instance = new lib.text9("synched",0);
	this.instance.setTransform(-737.7,-213.85);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1014));

	// Masked_Layer_9___6
	this.instance_1 = new lib.text8("synched",0);
	this.instance_1.setTransform(-736.85,-181.9,1.0001,1);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1014));

	// Masked_Layer_8___6
	this.instance_2 = new lib.text16("synched",0);
	this.instance_2.setTransform(-735.25,-65.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1014));

	// Masked_Layer_7___6
	this.instance_3 = new lib.text15("synched",0);
	this.instance_3.setTransform(-735.25,-94.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1014));

	// Layer_5
	this.instance_4 = new lib.shape14("synched",0);
	this.instance_4.setTransform(-7.5,-8.85);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(426).to({_off:false},0).wait(588));

	// Layer_4
	this.instance_5 = new lib.text13("synched",0);
	this.instance_5.setTransform(25.5,-63.35);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(426).to({_off:false},0).wait(588));

	// Layer_3
	this.instance_6 = new lib.shape7("synched",0);
	this.instance_6.setTransform(-5,-19.9);

	this.instance_7 = new lib.text12("synched",0);
	this.instance_7.setTransform(21.5,-152.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_6}]}).to({state:[{t:this.instance_6}]},412).to({state:[{t:this.instance_6}]},13).to({state:[{t:this.instance_7}]},1).wait(588));
	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(412).to({startPosition:0},0).to({alpha:0.0117},13).to({_off:true},1).wait(588));

	// Layer_2
	this.instance_8 = new lib.text6("synched",0);
	this.instance_8.setTransform(-219.95,-192.45);

	this.instance_9 = new lib.shape11("synched",0);
	this.instance_9.setTransform(-7.5,-8.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8}]}).to({state:[{t:this.instance_8}]},412).to({state:[{t:this.instance_8}]},13).to({state:[{t:this.instance_9}]},1).wait(588));
	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(412).to({startPosition:0},0).to({alpha:0.0117},13).to({_off:true},1).wait(588));

	// Layer_1
	this.instance_10 = new lib.shape3("synched",0);
	this.instance_10.setTransform(-235.15,-167.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(412).to({startPosition:0},0).to({alpha:0.0117},13).to({_off:true},1).wait(588));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-739.9,-215.5,979.0999999999999,291.7);


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


// stage content:
(lib.vital_maint_air = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {p1:0,p2:1000,p3:2130,p4:3291,p5:4112,p6:5499,p7:5931,p8:7286,p9:9057,p10:9690,p11:10315};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,1,998,999,1000,1001,2128,2129,2130,2131,3289,3290,3291,3292,3771,4110,4111,4112,4113,5497,5498,5499,5500,5929,5930,5931,5932,7284,7285,7286,7287,9055,9056,9057,9058,9688,9689,9690,9691,10313,10314,10315,10316,11186];
	this.streamSoundSymbolsList[1] = [{id:"vital_maint_air1",startFrame:1,endFrame:998,loop:1,offset:0}];
	this.streamSoundSymbolsList[1001] = [{id:"vital_maint_air2",startFrame:1001,endFrame:2128,loop:1,offset:0}];
	this.streamSoundSymbolsList[2131] = [{id:"vital_maint_air3",startFrame:2131,endFrame:3290,loop:1,offset:0}];
	this.streamSoundSymbolsList[3292] = [{id:"vital_maint_air4",startFrame:3292,endFrame:3770,loop:1,offset:0}];
	this.streamSoundSymbolsList[3771] = [{id:"vital_maint_air4_2",startFrame:3771,endFrame:4110,loop:1,offset:0}];
	this.streamSoundSymbolsList[4113] = [{id:"vital_maint_air5_rrrrr",startFrame:4113,endFrame:5498,loop:1,offset:280}];
	this.streamSoundSymbolsList[5500] = [{id:"vital_maint_air6",startFrame:5500,endFrame:5930,loop:1,offset:0}];
	this.streamSoundSymbolsList[5932] = [{id:"vital_maint_air7",startFrame:5932,endFrame:7285,loop:1,offset:0}];
	this.streamSoundSymbolsList[7287] = [{id:"vital_maint_air8",startFrame:7287,endFrame:9055,loop:1,offset:0}];
	this.streamSoundSymbolsList[9058] = [{id:"vital_maint_air9",startFrame:9058,endFrame:9689,loop:1,offset:0}];
	this.streamSoundSymbolsList[9691] = [{id:"vital_maint_air10",startFrame:9691,endFrame:10314,loop:1,offset:0}];
	this.streamSoundSymbolsList[10316] = [{id:"vital_maint_air11",startFrame:10316,endFrame:11186,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		InitPage(11);
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
		// Back to Topicクリック
		this.back.addEventListener("click", function(){
			GetUrlMain("vitalmenu_air");
			GetUrlTop("topmenu_vital");
		});
		
		//-------------------------------------
		// スライダー操作関連
		//-------------------------------------
		// 再生/停止ボタンクリック
		this.playpau.addEventListener("click", ClickPlayPau);
		// リプレイボタンクリック
		this.replay.addEventListener("click", ClickReplay);
	}
	this.frame_1 = function() {
		var soundInstance = playSound("vital_maint_air1",0);
		this.InsertIntoSoundStreamData(soundInstance,1,998,1);
	}
	this.frame_998 = function() {
		this.stop();
	}
	this.frame_999 = function() {
		this.stop();
	}
	this.frame_1000 = function() {
		Prev(1);
		InitAnim();
	}
	this.frame_1001 = function() {
		var soundInstance = playSound("vital_maint_air2",0);
		this.InsertIntoSoundStreamData(soundInstance,1001,2128,1);
	}
	this.frame_2128 = function() {
		this.stop();
	}
	this.frame_2129 = function() {
		this.stop();
	}
	this.frame_2130 = function() {
		InitAnim();
	}
	this.frame_2131 = function() {
		var soundInstance = playSound("vital_maint_air3",0);
		this.InsertIntoSoundStreamData(soundInstance,2131,3290,1);
	}
	this.frame_3289 = function() {
		this.stop();
	}
	this.frame_3290 = function() {
		this.stop();
	}
	this.frame_3291 = function() {
		InitAnim();
	}
	this.frame_3292 = function() {
		var soundInstance = playSound("vital_maint_air4",0);
		this.InsertIntoSoundStreamData(soundInstance,3292,3770,1);
	}
	this.frame_3771 = function() {
		var soundInstance = playSound("vital_maint_air4_2",0);
		this.InsertIntoSoundStreamData(soundInstance,3771,4110,1);
	}
	this.frame_4110 = function() {
		this.stop();
	}
	this.frame_4111 = function() {
		this.stop();
	}
	this.frame_4112 = function() {
		InitAnim();
	}
	this.frame_4113 = function() {
		var soundInstance = playSound("vital_maint_air5_rrrrr",0,280);
		this.InsertIntoSoundStreamData(soundInstance,4113,5498,1,280);
	}
	this.frame_5497 = function() {
		this.stop();
	}
	this.frame_5498 = function() {
		this.stop();
	}
	this.frame_5499 = function() {
		InitAnim();
	}
	this.frame_5500 = function() {
		var soundInstance = playSound("vital_maint_air6",0);
		this.InsertIntoSoundStreamData(soundInstance,5500,5930,1);
	}
	this.frame_5929 = function() {
		this.stop();
	}
	this.frame_5930 = function() {
		this.stop();
	}
	this.frame_5931 = function() {
		InitAnim();
	}
	this.frame_5932 = function() {
		var soundInstance = playSound("vital_maint_air7",0);
		this.InsertIntoSoundStreamData(soundInstance,5932,7285,1);
	}
	this.frame_7284 = function() {
		this.stop();
	}
	this.frame_7285 = function() {
		this.stop();
	}
	this.frame_7286 = function() {
		InitAnim();
	}
	this.frame_7287 = function() {
		var soundInstance = playSound("vital_maint_air8",0);
		this.InsertIntoSoundStreamData(soundInstance,7287,9055,1);
	}
	this.frame_9055 = function() {
		this.stop();
	}
	this.frame_9056 = function() {
		this.stop();
	}
	this.frame_9057 = function() {
		InitAnim();
	}
	this.frame_9058 = function() {
		var soundInstance = playSound("vital_maint_air9",0);
		this.InsertIntoSoundStreamData(soundInstance,9058,9689,1);
	}
	this.frame_9688 = function() {
		this.stop();
	}
	this.frame_9689 = function() {
		this.stop();
	}
	this.frame_9690 = function() {
		Next(1);
		InitAnim();
	}
	this.frame_9691 = function() {
		var soundInstance = playSound("vital_maint_air10",0);
		this.InsertIntoSoundStreamData(soundInstance,9691,10314,1);
	}
	this.frame_10313 = function() {
		this.stop();
	}
	this.frame_10314 = function() {
		this.stop();
	}
	this.frame_10315 = function() {
		Next(0);
		InitAnim();
	}
	this.frame_10316 = function() {
		var soundInstance = playSound("vital_maint_air11",0);
		this.InsertIntoSoundStreamData(soundInstance,10316,11186,1);
	}
	this.frame_11186 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(997).call(this.frame_998).wait(1).call(this.frame_999).wait(1).call(this.frame_1000).wait(1).call(this.frame_1001).wait(1127).call(this.frame_2128).wait(1).call(this.frame_2129).wait(1).call(this.frame_2130).wait(1).call(this.frame_2131).wait(1158).call(this.frame_3289).wait(1).call(this.frame_3290).wait(1).call(this.frame_3291).wait(1).call(this.frame_3292).wait(479).call(this.frame_3771).wait(339).call(this.frame_4110).wait(1).call(this.frame_4111).wait(1).call(this.frame_4112).wait(1).call(this.frame_4113).wait(1384).call(this.frame_5497).wait(1).call(this.frame_5498).wait(1).call(this.frame_5499).wait(1).call(this.frame_5500).wait(429).call(this.frame_5929).wait(1).call(this.frame_5930).wait(1).call(this.frame_5931).wait(1).call(this.frame_5932).wait(1352).call(this.frame_7284).wait(1).call(this.frame_7285).wait(1).call(this.frame_7286).wait(1).call(this.frame_7287).wait(1768).call(this.frame_9055).wait(1).call(this.frame_9056).wait(1).call(this.frame_9057).wait(1).call(this.frame_9058).wait(630).call(this.frame_9688).wait(1).call(this.frame_9689).wait(1).call(this.frame_9690).wait(1).call(this.frame_9691).wait(622).call(this.frame_10313).wait(1).call(this.frame_10314).wait(1).call(this.frame_10315).wait(1).call(this.frame_10316).wait(870).call(this.frame_11186).wait(1));

	// Layer_17
	this.instance = new lib.text19("synched",0);
	this.instance.setTransform(10,0,1.5021,1.5021);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(11187));

	// Layer_126_page
	this.page = new cjs.Text("Page number", "italic bold 15px 'Arial'", "#FF9900");
	this.page.name = "page";
	this.page.lineHeight = 17;
	this.page.lineWidth = 193;
	this.page.parent = this;
	this.page.setTransform(23,658,1.4989,1.4989);

	this.timeline.addTween(cjs.Tween.get(this.page).wait(11187));

	// Layer_122_back
	this.back = new lib.button99();
	this.back.name = "back";
	this.back.setTransform(350,645,1.0001,1.0002);
	new cjs.ButtonHelper(this.back, 0, 1, 2, false, new lib.button99(), 3);

	this.timeline.addTween(cjs.Tween.get(this.back).wait(11187));

	// Layer_116_next
	this.next = new lib.button94();
	this.next.name = "next";
	this.next.setTransform(1496.1,5.1,0.9998,0.9999,0,0,0,0.1,0.1);
	new cjs.ButtonHelper(this.next, 0, 1, 2, false, new lib.button94(), 3);

	this.timeline.addTween(cjs.Tween.get(this.next).wait(11187));

	// Layer_111_previous
	this.previous = new lib.button87();
	this.previous.name = "previous";
	this.previous.setTransform(1432,5,1.0003,0.9993);
	new cjs.ButtonHelper(this.previous, 0, 1, 2, false, new lib.button87(), 3);

	this.timeline.addTween(cjs.Tween.get(this.previous).wait(11187));

	// Layer_108_slider
	this.slider = new lib.sprite822();
	this.slider.name = "slider";
	this.slider.setTransform(610.1,670.1,0.9937,0.9983,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.slider).wait(11187));

	// Layer_101_replay
	this.replay = new lib.sprite782();
	this.replay.name = "replay";
	this.replay.setTransform(1045.1,650.1,0.9999,0.9999,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.replay).wait(11187));

	// Layer_95_slider_base
	this.instance_1 = new lib.sprite75();
	this.instance_1.setTransform(600,650,1,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(11187));

	// Layer_89_playpau
	this.playpau = new lib.sprite71();
	this.playpau.name = "playpau";
	this.playpau.setTransform(555,650,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.playpau).wait(11187));

	// Mask_Layer_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("Eh8/AyyMAAAhfTMD5/AAAMAAABfTg");
	mask.setTransform(800,325);

	// Masked_Layer_2___1
	this.ani1 = new lib.sprite17();
	this.ani1.name = "ani1";
	this.ani1.setTransform(1130,383.55,1.5021,1.5021);

	this.ani2 = new lib.sprite65();
	this.ani2.name = "ani2";
	this.ani2.setTransform(1130,368.65,1.5021,1.5021);

	this.ani3 = new lib.sprite74();
	this.ani3.name = "ani3";
	this.ani3.setTransform(1130,369.6,1.5021,1.5021);

	this.ani4 = new lib.sprite81();
	this.ani4.name = "ani4";
	this.ani4.setTransform(1130,385.05,1.5021,1.5021);

	this.ani5 = new lib.sprite93();
	this.ani5.name = "ani5";
	this.ani5.setTransform(1130,376.05,1.5021,1.5021);

	this.ani6 = new lib.sprite100();
	this.ani6.name = "ani6";
	this.ani6.setTransform(1130,372.5,1.5021,1.5021);

	this.ani7 = new lib.sprite114();
	this.ani7.name = "ani7";
	this.ani7.setTransform(1130,371,1.5021,1.5021);

	this.ani8 = new lib.sprite119();
	this.ani8.name = "ani8";
	this.ani8.setTransform(1130,369.35,1.5021,1.5021);

	this.ani9 = new lib.sprite124();
	this.ani9.name = "ani9";
	this.ani9.setTransform(1130,367.85,1.5021,1.5021);

	this.ani10 = new lib.sprite129();
	this.ani10.name = "ani10";
	this.ani10.setTransform(1130,367.85,1.5021,1.5021);

	this.ani11 = new lib.sprite140();
	this.ani11.name = "ani11";
	this.ani11.setTransform(1130,367.85,1.5021,1.5021);

	var maskedShapeInstanceList = [this.ani1,this.ani2,this.ani3,this.ani4,this.ani5,this.ani6,this.ani7,this.ani8,this.ani9,this.ani10,this.ani11];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.ani1}]}).to({state:[{t:this.ani2}]},1000).to({state:[{t:this.ani3}]},1130).to({state:[{t:this.ani4}]},1161).to({state:[{t:this.ani5}]},821).to({state:[{t:this.ani6}]},1387).to({state:[{t:this.ani7}]},432).to({state:[{t:this.ani8}]},1355).to({state:[{t:this.ani9}]},1771).to({state:[{t:this.ani10}]},633).to({state:[{t:this.ani11}]},625).wait(872));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(810,350,787,346);
// library properties:
lib.properties = {
	id: '786DCE5F8407AE4380EFB6EA9159D292',
	width: 1600,
	height: 700,
	fps: 25,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/vital_maint_air_atlas_1.png", id:"vital_maint_air_atlas_1"},
		{src:"images/vital_maint_air_atlas_2.png", id:"vital_maint_air_atlas_2"},
		{src:"images/vital_maint_air_atlas_3.png", id:"vital_maint_air_atlas_3"},
		{src:"images/vital_maint_air_atlas_4.png", id:"vital_maint_air_atlas_4"},
		{src:"images/vital_maint_air_atlas_5.png", id:"vital_maint_air_atlas_5"},
		{src:"images/vital_maint_air_atlas_6.png", id:"vital_maint_air_atlas_6"},
		{src:"sounds/vital_maint_air1.mp3", id:"vital_maint_air1"},
		{src:"sounds/vital_maint_air10.mp3", id:"vital_maint_air10"},
		{src:"sounds/vital_maint_air11.mp3", id:"vital_maint_air11"},
		{src:"sounds/vital_maint_air2.mp3", id:"vital_maint_air2"},
		{src:"sounds/vital_maint_air3.mp3", id:"vital_maint_air3"},
		{src:"sounds/vital_maint_air4.mp3", id:"vital_maint_air4"},
		{src:"sounds/vital_maint_air4_2.mp3", id:"vital_maint_air4_2"},
		{src:"sounds/vital_maint_air5_rrrrr.mp3", id:"vital_maint_air5_rrrrr"},
		{src:"sounds/vital_maint_air6.mp3", id:"vital_maint_air6"},
		{src:"sounds/vital_maint_air7.mp3", id:"vital_maint_air7"},
		{src:"sounds/vital_maint_air8.mp3", id:"vital_maint_air8"},
		{src:"sounds/vital_maint_air9.mp3", id:"vital_maint_air9"}
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