(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"vital_op_air_atlas_1", frames: [[0,1518,1227,448],[0,1007,1290,509],[0,0,1318,1005]]},
		{name:"vital_op_air_atlas_2", frames: [[563,1519,649,113],[1803,1088,169,72],[1871,0,163,102],[780,1359,148,102],[1595,1088,206,79],[1088,666,218,80],[563,1359,215,115],[0,1219,942,138],[0,1079,1154,138],[0,1359,561,138],[0,0,1291,262],[1234,1250,577,138],[0,264,1165,262],[0,1499,561,138],[0,939,1295,138],[0,528,1086,233],[0,763,1316,174],[1234,1390,577,138],[1595,1169,276,53],[780,1463,113,53],[1234,1079,60,60],[1318,666,258,210],[1595,880,242,206],[1297,939,296,309],[1613,546,316,332],[944,1219,288,298],[1613,253,428,291],[1167,264,444,400],[1293,0,576,251]]}
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



(lib.CachedBmp_59 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["vital_op_air_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["vital_op_air_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["vital_op_air_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.image10 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.image12 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.image2 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.image3 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.image59 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.image68 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.image79 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.image84 = function() {
	this.initialize(ss["vital_op_air_atlas_2"]);
	this.gotoAndStop(28);
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
	this.instance = new lib.CachedBmp_59();
	this.instance.setTransform(-22.9,-3.5,0.3335,0.3335);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22.9,-3.5,216.5,37.7);


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
	this.instance = new lib.CachedBmp_58();
	this.instance.setTransform(47.9,-4.1,0.3335,0.3335);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(47.9,-4.1,56.4,24);


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
	this.instance = new lib.CachedBmp_57();
	this.instance.setTransform(46.65,-4.1,0.3335,0.3335);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(46.7,-4.1,54.3,34);


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
	this.instance = new lib.CachedBmp_56();
	this.instance.setTransform(48.9,-4.1,0.3335,0.3335);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(48.9,-4.1,49.4,34);


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
	this.instance = new lib.CachedBmp_55();
	this.instance.setTransform(42.7,-4,0.3335,0.3335);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(42.7,-4,68.7,26.4);


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
	this.instance = new lib.CachedBmp_54();
	this.instance.setTransform(36.8,-2.5,0.3335,0.3335);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(36.8,-2.5,72.7,26.7);


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
	this.instance = new lib.CachedBmp_53();
	this.instance.setTransform(35.3,-4,0.3335,0.3335);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(35.3,-4,71.7,38.4);


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
	this.instance = new lib.CachedBmp_52();
	this.instance.setTransform(-4,-3.35,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.3,354.5,129.4);


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
	this.instance = new lib.CachedBmp_51();
	this.instance.setTransform(-4,-2.8,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-2.8,272.2,39.9);


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
	this.instance = new lib.CachedBmp_50();
	this.instance.setTransform(-4,-3.35,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.3,333.4,39.8);


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
	this.instance = new lib.CachedBmp_49();
	this.instance.setTransform(-4,-3.35,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.3,162.1,39.8);


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
	this.instance = new lib.CachedBmp_48();
	this.instance.setTransform(-4,-3.35,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.3,373,75.7);


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
	this.instance = new lib.CachedBmp_47();
	this.instance.setTransform(-4,-3.35,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.3,166.7,39.8);


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
	this.instance = new lib.CachedBmp_46();
	this.instance.setTransform(-3.75,-2.8,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-2.8,336.59999999999997,75.7);


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
	this.instance = new lib.CachedBmp_45();
	this.instance.setTransform(-4,-3.35,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.3,162.1,39.8);


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
	this.instance = new lib.CachedBmp_44();
	this.instance.setTransform(-3.2,-2.8,0.2888,0.2888);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.2,-2.8,374.09999999999997,39.9);


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
	this.instance = new lib.CachedBmp_43();
	this.instance.setTransform(-4,-3.35,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.3,372.7,147);


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
	this.instance = new lib.CachedBmp_42();
	this.instance.setTransform(-6.95,-3.45,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6.9,-3.4,313.7,67.3);


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
	this.instance = new lib.CachedBmp_41();
	this.instance.setTransform(0,0,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,380.3,50.3);


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
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(-2.8,-2.8,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.8,-2.8,166.70000000000002,39.9);


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
	this.instance = new lib.CachedBmp_39();
	this.instance.setTransform(-3.9,-2.8,0.2889,0.2889);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-2.8,380.79999999999995,290.3);


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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("AR+BpMgkjAAAMAAAggBMAkjAAAgA+YETMA8xAAAIAAaGMg8xAAAg");
	this.shape.setTransform(-3.85,-16.85);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-199.3,-212.3,391,391);


(lib.shape85 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#FFFFFF").s().p("AKNLuIAAhaIFJAAIAABagAhvLVIAAhLIIbAAIAABLgArqLQIAAhLIHRAAIAABLgAzjLQIAAhpIFUAAIAABpgASjBGIAAhyIKFAAIAABygA8ng7IAAjhIIwAAIAADhgAuyo0IAAi5IWpAAIAAC5g");
	this.shape.setTransform(1.425,87.65);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_2
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],28);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.681,0,0,0.681,-196.2,-85.5)).s().p("A+pNXIAA6tMA9TAAAIAAatg")
	}.bind(this);
	this.shape_1.setTransform(-3.025,94.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],27);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.535,0,0,0.525,-118.7,-105.1)).s().p("AyjQbMAAAgg1MAlHAAAMAAAAg1g")
	}.bind(this);
	this.shape_2.setTransform(-5,-107.975);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-199.2,-213,392.4,393);


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

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("ASSQBMgkjAAAMAAAggBMAkjAAAg");
	this.shape.setTransform(-5.825,-108.85);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],27);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.535,0,0,0.525,-118.7,-105.1)).s().p("AyjQbMAAAgg1MAlHAAAMAAAAg1g")
	}.bind(this);
	this.shape_1.setTransform(-5,-107.975);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-123.8,-213,237.6,210.1);


(lib.shape73 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#000000").s().p("AgRARQgHgGAAgLQAAgJAHgIQAHgHAKAAQAKAAAIAHQAHAIAAAJQAAALgHAGQgIAIgKAAQgKAAgHgIg");
	this.shape.setTransform(0.2,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.3,-2.5,5,5);


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

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("AX/VaMgv9AAAMAAAgqzMAv9AAAg");
	this.shape.setTransform(1.15,-16.35);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-153.3,-154.3,309,276);


(lib.shape69 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],26);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-214,-145.5)).s().p("EghbAWvMAAAgtdMBC3AAAMAAAAtdg")
	}.bind(this);
	this.shape.setTransform(10,-8.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-204,-154,428,291);


(lib.shape63 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("ARbnLIAAOXMgi1AAAIAAuXg");
	this.shape.setTransform(11.65,-38.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#000000").ss(2,0,0,3).p("ARbG4Mgi1AAAIAAtvMAi1AAAg");
	this.shape_1.setTransform(12.65,62.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-100.8,-85.5,226,193);


(lib.shape61 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#FFFFFF").s().p("A0QEVIAAopMAohAAAIAAIpg");
	this.shape.setTransform(9.425,-115.75);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-120.3,-143.5,259.5,55.5);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],25);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.819,0,0,0.819,-118,-122.1)).s().p("AybTFMAAAgmJMAk3AAAMAAAAmJg")
	}.bind(this);
	this.shape.setTransform(14,-11);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-104,-133.1,236,244.2);


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

	// Layer_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("APtt+IAAb9I/ZAAIAA79g");
	this.shape.setTransform(115.15,85.15);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#000000").ss(2,0,0,3).p("AD/gxIAA8wIbMAAIAAcwgABfdiMggpAAAIAA7+MAgpAAAgA8Wg7IAA8IIbCAAIAAcIg");
	this.shape_1.setTransform(-5.85,-14.35);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_2
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],22);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(0.868,0,0,0.894,-105,-92.1)).s().p("AwZOZIAA8xMAgzAAAIAAcxg")
	}.bind(this);
	this.shape_2.setTransform(116.525,85.525);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_1
	this.shape_3 = new cjs.Shape();
	var sprImg_shape_3 = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],21);
	sprImg_shape_3.onload = function(){
		this.shape_3.graphics.bf(sprImg_shape_3, null, new cjs.Matrix2D(0.845,0,0,0.884,-108.6,-92.8)).s().p("Aw9OhIAA9BMAh7AAAIAAdBg")
	}.bind(this);
	this.shape_3.setTransform(-100.475,84.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-209.1,-204.3,430.7,381.9);


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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("AfLgxI7MAAIAA8wIbMAAgABfdiMggpAAAIAA7+MAgpAAAgAhUg7I7CAAIAA8IIbCAAg");
	this.shape.setTransform(-5.85,-14.35);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],21);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.845,0,0,0.884,-108.6,-92.8)).s().p("Aw9OhIAA9BMAh7AAAIAAdBg")
	}.bind(this);
	this.shape_1.setTransform(-100.475,84.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-209.1,-204.3,403.79999999999995,381.70000000000005);


(lib.shape5 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(2,0,0,3).p("AdxuXIAAcvI7MAAIAA8vgAiut5IAAcHI7CAAIAA8Hg");
	this.shape.setTransform(3.15,-111.35);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-188.3,-204.3,383,186);


(lib.shape4 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],23);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.586,0,0,0.586,-86.7,-90.5)).s().p("AtiOJIAA8RIbFAAIAAcRg")
	}.bind(this);
	this.shape.setTransform(-99.95,-110.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["vital_op_air_atlas_2"],24);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.554,0,0,0.554,-87.6,-91.9)).s().p("AtrOYIAA8vIbXAAIAAcvg")
	}.bind(this);
	this.shape_1.setTransform(107.025,-111.05);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-186.7,-203,381.4,183.9);


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
	this.instance = new lib.CachedBmp_38();
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
	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(5,12,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_36();
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


(lib.sprite94 = function(mode,startPosition,loop,reversed) {
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
	this.frame_471 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(471).call(this.frame_471).wait(1));

	// Masked_Layer_14___12
	this.instance = new lib.text83("synched",0);
	this.instance.setTransform(-635.1,-178.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(472));

	// Masked_Layer_13___12
	this.instance_1 = new lib.text81("synched",0);
	this.instance_1.setTransform(-636,-213.85);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(472));

	// Layer_11
	this.instance_2 = new lib.shape93("synched",0);
	this.instance_2.setTransform(-26.9,-32.85,0.8663,0.8664,0,0,0,-0.5,-0.5);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(290).to({_off:false},0).wait(182));

	// Layer_10
	this.instance_3 = new lib.text92("synched",0);
	this.instance_3.setTransform(-80.95,-20.2,0.8663,0.8664,0,0,0,-0.5,-0.5);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(290).to({_off:false},0).wait(182));

	// Layer_9
	this.instance_4 = new lib.text91("synched",0);
	this.instance_4.setTransform(-12.45,98.85,0.8663,0.8664,0,0,0,-0.4,0.5);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(290).to({_off:false},0).wait(182));

	// Layer_8
	this.instance_5 = new lib.text90("synched",0);
	this.instance_5.setTransform(-73.55,96.2,0.8663,0.8664,0,0,0,-0.5,0.5);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(290).to({_off:false},0).wait(182));

	// Layer_7
	this.instance_6 = new lib.text89("synched",0);
	this.instance_6.setTransform(-133.35,95.4,0.8663,0.8664,0,0,0,-0.5,0.4);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(290).to({_off:false},0).wait(182));

	// Layer_6
	this.instance_7 = new lib.text88("synched",0);
	this.instance_7.setTransform(-193.5,97.8,0.8663,0.8664,0,0,0,-0.4,0.6);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(290).to({_off:false},0).wait(182));

	// Layer_5
	this.instance_8 = new lib.text87("synched",0);
	this.instance_8.setTransform(43.5,29.35,0.8663,0.8664,0,0,0,0.5,0.5);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(290).to({_off:false},0).wait(182));

	// Layer_4
	this.instance_9 = new lib.text86("synched",0);
	this.instance_9.setTransform(-221.3,19.45,0.8663,0.8664,0,0,0,-0.4,0.4);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(290).to({_off:false},0).wait(182));

	// Layer_3
	this.instance_10 = new lib.shape85("synched",0);
	this.instance_10.setTransform(-26.9,-32.85,0.8663,0.8664,0,0,0,-0.5,-0.5);
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(290).to({_off:false},0).wait(182));

	// Layer_2
	this.instance_11 = new lib.shape80("synched",0);
	this.instance_11.setTransform(-26.9,-32.85,0.8663,0.8664,0,0,0,-0.5,-0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).to({_off:true},290).wait(182));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-640,-217,781,340.6);


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
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_777 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(777).call(this.frame_777).wait(1));

	// Masked_Layer_15___5
	this.instance = new lib.text77("synched",0);
	this.instance.setTransform(-613.35,17.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(778));

	// Masked_Layer_14___5
	this.instance_1 = new lib.shape73("synched",0);
	this.instance_1.setTransform(-620.85,24.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(778));

	// Masked_Layer_13___5
	this.instance_2 = new lib.shape73("synched",0);
	this.instance_2.setTransform(-620.85,0.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(778));

	// Masked_Layer_12___5
	this.instance_3 = new lib.text76("synched",0);
	this.instance_3.setTransform(-614.35,-5.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(778));

	// Masked_Layer_11___5
	this.instance_4 = new lib.text75("synched",0);
	this.instance_4.setTransform(-634,-174.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(778));

	// Masked_Layer_10___5
	this.instance_5 = new lib.text74("synched",0);
	this.instance_5.setTransform(-636,-208.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(778));

	// Masked_Layer_9___5
	this.instance_6 = new lib.shape73("synched",0);
	this.instance_6.setTransform(-620.7,-85.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(778));

	// Masked_Layer_8___5
	this.instance_7 = new lib.shape73("synched",0);
	this.instance_7.setTransform(-620.65,-25.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(778));

	// Masked_Layer_7___5
	this.instance_8 = new lib.text72("synched",0);
	this.instance_8.setTransform(-613.65,-94.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(778));

	// Masked_Layer_6___5
	this.instance_9 = new lib.text71("synched",0);
	this.instance_9.setTransform(-614.35,-31.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(778));

	// Layer_4
	this.instance_10 = new lib.shape70("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(778));

	// Mask_Layer_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("A4DVpMAAAgrRMAwHAAAMAAAArRg");
	mask.setTransform(1.6497,-16.875);

	// Masked_Layer_2___1
	this.instance_11 = new lib.shape69("synched",0);

	var maskedShapeInstanceList = [this.instance_11];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(778));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-640,-211.8,795.7,333.5);


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


(lib.sprite66 = function(mode,startPosition,loop,reversed) {
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
	this.frame_774 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(774).call(this.frame_774).wait(1));

	// Masked_Layer_9___7
	this.instance = new lib.text65("synched",0);
	this.instance.setTransform(-636.75,-213.8,1.0003,1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(775));

	// Masked_Layer_8___7
	this.instance_1 = new lib.text64("synched",0);
	this.instance_1.setTransform(-634.8,-180.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(775));

	// Layer_6
	this.instance_2 = new lib.shape63("synched",0);
	this.instance_2.setTransform(-7.5,-8.85);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(775));

	// Layer_5
	this.instance_3 = new lib.text62("synched",0);
	this.instance_3.setTransform(-142.75,-150.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(775));

	// Layer_4
	this.instance_4 = new lib.shape61("synched",0);
	this.instance_4.setTransform(-7.5,-8.85);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(775));

	// Mask_Layer_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AxaPAIAA9/MAi1AAAIAAd/g");
	mask.setTransform(5.15,2.65);

	// Masked_Layer_2___1
	this.instance_5 = new lib.shape60("synched",0);
	this.instance_5.setTransform(-7.5,-8.85);

	var maskedShapeInstanceList = [this.instance_5];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(775));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-639.9,-216.6,804,315.3);


(lib.sprite14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {"checking of breather cap ":760,precaution:1146};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		/* stopAllSounds ();
		*/
	}
	this.frame_753 = function() {
		//this.gotoAndPlay(761);
	}
	this.frame_1274 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(753).call(this.frame_753).wait(521).call(this.frame_1274).wait(1));

	// Masked_Layer_8___6
	this.instance = new lib.text9("synched",0);
	this.instance.setTransform(-637.2,-213.15);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1275));

	// Masked_Layer_7___6
	this.instance_1 = new lib.text8("synched",0);
	this.instance_1.setTransform(-633.35,-181.2,1.0001,1);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1275));

	// Layer_5
	this.instance_2 = new lib.shape13("synched",0);
	this.instance_2.setTransform(-18.2,-35.3,0.8823,0.8822,0,0,0,-0.5,-0.4);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1146).to({_off:false},0).wait(129));

	// Layer_4
	this.instance_3 = new lib.shape11("synched",0);
	this.instance_3.setTransform(-18.2,-35.3,0.8823,0.8822,0,0,0,-0.5,-0.4);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(760).to({_off:false},0).to({_off:true},386).wait(129));

	// Layer_3
	this.instance_4 = new lib.shape5("synched",0);
	this.instance_4.setTransform(-18.2,-35.3,0.8823,0.8822,0,0,0,-0.5,-0.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({_off:true},760).wait(515));

	// Layer_2
	this.instance_5 = new lib.shape4("synched",0);
	this.instance_5.setTransform(-18.2,-35.3,0.8823,0.8822,0,0,0,-0.5,-0.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1275));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-640,-215.9,817.8,337.7);


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
(lib.vital_op_air = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {p1:0,p2:1275,p3:2050,p4:2828};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,1,1273,1274,1275,1276,2048,2049,2050,2051,2826,2827,2828,2829,2831,3295];
	this.streamSoundSymbolsList[1] = [{id:"vital_op_air1",startFrame:1,endFrame:1274,loop:1,offset:0}];
	this.streamSoundSymbolsList[1276] = [{id:"vital_op_air2",startFrame:1276,endFrame:2049,loop:1,offset:0}];
	this.streamSoundSymbolsList[2051] = [{id:"vital_op_air3",startFrame:2051,endFrame:2827,loop:1,offset:0}];
	this.streamSoundSymbolsList[2829] = [{id:"vital_op_air4_rrrrr",startFrame:2829,endFrame:2831,loop:1,offset:0}];
	this.streamSoundSymbolsList[2831] = [{id:"vital_op_air4_rrrrr",startFrame:2831,endFrame:3296,loop:1,offset:280}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		InitPage(4);
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
		var soundInstance = playSound("vital_op_air1",0);
		this.InsertIntoSoundStreamData(soundInstance,1,1274,1);
	}
	this.frame_1273 = function() {
		this.stop();
	}
	this.frame_1274 = function() {
		this.stop();
	}
	this.frame_1275 = function() {
		Prev(1);
		InitAnim();
	}
	this.frame_1276 = function() {
		var soundInstance = playSound("vital_op_air2",0);
		this.InsertIntoSoundStreamData(soundInstance,1276,2049,1);
	}
	this.frame_2048 = function() {
		this.stop();
	}
	this.frame_2049 = function() {
		this.stop();
	}
	this.frame_2050 = function() {
		Next(1);
		InitAnim();
	}
	this.frame_2051 = function() {
		var soundInstance = playSound("vital_op_air3",0);
		this.InsertIntoSoundStreamData(soundInstance,2051,2827,1);
	}
	this.frame_2826 = function() {
		this.stop();
	}
	this.frame_2827 = function() {
		this.stop();
	}
	this.frame_2828 = function() {
		Next(0);
		InitAnim();
	}
	this.frame_2829 = function() {
		var soundInstance = playSound("vital_op_air4_rrrrr",0);
		this.InsertIntoSoundStreamData(soundInstance,2829,2831,1);
	}
	this.frame_2831 = function() {
		var soundInstance = playSound("vital_op_air4_rrrrr",0,280);
		this.InsertIntoSoundStreamData(soundInstance,2831,3296,1,280);
	}
	this.frame_3295 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1272).call(this.frame_1273).wait(1).call(this.frame_1274).wait(1).call(this.frame_1275).wait(1).call(this.frame_1276).wait(772).call(this.frame_2048).wait(1).call(this.frame_2049).wait(1).call(this.frame_2050).wait(1).call(this.frame_2051).wait(775).call(this.frame_2826).wait(1).call(this.frame_2827).wait(1).call(this.frame_2828).wait(1).call(this.frame_2829).wait(2).call(this.frame_2831).wait(464).call(this.frame_3295).wait(1));

	// Layer_20
	this.instance = new lib.text16("synched",0);
	this.instance.setTransform(10,0,1.7305,1.7305);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(3296));

	// Layer_126_page
	this.page = new cjs.Text("Page number", "italic bold 15px 'Arial'", "#FF9900");
	this.page.name = "page";
	this.page.lineHeight = 17;
	this.page.lineWidth = 193;
	this.page.parent = this;
	this.page.setTransform(23,658,1.4989,1.4989);

	this.timeline.addTween(cjs.Tween.get(this.page).wait(3296));

	// Layer_122_back
	this.back = new lib.button99();
	this.back.name = "back";
	this.back.setTransform(350,645,1.0001,1.0002);
	new cjs.ButtonHelper(this.back, 0, 1, 2, false, new lib.button99(), 3);

	this.timeline.addTween(cjs.Tween.get(this.back).wait(3296));

	// Layer_116_next
	this.next = new lib.button94();
	this.next.name = "next";
	this.next.setTransform(1496.1,5.1,0.9998,0.9999,0,0,0,0.1,0.1);
	new cjs.ButtonHelper(this.next, 0, 1, 2, false, new lib.button94(), 3);

	this.timeline.addTween(cjs.Tween.get(this.next).wait(3296));

	// Layer_111_previous
	this.previous = new lib.button87();
	this.previous.name = "previous";
	this.previous.setTransform(1432,5,1.0003,0.9993);
	new cjs.ButtonHelper(this.previous, 0, 1, 2, false, new lib.button87(), 3);

	this.timeline.addTween(cjs.Tween.get(this.previous).wait(3296));

	// Layer_108_slider
	this.slider = new lib.sprite822();
	this.slider.name = "slider";
	this.slider.setTransform(610.1,670.1,0.9937,0.9983,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.slider).wait(3296));

	// Layer_101_replay
	this.replay = new lib.sprite782();
	this.replay.name = "replay";
	this.replay.setTransform(1045.1,650.1,0.9999,0.9999,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.replay).wait(3296));

	// Layer_95_slider_base
	this.instance_1 = new lib.sprite75();
	this.instance_1.setTransform(600,650,1,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(3296));

	// Layer_89_playpau
	this.playpau = new lib.sprite71();
	this.playpau.name = "playpau";
	this.playpau.setTransform(555,650,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.playpau).wait(3296));

	// Mask_Layer_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("Eh8/AyyMAAAhfTMD5/AAAMAAABfTg");
	mask.setTransform(800,325);

	// Masked_Layer_2___1
	this.ani1 = new lib.sprite14();
	this.ani1.name = "ani1";
	this.ani1.setTransform(1130,433,1.7305,1.7305);

	this.ani2 = new lib.sprite66();
	this.ani2.name = "ani2";
	this.ani2.setTransform(1130,433,1.7305,1.7305);

	this.ani3 = new lib.sprite78();
	this.ani3.name = "ani3";
	this.ani3.setTransform(1130,426,1.7305,1.7305);

	this.ani4 = new lib.sprite94();
	this.ani4.name = "ani4";
	this.ani4.setTransform(1130,433,1.7305,1.7305);

	var maskedShapeInstanceList = [this.ani1,this.ani2,this.ani3,this.ani4];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.ani1}]}).to({state:[{t:this.ani2}]},1275).to({state:[{t:this.ani3}]},775).to({state:[{t:this.ani4}]},778).wait(468));

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
		{src:"images/vital_op_air_atlas_1.png", id:"vital_op_air_atlas_1"},
		{src:"images/vital_op_air_atlas_2.png", id:"vital_op_air_atlas_2"},
		{src:"sounds/vital_op_air1.mp3", id:"vital_op_air1"},
		{src:"sounds/vital_op_air2.mp3", id:"vital_op_air2"},
		{src:"sounds/vital_op_air3.mp3", id:"vital_op_air3"},
		{src:"sounds/vital_op_air4_rrrrr.mp3", id:"vital_op_air4_rrrrr"}
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