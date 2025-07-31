(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"vital_op_ref_atlas_1", frames: [[0,1501,1192,335],[0,774,1192,388],[0,1164,1204,335],[0,0,1088,772],[1090,0,869,772]]},
		{name:"vital_op_ref_atlas_2", frames: [[436,667,475,82],[1533,942,294,99],[1957,780,77,99],[1119,512,127,143],[1857,780,98,120],[1857,902,98,120],[1957,881,77,99],[1854,145,131,143],[436,1010,263,99],[0,512,1117,153],[436,780,991,106],[1957,982,77,99],[1854,290,129,99],[913,667,332,99],[1829,1024,77,99],[1854,0,150,143],[1211,942,320,99],[979,1010,98,120],[1079,1010,98,120],[0,0,1212,281],[0,283,1248,227],[436,888,773,120],[436,768,748,9],[2014,0,9,676],[0,1111,712,9],[2025,0,9,670],[2036,0,9,670],[701,1010,276,53],[1179,1043,113,53],[1294,1043,60,60],[1702,402,298,228],[1250,402,450,376],[1429,780,426,160],[0,667,434,382],[1250,0,602,400],[1702,632,310,146]]}
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



(lib.CachedBmp_35 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["vital_op_ref_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["vital_op_ref_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["vital_op_ref_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["vital_op_ref_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["vital_op_ref_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.image2 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.image26 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.image38 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.image57 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.image66 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.vital_op_ref3 = function() {
	this.initialize(ss["vital_op_ref_atlas_2"]);
	this.gotoAndStop(35);
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
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(0,0,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,158.1,27.3);


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
	this.instance = new lib.CachedBmp_34();
	this.instance.setTransform(-3,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3,-3.4,97.9,33);


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
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(64.2,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(64.2,-3.4,25.700000000000003,33);


(lib.text60 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(0.2,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.2,-3.4,42.3,47.6);


(lib.text53 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3,-3.1,32.6,40);


(lib.text52 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.35,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-3.1,32.6,40);


(lib.text51 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.8,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.8,-3.1,396.8,111.5);


(lib.text50 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.95,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-3.1,396.7,129.2);


(lib.text49 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(63.85,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(63.9,-3.4,25.6,33);


(lib.text48 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-1.5,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-3.4,43.6,47.6);


(lib.text46 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3,-3.4,87.6,33);


(lib.text44 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.35,-3.2,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-3.2,371.8,51);


(lib.text41 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.35,-3.2,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-3.2,329.8,35.300000000000004);


(lib.text33 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(64.2,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(64.2,-3.4,25.700000000000003,33);


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
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0.2,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.2,-3.4,43,33);


(lib.text29 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.35,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-3.4,110.5,33);


(lib.text20 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(63.25,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(63.3,-3.4,25.60000000000001,33);


(lib.text17 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(0.2,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.2,-3.4,50,47.6);


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
	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(-3.35,-3.4,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.3,-3.4,106.5,33);


(lib.text11 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(0,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-3.1,32.6,40);


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
	this.instance = new lib.CachedBmp_15();
	this.instance.setTransform(-0.95,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.9,-3.1,32.6,40);


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
	this.instance = new lib.CachedBmp_14();
	this.instance.setTransform(-0.55,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-3.1,400.7,111.5);


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
	this.instance = new lib.CachedBmp_13();
	this.instance.setTransform(-0.5,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-3.1,403.4,93.6);


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
	this.instance = new lib.CachedBmp_12();
	this.instance.setTransform(-1.85,-3.1,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.8,-3.1,415.40000000000003,75.6);


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
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(-0.9,-3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.9,-3,257.29999999999995,40);


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

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(1,0,0,3).p("ABDAPQgcgIgfADIglgFIADgQQADgUgQgBIhRAUIgPgvQgLgcgxACAjDg6QAwgJgBAhIAEAiQABASAhgOIA4gJQAJAgAcACIBLAGIgNAaIAAACICKAVIhmhfIgOAaAA6AjIAJgU");
	this.shape.setTransform(59.268,2.0657);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(1,0,0,3).p("AAAgMIAAAZ");
	this.shape_1.setTransform(39.65,-5.175);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF0000").s().p("AAuA3QgcgDgJghIg2AKQgiAOAAgSIgFgiQABgggwAIIAAgaQAygDAKAcIAQAuIBPgTQARACgDASIgEARIAnAFQAegCAdAIIgKATg");
	this.shape_2.setTransform(52.825,-0.4852);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_3
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#FF0000").ss(1,0,0,3).p("ABDAPIg7gFIglgFIADgQQADgUgQgBIhRAUIgPgvQgLgcgxACAjDg6QAwgJgBAhIAEAiQABASAhgOIA4gJQAJAgAcACIBLAGIgNAaIAAACICKAVIhmhfIgOAaAA6AjIAJgU");
	this.shape_3.setTransform(22.518,0.5657);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#FF0000").ss(1,0,0,3).p("AAAgMIAAAZ");
	this.shape_4.setTransform(2.9,-6.675);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FF0000").s().p("AAuA3QgcgDgJghIg2AKQgiAOAAgSIgFgiQABgggwAIIAAgaQAygDAKAcIAQAuIBPgTQARACgDASIgEARIAnAFIA7AGIgKATg");
	this.shape_5.setTransform(16.075,-1.9852);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3}]}).wait(1));

	// Layer_2
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#FF0000").ss(1,0,0,3).p("ABDAPIg7gFIglgFIADgQQADgUgQgBIhRAUIgPgvQgLgcgxACAjDg6QAwgJgBAhIAEAiQABASAhgOIA4gJQAJAgAcACIBLAGIgNAaIAAACICKAVIhmhfIgOAaAA6AjIAJgU");
	this.shape_6.setTransform(-14.482,0.3157);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f().s("#FF0000").ss(1,0,0,3).p("AAAgMIAAAZ");
	this.shape_7.setTransform(-34.1,-6.925);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FF0000").s().p("AAuA3QgcgDgJghIg2AKQgiAOAAgSIgFgiQABgggwAIIAAgaQAygDAKAcIAQAuIBPgTQARACgDASIgEARIAnAFIA7AGIgKATg");
	this.shape_8.setTransform(-20.925,-2.2352);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	// Layer_1
	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s("#FF0000").ss(1,0,0,3).p("ABDAPIg7gFIglgFIADgQQADgUgQgBIhRAUIgPgvQgLgcgxACAjDg6QAwgJgBAhIAEAiQABASAhgOIA4gJQAJAgAcACIBLAGIgNAaIAAACICKAVIhmhfIgOAaAA6AjIAJgU");
	this.shape_9.setTransform(-57.982,-1.9343);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("#FF0000").ss(1,0,0,3).p("AAAgMIAAAZ");
	this.shape_10.setTransform(-77.6,-9.175);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FF0000").s().p("AAuA3QgcgDgJghIg2AKQgiAOAAgSIgFgiQABgggwAIIAAgaQAygDAKAcIAQAuIBPgTQARACgDASIgEARIAnAFIA7AGIgKATg");
	this.shape_11.setTransform(-64.425,-4.4852);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10},{t:this.shape_9}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78.6,-11.5,157.6,23);


(lib.shape67 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_ref_atlas_2"],34);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.771,0,0,0.768,-232,-153.7)).s().p("EgkQAYBMAAAgwBMBIhAAAMAAAAwBg")
	}.bind(this);
	this.shape.setTransform(0.05,-0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-232,-153.7,464.1,307.4);


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
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AHlBuIvJAAIAAjbIPJAAg");
	this.shape.setTransform(-192.35,128);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#C1C002").s().p("AnkBuIAAjbIPJAAIAADbg");
	this.shape_1.setTransform(-192.35,128);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-241.8,116,99,24);


(lib.shape59 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_10();
	this.instance.setTransform(-143.3,127.15,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#C1C002").ss(3,0,0,3).p("AryAAIXlAA");
	this.shape.setTransform(-11.8,36.15);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-143.3,34.7,249,95.49999999999999);


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

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_ref_atlas_2"],33);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-217,-191)).s().p("Egh5Ad2MAAAg7rMBDzAAAMAAAA7rg")
	}.bind(this);
	this.shape.setTransform(0,-12);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-217,-203,434,382);


(lib.shape56 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AHlBuIvJAAIAAjbIPJAAg");
	this.shape.setTransform(167.65,128);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("AnkBuIAAjbIPJAAIAADbg");
	this.shape_1.setTransform(167.65,128);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_2
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(-195.3,-143.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#0000FF").ss(3,0,0,3).p("AOdAAI85AA");
	this.shape_2.setTransform(4.675,-63.35);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#00FFFF").ss(3,0,0,3).p("AAAnqIAAPV");
	this.shape_3.setTransform(-87.55,-13.225);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#FF0000").ss(3,0,0,3).p("ACvngQk0DngjLm");
	this.shape_4.setTransform(80.5002,-14.9141);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-195.3,-143.8,412.5,283.8);


(lib.shape47 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_8();
	this.instance.setTransform(-195.3,-121.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#00FFFF").ss(3,0,0,3).p("AAAnqIAAPV");
	this.shape.setTransform(-87.55,-13.225);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-195.3,-121.8,109.30000000000001,225);


(lib.shape45 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AnkhtIPJAAIAADbIvJAAg");
	this.shape.setTransform(-192.35,-142);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#00FFFF").s().p("AnkBuIAAjbIPJAAIAADbg");
	this.shape_1.setTransform(-192.35,-142);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-241.8,-154,99,24);


(lib.shape43 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("ADIHQImJuEICqOE");
	this.shape.setTransform(-96.7786,-93.3558);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// レイヤー_2
	this.instance = new lib.vital_op_ref3();
	this.instance.setTransform(-146,-50);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-146,-140.1,310,236.1);


(lib.shape39 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_ref_atlas_2"],32);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-213,-80)).s().p("EghRAMgIAA4/MBCjAAAIAAY/g")
	}.bind(this);
	this.shape.setTransform(4.3,7.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-208.7,-72.5,426,160);


(lib.shape37 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AHlBuIvJAAIAAjbIPJAAg");
	this.shape.setTransform(167.65,128);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("AnkBuIAAjbIPJAAIAADbg");
	this.shape_1.setTransform(167.65,128);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_2
	this.instance = new lib.CachedBmp_7();
	this.instance.setTransform(-122.25,-143.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#0000FF").ss(3,0,0,3).p("AOdAAI85AA");
	this.shape_2.setTransform(4.675,-63.35);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#FF0000").ss(3,0,0,3).p("ACvngQk0DngjLm");
	this.shape_3.setTransform(80.5002,-14.9141);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-122.2,-143.8,339.4,283.8);


(lib.shape31 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_6();
	this.instance.setTransform(-122.25,-143.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#0000FF").ss(3,0,0,3).p("AOdAAI85AA");
	this.shape.setTransform(4.675,-63.35);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-122.2,-143.8,237,82.00000000000001);


(lib.shape28 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AnkhtIPJAAIAADbIvJAAg");
	this.shape.setTransform(167.65,-142);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#0000FF").s().p("AnkBuIAAjbIPJAAIAADbg");
	this.shape_1.setTransform(167.65,-142);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(118.2,-154,98.99999999999999,24);


(lib.shape27 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_ref_atlas_2"],31);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-225,-188)).s().p("EgjJAdYMAAAg6vMBGTAAAMAAAA6vg")
	}.bind(this);
	this.shape.setTransform(0,-12);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-225,-200,450,376);


(lib.shape25 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AHlBuIvJAAIAAjbIPJAAg");
	this.shape.setTransform(167.65,128);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("AnkBuIAAjbIPJAAIAADbg");
	this.shape_1.setTransform(167.65,128);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_2
	this.instance = new lib.CachedBmp_5();
	this.instance.setTransform(163.75,-109.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FF0000").ss(3,0,0,3).p("ACvngQk0DngjLm");
	this.shape_2.setTransform(80.5002,-14.9141);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(62.1,-109.8,155.1,249.8);


(lib.shape18d = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#C1C002").s().p("AAIAXIgPAAIgbAJIAjhAIAiBBg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999);


(lib.shape18c = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#00FFFF").s().p("AAIAXIgPAAIgbAJIAjhAIAiBBg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999);


(lib.shape18b = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#0000FF").s().p("AAIAXIgPAAIgbAJIAjhAIAiBBg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999);


(lib.shape18 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#FF0000").s().p("AAIAXIgPAAIgbAJIAjhAIAiBBg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999);


(lib.shape16 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_4();
	this.instance.setTransform(163.75,-109.8,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(3,0,0,3).p("ACvngQk0DngjLm");
	this.shape.setTransform(80.5002,-14.9141);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(62.1,-109.8,104.70000000000002,223);


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

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AHlBuIvJAAIAAjbIPJAAg");
	this.shape.setTransform(167.65,128);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("AnkBuIAAjbIPJAAIAADbg");
	this.shape_1.setTransform(167.65,128);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(118.2,116,98.99999999999999,24);


(lib.shape12 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#B8B8B8").s().p("AABAgIgBgBIAAgBIAAgBIgBAAIAAgDIAAgEIAAgCIgCAAIgBgBIgBgCIAAgBIgBAAIAAgHIAAgJIAAgEIgBAAIgBgBIgBgBIAAgBIgBgBIAAgFIAAgIIAAgGIABgBIAAgBIABgBIABgBIADAAIAAAAIADAAIABABIAAABIABABIAAABIABAEIAAADIAAABIABABIABAAIABACIAAABIAAABIAAABIABADIAAACIgBABIABAFIAAABIAAAGIACABIABAAIABABIABABIAAACIAAABIAAACIAAABIAAACIAAADIAAABIgBABIAAABIAAAAIAAACIAAACIAAACIAAABIAAABIgBAAIgBABIgBABIgDAAg");
	this.shape.setTransform(26.225,-60.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AmBDVIAAgIIgKAAIAAgDIAAAAIAAgCIAAgCIAAgBIgBgBIAAgBIgBgBIAAAAIgCAAIgCgBIAAgHIAAgBIAAgHIAAgBIgBgDIAAgCIAAgBIAAgBIgBgBIAAgCIgCAAIAAgEIAAgDIgBgBIAAgBIAAgHIgDAAIAAgzIAYAAIAAg3IgGAAIAAkAIMhAAIAAEAIpnAAIAACYIiLAAIAAAQg");
	this.shape_1.setTransform(67,-79.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(25.1,-100.3,82.9,43.3);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_ref_atlas_2"],30);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.117,0,0,1.117,-166.5,-127.4)).s().p("A6AT6MAAAgnzMA0BAAAMAAAAnzg")
	}.bind(this);
	this.shape.setTransform(-11.575,-0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-178,-127.4,332.9,254.8);


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


(lib.sprite19d = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.shape18d("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sprite19d, new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999), null);


(lib.sprite19c = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.shape18c("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sprite19c, new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999), null);


(lib.sprite19b = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.shape18b("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sprite19b, new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999), null);


(lib.sprite19 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.shape18("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sprite19, new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999), null);


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


(lib.sprite69 = function(mode,startPosition,loop,reversed) {
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
	this.frame_449 = function() {
		/* gotoAndPlay(460);
		*/
	}
	this.frame_1247 = function() {
		//this.gotoAndPlay(1200);
	}
	this.frame_2380 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(449).call(this.frame_449).wait(798).call(this.frame_1247).wait(1133).call(this.frame_2380).wait(1));

	// Masked_Layer_19___13
	this.instance = new lib.text11("synched",0);
	this.instance.setTransform(-537.5,-10.3);

	this.instance_1 = new lib.text53("synched",0);
	this.instance_1.setTransform(-536.75,24.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1252).wait(1129));

	// Masked_Layer_18___13
	this.instance_2 = new lib.text10("synched",0);
	this.instance_2.setTransform(-538.25,-95.3);

	this.instance_3 = new lib.text52("synched",0);
	this.instance_3.setTransform(-536.75,-95.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2}]}).to({state:[{t:this.instance_3}]},1252).wait(1129));

	// Masked_Layer_17___13
	this.instance_4 = new lib.text9("synched",0);
	this.instance_4.setTransform(-522.15,-10.3);

	this.instance_5 = new lib.text51("synched",0);
	this.instance_5.setTransform(-520.75,-95.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4}]}).to({state:[{t:this.instance_5}]},1252).wait(1129));

	// Masked_Layer_16___13
	this.instance_6 = new lib.text8("synched",0);
	this.instance_6.setTransform(-522.25,-95.3);

	this.instance_7 = new lib.text50("synched",0);
	this.instance_7.setTransform(-520.75,24.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_6}]}).to({state:[{t:this.instance_7}]},1252).wait(1129));

	// Masked_Layer_15___13
	this.instance_8 = new lib.text7("synched",0);
	this.instance_8.setTransform(-537.25,-172.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(1252).to({startPosition:0},0).wait(1129));

	// Masked_Layer_14___13
	this.instance_9 = new lib.text5("synched",0);
	this.instance_9.setTransform(-538.25,-201.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(1252).to({startPosition:0},0).wait(1129));

	// Layer_37
	this.instance_10 = new lib.shape68("synched",0);
	this.instance_10.setTransform(237.65,-28.95);
	this.instance_10.alpha = 0;
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(2366).to({_off:false},0).to({alpha:0.9297},14).wait(1));

	// Layer_33
	this.instance_11 = new lib.shape58("synched",0);
	this.instance_11.setTransform(200,7);
	this.instance_11.alpha = 0;
	this.instance_11._off = true;

	this.instance_12 = new lib.shape67("synched",0);
	this.instance_12.setTransform(200.7,-5.35);
	this.instance_12.alpha = 0;
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(1491).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(279).to({startPosition:0},0).to({alpha:0},15).to({_off:true},1).wait(581));
	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(2038).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(329));

	// Layer_32
	this.instance_13 = new lib.text49("synched",0);
	this.instance_13.setTransform(33.4,-15.7);
	this.instance_13._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(1372).to({_off:false},0).wait(119).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_31
	this.instance_14 = new lib.text44("synched",0);
	this.instance_14.setTransform(66.9,151.05);
	this.instance_14.alpha = 0;
	this.instance_14._off = true;

	this.instance_15 = new lib.text48("synched",0);
	this.instance_15.setTransform(-30.4,-44);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(1073).to({_off:false},0).to({alpha:0.8984},9).wait(1).to({alpha:1},0).wait(165).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(1118));
	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(1372).to({_off:false},0).wait(119).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_30
	this.instance_16 = new lib.shape43("synched",0);
	this.instance_16.setTransform(228.85,49.15);
	this.instance_16.alpha = 0;
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(1073).to({_off:false},0).to({alpha:0.8984},9).wait(1).to({alpha:1},0).wait(165).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(1118));

	// Layer_29
	this.instance_17 = new lib.sprite19c();
	this.instance_17.setTransform(15.25,101.85,3,3,180);
	this.instance_17._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(1372).to({_off:false},0).wait(133).to({_off:true},1).wait(278).to({_off:false,alpha:0},0).to({alpha:1},15).wait(1).to({x:15.2},0).wait(238).to({x:15.25},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_28
	this.instance_18 = new lib.text41("synched",0);
	this.instance_18.setTransform(81.6,-189.95);
	this.instance_18.alpha = 0;
	this.instance_18._off = true;

	this.instance_19 = new lib.text46("synched",0);
	this.instance_19.setTransform(-18.55,-148.85);
	this.instance_19._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(1044).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(190).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(1118));
	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(1372).to({_off:false},0).wait(119).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_27
	this.instance_20 = new lib.shape39("synched",0);
	this.instance_20.setTransform(199.05,-89.85);
	this.instance_20.alpha = 0;
	this.instance_20._off = true;

	this.instance_21 = new lib.shape45("synched",0);
	this.instance_21.setTransform(208.3,0.05);
	this.instance_21._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(1044).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(190).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(1118));
	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(1372).to({_off:false},0).wait(119).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_26
	this.instance_22 = new lib.text33("synched",0);
	this.instance_22.setTransform(133.4,-82.7);
	this.instance_22._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(855).to({_off:false},0).wait(189).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(188).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(229).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_25
	this.instance_23 = new lib.text32("synched",0);
	this.instance_23.setTransform(195.6,-164);
	this.instance_23._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(855).to({_off:false},0).wait(189).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(188).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(229).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_23
	this.instance_24 = new lib.sprite19b();
	this.instance_24.setTransform(84.25,-141.15,3,3,-90);
	this.instance_24._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(855).to({_off:false},0).wait(1).to({scaleX:2.9999,scaleY:2.9999,x:84.2},0).wait(187).to({scaleX:3,scaleY:3,x:84.25},1).wait(14).to({_off:true},2).wait(188).to({_off:false},0).wait(15).to({scaleX:2.9999,scaleY:2.9999,x:84.2},0).wait(227).to({scaleX:3,scaleY:3,x:84.25},1).wait(14).to({_off:true},1).wait(278).to({_off:false},0).wait(16).to({scaleX:2.9999,scaleY:2.9999,x:84.2},0).wait(238).to({scaleX:3,scaleY:3,x:84.25},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_22
	this.instance_25 = new lib.text29("synched",0);
	this.instance_25.setTransform(332.45,-148.85);
	this.instance_25._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(855).to({_off:false},0).wait(189).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(188).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(229).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_21
	this.instance_26 = new lib.shape27("synched",0);
	this.instance_26.setTransform(200,10.45);
	this.instance_26.alpha = 0;
	this.instance_26._off = true;

	this.instance_27 = new lib.shape28("synched",0);
	this.instance_27.setTransform(208.3,0.05);
	this.instance_27._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(614).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(137).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(1602));
	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(855).to({_off:false},0).wait(189).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(188).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(229).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_20
	this.instance_28 = new lib.text20("synched",0);
	this.instance_28.setTransform(227.35,-33.7);
	this.instance_28.alpha = 0;
	this.instance_28._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_28).wait(765).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).wait(266).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(188).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(229).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_18
	this.instance_29 = new lib.sprite19();
	this.instance_29.setTransform(374.25,-118.15,3,3);
	this.instance_29.alpha = 0;
	this.instance_29._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_29).wait(765).to({_off:false},0).to({alpha:1},13).wait(1).to({y:-118.1},0).wait(264).to({y:-118.15},1).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(188).to({_off:false},0).to({alpha:1},14).wait(1).to({y:-118.1},0).wait(227).to({y:-118.15},1).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:1},15).wait(1).to({y:-118.1},0).wait(237).to({y:-118.15},1).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_17
	this.instance_30 = new lib.text17("synched",0);
	this.instance_30.setTransform(385.6,-61);
	this.instance_30.alpha = 0;
	this.instance_30._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(765).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).to({_off:true},77).wait(393).to({_off:false,alpha:0},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).to({_off:true},110).wait(412).to({_off:false,alpha:0},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_16
	this.instance_31 = new lib.text14("synched",0);
	this.instance_31.setTransform(335.45,121.15);
	this.instance_31.alpha = 0;
	this.instance_31._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_31).wait(765).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).to({_off:true},77).wait(393).to({_off:false,alpha:0},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).to({_off:true},110).wait(412).to({_off:false,alpha:0},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_15
	this.instance_32 = new lib.shape25("synched",0);
	this.instance_32.setTransform(208.3,0.05);
	this.instance_32.alpha = 0;
	this.instance_32._off = true;

	this.instance_33 = new lib.shape37("synched",0);
	this.instance_33.setTransform(208.3,0.05);
	this.instance_33.alpha = 0;
	this.instance_33._off = true;

	this.instance_34 = new lib.shape56("synched",0);
	this.instance_34.setTransform(208.3,0.05);
	this.instance_34.alpha = 0;
	this.instance_34._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(765).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).to({_off:true},77).wait(1526));
	this.timeline.addTween(cjs.Tween.get(this.instance_33).wait(1248).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).to({_off:true},110).wait(1009));
	this.timeline.addTween(cjs.Tween.get(this.instance_34).wait(1784).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_10
	this.instance_35 = new lib.text20("synched",0);
	this.instance_35.setTransform(227.35,-33.7);
	this.instance_35._off = true;

	this.instance_36 = new lib.text61("synched",0);
	this.instance_36.setTransform(121.9,39.3);
	this.instance_36._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(526).to({_off:false},0).wait(88).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},3).wait(1750));
	this.timeline.addTween(cjs.Tween.get(this.instance_36).wait(1906).to({_off:false},0).to({startPosition:0},132).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_9
	this.instance_37 = new lib.text60("synched",0);
	this.instance_37.setTransform(179.6,142);
	this.instance_37._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_37).wait(1906).to({_off:false},0).to({startPosition:0},132).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_8
	this.instance_38 = new lib.sprite19();
	this.instance_38.setTransform(374.25,-118.15,3,3);
	this.instance_38._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_38).wait(526).to({_off:false},0).wait(1).to({y:-118.1},0).wait(86).to({y:-118.15},1).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},3).wait(1750));

	// Layer_7
	this.instance_39 = new lib.text17("synched",0);
	this.instance_39.setTransform(385.6,-61);
	this.instance_39._off = true;

	this.instance_40 = new lib.sprite19d();
	this.instance_40.setTransform(315.25,128.85,3,3,90);
	this.instance_40._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_39).wait(526).to({_off:false},0).wait(88).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},3).wait(224).to({_off:false,alpha:1},0).wait(189).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(312).to({_off:false,alpha:1},0).wait(119).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(875));
	this.timeline.addTween(cjs.Tween.get(this.instance_40).wait(1906).to({_off:false},0).wait(132).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_6
	this.instance_41 = new lib.text14("synched",0);
	this.instance_41.setTransform(335.45,121.15);
	this.instance_41._off = true;

	this.instance_42 = new lib.shape59("synched",0);
	this.instance_42.setTransform(208.3,0.05);
	this.instance_42._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_41).wait(526).to({_off:false},0).wait(88).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},3).wait(224).to({_off:false,alpha:1},0).wait(189).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(312).to({_off:false,alpha:1},0).wait(119).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(875));
	this.timeline.addTween(cjs.Tween.get(this.instance_42).wait(1906).to({_off:false},0).wait(132).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Mask_Layer_5 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_450 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_451 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_452 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_453 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_454 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_455 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_456 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_457 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_458 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_459 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_460 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_461 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_462 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_463 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_464 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_465 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_466 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_467 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_468 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_469 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_470 = new cjs.Graphics().p("ARRNzIAAkXIQnAAIAAEXg");
	var mask_graphics_471 = new cjs.Graphics().p("AoSCMIAAkXIQmAAIAAEXg");
	var mask_graphics_472 = new cjs.Graphics().p("AoSDDIAAmFIQmAAIAAGFg");
	var mask_graphics_473 = new cjs.Graphics().p("AoSD6IAAnzIQmAAIAAHzg");
	var mask_graphics_474 = new cjs.Graphics().p("AoSExIAAphIQmAAIAAJhg");
	var mask_graphics_475 = new cjs.Graphics().p("AoSFpIAArQIQmAAIAALQg");
	var mask_graphics_476 = new cjs.Graphics().p("AoSGgIAAs/IQmAAIAAM/g");
	var mask_graphics_477 = new cjs.Graphics().p("AoSHXIAAutIQmAAIAAOtg");
	var mask_graphics_478 = new cjs.Graphics().p("AoSIOIAAwbIQmAAIAAQbg");
	var mask_graphics_479 = new cjs.Graphics().p("AoSJFIAAyJIQmAAIAASJg");
	var mask_graphics_480 = new cjs.Graphics().p("AoSJ8IAAz3IQmAAIAAT3g");
	var mask_graphics_481 = new cjs.Graphics().p("AoSKzIAA1lIQmAAIAAVlg");
	var mask_graphics_482 = new cjs.Graphics().p("AoSLrIAA3UIQmAAIAAXUg");
	var mask_graphics_483 = new cjs.Graphics().p("AoSMiIAA5DIQmAAIAAZDg");
	var mask_graphics_484 = new cjs.Graphics().p("AoSNZIAA6xIQmAAIAAaxg");
	var mask_graphics_485 = new cjs.Graphics().p("AoSOQIAA8fIQmAAIAAcfg");
	var mask_graphics_486 = new cjs.Graphics().p("AoSPHIAA+NIQmAAIAAeNg");
	var mask_graphics_487 = new cjs.Graphics().p("AoSP+IAA/7IQmAAIAAf7g");
	var mask_graphics_488 = new cjs.Graphics().p("AoSQ2MAAAghrIQmAAMAAAAhrg");
	var mask_graphics_489 = new cjs.Graphics().p("AoSRtMAAAgjZIQmAAMAAAAjZg");
	var mask_graphics_490 = new cjs.Graphics().p("AoSSkMAAAglHIQmAAMAAAAlHg");
	var mask_graphics_491 = new cjs.Graphics().p("AoSTbMAAAgm1IQmAAMAAAAm1g");
	var mask_graphics_492 = new cjs.Graphics().p("AoSUSMAAAgojIQmAAMAAAAojg");
	var mask_graphics_493 = new cjs.Graphics().p("AoSVJMAAAgqRIQmAAMAAAAqRg");
	var mask_graphics_494 = new cjs.Graphics().p("AoSWBMAAAgsAIQmAAMAAAAsAg");
	var mask_graphics_495 = new cjs.Graphics().p("AoSW4MAAAgtvIQmAAMAAAAtvg");
	var mask_graphics_496 = new cjs.Graphics().p("AoSXvMAAAgvdIQmAAMAAAAvdg");
	var mask_graphics_497 = new cjs.Graphics().p("AoSYmMAAAgxLIQmAAMAAAAxLg");
	var mask_graphics_498 = new cjs.Graphics().p("AoSZdMAAAgy5IQmAAMAAAAy5g");
	var mask_graphics_499 = new cjs.Graphics().p("AoSaUMAAAg0nIQmAAMAAAA0ng");
	var mask_graphics_500 = new cjs.Graphics().p("AoSbMMAAAg2XIQmAAMAAAA2Xg");
	var mask_graphics_501 = new cjs.Graphics().p("AoScDMAAAg4FIQmAAMAAAA4Fg");
	var mask_graphics_502 = new cjs.Graphics().p("AoSc6MAAAg5zIQmAAMAAAA5zg");
	var mask_graphics_503 = new cjs.Graphics().p("AoSc6MAAAg5zIQlAAMAAAA5zg");
	var mask_graphics_504 = new cjs.Graphics().p("AoSc6MAAAg5zIQmAAMAAAA5zg");
	var mask_graphics_505 = new cjs.Graphics().p("Aolc6MAAAg5zIRMAAMAAAA5zg");
	var mask_graphics_506 = new cjs.Graphics().p("Ao4c6MAAAg5zIRxAAMAAAA5zg");
	var mask_graphics_507 = new cjs.Graphics().p("ApLc6MAAAg5zISXAAMAAAA5zg");
	var mask_graphics_508 = new cjs.Graphics().p("Apec6MAAAg5zIS9AAMAAAA5zg");
	var mask_graphics_509 = new cjs.Graphics().p("Apxc6MAAAg5zITjAAMAAAA5zg");
	var mask_graphics_510 = new cjs.Graphics().p("AqEc6MAAAg5zIUJAAMAAAA5zg");
	var mask_graphics_511 = new cjs.Graphics().p("AqXc6MAAAg5zIUvAAMAAAA5zg");
	var mask_graphics_512 = new cjs.Graphics().p("Aqqc6MAAAg5zIVVAAMAAAA5zg");
	var mask_graphics_513 = new cjs.Graphics().p("Aq9c6MAAAg5zIV7AAMAAAA5zg");
	var mask_graphics_514 = new cjs.Graphics().p("ArPc6MAAAg5zIWgAAMAAAA5zg");
	var mask_graphics_515 = new cjs.Graphics().p("Aric6MAAAg5zIXFAAMAAAA5zg");
	var mask_graphics_516 = new cjs.Graphics().p("Ar1c6MAAAg5zIXrAAMAAAA5zg");
	var mask_graphics_517 = new cjs.Graphics().p("AsIc6MAAAg5zIYRAAMAAAA5zg");
	var mask_graphics_518 = new cjs.Graphics().p("Asbc6MAAAg5zIY3AAMAAAA5zg");
	var mask_graphics_519 = new cjs.Graphics().p("Asuc6MAAAg5zIZdAAMAAAA5zg");
	var mask_graphics_520 = new cjs.Graphics().p("AtBc6MAAAg5zIaDAAMAAAA5zg");
	var mask_graphics_521 = new cjs.Graphics().p("AtUc6MAAAg5zIapAAMAAAA5zg");
	var mask_graphics_522 = new cjs.Graphics().p("Atnc6MAAAg5zIbPAAMAAAA5zg");
	var mask_graphics_523 = new cjs.Graphics().p("Atmc6MAAAg5zIbNAAMAAAA5zg");
	var mask_graphics_524 = new cjs.Graphics().p("AGqc6MAAAg5zIbOAAMAAAA5zg");
	var mask_graphics_765 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_766 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_767 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_768 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_769 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_770 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_771 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_772 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_773 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_774 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_775 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_776 = new cjs.Graphics().p("AoSDXIAAmtIQlAAIAAGtg");
	var mask_graphics_777 = new cjs.Graphics().p("AoSDXIAAmtIQlAAIAAGtg");
	var mask_graphics_778 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_779 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_780 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_781 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_782 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_783 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_784 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_785 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_786 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_787 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_788 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_789 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_790 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_791 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_792 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_793 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_794 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_795 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_796 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_797 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_798 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_799 = new cjs.Graphics().p("AoSDXIAAmtIQlAAIAAGtg");
	var mask_graphics_800 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_801 = new cjs.Graphics().p("Ao+DXIAAmtIR9AAIAAGtg");
	var mask_graphics_802 = new cjs.Graphics().p("ApqDXIAAmtITVAAIAAGtg");
	var mask_graphics_803 = new cjs.Graphics().p("AqVDXIAAmtIUrAAIAAGtg");
	var mask_graphics_804 = new cjs.Graphics().p("ArBDXIAAmtIWDAAIAAGtg");
	var mask_graphics_805 = new cjs.Graphics().p("ArsDXIAAmtIXZAAIAAGtg");
	var mask_graphics_806 = new cjs.Graphics().p("AsYDXIAAmtIYxAAIAAGtg");
	var mask_graphics_807 = new cjs.Graphics().p("AtDDXIAAmtIaHAAIAAGtg");
	var mask_graphics_808 = new cjs.Graphics().p("AtvDXIAAmtIbfAAIAAGtg");
	var mask_graphics_809 = new cjs.Graphics().p("AuaDXIAAmtIc2AAIAAGtg");
	var mask_graphics_810 = new cjs.Graphics().p("AvGDXIAAmtIeNAAIAAGtg");
	var mask_graphics_811 = new cjs.Graphics().p("AvyDXIAAmtIflAAIAAGtg");
	var mask_graphics_812 = new cjs.Graphics().p("AwdDXIAAmtMAg7AAAIAAGtg");
	var mask_graphics_813 = new cjs.Graphics().p("AxJDXIAAmtMAiTAAAIAAGtg");
	var mask_graphics_814 = new cjs.Graphics().p("Ax0DXIAAmtMAjpAAAIAAGtg");
	var mask_graphics_815 = new cjs.Graphics().p("AygDXIAAmtMAlBAAAIAAGtg");
	var mask_graphics_816 = new cjs.Graphics().p("AzLDXIAAmtMAmXAAAIAAGtg");
	var mask_graphics_817 = new cjs.Graphics().p("Az3DXIAAmtMAnvAAAIAAGtg");
	var mask_graphics_818 = new cjs.Graphics().p("A0iDXIAAmtMApFAAAIAAGtg");
	var mask_graphics_819 = new cjs.Graphics().p("A1ODXIAAmtMAqdAAAIAAGtg");
	var mask_graphics_820 = new cjs.Graphics().p("A16DXIAAmtMAr1AAAIAAGtg");
	var mask_graphics_821 = new cjs.Graphics().p("A2lDXIAAmtMAtLAAAIAAGtg");
	var mask_graphics_822 = new cjs.Graphics().p("A3QDXIAAmtMAuiAAAIAAGtg");
	var mask_graphics_823 = new cjs.Graphics().p("A38DXIAAmtMAv5AAAIAAGtg");
	var mask_graphics_824 = new cjs.Graphics().p("A4oDXIAAmtMAxRAAAIAAGtg");
	var mask_graphics_825 = new cjs.Graphics().p("A5TDXIAAmtMAynAAAIAAGtg");
	var mask_graphics_826 = new cjs.Graphics().p("A5/DXIAAmtMAz/AAAIAAGtg");
	var mask_graphics_827 = new cjs.Graphics().p("A6qDXIAAmtMA1VAAAIAAGtg");
	var mask_graphics_828 = new cjs.Graphics().p("A7WDXIAAmtMA2tAAAIAAGtg");
	var mask_graphics_829 = new cjs.Graphics().p("A8CDXIAAmtMA4FAAAIAAGtg");
	var mask_graphics_830 = new cjs.Graphics().p("A8tDXIAAmtMA5bAAAIAAGtg");
	var mask_graphics_831 = new cjs.Graphics().p("A9YDXIAAmtMA6yAAAIAAGtg");
	var mask_graphics_832 = new cjs.Graphics().p("A9ZDXIAAmtMA6zAAAIAAGtg");
	var mask_graphics_833 = new cjs.Graphics().p("A9YDXIAAmtMA6yAAAIAAGtg");
	var mask_graphics_834 = new cjs.Graphics().p("A9YDtIAAnZMA6yAAAIAAHZg");
	var mask_graphics_835 = new cjs.Graphics().p("A9YEDIAAoFMA6yAAAIAAIFg");
	var mask_graphics_836 = new cjs.Graphics().p("A9YEZIAAoxMA6yAAAIAAIxg");
	var mask_graphics_837 = new cjs.Graphics().p("A9YEvIAApdMA6yAAAIAAJdg");
	var mask_graphics_838 = new cjs.Graphics().p("A9YFFIAAqJMA6yAAAIAAKJg");
	var mask_graphics_839 = new cjs.Graphics().p("A9YFaIAAq0MA6yAAAIAAK0g");
	var mask_graphics_840 = new cjs.Graphics().p("A9YFxIAArhMA6yAAAIAALhg");
	var mask_graphics_841 = new cjs.Graphics().p("A9YGHIAAsNMA6yAAAIAAMNg");
	var mask_graphics_842 = new cjs.Graphics().p("A9YGcIAAs3MA6yAAAIAAM3g");
	var mask_graphics_843 = new cjs.Graphics().p("A9YGyIAAtjMA6yAAAIAANjg");
	var mask_graphics_844 = new cjs.Graphics().p("A9YHIIAAuPMA6yAAAIAAOPg");
	var mask_graphics_845 = new cjs.Graphics().p("A9YHeIAAu7MA6yAAAIAAO7g");
	var mask_graphics_846 = new cjs.Graphics().p("A9YH0IAAvnMA6yAAAIAAPng");
	var mask_graphics_847 = new cjs.Graphics().p("A9YIKIAAwTMA6yAAAIAAQTg");
	var mask_graphics_848 = new cjs.Graphics().p("A9YIgIAAw/MA6yAAAIAAQ/g");
	var mask_graphics_849 = new cjs.Graphics().p("A9YI2IAAxrMA6yAAAIAARrg");
	var mask_graphics_850 = new cjs.Graphics().p("A9YJLIAAyVMA6yAAAIAASVg");
	var mask_graphics_851 = new cjs.Graphics().p("A9YJhIAAzBMA6yAAAIAATBg");
	var mask_graphics_852 = new cjs.Graphics().p("A9ZJhIAAzBMA6zAAAIAATBg");
	var mask_graphics_853 = new cjs.Graphics().p("A46FiIAAzDMA6zAAAIAATDg");
	var mask_graphics_1248 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1249 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1250 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1251 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1252 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1253 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1254 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1255 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1256 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1257 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1258 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1259 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1260 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1261 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1262 = new cjs.Graphics().p("AoSm0IAAmtIQlAAIAAGtg");
	var mask_graphics_1317 = new cjs.Graphics().p("AoSDXIAAmtIQmAAIAAGtg");
	var mask_graphics_1318 = new cjs.Graphics().p("AoSEAIAAn/IQmAAIAAH/g");
	var mask_graphics_1319 = new cjs.Graphics().p("AoSEoIAApPIQmAAIAAJPg");
	var mask_graphics_1320 = new cjs.Graphics().p("AoSFRIAAqhIQmAAIAAKhg");
	var mask_graphics_1321 = new cjs.Graphics().p("AoSF6IAArzIQmAAIAALzg");
	var mask_graphics_1322 = new cjs.Graphics().p("AoSGiIAAtDIQmAAIAANDg");
	var mask_graphics_1323 = new cjs.Graphics().p("AoSHLIAAuVIQmAAIAAOVg");
	var mask_graphics_1324 = new cjs.Graphics().p("AoSHzIAAvmIQmAAIAAPmg");
	var mask_graphics_1325 = new cjs.Graphics().p("AoSIcIAAw3IQmAAIAAQ3g");
	var mask_graphics_1326 = new cjs.Graphics().p("AoSJFIAAyJIQmAAIAASJg");
	var mask_graphics_1327 = new cjs.Graphics().p("AoSJtIAAzaIQmAAIAATag");
	var mask_graphics_1328 = new cjs.Graphics().p("AoSKWIAA0rIQmAAIAAUrg");
	var mask_graphics_1329 = new cjs.Graphics().p("AoSK/IAA19IQmAAIAAV9g");
	var mask_graphics_1330 = new cjs.Graphics().p("AoSLnIAA3NIQmAAIAAXNg");
	var mask_graphics_1331 = new cjs.Graphics().p("AoSMQIAA4fIQmAAIAAYfg");
	var mask_graphics_1332 = new cjs.Graphics().p("AoSM4IAA5wIQmAAIAAZwg");
	var mask_graphics_1333 = new cjs.Graphics().p("AoSNhIAA7BIQmAAIAAbBg");
	var mask_graphics_1334 = new cjs.Graphics().p("AoSOKIAA8TIQmAAIAAcTg");
	var mask_graphics_1335 = new cjs.Graphics().p("AoSOyIAA9kIQmAAIAAdkg");
	var mask_graphics_1336 = new cjs.Graphics().p("AoSPbIAA+1IQmAAIAAe1g");
	var mask_graphics_1337 = new cjs.Graphics().p("AoSQEMAAAggHIQmAAMAAAAgHg");
	var mask_graphics_1338 = new cjs.Graphics().p("AoSQsMAAAghXIQmAAMAAAAhXg");
	var mask_graphics_1339 = new cjs.Graphics().p("AoSRVMAAAgipIQmAAMAAAAipg");
	var mask_graphics_1340 = new cjs.Graphics().p("AoSR+MAAAgj7IQmAAMAAAAj7g");
	var mask_graphics_1341 = new cjs.Graphics().p("AoSSmMAAAglLIQmAAMAAAAlLg");
	var mask_graphics_1342 = new cjs.Graphics().p("AoSTPMAAAgmdIQmAAMAAAAmdg");
	var mask_graphics_1343 = new cjs.Graphics().p("AoST4MAAAgnvIQmAAMAAAAnvg");
	var mask_graphics_1344 = new cjs.Graphics().p("AoSUgMAAAgo/IQmAAMAAAAo/g");
	var mask_graphics_1345 = new cjs.Graphics().p("AoSVJMAAAgqRIQmAAMAAAAqRg");
	var mask_graphics_1346 = new cjs.Graphics().p("AoSVyMAAAgrjIQmAAMAAAArjg");
	var mask_graphics_1347 = new cjs.Graphics().p("AoSWaMAAAgszIQmAAMAAAAszg");
	var mask_graphics_1348 = new cjs.Graphics().p("AoSXDMAAAguFIQmAAMAAAAuFg");
	var mask_graphics_1349 = new cjs.Graphics().p("AoSXDMAAAguFIQlAAMAAAAuFg");
	var mask_graphics_1350 = new cjs.Graphics().p("AoSXDMAAAguFIQmAAMAAAAuFg");
	var mask_graphics_1351 = new cjs.Graphics().p("AokXDMAAAguFIRJAAMAAAAuFg");
	var mask_graphics_1352 = new cjs.Graphics().p("Ao2XDMAAAguFIRtAAMAAAAuFg");
	var mask_graphics_1353 = new cjs.Graphics().p("ApIXDMAAAguFISRAAMAAAAuFg");
	var mask_graphics_1354 = new cjs.Graphics().p("ApZXDMAAAguFIS0AAMAAAAuFg");
	var mask_graphics_1355 = new cjs.Graphics().p("AprXDMAAAguFITYAAMAAAAuFg");
	var mask_graphics_1356 = new cjs.Graphics().p("Ap9XDMAAAguFIT7AAMAAAAuFg");
	var mask_graphics_1357 = new cjs.Graphics().p("AqPXDMAAAguFIUfAAMAAAAuFg");
	var mask_graphics_1358 = new cjs.Graphics().p("AqhXDMAAAguFIVDAAMAAAAuFg");
	var mask_graphics_1359 = new cjs.Graphics().p("AqyXDMAAAguFIVlAAMAAAAuFg");
	var mask_graphics_1360 = new cjs.Graphics().p("ArFXDMAAAguFIWLAAMAAAAuFg");
	var mask_graphics_1361 = new cjs.Graphics().p("ArWXDMAAAguFIWtAAMAAAAuFg");
	var mask_graphics_1362 = new cjs.Graphics().p("AroXDMAAAguFIXRAAMAAAAuFg");
	var mask_graphics_1363 = new cjs.Graphics().p("Ar6XDMAAAguFIX1AAMAAAAuFg");
	var mask_graphics_1364 = new cjs.Graphics().p("AsMXDMAAAguFIYZAAMAAAAuFg");
	var mask_graphics_1365 = new cjs.Graphics().p("AseXDMAAAguFIY9AAMAAAAuFg");
	var mask_graphics_1366 = new cjs.Graphics().p("AsvXDMAAAguFIZfAAMAAAAuFg");
	var mask_graphics_1367 = new cjs.Graphics().p("AtBXDMAAAguFIaDAAMAAAAuFg");
	var mask_graphics_1368 = new cjs.Graphics().p("AtTXDMAAAguFIanAAMAAAAuFg");
	var mask_graphics_1369 = new cjs.Graphics().p("AtTXDMAAAguFIanAAMAAAAuFg");
	var mask_graphics_1370 = new cjs.Graphics().p("AtTXDMAAAguFIanAAMAAAAuFg");
	var mask_graphics_1784 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1785 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1786 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1787 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1788 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1789 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1790 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1791 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1792 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1793 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1794 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1795 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1796 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1797 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1798 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1799 = new cjs.Graphics().p("AoSLtIAAmuIQlAAIAAGug");
	var mask_graphics_1851 = new cjs.Graphics().p("AoSFMIAAqXIQmAAIAAKXg");
	var mask_graphics_1852 = new cjs.Graphics().p("ApAFMIAAqXISBAAIAAKXg");
	var mask_graphics_1853 = new cjs.Graphics().p("AptFMIAAqXITbAAIAAKXg");
	var mask_graphics_1854 = new cjs.Graphics().p("AqaFMIAAqXIU1AAIAAKXg");
	var mask_graphics_1855 = new cjs.Graphics().p("ArHFMIAAqXIWQAAIAAKXg");
	var mask_graphics_1856 = new cjs.Graphics().p("Ar1FMIAAqXIXrAAIAAKXg");
	var mask_graphics_1857 = new cjs.Graphics().p("AsiFMIAAqXIZFAAIAAKXg");
	var mask_graphics_1858 = new cjs.Graphics().p("AtPFMIAAqXIafAAIAAKXg");
	var mask_graphics_1859 = new cjs.Graphics().p("At9FMIAAqXIb7AAIAAKXg");
	var mask_graphics_1860 = new cjs.Graphics().p("AuqFMIAAqXIdVAAIAAKXg");
	var mask_graphics_1861 = new cjs.Graphics().p("AvXFMIAAqXIevAAIAAKXg");
	var mask_graphics_1862 = new cjs.Graphics().p("AwEFMIAAqXMAgJAAAIAAKXg");
	var mask_graphics_1863 = new cjs.Graphics().p("AwyFMIAAqXMAhlAAAIAAKXg");
	var mask_graphics_1864 = new cjs.Graphics().p("AxfFMIAAqXMAi/AAAIAAKXg");
	var mask_graphics_1865 = new cjs.Graphics().p("AyMFMIAAqXMAkaAAAIAAKXg");
	var mask_graphics_1866 = new cjs.Graphics().p("Ay6FMIAAqXMAl1AAAIAAKXg");
	var mask_graphics_1867 = new cjs.Graphics().p("AznFMIAAqXMAnPAAAIAAKXg");
	var mask_graphics_1868 = new cjs.Graphics().p("A0VFMIAAqXMAoqAAAIAAKXg");
	var mask_graphics_1869 = new cjs.Graphics().p("A1CFMIAAqXMAqFAAAIAAKXg");
	var mask_graphics_1870 = new cjs.Graphics().p("A1vFMIAAqXMArfAAAIAAKXg");
	var mask_graphics_1871 = new cjs.Graphics().p("A2dFMIAAqXMAs7AAAIAAKXg");
	var mask_graphics_1872 = new cjs.Graphics().p("A3KFMIAAqXMAuVAAAIAAKXg");
	var mask_graphics_1873 = new cjs.Graphics().p("A33FMIAAqXMAvvAAAIAAKXg");
	var mask_graphics_1874 = new cjs.Graphics().p("A4kFMIAAqXMAxJAAAIAAKXg");
	var mask_graphics_1875 = new cjs.Graphics().p("A5SFMIAAqXMAylAAAIAAKXg");
	var mask_graphics_1876 = new cjs.Graphics().p("A5/FMIAAqXMAz/AAAIAAKXg");
	var mask_graphics_1877 = new cjs.Graphics().p("A6sFMIAAqXMA1ZAAAIAAKXg");
	var mask_graphics_1878 = new cjs.Graphics().p("A7aFMIAAqXMA21AAAIAAKXg");
	var mask_graphics_1879 = new cjs.Graphics().p("A8HFMIAAqXMA4PAAAIAAKXg");
	var mask_graphics_1880 = new cjs.Graphics().p("A80FMIAAqXMA5pAAAIAAKXg");
	var mask_graphics_1881 = new cjs.Graphics().p("A9hFMIAAqXMA7DAAAIAAKXg");
	var mask_graphics_1882 = new cjs.Graphics().p("A+PFMIAAqXMA8eAAAIAAKXg");
	var mask_graphics_1883 = new cjs.Graphics().p("A+OFMIAAqXMA8dAAAIAAKXg");
	var mask_graphics_1884 = new cjs.Graphics().p("A+PFMIAAqXMA8eAAAIAAKXg");
	var mask_graphics_1885 = new cjs.Graphics().p("A+PFkIAArHMA8eAAAIAALHg");
	var mask_graphics_1886 = new cjs.Graphics().p("A+PF8IAAr3MA8eAAAIAAL3g");
	var mask_graphics_1887 = new cjs.Graphics().p("A+PGUIAAsnMA8eAAAIAAMng");
	var mask_graphics_1888 = new cjs.Graphics().p("A+PGsIAAtXMA8eAAAIAANXg");
	var mask_graphics_1889 = new cjs.Graphics().p("A+PHEIAAuHMA8eAAAIAAOHg");
	var mask_graphics_1890 = new cjs.Graphics().p("A+PHbIAAu2MA8eAAAIAAO2g");
	var mask_graphics_1891 = new cjs.Graphics().p("A+PHzIAAvmMA8eAAAIAAPmg");
	var mask_graphics_1892 = new cjs.Graphics().p("A+PILIAAwVMA8eAAAIAAQVg");
	var mask_graphics_1893 = new cjs.Graphics().p("A+PIjIAAxFMA8eAAAIAARFg");
	var mask_graphics_1894 = new cjs.Graphics().p("A+PI7IAAx1MA8eAAAIAAR1g");
	var mask_graphics_1895 = new cjs.Graphics().p("A+PJTIAAylMA8eAAAIAASlg");
	var mask_graphics_1896 = new cjs.Graphics().p("A+PJrIAAzVMA8eAAAIAATVg");
	var mask_graphics_1897 = new cjs.Graphics().p("A+PKDIAA0EMA8eAAAIAAUEg");
	var mask_graphics_1898 = new cjs.Graphics().p("A+PKbIAA01MA8eAAAIAAU1g");
	var mask_graphics_1899 = new cjs.Graphics().p("A+PKyIAA1jMA8eAAAIAAVjg");
	var mask_graphics_1900 = new cjs.Graphics().p("A+PLKIAA2TMA8eAAAIAAWTg");
	var mask_graphics_1901 = new cjs.Graphics().p("A+PLiIAA3DMA8eAAAIAAXDg");
	var mask_graphics_1902 = new cjs.Graphics().p("A+PL6IAA3zMA8eAAAIAAXzg");
	var mask_graphics_1903 = new cjs.Graphics().p("A+OL6IAA3zMA8dAAAIAAXzg");
	var mask_graphics_1904 = new cjs.Graphics().p("A+PNuIAA3zMA8eAAAIAAXzg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(450).to({graphics:mask_graphics_450,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_451,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_452,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_453,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_454,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_455,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_456,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_457,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_458,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_459,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_460,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_461,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_462,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_463,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_464,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_465,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_466,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_467,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_468,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_469,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_470,x:216.8432,y:88.3179}).wait(1).to({graphics:mask_graphics_471,x:380.55,y:162.675}).wait(1).to({graphics:mask_graphics_472,x:380.55,y:157.15}).wait(1).to({graphics:mask_graphics_473,x:380.55,y:151.65}).wait(1).to({graphics:mask_graphics_474,x:380.55,y:146.125}).wait(1).to({graphics:mask_graphics_475,x:380.55,y:140.6}).wait(1).to({graphics:mask_graphics_476,x:380.55,y:135.1}).wait(1).to({graphics:mask_graphics_477,x:380.55,y:129.575}).wait(1).to({graphics:mask_graphics_478,x:380.55,y:124.075}).wait(1).to({graphics:mask_graphics_479,x:380.55,y:118.55}).wait(1).to({graphics:mask_graphics_480,x:380.55,y:113.025}).wait(1).to({graphics:mask_graphics_481,x:380.55,y:107.525}).wait(1).to({graphics:mask_graphics_482,x:380.55,y:102}).wait(1).to({graphics:mask_graphics_483,x:380.55,y:96.475}).wait(1).to({graphics:mask_graphics_484,x:380.55,y:90.975}).wait(1).to({graphics:mask_graphics_485,x:380.55,y:85.45}).wait(1).to({graphics:mask_graphics_486,x:380.55,y:79.925}).wait(1).to({graphics:mask_graphics_487,x:380.55,y:74.425}).wait(1).to({graphics:mask_graphics_488,x:380.55,y:68.9}).wait(1).to({graphics:mask_graphics_489,x:380.55,y:63.375}).wait(1).to({graphics:mask_graphics_490,x:380.55,y:57.875}).wait(1).to({graphics:mask_graphics_491,x:380.55,y:52.35}).wait(1).to({graphics:mask_graphics_492,x:380.55,y:46.825}).wait(1).to({graphics:mask_graphics_493,x:380.55,y:41.325}).wait(1).to({graphics:mask_graphics_494,x:380.55,y:35.8}).wait(1).to({graphics:mask_graphics_495,x:380.55,y:30.275}).wait(1).to({graphics:mask_graphics_496,x:380.55,y:24.775}).wait(1).to({graphics:mask_graphics_497,x:380.55,y:19.25}).wait(1).to({graphics:mask_graphics_498,x:380.55,y:13.75}).wait(1).to({graphics:mask_graphics_499,x:380.55,y:8.225}).wait(1).to({graphics:mask_graphics_500,x:380.55,y:2.7}).wait(1).to({graphics:mask_graphics_501,x:380.55,y:-2.8}).wait(1).to({graphics:mask_graphics_502,x:380.55,y:-8.325}).wait(1).to({graphics:mask_graphics_503,x:380.5366,y:-8.3291}).wait(1).to({graphics:mask_graphics_504,x:380.55,y:-8.325}).wait(1).to({graphics:mask_graphics_505,x:378.65,y:-8.325}).wait(1).to({graphics:mask_graphics_506,x:376.775,y:-8.325}).wait(1).to({graphics:mask_graphics_507,x:374.875,y:-8.325}).wait(1).to({graphics:mask_graphics_508,x:373,y:-8.325}).wait(1).to({graphics:mask_graphics_509,x:371.1,y:-8.325}).wait(1).to({graphics:mask_graphics_510,x:369.225,y:-8.325}).wait(1).to({graphics:mask_graphics_511,x:367.325,y:-8.325}).wait(1).to({graphics:mask_graphics_512,x:365.45,y:-8.325}).wait(1).to({graphics:mask_graphics_513,x:363.55,y:-8.325}).wait(1).to({graphics:mask_graphics_514,x:361.65,y:-8.325}).wait(1).to({graphics:mask_graphics_515,x:359.775,y:-8.325}).wait(1).to({graphics:mask_graphics_516,x:357.875,y:-8.325}).wait(1).to({graphics:mask_graphics_517,x:356,y:-8.325}).wait(1).to({graphics:mask_graphics_518,x:354.1,y:-8.325}).wait(1).to({graphics:mask_graphics_519,x:352.225,y:-8.325}).wait(1).to({graphics:mask_graphics_520,x:350.325,y:-8.325}).wait(1).to({graphics:mask_graphics_521,x:348.45,y:-8.325}).wait(1).to({graphics:mask_graphics_522,x:346.55,y:-8.325}).wait(1).to({graphics:mask_graphics_523,x:346.5436,y:-8.3291}).wait(1).to({graphics:mask_graphics_524,x:216.8429,y:-8.3002}).wait(2).to({graphics:null,x:0,y:0}).wait(239).to({graphics:mask_graphics_765,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_766,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_767,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_768,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_769,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_770,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_771,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_772,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_773,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_774,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_775,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_776,x:380.5366,y:-151.7684}).wait(1).to({graphics:mask_graphics_777,x:380.5366,y:-151.7684}).wait(1).to({graphics:mask_graphics_778,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_779,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_780,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_781,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_782,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_783,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_784,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_785,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_786,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_787,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_788,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_789,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_790,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_791,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_792,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_793,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_794,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_795,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_796,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_797,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_798,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_799,x:380.5366,y:-151.7684}).wait(1).to({graphics:mask_graphics_800,x:380.55,y:-151.75}).wait(1).to({graphics:mask_graphics_801,x:376.2,y:-151.75}).wait(1).to({graphics:mask_graphics_802,x:371.85,y:-151.75}).wait(1).to({graphics:mask_graphics_803,x:367.475,y:-151.75}).wait(1).to({graphics:mask_graphics_804,x:363.125,y:-151.75}).wait(1).to({graphics:mask_graphics_805,x:358.775,y:-151.75}).wait(1).to({graphics:mask_graphics_806,x:354.425,y:-151.75}).wait(1).to({graphics:mask_graphics_807,x:350.075,y:-151.75}).wait(1).to({graphics:mask_graphics_808,x:345.7,y:-151.75}).wait(1).to({graphics:mask_graphics_809,x:341.35,y:-151.75}).wait(1).to({graphics:mask_graphics_810,x:337,y:-151.75}).wait(1).to({graphics:mask_graphics_811,x:332.65,y:-151.75}).wait(1).to({graphics:mask_graphics_812,x:328.3,y:-151.75}).wait(1).to({graphics:mask_graphics_813,x:323.925,y:-151.75}).wait(1).to({graphics:mask_graphics_814,x:319.575,y:-151.75}).wait(1).to({graphics:mask_graphics_815,x:315.225,y:-151.75}).wait(1).to({graphics:mask_graphics_816,x:310.875,y:-151.75}).wait(1).to({graphics:mask_graphics_817,x:306.525,y:-151.75}).wait(1).to({graphics:mask_graphics_818,x:302.175,y:-151.75}).wait(1).to({graphics:mask_graphics_819,x:297.8,y:-151.75}).wait(1).to({graphics:mask_graphics_820,x:293.45,y:-151.75}).wait(1).to({graphics:mask_graphics_821,x:289.1,y:-151.75}).wait(1).to({graphics:mask_graphics_822,x:284.75,y:-151.75}).wait(1).to({graphics:mask_graphics_823,x:280.4,y:-151.75}).wait(1).to({graphics:mask_graphics_824,x:276.025,y:-151.75}).wait(1).to({graphics:mask_graphics_825,x:271.675,y:-151.75}).wait(1).to({graphics:mask_graphics_826,x:267.325,y:-151.75}).wait(1).to({graphics:mask_graphics_827,x:262.975,y:-151.75}).wait(1).to({graphics:mask_graphics_828,x:258.625,y:-151.75}).wait(1).to({graphics:mask_graphics_829,x:254.25,y:-151.75}).wait(1).to({graphics:mask_graphics_830,x:249.9,y:-151.75}).wait(1).to({graphics:mask_graphics_831,x:245.55,y:-151.75}).wait(1).to({graphics:mask_graphics_832,x:245.5407,y:-151.7684}).wait(1).to({graphics:mask_graphics_833,x:245.55,y:-151.75}).wait(1).to({graphics:mask_graphics_834,x:245.55,y:-149.55}).wait(1).to({graphics:mask_graphics_835,x:245.55,y:-147.375}).wait(1).to({graphics:mask_graphics_836,x:245.55,y:-145.175}).wait(1).to({graphics:mask_graphics_837,x:245.55,y:-142.975}).wait(1).to({graphics:mask_graphics_838,x:245.55,y:-140.775}).wait(1).to({graphics:mask_graphics_839,x:245.55,y:-138.6}).wait(1).to({graphics:mask_graphics_840,x:245.55,y:-136.4}).wait(1).to({graphics:mask_graphics_841,x:245.55,y:-134.2}).wait(1).to({graphics:mask_graphics_842,x:245.55,y:-131.975}).wait(1).to({graphics:mask_graphics_843,x:245.55,y:-129.8}).wait(1).to({graphics:mask_graphics_844,x:245.55,y:-127.6}).wait(1).to({graphics:mask_graphics_845,x:245.55,y:-125.4}).wait(1).to({graphics:mask_graphics_846,x:245.55,y:-123.225}).wait(1).to({graphics:mask_graphics_847,x:245.55,y:-121.025}).wait(1).to({graphics:mask_graphics_848,x:245.55,y:-118.825}).wait(1).to({graphics:mask_graphics_849,x:245.55,y:-116.625}).wait(1).to({graphics:mask_graphics_850,x:245.55,y:-114.45}).wait(1).to({graphics:mask_graphics_851,x:245.55,y:-112.25}).wait(1).to({graphics:mask_graphics_852,x:245.5407,y:-112.2336}).wait(1).to({graphics:mask_graphics_853,x:216.8512,y:-86.629}).wait(2).to({graphics:null,x:0,y:0}).wait(393).to({graphics:mask_graphics_1248,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1249,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1250,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1251,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1252,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1253,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1254,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1255,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1256,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1257,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1258,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1259,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1260,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1261,x:10.5381,y:-86.6199}).wait(1).to({graphics:mask_graphics_1262,x:10.5381,y:-86.6199}).wait(55).to({graphics:mask_graphics_1317,x:10.55,y:-151.75}).wait(1).to({graphics:mask_graphics_1318,x:10.55,y:-147.675}).wait(1).to({graphics:mask_graphics_1319,x:10.55,y:-143.625}).wait(1).to({graphics:mask_graphics_1320,x:10.55,y:-139.55}).wait(1).to({graphics:mask_graphics_1321,x:10.55,y:-135.5}).wait(1).to({graphics:mask_graphics_1322,x:10.55,y:-131.425}).wait(1).to({graphics:mask_graphics_1323,x:10.55,y:-127.375}).wait(1).to({graphics:mask_graphics_1324,x:10.55,y:-123.3}).wait(1).to({graphics:mask_graphics_1325,x:10.55,y:-119.25}).wait(1).to({graphics:mask_graphics_1326,x:10.55,y:-115.175}).wait(1).to({graphics:mask_graphics_1327,x:10.55,y:-111.1}).wait(1).to({graphics:mask_graphics_1328,x:10.55,y:-107.05}).wait(1).to({graphics:mask_graphics_1329,x:10.55,y:-102.975}).wait(1).to({graphics:mask_graphics_1330,x:10.55,y:-98.925}).wait(1).to({graphics:mask_graphics_1331,x:10.55,y:-94.85}).wait(1).to({graphics:mask_graphics_1332,x:10.55,y:-90.8}).wait(1).to({graphics:mask_graphics_1333,x:10.55,y:-86.725}).wait(1).to({graphics:mask_graphics_1334,x:10.55,y:-82.675}).wait(1).to({graphics:mask_graphics_1335,x:10.55,y:-78.6}).wait(1).to({graphics:mask_graphics_1336,x:10.55,y:-74.55}).wait(1).to({graphics:mask_graphics_1337,x:10.55,y:-70.475}).wait(1).to({graphics:mask_graphics_1338,x:10.55,y:-66.425}).wait(1).to({graphics:mask_graphics_1339,x:10.55,y:-62.35}).wait(1).to({graphics:mask_graphics_1340,x:10.55,y:-58.275}).wait(1).to({graphics:mask_graphics_1341,x:10.55,y:-54.225}).wait(1).to({graphics:mask_graphics_1342,x:10.55,y:-50.15}).wait(1).to({graphics:mask_graphics_1343,x:10.55,y:-46.1}).wait(1).to({graphics:mask_graphics_1344,x:10.55,y:-42.025}).wait(1).to({graphics:mask_graphics_1345,x:10.55,y:-37.975}).wait(1).to({graphics:mask_graphics_1346,x:10.55,y:-33.9}).wait(1).to({graphics:mask_graphics_1347,x:10.55,y:-29.85}).wait(1).to({graphics:mask_graphics_1348,x:10.55,y:-25.775}).wait(1).to({graphics:mask_graphics_1349,x:10.5367,y:-25.7715}).wait(1).to({graphics:mask_graphics_1350,x:10.55,y:-25.775}).wait(1).to({graphics:mask_graphics_1351,x:12.325,y:-25.775}).wait(1).to({graphics:mask_graphics_1352,x:14.1,y:-25.775}).wait(1).to({graphics:mask_graphics_1353,x:15.875,y:-25.775}).wait(1).to({graphics:mask_graphics_1354,x:17.65,y:-25.775}).wait(1).to({graphics:mask_graphics_1355,x:19.45,y:-25.775}).wait(1).to({graphics:mask_graphics_1356,x:21.225,y:-25.775}).wait(1).to({graphics:mask_graphics_1357,x:23,y:-25.775}).wait(1).to({graphics:mask_graphics_1358,x:24.775,y:-25.775}).wait(1).to({graphics:mask_graphics_1359,x:26.55,y:-25.775}).wait(1).to({graphics:mask_graphics_1360,x:28.3,y:-25.775}).wait(1).to({graphics:mask_graphics_1361,x:30.075,y:-25.775}).wait(1).to({graphics:mask_graphics_1362,x:31.85,y:-25.775}).wait(1).to({graphics:mask_graphics_1363,x:33.625,y:-25.775}).wait(1).to({graphics:mask_graphics_1364,x:35.425,y:-25.775}).wait(1).to({graphics:mask_graphics_1365,x:37.2,y:-25.775}).wait(1).to({graphics:mask_graphics_1366,x:38.975,y:-25.775}).wait(1).to({graphics:mask_graphics_1367,x:40.75,y:-25.775}).wait(1).to({graphics:mask_graphics_1368,x:42.525,y:-25.775}).wait(1).to({graphics:mask_graphics_1369,x:42.5056,y:-25.7715}).wait(1).to({graphics:mask_graphics_1370,x:42.5404,y:-25.7684}).wait(2).to({graphics:null,x:0,y:0}).wait(412).to({graphics:mask_graphics_1784,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1785,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1786,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1787,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1788,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1789,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1790,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1791,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1792,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1793,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1794,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1795,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1796,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1797,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1798,x:10.5381,y:74.8556}).wait(1).to({graphics:mask_graphics_1799,x:10.5381,y:74.8556}).wait(52).to({graphics:mask_graphics_1851,x:10.55,y:135.125}).wait(1).to({graphics:mask_graphics_1852,x:15.075,y:135.375}).wait(1).to({graphics:mask_graphics_1853,x:19.6,y:135.575}).wait(1).to({graphics:mask_graphics_1854,x:24.125,y:135.825}).wait(1).to({graphics:mask_graphics_1855,x:28.65,y:136.075}).wait(1).to({graphics:mask_graphics_1856,x:33.2,y:136.275}).wait(1).to({graphics:mask_graphics_1857,x:37.725,y:136.525}).wait(1).to({graphics:mask_graphics_1858,x:42.25,y:136.775}).wait(1).to({graphics:mask_graphics_1859,x:46.775,y:136.975}).wait(1).to({graphics:mask_graphics_1860,x:51.3,y:137.225}).wait(1).to({graphics:mask_graphics_1861,x:55.825,y:137.475}).wait(1).to({graphics:mask_graphics_1862,x:60.35,y:137.675}).wait(1).to({graphics:mask_graphics_1863,x:64.9,y:137.925}).wait(1).to({graphics:mask_graphics_1864,x:69.425,y:138.175}).wait(1).to({graphics:mask_graphics_1865,x:73.95,y:138.375}).wait(1).to({graphics:mask_graphics_1866,x:78.475,y:138.625}).wait(1).to({graphics:mask_graphics_1867,x:82.975,y:138.875}).wait(1).to({graphics:mask_graphics_1868,x:87.5,y:139.125}).wait(1).to({graphics:mask_graphics_1869,x:92.025,y:139.325}).wait(1).to({graphics:mask_graphics_1870,x:96.55,y:139.575}).wait(1).to({graphics:mask_graphics_1871,x:101.1,y:139.825}).wait(1).to({graphics:mask_graphics_1872,x:105.625,y:140.025}).wait(1).to({graphics:mask_graphics_1873,x:110.15,y:140.275}).wait(1).to({graphics:mask_graphics_1874,x:114.675,y:140.525}).wait(1).to({graphics:mask_graphics_1875,x:119.2,y:140.725}).wait(1).to({graphics:mask_graphics_1876,x:123.725,y:140.975}).wait(1).to({graphics:mask_graphics_1877,x:128.25,y:141.225}).wait(1).to({graphics:mask_graphics_1878,x:132.8,y:141.425}).wait(1).to({graphics:mask_graphics_1879,x:137.325,y:141.675}).wait(1).to({graphics:mask_graphics_1880,x:141.85,y:141.925}).wait(1).to({graphics:mask_graphics_1881,x:146.375,y:142.125}).wait(1).to({graphics:mask_graphics_1882,x:150.9,y:142.375}).wait(1).to({graphics:mask_graphics_1883,x:150.8998,y:142.3688}).wait(1).to({graphics:mask_graphics_1884,x:150.9,y:142.375}).wait(1).to({graphics:mask_graphics_1885,x:150.9,y:139.975}).wait(1).to({graphics:mask_graphics_1886,x:150.9,y:137.6}).wait(1).to({graphics:mask_graphics_1887,x:150.9,y:135.2}).wait(1).to({graphics:mask_graphics_1888,x:150.9,y:132.825}).wait(1).to({graphics:mask_graphics_1889,x:150.9,y:130.425}).wait(1).to({graphics:mask_graphics_1890,x:150.9,y:128.05}).wait(1).to({graphics:mask_graphics_1891,x:150.9,y:125.65}).wait(1).to({graphics:mask_graphics_1892,x:150.9,y:123.275}).wait(1).to({graphics:mask_graphics_1893,x:150.9,y:120.875}).wait(1).to({graphics:mask_graphics_1894,x:150.9,y:118.45}).wait(1).to({graphics:mask_graphics_1895,x:150.9,y:116.075}).wait(1).to({graphics:mask_graphics_1896,x:150.9,y:113.675}).wait(1).to({graphics:mask_graphics_1897,x:150.9,y:111.3}).wait(1).to({graphics:mask_graphics_1898,x:150.9,y:108.9}).wait(1).to({graphics:mask_graphics_1899,x:150.9,y:106.525}).wait(1).to({graphics:mask_graphics_1900,x:150.9,y:104.125}).wait(1).to({graphics:mask_graphics_1901,x:150.9,y:101.75}).wait(1).to({graphics:mask_graphics_1902,x:150.9,y:99.35}).wait(1).to({graphics:mask_graphics_1903,x:150.8998,y:99.3501}).wait(1).to({graphics:mask_graphics_1904,x:150.9,y:87.775}).wait(477));

	// Masked_Layer_11___5
	this.instance_43 = new lib.text20("synched",0);
	this.instance_43.setTransform(227.35,-33.7);

	this.instance_44 = new lib.text33("synched",0);
	this.instance_44.setTransform(133.4,-82.7);
	this.instance_44.alpha = 0;
	this.instance_44._off = true;

	this.instance_45 = new lib.text49("synched",0);
	this.instance_45.setTransform(33.4,-15.7);
	this.instance_45.alpha = 0;
	this.instance_45._off = true;

	this.instance_46 = new lib.text61("synched",0);
	this.instance_46.setTransform(121.9,39.3);
	this.instance_46.alpha = 0;
	this.instance_46._off = true;

	var maskedShapeInstanceList = [this.instance_43,this.instance_44,this.instance_45,this.instance_46];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_43}]},450).to({state:[]},76).to({state:[{t:this.instance_44}]},239).to({state:[{t:this.instance_44}]},12).to({state:[{t:this.instance_44}]},1).to({state:[]},77).to({state:[{t:this.instance_45}]},393).to({state:[{t:this.instance_45}]},13).to({state:[{t:this.instance_45}]},1).to({state:[]},110).to({state:[{t:this.instance_46}]},412).to({state:[{t:this.instance_46}]},14).to({state:[{t:this.instance_46}]},1).to({state:[]},107).wait(475));
	this.timeline.addTween(cjs.Tween.get(this.instance_44).wait(765).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).to({_off:true},77).wait(1526));
	this.timeline.addTween(cjs.Tween.get(this.instance_45).wait(1248).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).to({_off:true},110).wait(1009));
	this.timeline.addTween(cjs.Tween.get(this.instance_46).wait(1784).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).to({_off:true},107).wait(475));

	// Masked_Layer_10___5
	this.instance_47 = new lib.text32("synched",0);
	this.instance_47.setTransform(195.6,-164);
	this.instance_47.alpha = 0;
	this.instance_47._off = true;

	this.instance_48 = new lib.text48("synched",0);
	this.instance_48.setTransform(-30.4,-44);
	this.instance_48.alpha = 0;
	this.instance_48._off = true;

	this.instance_49 = new lib.text60("synched",0);
	this.instance_49.setTransform(179.6,142);
	this.instance_49.alpha = 0;
	this.instance_49._off = true;

	var maskedShapeInstanceList = [this.instance_47,this.instance_48,this.instance_49];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_47).wait(765).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).to({_off:true},77).wait(1526));
	this.timeline.addTween(cjs.Tween.get(this.instance_48).wait(1248).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).to({_off:true},110).wait(1009));
	this.timeline.addTween(cjs.Tween.get(this.instance_49).wait(1784).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).to({_off:true},107).wait(475));

	// Masked_Layer_9___5
	this.instance_50 = new lib.sprite19();
	this.instance_50.setTransform(374.25,-118.15,3,3);
	this.instance_50._off = true;

	var maskedShapeInstanceList = [this.instance_50];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_50).wait(450).to({_off:false},0).wait(74).to({_off:true},2).wait(1855));

	// Masked_Layer_8___5
	this.instance_51 = new lib.text17("synched",0);
	this.instance_51.setTransform(385.6,-61);

	this.instance_52 = new lib.sprite19b();
	this.instance_52.setTransform(84.25,-141.15,3,3,-90);
	this.instance_52._off = true;

	this.instance_53 = new lib.sprite19c();
	this.instance_53.setTransform(15.25,101.85,3,3,180);
	this.instance_53.alpha = 0;
	this.instance_53._off = true;

	this.instance_54 = new lib.sprite19d();
	this.instance_54.setTransform(315.25,128.85,3,3,90);
	this.instance_54._off = true;

	var maskedShapeInstanceList = [this.instance_51,this.instance_52,this.instance_53,this.instance_54];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_51}]},450).to({state:[]},76).to({state:[{t:this.instance_52}]},239).to({state:[{t:this.instance_52}]},10).to({state:[{t:this.instance_52}]},1).to({state:[{t:this.instance_52}]},1).to({state:[{t:this.instance_52}]},1).to({state:[{t:this.instance_52}]},21).to({state:[{t:this.instance_52}]},1).to({state:[{t:this.instance_52}]},32).to({state:[{t:this.instance_52}]},1).to({state:[{t:this.instance_52}]},19).to({state:[{t:this.instance_52}]},1).to({state:[]},2).to({state:[{t:this.instance_53}]},393).to({state:[{t:this.instance_53}]},13).to({state:[{t:this.instance_53}]},1).to({state:[]},110).to({state:[{t:this.instance_54}]},412).to({state:[{t:this.instance_54}]},14).to({state:[{t:this.instance_54}]},1).to({state:[]},107).wait(475));
	this.timeline.addTween(cjs.Tween.get(this.instance_52).wait(765).to({_off:false},0).to({scaleX:2.9999,scaleY:2.9999,x:84.2},10).wait(2).to({scaleX:3,scaleY:3,x:84.25},0).wait(76).to({_off:true},2).wait(1526));
	this.timeline.addTween(cjs.Tween.get(this.instance_53).wait(1248).to({_off:false},0).to({alpha:1},13).wait(1).to({_off:true},110).wait(1009));
	this.timeline.addTween(cjs.Tween.get(this.instance_54).wait(1784).to({_off:false},0).wait(15).to({y:129.85},0).to({_off:true},107).wait(475));

	// Masked_Layer_7___5
	this.instance_55 = new lib.shape16("synched",0);
	this.instance_55.setTransform(208.3,0.05);

	this.instance_56 = new lib.shape31("synched",0);
	this.instance_56.setTransform(208.3,0.05);
	this.instance_56.alpha = 0;
	this.instance_56._off = true;

	this.instance_57 = new lib.shape47("synched",0);
	this.instance_57.setTransform(208.3,0.05);
	this.instance_57.alpha = 0;
	this.instance_57._off = true;

	this.instance_58 = new lib.shape59("synched",0);
	this.instance_58.setTransform(208.3,0.05);
	this.instance_58.alpha = 0;
	this.instance_58._off = true;

	var maskedShapeInstanceList = [this.instance_55,this.instance_56,this.instance_57,this.instance_58];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_55}]},450).to({state:[]},76).to({state:[{t:this.instance_56}]},239).to({state:[{t:this.instance_56}]},12).to({state:[{t:this.instance_56}]},1).to({state:[]},77).to({state:[{t:this.instance_57}]},393).to({state:[{t:this.instance_57}]},13).to({state:[{t:this.instance_57}]},1).to({state:[]},110).to({state:[{t:this.instance_58}]},412).to({state:[{t:this.instance_58}]},14).to({state:[{t:this.instance_58}]},1).to({state:[]},107).wait(475));
	this.timeline.addTween(cjs.Tween.get(this.instance_56).wait(765).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).to({_off:true},77).wait(1526));
	this.timeline.addTween(cjs.Tween.get(this.instance_57).wait(1248).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).to({_off:true},110).wait(1009));
	this.timeline.addTween(cjs.Tween.get(this.instance_58).wait(1784).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).to({_off:true},107).wait(475));

	// Layer_5
	this.instance_59 = new lib.shape25("synched",0);
	this.instance_59.setTransform(208.3,0.05);
	this.instance_59._off = true;

	this.instance_60 = new lib.shape37("synched",0);
	this.instance_60.setTransform(208.3,0.05);
	this.instance_60._off = true;

	this.instance_61 = new lib.shape56("synched",0);
	this.instance_61.setTransform(208.3,0.05);
	this.instance_61._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_59).wait(526).to({_off:false},0).wait(88).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},3).wait(1750));
	this.timeline.addTween(cjs.Tween.get(this.instance_60).wait(855).to({_off:false},0).wait(189).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(1321));
	this.timeline.addTween(cjs.Tween.get(this.instance_61).wait(1372).to({_off:false},0).to({startPosition:0},119).to({alpha:0},14).to({_off:true},1).wait(875));

	// Layer_4
	this.instance_62 = new lib.text14("synched",0);
	this.instance_62.setTransform(335.45,121.15);

	this.instance_63 = new lib.text29("synched",0);
	this.instance_63.setTransform(332.45,-148.85);
	this.instance_63.alpha = 0;
	this.instance_63._off = true;

	this.instance_64 = new lib.text46("synched",0);
	this.instance_64.setTransform(-18.55,-148.85);
	this.instance_64.alpha = 0;
	this.instance_64._off = true;

	this.instance_65 = new lib.text63("synched",0);
	this.instance_65.setTransform(-24.55,121.15);
	this.instance_65._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_62}]},450).to({state:[]},5).to({state:[{t:this.instance_62}]},5).to({state:[]},5).to({state:[{t:this.instance_62}]},5).to({state:[]},56).to({state:[{t:this.instance_63}]},239).to({state:[{t:this.instance_63}]},12).to({state:[{t:this.instance_63}]},1).to({state:[]},6).to({state:[{t:this.instance_63}]},5).to({state:[]},5).to({state:[{t:this.instance_63}]},5).to({state:[]},56).to({state:[{t:this.instance_64}]},393).to({state:[{t:this.instance_64}]},13).to({state:[{t:this.instance_64}]},1).to({state:[]},110).to({state:[{t:this.instance_65}]},478).to({state:[{t:this.instance_65}]},188).to({state:[{t:this.instance_65}]},14).to({state:[]},1).wait(328));
	this.timeline.addTween(cjs.Tween.get(this.instance_63).wait(765).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).to({_off:true},6).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},56).wait(1526));
	this.timeline.addTween(cjs.Tween.get(this.instance_64).wait(1248).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).to({_off:true},110).wait(1009));
	this.timeline.addTween(cjs.Tween.get(this.instance_65).wait(1850).to({_off:false},0).wait(188).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_3
	this.instance_66 = new lib.shape13("synched",0);
	this.instance_66.setTransform(208.3,0.05);

	this.instance_67 = new lib.shape28("synched",0);
	this.instance_67.setTransform(208.3,0.05);
	this.instance_67.alpha = 0;
	this.instance_67._off = true;

	this.instance_68 = new lib.shape45("synched",0);
	this.instance_68.setTransform(208.3,0.05);
	this.instance_68.alpha = 0;
	this.instance_68._off = true;

	this.instance_69 = new lib.shape62("synched",0);
	this.instance_69.setTransform(208.3,0.05);
	this.instance_69._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_66}]},450).to({state:[]},5).to({state:[{t:this.instance_66}]},5).to({state:[]},5).to({state:[{t:this.instance_66}]},5).to({state:[]},56).to({state:[{t:this.instance_67}]},239).to({state:[{t:this.instance_67}]},12).to({state:[{t:this.instance_67}]},1).to({state:[]},6).to({state:[{t:this.instance_67}]},5).to({state:[]},5).to({state:[{t:this.instance_67}]},5).to({state:[]},56).to({state:[{t:this.instance_68}]},393).to({state:[{t:this.instance_68}]},13).to({state:[{t:this.instance_68}]},1).to({state:[]},110).to({state:[{t:this.instance_69}]},478).to({state:[{t:this.instance_69}]},188).to({state:[{t:this.instance_69}]},14).to({state:[]},1).wait(328));
	this.timeline.addTween(cjs.Tween.get(this.instance_67).wait(765).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).to({_off:true},6).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},56).wait(1526));
	this.timeline.addTween(cjs.Tween.get(this.instance_68).wait(1248).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).to({_off:true},110).wait(1009));
	this.timeline.addTween(cjs.Tween.get(this.instance_69).wait(1850).to({_off:false},0).wait(188).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_2
	this.instance_70 = new lib.shape12("synched",0);
	this.instance_70.setTransform(208.3,0.05);
	this.instance_70._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_70).wait(450).to({_off:false},0).wait(164).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},3).wait(134).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).wait(266).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(188).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(229).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	// Layer_1
	this.instance_71 = new lib.shape3("synched",0);
	this.instance_71.setTransform(208.3,0.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_71).wait(614).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},3).wait(134).to({_off:false},0).to({alpha:0.9219},12).wait(1).to({alpha:1},0).wait(266).to({startPosition:0},0).to({alpha:0.0703},13).wait(1).to({alpha:0},0).to({_off:true},2).wait(188).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(229).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(278).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).wait(239).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(328));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-540.1,-204.6,979.7,403.4);


// stage content:
(lib.vital_op_ref = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {p1:0};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,1,2375];
	this.streamSoundSymbolsList[1] = [{id:"vital_op_ref1_rrrrr",startFrame:1,endFrame:2376,loop:1,offset:200}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		InitPage(1);
		Next(0);
		Prev(0);
		InitAnim();
		
		//-------------------------------------
		//ページ移動
		//-------------------------------------
		// Back to Topicクリック
		this.back.addEventListener("click", function(){
			GetUrlMain("vitalmenu_ref");
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
		var soundInstance = playSound("vital_op_ref1_rrrrr",0,200);
		this.InsertIntoSoundStreamData(soundInstance,1,2376,1,200);
	}
	this.frame_2375 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(2374).call(this.frame_2375).wait(1));

	// Layer_126_page
	this.page = new cjs.Text("Page number", "italic bold 15px 'Arial'", "#FF9900");
	this.page.name = "page";
	this.page.lineHeight = 17;
	this.page.lineWidth = 193;
	this.page.parent = this;
	this.page.setTransform(23,658,1.4989,1.4989);

	this.timeline.addTween(cjs.Tween.get(this.page).wait(2376));

	// Layer_122_back
	this.back = new lib.button99();
	this.back.name = "back";
	this.back.setTransform(350,645,1.0001,1.0002);
	new cjs.ButtonHelper(this.back, 0, 1, 2, false, new lib.button99(), 3);

	this.timeline.addTween(cjs.Tween.get(this.back).wait(2376));

	// Layer_116_next
	this.next = new lib.button94();
	this.next.name = "next";
	this.next.setTransform(1496.1,5.1,0.9998,0.9999,0,0,0,0.1,0.1);
	new cjs.ButtonHelper(this.next, 0, 1, 2, false, new lib.button94(), 3);

	this.timeline.addTween(cjs.Tween.get(this.next).wait(2376));

	// Layer_111_previous
	this.previous = new lib.button87();
	this.previous.name = "previous";
	this.previous.setTransform(1432,5,1.0003,0.9993);
	new cjs.ButtonHelper(this.previous, 0, 1, 2, false, new lib.button87(), 3);

	this.timeline.addTween(cjs.Tween.get(this.previous).wait(2376));

	// Layer_108_slider
	this.slider = new lib.sprite822();
	this.slider.name = "slider";
	this.slider.setTransform(610.1,670.1,0.9937,0.9983,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.slider).wait(2376));

	// Layer_101_replay
	this.replay = new lib.sprite78();
	this.replay.name = "replay";
	this.replay.setTransform(1045.1,650.1,0.9999,0.9999,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.replay).wait(2376));

	// Layer_95_slider_base
	this.instance = new lib.sprite75();
	this.instance.setTransform(600,650,1,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2376));

	// Layer_89_playpau
	this.playpau = new lib.sprite71();
	this.playpau.name = "playpau";
	this.playpau.setTransform(555,650,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.playpau).wait(2376));

	// Layer_65
	this.instance_1 = new lib.text90("synched",0);
	this.instance_1.setTransform(10,0,1.5021,1.5021);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(2376));

	// Mask_Layer_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("Eh8/AyyMAAAhfTMD5/AAAMAAABfTg");
	mask.setTransform(800,325);

	// Masked_Layer_2___1
	this.ani1 = new lib.sprite69();
	this.ani1.name = "ani1";
	this.ani1.setTransform(840,365,1.5021,1.5021);

	var maskedShapeInstanceList = [this.ani1];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.ani1).wait(2376));

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
		{src:"images/vital_op_ref_atlas_1.png", id:"vital_op_ref_atlas_1"},
		{src:"images/vital_op_ref_atlas_2.png", id:"vital_op_ref_atlas_2"},
		{src:"sounds/vital_op_ref1_rrrrr.mp3", id:"vital_op_ref1_rrrrr"}
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