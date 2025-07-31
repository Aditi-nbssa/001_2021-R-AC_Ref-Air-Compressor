(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"vital_maint_ref_atlas_1", frames: [[0,606,1226,388],[0,0,1228,604],[0,1333,1186,335],[0,1670,1221,281],[0,996,1212,335]]},
		{name:"vital_maint_ref_atlas_2", frames: [[0,566,1209,245],[0,1042,1234,227],[0,0,1201,281],[735,1729,1206,173],[0,1729,733,288],[0,1500,1212,227],[0,813,1235,227],[0,283,1199,281],[0,1271,1230,227]]},
		{name:"vital_maint_ref_atlas_3", frames: [[0,1148,948,113],[0,1740,1027,66],[1027,1270,736,120],[1236,1392,473,165],[1649,1632,397,165],[342,834,513,218],[1236,1559,411,165],[0,1672,1112,66],[1103,350,94,120],[1922,712,94,120],[0,503,1179,120],[950,1148,836,120],[0,0,1203,173],[0,175,1197,173],[274,1392,672,120],[342,712,1100,120],[0,350,1101,151],[274,1270,751,120],[1215,976,760,120],[342,625,276,53],[620,625,113,53],[735,625,60,60],[948,1392,286,278],[1205,0,580,312],[1114,1726,282,204],[1444,712,476,262],[0,1263,272,334],[1635,314,386,396],[1199,314,434,396],[1787,0,218,292],[1788,1098,188,254],[1711,1392,312,238],[857,834,356,312],[0,625,340,389]]}
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



(lib.CachedBmp_36 = function() {
	this.initialize(ss["vital_maint_ref_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["vital_maint_ref_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["vital_maint_ref_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["vital_maint_ref_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["vital_maint_ref_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["vital_maint_ref_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["vital_maint_ref_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["vital_maint_ref_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["vital_maint_ref_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["vital_maint_ref_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["vital_maint_ref_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["vital_maint_ref_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["vital_maint_ref_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["vital_maint_ref_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.image11 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.image114 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.image119 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.image125 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.image127 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.image13 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.image2 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.image59 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.image65 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.image69 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.image76 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.image79 = function() {
	this.initialize(ss["vital_maint_ref_atlas_3"]);
	this.gotoAndStop(33);
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


(lib.text130 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.8,-3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.8,-3,408.1,129.2);


(lib.text129 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-2.75,-3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.7,-3,315.5,37.6);


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
	this.instance = new lib.CachedBmp_34();
	this.instance.setTransform(-3.6,-3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-3,402.40000000000003,81.6);


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
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(-2.85,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.8,-2.9,341.8,22);


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
	this.instance = new lib.CachedBmp_32();
	this.instance.setTransform(-3.6,-3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-3,408.8,201.1);


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
	this.instance = new lib.CachedBmp_31();
	this.instance.setTransform(-3.4,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,245,40);


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
	this.instance = new lib.CachedBmp_30();
	this.instance.setTransform(-18.35,-4.2,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-18.3,-4.2,157.4,54.900000000000006);


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
	this.instance.setTransform(-2.95,-3.2,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.9,-3.2,132.1,54.900000000000006);


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
	this.instance.setTransform(-3.6,-1.2,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-1.2,170.79999999999998,72.60000000000001);


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
	this.instance = new lib.CachedBmp_27();
	this.instance.setTransform(-3.65,-3.2,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-3.2,136.79999999999998,54.900000000000006);


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
	this.instance = new lib.CachedBmp_26();
	this.instance.setTransform(-3.8,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.8,-2.9,410.8,75.60000000000001);


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
	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(-3.65,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-2.9,370.1,22);


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
	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(-3.5,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-2.9,31.3,40);


(lib.text84 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-2.3,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.3,-2.9,31.3,40);


(lib.text83 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.2,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.2,-2.9,392.5,40);


(lib.text82 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.75,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,394.7,111.5);


(lib.text81 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-2.85,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.8,-2.9,278.2,40);


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
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(-1.6,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.6,-2.9,400.40000000000003,57.6);


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
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(-1.45,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.4,-2.9,398.4,57.6);


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
	this.instance.setTransform(-0.75,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.7,-2.9,223.7,40);


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
	this.instance.setTransform(-1.7,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.7,-2.9,399.8,93.60000000000001);


(lib.text71 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-1.75,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.7,-2.9,401.4,57.6);


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
	this.instance = new lib.CachedBmp_14();
	this.instance.setTransform(-3.95,-3,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-3,244,95.9);


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
	this.instance.setTransform(-3.75,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,403.4,75.60000000000001);


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
	this.instance.setTransform(-2.4,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.4,-2.9,406.4,93.60000000000001);


(lib.text62 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-3.4,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.4,-2.9,411.09999999999997,75.60000000000001);


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
	this.instance = new lib.CachedBmp_10();
	this.instance.setTransform(-2.85,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.8,-2.9,366.1,40);


(lib.text37 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(0,0,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,366.5,50.3);


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
	this.instance = new lib.CachedBmp_8();
	this.instance.setTransform(-3.7,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,403.4,111.5);


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
	this.instance = new lib.CachedBmp_7();
	this.instance.setTransform(-3.7,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.9,399.09999999999997,93.60000000000001);


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
	this.instance = new lib.CachedBmp_6();
	this.instance.setTransform(-3.25,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.2,-2.9,249.89999999999998,40);


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
	this.instance = new lib.CachedBmp_5();
	this.instance.setTransform(-3.6,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-2.9,409.40000000000003,75.60000000000001);


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
	this.instance = new lib.CachedBmp_4();
	this.instance.setTransform(-2.9,-2.9,0.3329,0.3329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.9,-2.9,253,40);


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

	// Layer_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,0,0,3).p("AW7CzMgt1AAAIAAllMAt1AAAg");
	this.shape.setTransform(-42.85,158.475);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(230,230,230,0.702)").s().p("A26CzIAAllMAt0AAAIAAFlg");
	this.shape_1.setTransform(-42.85,158.475);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_2
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FF0000").ss(1,0,0,3).p("AB0jeIA5AgIgahYIhYAXIA5AhIkjH5");
	this.shape_2.setTransform(-76.202,-0.4537);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FF0000").s().p("AAAAMIg4ggIBXgXIAaBXg");
	this.shape_3.setTransform(-64.625,-23.975);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// Layer_1
	this.shape_4 = new cjs.Shape();
	var sprImg_shape_4 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],26);
	sprImg_shape_4.onload = function(){
		this.shape_4.graphics.bf(sprImg_shape_4, null, new cjs.Matrix2D(1.196,0,0,1.196,-162.6,-199.7)).s().p("A5ZfNMAAAg+ZMAyzAAAMAAAA+Zg")
	}.bind(this);
	this.shape_4.setTransform(-35.45,-6.225);

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-198.1,-205.9,325.3,399.4);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],25);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.671,0,0,1,-159.6,-131)).s().p("A48UeMAAAgo7MAx4AAAMAAAAo7g")
	}.bind(this);
	this.shape.setTransform(-20.95,-36.85);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-180.6,-167.8,319.29999999999995,262);


(lib.shape120 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],24);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.424,0,0,1.424,-200.8,-145.3)).s().p("A/XWtMAAAgtZMA+vAAAMAAAAtZg")
	}.bind(this);
	this.shape.setTransform(-17.25,-57.075);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-218,-202.3,401.6,290.5);


(lib.shape117 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#FF0000").ss(3,0,0,3).p("A6Uu3Ig3AAIAAA8A7Ls/IAAA8A2ku3Ig8AAA1JuaIAAgdIgfAAA1JsiIAAg8A4cu3Ig8AAA2gqJIA8AAA4YqJIA8AAA6QqJIA8AAA7LrHIAAA8A1JqqIAAg8AbMKOIAAg8Ig8AAAW8KqIAAA8AXcJSIggAAIAAAcAZUJSIg8AAAYWO4IA8AAAW8OaIAAAeIAeAAAW8MiIAAA8AbMN+IAAg8AaOO4IA8AAAbMMGIAAg8");
	this.shape.setTransform(37.8,-26.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-137.7,-123.4,351,193.3);


(lib.shape116 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#FF0000").ss(3,0,0,3).p("ACGiyIg8AAACIg8IAAg8AiHhYIAAA8AhpiyIgeAAIAAAeAAOiyIg7AAAgrCzIA7AAAiHCXIAAAcIAgAAAiHAfIAAA8ACIA7IAAg7ABMCzIA8AAIAAg8");
	this.shape.setTransform(198.2,50.45);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(3,0,0,3).p("AiJiVIg3AAIAAA8AjAgdIAAA7ABmiVIg8AAADBh4IAAgdIgfAAADBAAIAAg8AgRiVIg8AAABqCXIA8AAAgNCXIA7AAAiFCXIA8AAAjABaIAAA8ADBB3IAAg8");
	this.shape_1.setTransform(-116.875,-106.9);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-137.7,-123.4,351,193.3);


(lib.shape115 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],23);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.769,0,0,0.769,-223,-120)).s().p("Egi1ASwMAAAglfMBFrAAAMAAAAlfg")
	}.bind(this);
	this.shape.setTransform(0.025,-0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-223,-120,446.1,240);


(lib.shape112 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#FF0000").ss(2,0,0,3).p("AMcDfI43AAIAAm9IY3AAg");
	this.shape.setTransform(1.925,-84.15);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.651)").s().p("AsbDfIAAm9IY3AAIAAG9g");
	this.shape_1.setTransform(1.925,-84.15);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78.6,-107.4,161.1,46.60000000000001);


(lib.shape108g = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#00FF00").s().p("AAIAXIgPAAIgbAJIAjhAIAiBBg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999);


(lib.shape107 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#00FF00").s().p("Ak8aJQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAk+YlQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlAXBQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlCVdQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlET5QgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlGSVQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlIQxQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlKPNQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlMNpQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlOMFQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlQKhQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlSI9QgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlUHZQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlWF1QgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlYERQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlaCtQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlcBJQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlegaQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlgh+QgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlijiQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlklGQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlmmqQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlooOQgMgLAAgRQAAgQAMgMQAMgMAQAAQARAAALAMQAMAMAAAQQAAARgMALQgLAMgRAAQgQAAgMgMgAlqpyQgLgLAAgRQAAgQALgMQAMgMARAAQAQAAAMAMQAMAMAAAQQAAARgMALQgMAMgQAAQgRAAgMgMgAlsrWQgLgLAAgRQAAgQALgMQAMgMARAAQAQAAAMAMQAMAMAAAQQAAARgMALQgMAMgQAAQgRAAgMgMgAlts6QgLgLAAgRQAAgQALgMQAMgMARAAQAQAAAMAMQAMAMAAAQQAAARgMALQgMAMgQAAQgRAAgMgMgAlvueQgLgLAAgRQAAgQALgMQAMgMARAAQAQAAAMAMQAMAMAAAQQAAARgMALQgMAMgQAAQgRAAgMgMgAlwwCQgLgLAAgRQAAgQALgMQAMgMARAAQAQAAAMAMQAMAMAAAQQAAARgMALQgMAMgQAAQgRAAgMgMgAlyxmQgLgLAAgRQAAgQALgMQAMgMARAAQAQAAAMAMQAMAMAAAQQAAARgMALQgMAMgQAAQgRAAgMgMgAD6y0QgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMgACWy0QgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMgAAyy0QgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMgAgxy0QgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAAKALQAMAMAAARQAAAQgMAMQgKAMgRAAQgQAAgMgMgAiVy0QgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMgAj5y0QgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMgAldy0QgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMgAE60kQgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMgAE62IQgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMgAE63sQgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMgAE65QQgMgMAAgQQAAgRAMgMQAMgLAQAAQARAAALALQAMAMAAARQAAAQgMAMQgLAMgRAAQgQAAgMgMg");
	this.shape.setTransform(-101.025,1.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-139.2,-167.3,76.39999999999999,337);


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
	this.shape.graphics.f().s("#FF0000").ss(2,0,0,3).p("AKuDfI1cAAIAAm9IVcAAg");
	this.shape.setTransform(-40.95,76.65);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.651)").s().p("AquDfIAAm9IVdAAIAAG9g");
	this.shape_1.setTransform(-40.95,76.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-110.6,53.4,139.29999999999998,46.6);


(lib.shape103 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#FF0000").ss(1,0,0,3).p("AhdDkIglgQIAVA0IA0gTIgkgRIDknw");
	this.shape.setTransform(76.071,76.8639);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("AgjgZIAjAQIAkAQIgzATg");
	this.shape_1.setTransform(66.625,100.675);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(62,49,28.599999999999994,55.3);


(lib.shape101 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#FF0000").ss(2,0,0,3).p("ALLkqIAAJVI2VAAIAApVg");
	this.shape.setTransform(159.025,18.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.651)").s().p("ArKErIAApVIWVAAIAAJVg");
	this.shape_1.setTransform(159.025,18.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(86.5,-12.8,145.1,61.8);


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
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF00FF").ss(8,0,0,3).p("ACbhxIAdz7AghVjQgniGCQAaIFSAiQDvhFikiOQmmhToJghQhwg2AYhz");
	this.shape.setTransform(114.4294,-42.6788);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF00FF").ss(8,0,0,3).p("AlejHIAApEIAOg9IH0gUQDEgrgJjcACwRlIgOr0");
	this.shape_1.setTransform(94.8219,58.2743);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(55.3,-185.6,118.3,360.4);


(lib.shape92 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#FF0000").ss(1,0,0,3).p("AjUHMIglgRIAVA1IA0gTIgkgRIHSu/");
	this.shape.setTransform(100.9687,-80.6158);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("AgjgZIAjAQIAkAQIgzATg");
	this.shape_1.setTransform(79.625,-33.675);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(75,-131.6,52.400000000000006,101.6);


(lib.shape90 = function(mode,startPosition,loop,reversed) {
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
	this.shape_1.graphics.f().s("#FF0000").ss(1,0,0,3).p("AAAjpIAoAAAAAjpIAAHYAgnjpIAnAA");
	this.shape_1.setTransform(0,11.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF0000").s().p("AAAATIgnAAIAnglIAoAlg");
	this.shape_2.setTransform(0,-14.35);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5,-17.3,10,53.3);


(lib.shape88 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#FF0000").ss(2,0,0,3).p("ApVi2ISrAAIAAFtIyrAAg");
	this.shape.setTransform(169.775,-151.125);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.651)").s().p("ApVC3IAAltISrAAIAAFtg");
	this.shape_1.setTransform(169.775,-151.125);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(109,-170.4,121.6,38.599999999999994);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],33);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-170,-194.5)).s().p("A6jeZMAAAg8xMA1HAAAMAAAA8xg")
	}.bind(this);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-170,-194.5,340,389);


(lib.shape77 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],32);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.281,0,0,1.281,-228,-200.3)).s().p("EAjoAfKIAAv0IqUAAIAAgCIl3AAIAABCIgCAAIAAO0MgmnAAAIAAv2IkyAAIAAACIiuAAIAAgCIjsAAIAAACIlQAAMAAAgufMBHRAAAMAAAA+Tg")
	}.bind(this);
	this.shape.setTransform(0,0.45);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-228,-198.9,456.1,398.8);


(lib.shape70 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#FF0000").ss(3,0,0,3).p("AZGFgQqZCSutAAQusAAqaiSQqZiRAAjPQAAjOKZiSQKaiROsAAQOtAAKZCRQKaCSAADOQAADPqaCRg");
	this.shape.setTransform(-3.9,-61);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],31);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(1.407,0,0,1.407,-219.5,-167.5)).s().p("EgiSAaLMAAAg0VMBElAAAMAAAA0Vg")
	}.bind(this);
	this.shape_1.setTransform(0,-0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-232.5,-167.5,457.3,335);


(lib.shape66 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#FF0000").ss(1,0,0,3).p("AB0jeIA5AgIgahYIhYAXIA5AhIkjH5");
	this.shape.setTransform(-76.202,-0.4537);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("AAAAMIg4ggIBXgXIAaBXg");
	this.shape_1.setTransform(-64.625,-23.975);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_2
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#000000").ss(1,0,0,3).p("ASRHYMgkhAAAIAAuuMAkhAAAg");
	this.shape_2.setTransform(-116.55,66.85);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("rgba(230,230,230,0.702)").s().p("AyQHYIAAuuMAkhAAAIAAOug");
	this.shape_3.setTransform(-116.55,66.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// Layer_1
	this.shape_4 = new cjs.Shape();
	var sprImg_shape_4 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],30);
	sprImg_shape_4.onload = function(){
		this.shape_4.graphics.bf(sprImg_shape_4, null, new cjs.Matrix2D(1.596,0,0,1.596,-150,-202.7)).s().p("A3bfrMAAAg/VMAu3AAAMAAAA/Vg")
	}.bind(this);
	this.shape_4.setTransform(49.95,-2.325);

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-234.4,-205,434.4,405.4);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],29);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.327,0,0,1.327,-144.7,-193.8)).s().p("A2meSMAAAg8jMAtNAAAMAAAA8jg")
	}.bind(this);
	this.shape.setTransform(12.3,-1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-132.4,-194.8,289.4,387.6);


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

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(4,0,0,3).p("AnFAnIOMhN");
	this.shape.setTransform(49.35,84.425);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],27);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(1.054,0,0,1.054,-203.3,-208.6)).s().p("EgfwAgmMAAAhBLMA/hAAAMAAABBLg")
	}.bind(this);
	this.shape_1.setTransform(-3.675,-2.65);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-207,-211.2,406.7,417.2);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],22);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.473,0,0,1.473,-210.7,-204.8)).s().p("Egg6AgAMAAAg//MBB1AAAMAAAA//g")
	}.bind(this);
	this.shape.setTransform(-3.65,-5.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-214.3,-209.9,421.4,409.6);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_maint_ref_atlas_3"],28);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-217,-198)).s().p("Egh5Ae8MAAAg93MBDzAAAMAAAA93g")
	}.bind(this);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-217,-198,434,396);


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
	this.frame_794 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_796 = function() {
		//this.gotoAndPlay(805);
	}
	this.frame_1859 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(794).call(this.frame_794).wait(2).call(this.frame_796).wait(1063).call(this.frame_1859).wait(1));

	// Masked_Layer_11___7
	this.instance = new lib.text124("synched",0);
	this.instance.setTransform(-720.85,53.35);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},1265).wait(595));

	// Masked_Layer_10___7
	this.instance_1 = new lib.text123("synched",0);
	this.instance_1.setTransform(-722.1,31.15);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:true},1265).wait(595));

	// Masked_Layer_9___7
	this.instance_2 = new lib.text122("synched",0);
	this.instance_2.setTransform(-720.85,-171.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({_off:true},1265).wait(595));

	// Masked_Layer_8___7
	this.instance_3 = new lib.text121("synched",0);
	this.instance_3.setTransform(-721.1,-194.05);

	this.instance_4 = new lib.text130("synched",0);
	this.instance_4.setTransform(-720,-191.45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3}]}).to({state:[{t:this.instance_4}]},1265).wait(595));

	// Layer_6
	this.instance_5 = new lib.text129("synched",0);
	this.instance_5.setTransform(-159.95,137.45);
	this.instance_5.alpha = 0;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(810).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(1036));

	// Layer_5
	this.instance_6 = new lib.shape128("synched",0);
	this.instance_6.setTransform(23.4,-13.25);
	this.instance_6.alpha = 0;
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(810).to({_off:false},0).to({alpha:0.9297},13).wait(1).to({alpha:1},0).wait(1036));

	// Layer_2
	this.instance_7 = new lib.shape126("synched",0);
	this.instance_7.setTransform(14.85,98.25,0.7616,0.7616);
	this.instance_7.alpha = 0;
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(238).to({_off:false},0).to({alpha:0.9414},15).wait(1).to({alpha:1},0).wait(556).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(1035));

	// Layer_1
	this.instance_8 = new lib.shape120("synched",0);
	this.instance_8.setTransform(11.45,-15.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(810).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(1035));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-724.9,-219.2,919.9,399.5);


(lib.sprite109g = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.shape108g("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sprite109g, new cjs.Rectangle(-3.5,-3.3,7,6.699999999999999), null);


(lib.sprite91 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.shape90("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sprite91, new cjs.Rectangle(-5,-17.3,10,53.3), null);


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

	// timeline functions:
	this.frame_1082 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(1082).call(this.frame_1082).wait(1));

	// Masked_Layer_8___3
	this.instance = new lib.text75("synched",0);
	this.instance.setTransform(-721.2,-144.85);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1083));

	// Masked_Layer_7___3
	this.instance_1 = new lib.text74("synched",0);
	this.instance_1.setTransform(-720.2,49.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1083));

	// Masked_Layer_6___3
	this.instance_2 = new lib.text73("synched",0);
	this.instance_2.setTransform(-724.2,26.15);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1083));

	// Masked_Layer_5___3
	this.instance_3 = new lib.text72("synched",0);
	this.instance_3.setTransform(-720.2,-91.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1083));

	// Masked_Layer_4___3
	this.instance_4 = new lib.text71("synched",0);
	this.instance_4.setTransform(-720.2,-194.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1083));

	// Layer_3
	this.instance_5 = new lib.shape77("synched",0);
	this.instance_5.setTransform(-2.55,-22.5);
	this.instance_5.alpha = 0;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(759).to({_off:false},0).to({alpha:0.9414},16).wait(1).to({alpha:1},0).wait(307));

	// Layer_2
	this.instance_6 = new lib.shape70("synched",0);
	this.instance_6.setTransform(1.35,-32.85);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(759).to({startPosition:0},0).to({alpha:0},17).to({_off:true},1).wait(306));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-724.9,-221.4,951,398.8);


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


(lib.sprite68 = function(mode,startPosition,loop,reversed) {
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
	this.frame_434 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_439 = function() {
		//this.gotoAndPlay(445);
	}
	this.frame_751 = function() {
		//this.gotoAndPlay(760);
	}
	this.frame_1281 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(434).call(this.frame_434).wait(5).call(this.frame_439).wait(312).call(this.frame_751).wait(530).call(this.frame_1281).wait(1));

	// Masked_Layer_10___6
	this.instance = new lib.text64("synched",0);
	this.instance.setTransform(-721.1,-94.85);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1282));

	// Masked_Layer_9___6
	this.instance_1 = new lib.text63("synched",0);
	this.instance_1.setTransform(-722.1,-5.85);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1282));

	// Masked_Layer_8___6
	this.instance_2 = new lib.text62("synched",0);
	this.instance_2.setTransform(-721.1,-185.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1282));

	// Masked_Layer_7___6
	this.instance_3 = new lib.text61("synched",0);
	this.instance_3.setTransform(-722.1,-221.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1282));

	// Layer_5
	this.instance_4 = new lib.text67("synched",0);
	this.instance_4.setTransform(-216.8,12.6);
	this.instance_4.alpha = 0;
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(449).to({_off:false},0).to({alpha:0.9492},18).wait(1).to({alpha:1},0).wait(814));

	// Layer_4
	this.instance_5 = new lib.shape66("synched",0);
	this.instance_5.setTransform(1.05,-17.25);
	this.instance_5.alpha = 0;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(449).to({_off:false},0).to({alpha:0.9492},18).wait(1).to({alpha:1},0).wait(814));

	// Layer_1
	this.instance_6 = new lib.shape60("synched",0);
	this.instance_6.setTransform(1.05,-17.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(449).to({startPosition:0},0).to({alpha:0},19).to({_off:true},1).wait(813));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-724.9,-223.9,926,407.1);


(lib.sprite15 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1437 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(1437).call(this.frame_1437).wait(1));

	// Masked_Layer_8___3
	this.instance = new lib.text10("synched",0);
	this.instance.setTransform(-720.7,-74.45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1438));

	// Masked_Layer_7___3
	this.instance_1 = new lib.text9("synched",0);
	this.instance_1.setTransform(-719.7,57.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1438));

	// Masked_Layer_6___3
	this.instance_2 = new lib.text8("synched",0);
	this.instance_2.setTransform(-721.7,-192.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1438));

	// Masked_Layer_5___3
	this.instance_3 = new lib.text7("synched",0);
	this.instance_3.setTransform(-720.7,-165.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1438));

	// Masked_Layer_4___3
	this.instance_4 = new lib.text5("synched",0);
	this.instance_4.setTransform(-721.7,-221.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1438));

	// Layer_1
	this.instance_5 = new lib.shape3("synched",0);
	this.instance_5.setTransform(-0.95,-14.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).to({_off:true},860).wait(578));

	// Layer_10
	this.instance_6 = new lib.shape12("synched",0);
	this.instance_6.setTransform(-0.95,-14.6);
	this.instance_6.alpha = 0;
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(845).to({_off:false},0).to({alpha:0.9297},14).wait(1).to({alpha:1},0).to({_off:true},185).wait(393));

	// Layer_2
	this.instance_7 = new lib.shape14("synched",0);
	this.instance_7.setTransform(3.7,-21.85);
	this.instance_7.alpha = 0;
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(1045).to({_off:false},0).to({alpha:0.8789},14).wait(1).to({alpha:0.9414},0).wait(378));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-724.9,-233.1,941,418.2);


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


(lib.sprite118 = function(mode,startPosition,loop,reversed) {
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
	this.frame_714 = function() {
		//this.gotoAndPlay(720);
	}
	this.frame_1157 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(714).call(this.frame_714).wait(443).call(this.frame_1157).wait(1));

	// Masked_Layer_15___8
	this.instance = new lib.text87("synched",0);
	this.instance.setTransform(-720.1,25.45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1158));

	// Masked_Layer_14___8
	this.instance_1 = new lib.text86("synched",0);
	this.instance_1.setTransform(-720.1,-1.55);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1158));

	// Masked_Layer_13___8
	this.instance_2 = new lib.text85("synched",0);
	this.instance_2.setTransform(-721.1,-135.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1158));

	// Masked_Layer_12___8
	this.instance_3 = new lib.text84("synched",0);
	this.instance_3.setTransform(-722.1,-166.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1158));

	// Masked_Layer_11___8
	this.instance_4 = new lib.text83("synched",0);
	this.instance_4.setTransform(-708.6,-166.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1158));

	// Masked_Layer_10___8
	this.instance_5 = new lib.text82("synched",0);
	this.instance_5.setTransform(-707.6,-135.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1158));

	// Masked_Layer_9___8
	this.instance_6 = new lib.text81("synched",0);
	this.instance_6.setTransform(-722.1,-194.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1158));

	// Layer_22
	this.instance_7 = new lib.sprite91();
	this.instance_7.setTransform(-115.65,-87.25,0.9989,0.9989,-125.2894);

	this.instance_8 = new lib.shape116("synched",0);
	this.instance_8.setTransform(8.1,-19.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_7}]},313).to({state:[]},5).to({state:[{t:this.instance_7}]},5).to({state:[]},5).to({state:[{t:this.instance_7}]},5).to({state:[]},388).to({state:[{t:this.instance_8}]},33).to({state:[]},7).to({state:[{t:this.instance_8}]},6).to({state:[]},6).wait(385));

	// Layer_21
	this.instance_9 = new lib.text113("synched",0);
	this.instance_9.setTransform(-62.6,-119.35);

	this.instance_10 = new lib.shape117("synched",0);
	this.instance_10.setTransform(8.1,-19.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_9}]},313).to({state:[]},5).to({state:[{t:this.instance_9}]},5).to({state:[]},5).to({state:[{t:this.instance_9}]},5).to({state:[]},388).to({state:[{t:this.instance_10}]},59).wait(378));

	// Layer_20
	this.instance_11 = new lib.shape112("synched",0);
	this.instance_11.setTransform(-3.95,-18.3);

	this.instance_12 = new lib.shape115("synched",0);
	this.instance_12.setTransform(8.1,-19.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_11}]},313).to({state:[]},5).to({state:[{t:this.instance_11}]},5).to({state:[]},5).to({state:[{t:this.instance_11}]},5).to({state:[{t:this.instance_12}]},388).wait(437));

	// Mask_Layer_15 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_254 = new cjs.Graphics().p("AiVBpIAAjRIErAAIAADRg");
	var mask_graphics_255 = new cjs.Graphics().p("AiVDSIAAmjIErAAIAAGjg");
	var mask_graphics_256 = new cjs.Graphics().p("AiVE6IAApzIErAAIAAJzg");
	var mask_graphics_257 = new cjs.Graphics().p("AiVGjIAAtFIErAAIAANFg");
	var mask_graphics_258 = new cjs.Graphics().p("AiVIMIAAwXIErAAIAAQXg");
	var mask_graphics_259 = new cjs.Graphics().p("AiVJ0IAAznIErAAIAATng");
	var mask_graphics_260 = new cjs.Graphics().p("AiVLdIAA25IErAAIAAW5g");
	var mask_graphics_261 = new cjs.Graphics().p("AiVNGIAA6LIErAAIAAaLg");
	var mask_graphics_262 = new cjs.Graphics().p("AiVOuIAA9bIErAAIAAdbg");
	var mask_graphics_263 = new cjs.Graphics().p("AiVQXMAAAggtIErAAMAAAAgtg");
	var mask_graphics_264 = new cjs.Graphics().p("AiVSAMAAAgj/IErAAMAAAAj/g");
	var mask_graphics_265 = new cjs.Graphics().p("AiVToMAAAgnPIErAAMAAAAnPg");
	var mask_graphics_266 = new cjs.Graphics().p("AiVVRMAAAgqhIErAAMAAAAqhg");
	var mask_graphics_267 = new cjs.Graphics().p("AiVW6MAAAgtzIErAAMAAAAtzg");
	var mask_graphics_268 = new cjs.Graphics().p("AiVYiMAAAgxDIErAAMAAAAxDg");
	var mask_graphics_269 = new cjs.Graphics().p("AiVaLMAAAg0VIErAAMAAAA0Vg");
	var mask_graphics_270 = new cjs.Graphics().p("AiVaLMAAAg0VIErAAMAAAA0Vg");
	var mask_graphics_271 = new cjs.Graphics().p("AiVaLMAAAg0VIErAAMAAAA0Vg");
	var mask_graphics_272 = new cjs.Graphics().p("AjRaLMAAAg0VIGjAAMAAAA0Vg");
	var mask_graphics_273 = new cjs.Graphics().p("AkNaLMAAAg0VIIbAAMAAAA0Vg");
	var mask_graphics_274 = new cjs.Graphics().p("AlJaLMAAAg0VIKTAAMAAAA0Vg");
	var mask_graphics_275 = new cjs.Graphics().p("AmFaLMAAAg0VIMLAAMAAAA0Vg");
	var mask_graphics_276 = new cjs.Graphics().p("AnBaLMAAAg0VIODAAMAAAA0Vg");
	var mask_graphics_277 = new cjs.Graphics().p("An9aLMAAAg0VIP7AAMAAAA0Vg");
	var mask_graphics_278 = new cjs.Graphics().p("An9aLMAAAg0VIP7AAMAAAA0Vg");
	var mask_graphics_279 = new cjs.Graphics().p("An9aLMAAAg0VIP7AAMAAAA0Vg");
	var mask_graphics_280 = new cjs.Graphics().p("AoBbGMAAAg2LIQDAAMAAAA2Lg");
	var mask_graphics_281 = new cjs.Graphics().p("AoGcBMAAAg4BIQNAAMAAAA4Bg");
	var mask_graphics_282 = new cjs.Graphics().p("AoKc9MAAAg55IQVAAMAAAA55g");
	var mask_graphics_283 = new cjs.Graphics().p("AoOd4MAAAg7vIQdAAMAAAA7vg");
	var mask_graphics_284 = new cjs.Graphics().p("AoSezMAAAg9mIQlAAMAAAA9mg");
	var mask_graphics_285 = new cjs.Graphics().p("AoXfvMAAAg/dIQvAAMAAAA/dg");
	var mask_graphics_286 = new cjs.Graphics().p("EgIbAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_287 = new cjs.Graphics().p("EgIbAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_288 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_721 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_722 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_723 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_724 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_725 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_726 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_727 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_728 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_729 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_730 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_731 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_732 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_733 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");
	var mask_graphics_734 = new cjs.Graphics().p("EgLtAgqMAAAhBTIQ3AAMAAABBTg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(254).to({graphics:mask_graphics_254,x:-135,y:171.6}).wait(1).to({graphics:mask_graphics_255,x:-135,y:161.125}).wait(1).to({graphics:mask_graphics_256,x:-135,y:150.675}).wait(1).to({graphics:mask_graphics_257,x:-135,y:140.2}).wait(1).to({graphics:mask_graphics_258,x:-135,y:129.725}).wait(1).to({graphics:mask_graphics_259,x:-135,y:119.275}).wait(1).to({graphics:mask_graphics_260,x:-135,y:108.8}).wait(1).to({graphics:mask_graphics_261,x:-135,y:98.325}).wait(1).to({graphics:mask_graphics_262,x:-135,y:87.875}).wait(1).to({graphics:mask_graphics_263,x:-135,y:77.4}).wait(1).to({graphics:mask_graphics_264,x:-135,y:66.925}).wait(1).to({graphics:mask_graphics_265,x:-135,y:56.475}).wait(1).to({graphics:mask_graphics_266,x:-135,y:46}).wait(1).to({graphics:mask_graphics_267,x:-135,y:35.525}).wait(1).to({graphics:mask_graphics_268,x:-135,y:25.075}).wait(1).to({graphics:mask_graphics_269,x:-135,y:14.6}).wait(1).to({graphics:mask_graphics_270,x:-135.0162,y:14.5912}).wait(1).to({graphics:mask_graphics_271,x:-135,y:14.6}).wait(1).to({graphics:mask_graphics_272,x:-129,y:14.6}).wait(1).to({graphics:mask_graphics_273,x:-123,y:14.6}).wait(1).to({graphics:mask_graphics_274,x:-117,y:14.6}).wait(1).to({graphics:mask_graphics_275,x:-111.05,y:14.6}).wait(1).to({graphics:mask_graphics_276,x:-105.05,y:14.6}).wait(1).to({graphics:mask_graphics_277,x:-99.05,y:14.6}).wait(1).to({graphics:mask_graphics_278,x:-99.0662,y:14.5912}).wait(1).to({graphics:mask_graphics_279,x:-99.05,y:14.6}).wait(1).to({graphics:mask_graphics_280,x:-98.625,y:8.675}).wait(1).to({graphics:mask_graphics_281,x:-98.175,y:2.75}).wait(1).to({graphics:mask_graphics_282,x:-97.75,y:-3.175}).wait(1).to({graphics:mask_graphics_283,x:-97.3,y:-9.125}).wait(1).to({graphics:mask_graphics_284,x:-96.875,y:-15.05}).wait(1).to({graphics:mask_graphics_285,x:-96.425,y:-20.975}).wait(1).to({graphics:mask_graphics_286,x:-96,y:-26.9}).wait(1).to({graphics:mask_graphics_287,x:-96.0003,y:-26.9001}).wait(1).to({graphics:mask_graphics_288,x:-75,y:-26.9}).wait(433).to({graphics:mask_graphics_721,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_722,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_723,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_724,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_725,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_726,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_727,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_728,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_729,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_730,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_731,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_732,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_733,x:-75,y:-26.9}).wait(1).to({graphics:mask_graphics_734,x:-75,y:-26.9}).wait(424));

	// Masked_Layer_17___15
	this.instance_13 = new lib.sprite109g();
	this.instance_13.setTransform(-70.95,-198.4,4.0714,4.0714);
	this.instance_13._off = true;

	var maskedShapeInstanceList = [this.instance_13];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(254).to({_off:false},0).wait(467).to({alpha:0},13).to({_off:true},1).wait(423));

	// Masked_Layer_16___15
	this.instance_14 = new lib.shape107("synched",0);
	this.instance_14.setTransform(-3.95,-18.3);
	this.instance_14._off = true;

	var maskedShapeInstanceList = [this.instance_14];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(254).to({_off:false},0).wait(467).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_13
	this.instance_15 = new lib.sprite91();
	this.instance_15.setTransform(-116.3,113.8,0.9989,0.9989,-155.2905);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(205).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(1).to({scaleX:0.9977,scaleY:0.9977,rotation:-155.4159},0).wait(494).to({scaleX:0.9989,scaleY:0.9989,rotation:-155.2905},1).to({scaleX:0.9977,scaleY:0.9977,rotation:-155.4159,alpha:0.9219},1).to({scaleX:0.9989,scaleY:0.9989,rotation:-155.2905,alpha:0},12).to({_off:true},1).wait(423));

	// Layer_12
	this.instance_16 = new lib.text105("synched",0);
	this.instance_16.setTransform(-107.55,41.45);
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(205).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(496).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_11
	this.instance_17 = new lib.shape104("synched",0);
	this.instance_17.setTransform(-3.95,-18.3);
	this.instance_17._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(205).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(496).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_10
	this.instance_18 = new lib.shape103("synched",0);
	this.instance_18.setTransform(3.05,-69.3);
	this.instance_18._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(155).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(545).to({startPosition:0},0).to({x:-3.95,y:-18.3},1).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_9
	this.instance_19 = new lib.text102("synched",0);
	this.instance_19.setTransform(95.1,-78.85);
	this.instance_19._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(155).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(545).to({startPosition:0},0).to({x:88.1,y:-27.85},1).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_8
	this.instance_20 = new lib.shape101("synched",0);
	this.instance_20.setTransform(3.05,-69.3);
	this.instance_20._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(155).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(545).to({startPosition:0},0).to({x:-3.95,y:-18.3},1).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_7
	this.instance_21 = new lib.shape92("synched",0);
	this.instance_21.setTransform(-3.95,-18.3);
	this.instance_21._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(44).to({_off:false},0).wait(677).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_6
	this.instance_22 = new lib.text89("synched",0);
	this.instance_22.setTransform(110.6,-184.85);
	this.instance_22._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(44).to({_off:false},0).wait(677).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_5
	this.instance_23 = new lib.shape88("synched",0);
	this.instance_23.setTransform(-3.95,-18.3);
	this.instance_23._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(44).to({_off:false},0).wait(677).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_4
	this.instance_24 = new lib.sprite91();
	this.instance_24.setTransform(80.85,-64.2,0.9989,0.9989,-155.2905);
	this.instance_24._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(24).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(1119));

	// Layer_3
	this.instance_25 = new lib.text89("synched",0);
	this.instance_25.setTransform(110.6,-184.85);
	this.instance_25._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(24).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(1119));

	// Mask_Layer_2 (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_74 = new cjs.Graphics().p("AjFBfIAAi9IGKAAIAAC9g");
	var mask_1_graphics_75 = new cjs.Graphics().p("AjFB9IAAj5IGKAAIAAD5g");
	var mask_1_graphics_76 = new cjs.Graphics().p("AjFCaIAAkzIGKAAIAAEzg");
	var mask_1_graphics_77 = new cjs.Graphics().p("AjFC4IAAlvIGKAAIAAFvg");
	var mask_1_graphics_78 = new cjs.Graphics().p("AjFDVIAAmpIGKAAIAAGpg");
	var mask_1_graphics_79 = new cjs.Graphics().p("AjFDyIAAnjIGKAAIAAHjg");
	var mask_1_graphics_80 = new cjs.Graphics().p("AjFEQIAAofIGKAAIAAIfg");
	var mask_1_graphics_81 = new cjs.Graphics().p("AjFEtIAApZIGKAAIAAJZg");
	var mask_1_graphics_82 = new cjs.Graphics().p("AjFFLIAAqVIGKAAIAAKVg");
	var mask_1_graphics_83 = new cjs.Graphics().p("AjFFoIAArPIGKAAIAALPg");
	var mask_1_graphics_84 = new cjs.Graphics().p("AjFGGIAAsLIGKAAIAAMLg");
	var mask_1_graphics_85 = new cjs.Graphics().p("AjFGjIAAtGIGKAAIAANGg");
	var mask_1_graphics_86 = new cjs.Graphics().p("AjFHBIAAuBIGKAAIAAOBg");
	var mask_1_graphics_87 = new cjs.Graphics().p("AjFHeIAAu8IGKAAIAAO8g");
	var mask_1_graphics_88 = new cjs.Graphics().p("AjFH8IAAv3IGKAAIAAP3g");
	var mask_1_graphics_89 = new cjs.Graphics().p("AjFIZIAAwxIGKAAIAAQxg");
	var mask_1_graphics_90 = new cjs.Graphics().p("AjFI3IAAxtIGKAAIAARtg");
	var mask_1_graphics_91 = new cjs.Graphics().p("AjFJUIAAynIGKAAIAASng");
	var mask_1_graphics_92 = new cjs.Graphics().p("AjFJyIAAzjIGKAAIAATjg");
	var mask_1_graphics_93 = new cjs.Graphics().p("AjFKPIAA0dIGKAAIAAUdg");
	var mask_1_graphics_94 = new cjs.Graphics().p("AjEKPIAA0dIGJAAIAAUdg");
	var mask_1_graphics_95 = new cjs.Graphics().p("AjFKPIAA0dIGKAAIAAUdg");
	var mask_1_graphics_96 = new cjs.Graphics().p("AjqKPIAA0dIHUAAIAAUdg");
	var mask_1_graphics_97 = new cjs.Graphics().p("AkOKPIAA0dIIdAAIAAUdg");
	var mask_1_graphics_98 = new cjs.Graphics().p("AkzKPIAA0dIJnAAIAAUdg");
	var mask_1_graphics_99 = new cjs.Graphics().p("AlYKPIAA0dIKxAAIAAUdg");
	var mask_1_graphics_100 = new cjs.Graphics().p("Al9KPIAA0dIL7AAIAAUdg");
	var mask_1_graphics_101 = new cjs.Graphics().p("AmiKPIAA0dINFAAIAAUdg");
	var mask_1_graphics_102 = new cjs.Graphics().p("AnHKPIAA0dIOPAAIAAUdg");
	var mask_1_graphics_103 = new cjs.Graphics().p("AnHKPIAA0dIOPAAIAAUdg");
	var mask_1_graphics_104 = new cjs.Graphics().p("AnHKPIAA0dIOPAAIAAUdg");
	var mask_1_graphics_105 = new cjs.Graphics().p("AnHKoIAA1PIOPAAIAAVPg");
	var mask_1_graphics_106 = new cjs.Graphics().p("AnHLBIAA2BIOPAAIAAWBg");
	var mask_1_graphics_107 = new cjs.Graphics().p("AnHLaIAA2zIOPAAIAAWzg");
	var mask_1_graphics_108 = new cjs.Graphics().p("AnHLzIAA3lIOPAAIAAXlg");
	var mask_1_graphics_109 = new cjs.Graphics().p("AnHMMIAA4XIOPAAIAAYXg");
	var mask_1_graphics_110 = new cjs.Graphics().p("AnHMlIAA5JIOPAAIAAZJg");
	var mask_1_graphics_111 = new cjs.Graphics().p("AgMOoIAA5JIOOAAIAAZJg");
	var mask_1_graphics_112 = new cjs.Graphics().p("AnHMlIAA5JIOPAAIAAZJg");
	var mask_1_graphics_113 = new cjs.Graphics().p("An1MrIAA5UIPrAAIAAZUg");
	var mask_1_graphics_114 = new cjs.Graphics().p("AojMwIAA5fIRHAAIAAZfg");
	var mask_1_graphics_115 = new cjs.Graphics().p("ApRM2IAA5rISjAAIAAZrg");
	var mask_1_graphics_116 = new cjs.Graphics().p("Ap/M8IAA53IT/AAIAAZ3g");
	var mask_1_graphics_117 = new cjs.Graphics().p("AqtNCIAA6DIVbAAIAAaDg");
	var mask_1_graphics_118 = new cjs.Graphics().p("ArbNIIAA6PIW3AAIAAaPg");
	var mask_1_graphics_119 = new cjs.Graphics().p("AsJNNIAA6ZIYTAAIAAaZg");
	var mask_1_graphics_120 = new cjs.Graphics().p("AsJNNIAA6ZIYTAAIAAaZg");
	var mask_1_graphics_121 = new cjs.Graphics().p("AsJNNIAA6ZIYTAAIAAaZg");
	var mask_1_graphics_122 = new cjs.Graphics().p("AsHOtIAA9aIYPAAIAAdag");
	var mask_1_graphics_123 = new cjs.Graphics().p("AsFQNMAAAggZIYKAAMAAAAgZg");
	var mask_1_graphics_124 = new cjs.Graphics().p("AsCRuMAAAgjbIYFAAMAAAAjbg");
	var mask_1_graphics_125 = new cjs.Graphics().p("AsATOMAAAgmbIYBAAMAAAAmbg");
	var mask_1_graphics_126 = new cjs.Graphics().p("Ar+UuMAAAgpbIX9AAMAAAApbg");
	var mask_1_graphics_127 = new cjs.Graphics().p("Ar8WOMAAAgsbIX5AAMAAAAsbg");
	var mask_1_graphics_128 = new cjs.Graphics().p("Ar6XuMAAAgvbIX1AAMAAAAvbg");
	var mask_1_graphics_129 = new cjs.Graphics().p("Ar4ZOMAAAgybIXwAAMAAAAybg");
	var mask_1_graphics_130 = new cjs.Graphics().p("Ar1auMAAAg1bIXrAAMAAAA1bg");
	var mask_1_graphics_131 = new cjs.Graphics().p("ArzcOMAAAg4bIXnAAMAAAA4bg");
	var mask_1_graphics_132 = new cjs.Graphics().p("ArxduMAAAg7bIXjAAMAAAA7bg");
	var mask_1_graphics_133 = new cjs.Graphics().p("ArvfOMAAAg+bIXfAAMAAAA+bg");
	var mask_1_graphics_134 = new cjs.Graphics().p("ArvfOMAAAg+bIXfAAMAAAA+bg");
	var mask_1_graphics_135 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_721 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_722 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_723 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_724 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_725 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_726 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_727 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_728 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_729 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_730 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_731 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_732 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_733 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");
	var mask_1_graphics_734 = new cjs.Graphics().p("ApvfPMAAAg+dIXeAAMAAAA+dg");

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:null,x:0,y:0}).wait(74).to({graphics:mask_1_graphics_74,x:108.25,y:177.6}).wait(1).to({graphics:mask_1_graphics_75,x:108.25,y:174.65}).wait(1).to({graphics:mask_1_graphics_76,x:108.25,y:171.7}).wait(1).to({graphics:mask_1_graphics_77,x:108.25,y:168.75}).wait(1).to({graphics:mask_1_graphics_78,x:108.25,y:165.8}).wait(1).to({graphics:mask_1_graphics_79,x:108.25,y:162.875}).wait(1).to({graphics:mask_1_graphics_80,x:108.25,y:159.925}).wait(1).to({graphics:mask_1_graphics_81,x:108.25,y:156.975}).wait(1).to({graphics:mask_1_graphics_82,x:108.25,y:154.025}).wait(1).to({graphics:mask_1_graphics_83,x:108.25,y:151.075}).wait(1).to({graphics:mask_1_graphics_84,x:108.25,y:148.15}).wait(1).to({graphics:mask_1_graphics_85,x:108.25,y:145.2}).wait(1).to({graphics:mask_1_graphics_86,x:108.25,y:142.25}).wait(1).to({graphics:mask_1_graphics_87,x:108.25,y:139.3}).wait(1).to({graphics:mask_1_graphics_88,x:108.25,y:136.35}).wait(1).to({graphics:mask_1_graphics_89,x:108.25,y:133.425}).wait(1).to({graphics:mask_1_graphics_90,x:108.25,y:130.475}).wait(1).to({graphics:mask_1_graphics_91,x:108.25,y:127.525}).wait(1).to({graphics:mask_1_graphics_92,x:108.25,y:124.575}).wait(1).to({graphics:mask_1_graphics_93,x:108.25,y:121.625}).wait(1).to({graphics:mask_1_graphics_94,x:108.2408,y:121.6161}).wait(1).to({graphics:mask_1_graphics_95,x:108.25,y:121.625}).wait(1).to({graphics:mask_1_graphics_96,x:111.95,y:121.625}).wait(1).to({graphics:mask_1_graphics_97,x:115.625,y:121.625}).wait(1).to({graphics:mask_1_graphics_98,x:119.325,y:121.625}).wait(1).to({graphics:mask_1_graphics_99,x:123,y:121.625}).wait(1).to({graphics:mask_1_graphics_100,x:126.7,y:121.625}).wait(1).to({graphics:mask_1_graphics_101,x:130.375,y:121.625}).wait(1).to({graphics:mask_1_graphics_102,x:134.075,y:121.625}).wait(1).to({graphics:mask_1_graphics_103,x:134.0779,y:121.6161}).wait(1).to({graphics:mask_1_graphics_104,x:134.075,y:121.625}).wait(1).to({graphics:mask_1_graphics_105,x:134.075,y:119.125}).wait(1).to({graphics:mask_1_graphics_106,x:134.075,y:116.625}).wait(1).to({graphics:mask_1_graphics_107,x:134.075,y:114.15}).wait(1).to({graphics:mask_1_graphics_108,x:134.075,y:111.625}).wait(1).to({graphics:mask_1_graphics_109,x:134.075,y:109.125}).wait(1).to({graphics:mask_1_graphics_110,x:134.075,y:106.625}).wait(1).to({graphics:mask_1_graphics_111,x:89.8183,y:93.556}).wait(1).to({graphics:mask_1_graphics_112,x:134.075,y:106.625}).wait(1).to({graphics:mask_1_graphics_113,x:129.275,y:106.05}).wait(1).to({graphics:mask_1_graphics_114,x:124.475,y:105.475}).wait(1).to({graphics:mask_1_graphics_115,x:119.675,y:104.9}).wait(1).to({graphics:mask_1_graphics_116,x:114.85,y:104.325}).wait(1).to({graphics:mask_1_graphics_117,x:110.05,y:103.75}).wait(1).to({graphics:mask_1_graphics_118,x:105.25,y:103.175}).wait(1).to({graphics:mask_1_graphics_119,x:100.45,y:102.6}).wait(1).to({graphics:mask_1_graphics_120,x:100.4391,y:102.6176}).wait(1).to({graphics:mask_1_graphics_121,x:100.45,y:102.6}).wait(1).to({graphics:mask_1_graphics_122,x:100.475,y:93}).wait(1).to({graphics:mask_1_graphics_123,x:100.5,y:83.4}).wait(1).to({graphics:mask_1_graphics_124,x:100.525,y:73.825}).wait(1).to({graphics:mask_1_graphics_125,x:100.525,y:64.225}).wait(1).to({graphics:mask_1_graphics_126,x:100.55,y:54.625}).wait(1).to({graphics:mask_1_graphics_127,x:100.6,y:45.025}).wait(1).to({graphics:mask_1_graphics_128,x:100.625,y:35.4}).wait(1).to({graphics:mask_1_graphics_129,x:100.65,y:25.8}).wait(1).to({graphics:mask_1_graphics_130,x:100.675,y:16.225}).wait(1).to({graphics:mask_1_graphics_131,x:100.675,y:6.625}).wait(1).to({graphics:mask_1_graphics_132,x:100.7,y:-2.975}).wait(1).to({graphics:mask_1_graphics_133,x:100.725,y:-12.575}).wait(1).to({graphics:mask_1_graphics_134,x:100.7051,y:-12.569}).wait(1).to({graphics:mask_1_graphics_135,x:87.9396,y:-12.6235}).wait(586).to({graphics:mask_1_graphics_721,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_722,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_723,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_724,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_725,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_726,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_727,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_728,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_729,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_730,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_731,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_732,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_733,x:87.9396,y:-12.6235}).wait(1).to({graphics:mask_1_graphics_734,x:87.9396,y:-12.6235}).wait(424));

	// Masked_Layer_3___2
	this.instance_26 = new lib.shape94("synched",0);
	this.instance_26.setTransform(-3.95,-18.3);
	this.instance_26._off = true;

	var maskedShapeInstanceList = [this.instance_26];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_1;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(74).to({_off:false},0).wait(647).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(423));

	// Layer_2
	this.instance_27 = new lib.shape88("synched",0);
	this.instance_27.setTransform(-3.95,-18.3);
	this.instance_27._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(24).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(1119));

	// Layer_1
	this.instance_28 = new lib.shape80("synched",0);
	this.instance_28.setTransform(-3.95,-18.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_28).wait(721).to({startPosition:0},0).to({alpha:0},13).to({_off:true},1).wait(423));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-724.9,-212.8,987.2,389);


// stage content:
(lib.vital_maint_ref = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {p1:0,p2:1434,p3:2716,p4:3799,p5:4960};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,1,1432,1433,1434,1435,1881,2714,2715,2716,2717,3797,3798,3799,3800,4958,4959,4960,4961,5767,6819];
	this.streamSoundSymbolsList[1] = [{id:"vital_maint_ref1_rrrrr",startFrame:1,endFrame:1432,loop:1,offset:200}];
	this.streamSoundSymbolsList[1435] = [{id:"vital_maint_ref2",startFrame:1435,endFrame:1879,loop:1,offset:0}];
	this.streamSoundSymbolsList[1881] = [{id:"vital_maint_ref2_2",startFrame:1881,endFrame:2713,loop:1,offset:0}];
	this.streamSoundSymbolsList[2717] = [{id:"vital_maint_ref3",startFrame:2717,endFrame:3798,loop:1,offset:0}];
	this.streamSoundSymbolsList[3800] = [{id:"vital_maint_ref4",startFrame:3800,endFrame:4959,loop:1,offset:0}];
	this.streamSoundSymbolsList[4961] = [{id:"vital_maint_ref5",startFrame:4961,endFrame:5762,loop:1,offset:0}];
	this.streamSoundSymbolsList[5767] = [{id:"vital_maint_ref5_2",startFrame:5767,endFrame:6818,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		InitPage(5);
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
		var soundInstance = playSound("vital_maint_ref1_rrrrr",0,200);
		this.InsertIntoSoundStreamData(soundInstance,1,1432,1,200);
	}
	this.frame_1432 = function() {
		this.stop();
	}
	this.frame_1433 = function() {
		this.stop();
	}
	this.frame_1434 = function() {
		Prev(1);
		InitAnim();
	}
	this.frame_1435 = function() {
		var soundInstance = playSound("vital_maint_ref2",0);
		this.InsertIntoSoundStreamData(soundInstance,1435,1879,1);
	}
	this.frame_1881 = function() {
		var soundInstance = playSound("vital_maint_ref2_2",0);
		this.InsertIntoSoundStreamData(soundInstance,1881,2713,1);
	}
	this.frame_2714 = function() {
		this.stop();
	}
	this.frame_2715 = function() {
		this.stop();
	}
	this.frame_2716 = function() {
		InitAnim();
	}
	this.frame_2717 = function() {
		var soundInstance = playSound("vital_maint_ref3",0);
		this.InsertIntoSoundStreamData(soundInstance,2717,3798,1);
	}
	this.frame_3797 = function() {
		this.stop();
	}
	this.frame_3798 = function() {
		this.stop();
	}
	this.frame_3799 = function() {
		Next(1);
		InitAnim();
	}
	this.frame_3800 = function() {
		var soundInstance = playSound("vital_maint_ref4",0);
		this.InsertIntoSoundStreamData(soundInstance,3800,4959,1);
	}
	this.frame_4958 = function() {
		this.stop();
	}
	this.frame_4959 = function() {
		this.stop();
	}
	this.frame_4960 = function() {
		Next(0);
		InitAnim();
	}
	this.frame_4961 = function() {
		var soundInstance = playSound("vital_maint_ref5",0);
		this.InsertIntoSoundStreamData(soundInstance,4961,5762,1);
	}
	this.frame_5767 = function() {
		var soundInstance = playSound("vital_maint_ref5_2",0);
		this.InsertIntoSoundStreamData(soundInstance,5767,6818,1);
	}
	this.frame_6819 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1431).call(this.frame_1432).wait(1).call(this.frame_1433).wait(1).call(this.frame_1434).wait(1).call(this.frame_1435).wait(446).call(this.frame_1881).wait(833).call(this.frame_2714).wait(1).call(this.frame_2715).wait(1).call(this.frame_2716).wait(1).call(this.frame_2717).wait(1080).call(this.frame_3797).wait(1).call(this.frame_3798).wait(1).call(this.frame_3799).wait(1).call(this.frame_3800).wait(1158).call(this.frame_4958).wait(1).call(this.frame_4959).wait(1).call(this.frame_4960).wait(1).call(this.frame_4961).wait(806).call(this.frame_5767).wait(1052).call(this.frame_6819).wait(1));

	// Layer_126_page
	this.page = new cjs.Text("Page number", "italic bold 15px 'Arial'", "#FF9900");
	this.page.name = "page";
	this.page.lineHeight = 17;
	this.page.lineWidth = 193;
	this.page.parent = this;
	this.page.setTransform(23,658,1.4989,1.4989);

	this.timeline.addTween(cjs.Tween.get(this.page).wait(6820));

	// Layer_122_back
	this.back = new lib.button99();
	this.back.name = "back";
	this.back.setTransform(350,645,1.0001,1.0002);
	new cjs.ButtonHelper(this.back, 0, 1, 2, false, new lib.button99(), 3);

	this.timeline.addTween(cjs.Tween.get(this.back).wait(6820));

	// Layer_116_next
	this.next = new lib.button94();
	this.next.name = "next";
	this.next.setTransform(1496.1,5.1,0.9998,0.9999,0,0,0,0.1,0.1);
	new cjs.ButtonHelper(this.next, 0, 1, 2, false, new lib.button94(), 3);

	this.timeline.addTween(cjs.Tween.get(this.next).wait(6820));

	// Layer_111_previous
	this.previous = new lib.button87();
	this.previous.name = "previous";
	this.previous.setTransform(1432,5,1.0003,0.9993);
	new cjs.ButtonHelper(this.previous, 0, 1, 2, false, new lib.button87(), 3);

	this.timeline.addTween(cjs.Tween.get(this.previous).wait(6820));

	// Layer_108_slider
	this.slider = new lib.sprite822();
	this.slider.name = "slider";
	this.slider.setTransform(610.1,670.1,0.9937,0.9983,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.slider).wait(6820));

	// Layer_101_replay
	this.replay = new lib.sprite782();
	this.replay.name = "replay";
	this.replay.setTransform(1045.1,650.1,0.9999,0.9999,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.replay).wait(6820));

	// Layer_95_slider_base
	this.instance = new lib.sprite75();
	this.instance.setTransform(600,650,1,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(6820));

	// Layer_89_playpau
	this.playpau = new lib.sprite71();
	this.playpau.name = "playpau";
	this.playpau.setTransform(555,650,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.playpau).wait(6820));

	// Layer_52
	this.instance_1 = new lib.text37("synched",0);
	this.instance_1.setTransform(10,0,1.5021,1.5021);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(6820));

	// Mask_Layer_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("Eh8/AyyMAAAhfTMD5/AAAMAAABfTg");
	mask.setTransform(800,325);

	// Masked_Layer_2___1
	this.ani1 = new lib.sprite15();
	this.ani1.name = "ani1";
	this.ani1.setTransform(1120,385,1.5021,1.5021);

	this.ani2 = new lib.sprite68();
	this.ani2.name = "ani2";
	this.ani2.setTransform(1120,385,1.5021,1.5021);

	this.ani3 = new lib.sprite78();
	this.ani3.name = "ani3";
	this.ani3.setTransform(1120,385,1.5021,1.5021);

	this.ani4 = new lib.sprite118();
	this.ani4.name = "ani4";
	this.ani4.setTransform(1120,385,1.5021,1.5021);

	this.ani5 = new lib.sprite131();
	this.ani5.name = "ani5";
	this.ani5.setTransform(1120,385,1.5021,1.5021);

	var maskedShapeInstanceList = [this.ani1,this.ani2,this.ani3,this.ani4,this.ani5];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.ani1}]}).to({state:[{t:this.ani2}]},1434).to({state:[{t:this.ani3}]},1282).to({state:[{t:this.ani4}]},1083).to({state:[{t:this.ani5}]},1161).wait(1860));

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
		{src:"images/vital_maint_ref_atlas_1.png", id:"vital_maint_ref_atlas_1"},
		{src:"images/vital_maint_ref_atlas_2.png", id:"vital_maint_ref_atlas_2"},
		{src:"images/vital_maint_ref_atlas_3.png", id:"vital_maint_ref_atlas_3"},
		{src:"sounds/vital_maint_ref1_rrrrr.mp3", id:"vital_maint_ref1_rrrrr"},
		{src:"sounds/vital_maint_ref2.mp3", id:"vital_maint_ref2"},
		{src:"sounds/vital_maint_ref2_2.mp3", id:"vital_maint_ref2_2"},
		{src:"sounds/vital_maint_ref3.mp3", id:"vital_maint_ref3"},
		{src:"sounds/vital_maint_ref4.mp3", id:"vital_maint_ref4"},
		{src:"sounds/vital_maint_ref5.mp3", id:"vital_maint_ref5"},
		{src:"sounds/vital_maint_ref5_2.mp3", id:"vital_maint_ref5_2"}
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