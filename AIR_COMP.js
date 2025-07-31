(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"AIR_COMP_atlas_1", frames: [[0,0,1267,1091]]},
		{name:"AIR_COMP_atlas_2", frames: [[0,0,1198,1091]]},
		{name:"AIR_COMP_atlas_3", frames: [[0,0,1222,1034],[0,1036,1209,977]]},
		{name:"AIR_COMP_atlas_4", frames: [[0,923,1218,921],[0,0,1240,921]]},
		{name:"AIR_COMP_atlas_5", frames: [[0,0,1236,864],[0,866,1214,864]]},
		{name:"AIR_COMP_atlas_6", frames: [[0,1128,1236,694],[0,0,912,1126]]},
		{name:"AIR_COMP_atlas_7", frames: [[0,256,1179,126],[0,128,1198,126],[1028,727,643,126],[0,0,1199,126],[0,512,656,161],[1514,961,386,126],[1203,1126,267,92],[322,675,276,92],[897,1172,246,92],[1472,1183,222,92],[271,1165,374,92],[0,1173,235,92],[647,1165,248,92],[687,1071,182,92],[1514,1089,403,92],[271,1071,414,92],[322,943,573,126],[0,384,1137,126],[1028,512,94,70],[1028,584,91,70],[322,855,918,86],[1242,855,270,269],[0,949,269,222],[1028,656,113,53],[1975,357,60,60],[1813,357,160,181],[1181,341,352,360],[0,675,320,272],[1535,357,276,368],[1813,540,176,145],[1673,727,320,232],[1637,0,364,355],[897,943,304,227],[658,512,368,252],[1201,0,434,339]]},
		{name:"AIR_COMP_atlas_8", frames: [[0,525,1200,467],[0,994,1218,296],[0,0,1208,523],[0,1810,1216,126],[0,1292,517,516],[1049,1292,424,372],[1218,1666,436,349],[1475,952,432,352],[1210,0,448,416],[519,1292,528,499],[1202,525,464,425]]}
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



(lib.CachedBmp_143 = function() {
	this.initialize(ss["AIR_COMP_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_142 = function() {
	this.initialize(ss["AIR_COMP_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_141 = function() {
	this.initialize(ss["AIR_COMP_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_140 = function() {
	this.initialize(ss["AIR_COMP_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_139 = function() {
	this.initialize(ss["AIR_COMP_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_138 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_137 = function() {
	this.initialize(ss["AIR_COMP_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_136 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_135 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_134 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_133 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_132 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_131 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_130 = function() {
	this.initialize(ss["AIR_COMP_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_129 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_128 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_127 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_126 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_125 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_124 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_123 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_122 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_121 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_120 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_119 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_118 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_117 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_116 = function() {
	this.initialize(ss["AIR_COMP_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_115 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_114 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_113 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_112 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_111 = function() {
	this.initialize(ss["AIR_COMP_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_110 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_109 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_108 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_107 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_106 = function() {
	this.initialize(ss["AIR_COMP_atlas_6"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_105 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_104 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.image107 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.image111 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.image115 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.image124 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.image129 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.image137 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.image152 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.image158 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.image161 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.image165 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.image174 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.image184 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.image185 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.image2 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.image80 = function() {
	this.initialize(ss["AIR_COMP_atlas_8"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.image89 = function() {
	this.initialize(ss["AIR_COMP_atlas_7"]);
	this.gotoAndStop(34);
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


(lib.text188 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_143();
	this.instance.setTransform(0,0,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,399.7,344.2);


(lib.text177 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_142();
	this.instance.setTransform(0,0,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,384.3,290.6);


(lib.text168 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_141();
	this.instance.setTransform(0,0,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,385.5,326.2);


(lib.text155 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_140();
	this.instance.setTransform(0,0,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,377.9,344.2);


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
	this.instance = new lib.CachedBmp_139();
	this.instance.setTransform(0,0,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,389.9,272.6);


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
	this.instance = new lib.CachedBmp_138();
	this.instance.setTransform(0,0,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,372,39.8);


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
	this.instance = new lib.CachedBmp_137();
	this.instance.setTransform(0,0,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,389.9,219);


(lib.text132 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_136();
	this.instance.setTransform(0,0,0.3156,0.3156);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,378.1,39.8);


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
	this.instance = new lib.CachedBmp_135();
	this.instance.setTransform(-3.75,-3,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-3,378.5,147.3);


(lib.text120 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_134();
	this.instance.setTransform(-3.75,-3,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.7,-3,384.2,93.4);


(lib.text119 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_133();
	this.instance.setTransform(-2.9,-3,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.9,-3,202.9,39.8);


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
	this.instance = new lib.CachedBmp_132();
	this.instance.setTransform(0,0,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,378.3,39.8);


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
	this.instance = new lib.CachedBmp_131();
	this.instance.setTransform(-4,-3.55,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.5,207,50.8);


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
	this.instance = new lib.CachedBmp_130();
	this.instance.setTransform(-4,-3,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3,383,272.6);


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
	this.instance = new lib.CachedBmp_129();
	this.instance.setTransform(-4,-3.4,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.4,121.8,39.8);


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
	this.instance = new lib.CachedBmp_128();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,84.3,29);


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
	this.instance = new lib.CachedBmp_127();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,87.1,29);


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
	this.instance = new lib.CachedBmp_126();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,77.6,29);


(lib.text97 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_125();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,70.1,29);


(lib.text96 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_124();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,118,29);


(lib.text95 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_123();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,74.2,29);


(lib.text94 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_122();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,78.3,29);


(lib.text93 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_121();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,57.4,29);


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
	this.instance = new lib.CachedBmp_120();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,127.2,29);


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
	this.instance = new lib.CachedBmp_119();
	this.instance.setTransform(-4,-3.85,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.8,130.6,29);


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
	this.instance = new lib.CachedBmp_118();
	this.instance.setTransform(-4,-3.4,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3.4,180.8,39.8);


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
	this.instance = new lib.CachedBmp_117();
	this.instance.setTransform(-4,15.9,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,15.9,381.1,165);


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
	this.instance = new lib.CachedBmp_116();
	this.instance.setTransform(-4,-3,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3,381.4,308.2);


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
	this.instance = new lib.CachedBmp_115();
	this.instance.setTransform(-4,-3,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3,358.7,39.8);


(lib.text55 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_114();
	this.instance.setTransform(-3.6,-4,0.3835,0.3835);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.6,-4,36.1,26.9);


(lib.text54 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_113();
	this.instance.setTransform(-3.25,-4,0.3835,0.3835);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.2,-4,34.9,26.9);


(lib.text30 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_112();
	this.instance.setTransform(0,0,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,289.6,27.2);


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
	this.instance = new lib.CachedBmp_111();
	this.instance.setTransform(-4,-3,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3,391.2,290.6);


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
	this.instance = new lib.CachedBmp_110();
	this.instance.setTransform(-4,-3,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-3,383.6,39.8);


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


(lib.shape193 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("Ak6kvIgQA7AkNmeQgNAbgMAcAjMoFQgSAWgRAbAhxpWQgaAPgXAVAAspxIgsgEQgdAAgdAIACXo9QgYgTgagNADlnlIgkguAEel8Igbg2AFGkLIgSg5AFmggIgDg7AFjBYIADg7AFTDQIAKg8AlYCwQAFAeAHAdAlkA4QACAeADAeAljhBIgCA+AiDJMQAaASAcAKAjWH4IAmAtAkSGUIAbAzAEEGxIAag2AC+IYIAkgvABfJhQAagMAZgTAgRJ1IARABIAlgDAE0FDIASg5Ak9ElIATA4AFciWIgJg7AlWi5QgFAdgDAf");
	this.shape.setTransform(42.725,117.4506);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(6,53.5,73.5,128);


(lib.shape190 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("AjlCEQANAQASAOQAYAUAaANAkWAYQAEAeAMAcAkBhaQgOAbgFAeAivixIgXAQIgYAXAhBjeQgeAFgbALAhcDaQAcAIAfACAA1jgIg1gEIgGAAACli4QgZgPgcgKAD8hjQgPgYgWgWAEWAOIABgOQAAgWgFgVADrB8QATgYALgaAAZDlQAfgCAcgHACMDHQAbgNAXgS");
	this.shape.setTransform(324.275,-118.95);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(295.4,-142.8,57.80000000000001,47.80000000000001);


(lib.shape186 = function(mode,startPosition,loop,reversed) {
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_8"],8);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.523,0,0,0.523,-117.1,-108.7)).s().p("AySQ/MAAAgh9MAklAAAMAAAAh9g")
	}.bind(this);
	this.shape.setTransform(91.675,67.075);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_8"],9);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.379,0,0,0.379,-100.1,-94.6)).s().p("AvoOyIAA9jIfRAAIAAdjg")
	}.bind(this);
	this.shape_1.setTransform(318.825,-103.075);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-25.4,-197.6,444.29999999999995,373.4);


(lib.shape182 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("AASmlIgSAAIg7ADACJmQQgdgJgegGADzlaQgZgRgagOAjillQgZAQgXAVAh1mWQgdAIgbAMAmDCrQAMAbAQAaAmjA3QAEAfAIAcAmhhAQgEAdgBAeAl/iyQgNAbgJAdAk9kVQgUAWgRAZAGIigQgLgbgQgZAGkgtQgCgegIgcAGgBJQAFgeACgfAF8C8QANgbAKgdAFMkFIgsgvAE3EdIAmguADbFqQAZgPAYgUABtGZQAdgHAcgMAgIGnIA6gDAjrFgQAZARAbANAlDEQIAqArAh+GVQAcAIAeAF");
	this.shape.setTransform(294.1,-23.6504);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(250.9,-66.9,86.49999999999997,86.5);


(lib.shape178 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_109();
	this.instance.setTransform(66.15,-5.1,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(66.2,-5.1,85.10000000000001,84.89999999999999);


(lib.shape175 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],32);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.451,0,0,1.451,-220.5,-164.7)).s().p("EgidAZvMAAAgzdMBE6AAAMAAAAzdg")
	}.bind(this);
	this.shape.setTransform(196.25,14.35);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.3,-150.3,441.1,329.4);


(lib.shape166 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],31);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.122,0,0,1.122,-204.2,-199.1)).s().p("A/5fIMAAAg+PMA/zAAAMAAAA+Pg")
	}.bind(this);
	this.shape.setTransform(196.175,4.3);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-8,-194.8,408.4,398.3);


(lib.shape162 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],30);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.503,0,0,0.503,-80.5,-58.4)).s().p("AskJIIAAyPIZJAAIAASPg")
	}.bind(this);
	this.shape.setTransform(0,0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-80.5,-58.3,161,116.69999999999999);


(lib.shape159 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],29);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.821,0,0,0.821,-72.2,-59.5)).s().p("ArRJTIAAylIWjAAIAASlg")
	}.bind(this);
	this.shape.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.2,-59.5,144.5,119);


(lib.shape156 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("AAinzIgigBIg6AEACWnVQgbgMgdgIAh0niQgcAKgaAOAD5mVIgvgkAGBjTIgZg1AGghgIgMg6AFIk7IglgwAmZh8QgGAdgDAeAlzjuQgNAbgJAdAk0lUQgTAYgQAZAl4DkQAMAcAPAaAmbByQAFAeAJAcAmlgGIACA8Ak8FMIAmAtAGWCOIALg8AFtEAIAYg4AErFjIAkgwADTG0QAYgRAXgVAgNH1IANABIArgDABnHoQAdgIAbgNAiDHeQAcALAeAGAjrGiQAYATAZAPAjdmqQgYASgWAVAGmAXIAAg7");
	this.shape.setTransform(265.425,-97.4003);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(222.2,-148.5,86.5,102.3);


(lib.shape153 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],28);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.785,0,0,0.785,-108.3,-144.3)).s().p("Aw6WkMAAAgtGMAh1AAAMAAAAtGg")
	}.bind(this);
	this.shape.setTransform(206.275,-57.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(98,-202.1,216.60000000000002,288.7);


(lib.shape146 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("AQTjOIgbgsIgGgHAQ4hdQgFgegJgbALslJQgZAOgXAWANglgIgYgBIgkADAJkiPQgJAdgFAfAKYj6QgRAZgNAbAMxFhIAXACIAhgDALEEuQAYAVAaANAJ+DQQALAWAPAVIAFAHAJXBeQAGAfAJAcAJQgXIAAA6AQtCPQAJgdAFgfAP4D7IAfg0ARBAXIgBg5APMktQgXgVgagMAOhFNQAZgOAYgWAp8jOIgbgsIgGgHApXhdQgFgegJgbAujlJQgZAOgXAWAsvlgIgYgBIgkADArEktQgXgVgZgMAv3j6QgSAZgNAbAruFNQAZgOAXgWAtfFhIAYACIAggDAvLEuQAXAVAaANAwRDQQALAWAPAVIAFAHApjCPQAJgdAFgfAqXD7IAeg0ApPAXIAAg5AxAgXIABA6Aw4BeQAGAfAJAcAwsiPQgJAdgFAf");
	this.shape.setTransform(107.4,54.1997);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.4,17.8,219.70000000000002,72.9);


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
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("ADLjOIgbgsIgGgHADwhdQgFgegJgbAhblJQgZAOgXAWAAYlgIgYgBIgjADAjjiPQgKAdgFAfAivj6QgRAZgOAbAgWFhIAWACIAhgDAiDEuQAYAVAZANAjJDQQALAWAPAVIAFAHAjwBeQAGAfAJAcAj3gXIAAA6ADkCPQAKgdAFgfACwD7IAfg0AD4AXIAAg5ACEktQgYgVgZgMABZFNQAZgOAYgW");
	this.shape.setTransform(191.4,54.1997);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(2,1,0,3).p("ADLjOIgbgsIgFgHADxhdQgGgegJgbAhblJQgZAOgXAWAAYlgIgYgBIgjADACEktQgXgVgagMAivj6QgRAZgOAbABZFNQAagOAXgWAgWFhIAWACIAhgDAiDEuQAYAVAaANAjJDQQAMAWAOAVIAFAHADlCPQAJgdAFgfACwD7IAfg0AD5AXIgBg5Aj3gXIAAA6AjvBeQAFAfAKAcAjjiPQgKAdgFAf");
	this.shape_1.setTransform(23.4,54.1997);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.4,17.8,219.70000000000002,72.9);


(lib.shape144 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("AjfquIgZAAIAAA8AhnquIg8AAAj4lGIAAA8Aj4m+IAAA8Aj4o2IAAA8AAQquIg7AAACIquIg8AAAD5qoIAAgGIg1AAAD5owIAAg8AD5m4IAAg8AD5lAIAAg8AD5jIIAAg8AD5hQIAAg8AD5AnIAAg7AD5CfIAAg8AD5EXIAAg8AD5GPIAAg8AD5IHIAAg8AD5J/IAAg8ACyKvIA8AAAA6KvIA8AAAj4CZIAAA8Aj4AhIAAA8Aj4hWIAAA8Ai2KvIA8AAAj4J5IAAA2IAGAAAj4IBIAAA8Aj4GJIAAA8Aj4ERIAAA8Ag+KvIA8AAAj4jOIAAA8");
	this.shape.setTransform(248.2,18.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(222.3,-51.6,51.89999999999998,139.3);


(lib.shape142 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("Ai/jiQgQAbgKAcAhvk9QgXARgVAYABslAQgZgSgdgIAAAliQgdAAgcAJAC9jnIgkgxAD5gDQAAgfgDgcADtBzQAGgdADgfADADiQAQgZALgdAByE8QAXgQAUgZAjpB7QAIAdALAcAj4AEQAAAfAEAdAjrhyQgHAdgDAfAi7DqIAjAuAACFjQAfgBAcgJAhsFAQAaARAcAJADrh5QgIgdgLgb");
	this.shape.setTransform(371.4,114.2);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(345.5,77.8,51.80000000000001,72.89999999999999);


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

	// Layer_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("Ahvk9QgXARgVAYAi/jiQgQAbgKAcAAAliQgdAAgcAJABslAQgZgSgdgIAC9jnIgkgxAByE8QAXgQAUgZADADiQAQgZALgdADtBzQAGgdADgfAD5gDQAAgfgDgcAjrhyQgHAdgDAfAj4AEQAAAfAEAdAjpB7QAIAdALAcAi7DqIAjAuAACFjQAfgBAcgJAhsFAQAaARAcAJADrh5QgIgdgLgb");
	this.shape.setTransform(371.4,114.2);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(2,1,0,3).p("AP7q9Ig8AAAODq9IgZAAIAAA8ANqpFIAAA8ANqnNIAAA8ANqlVIAAA8AVdq3IAAgGIg2AAATrq9Ig8AAARzq9Ig8AAAVdjXIAAg8AVdlPIAAg8AVdnHIAAg8AVdo/IAAg8AVdEIIAAg8AVdCQIAAg8AVdAYIAAg7AVdhfIAAg8ASdKgIA8AAAUVKgIA8AAAVdJwIAAg8AVdH4IAAg8AVdGAIAAg8AMcD9QgFgegJgcAL3CMIgbgsIgGgIANqhlIAAA8ANqASIAAA8ANqCKIAAA8AF8BgQgSAYgNAbAFHDLQgJAcgFAfAJEgFIgYgCIgkAEAHPAQQgZAOgWAXAE7G5QAGAeAJAcAFhIrQAMAWAPAUIAFAHAGnKIQAYAWAaAMAIUK8IAYABIAggCAEzFCIABA7ANqHyIAAA8ALcJVIAegzAOtKgIA8AAANqJqIAAA2IAHAAAMQHpQAJgcAFgfAMkFyIAAg6ANqF6IAAA8AKFKnQAZgOAXgWAKvAtQgXgVgZgNANqECIAAA8AQlKgIA8AAAtzD9QgFgegKgcAuYCMIgcgsIgFgIA0TBgQgSAYgNAbAvgAtQgXgVgagNAxMgFIgYgCIgkAEAzAAQQgZAOgWAXA0uIrQAMAWAPAUIAFAHAzoKIQAYAWAaAMAx7K8IAXABIAhgCAwLKnQAagOAXgWAu0JVIAfgzAt/HpQAJgcAFgfAtrFyIAAg6ANqjdIAAA8A1cFCIAAA7A1IDLQgJAcgFAfA1UG5QAFAeAKAc");
	this.shape_1.setTransform(135.85,19.5012);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	var sprImg_shape_2 = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],27);
	sprImg_shape_2.onload = function(){
		this.shape_2.graphics.bf(sprImg_shape_2, null, new cjs.Matrix2D(1.403,0,0,1.402,-224.4,-190.7)).s().p("EgjDAdzMAAAg7mMBGHAAAMAAAA7mg")
	}.bind(this);
	this.shape_2.setTransform(196.225,9.8);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-28.2,-180.9,448.9,381.5);


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

	// Layer_2
	this.instance = new lib.CachedBmp_108();
	this.instance.setTransform(14.1,51.15,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],26);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.066,0,0,1.066,-187.6,-191.9)).s().p("A9Td/MAAAg79MA6nAAAMAAAA79g")
	}.bind(this);
	this.shape.setTransform(0.025,-0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-187.6,-191.9,375.29999999999995,383.8);


(lib.shape125 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],25);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.886,0,0,0.886,-70.9,-80.2)).s().p("ArEMiIAA5DIWJAAIAAZDg")
	}.bind(this);
	this.shape.setTransform(0.025,0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70.8,-80.1,141.7,160.3);


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
	this.shape.graphics.f().s("#FF0000").ss(2,1,0,3).p("AGTgCQAAgXgFgWAFNCeIAdghAGBBVQAKgUAEgWAF/hZIgYgnAFIiiIgjgcAD/jXIgogUAAAkVIgsABABVkQIgugEAhZkPIgsAJAiwj6IgqAQAiuD8IAsANAhVERIAtAFAAFEXIAsgCABeEQIAsgJAC2D6IAqgRACtj8IgsgMAEHDTIAkgYAmSgCIAAACQAAAXAEAUAmABWIAXAnAlLCgIAiAcAlJigIgeAhAl+hZQgKAUgFAWAkBjWIgmAZAkBDWQATAMAVAK");
	this.shape.setTransform(25.675,-68.45);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_8"],7);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.782,0,0,0.782,-169,-137.7)).s().p("A6ZVhMAAAgrBMA0zAAAMAAAArBg")
	}.bind(this);
	this.shape_1.setTransform(-12.35,-67.9);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-181.3,-205.6,338,275.4);


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

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(3,0,0,3).p("AG6mEIgagbIgRgRACMo8Ig8gLAFinWIgxgiAD9oVIg3gXAI1CsIAOg5AJLA2IACg2IAAgGAJJhBIgJg7AIxi2IgVg3AIBkjIghgyAIHEbIAag2AHCF8IAlgvAAhJMIA8gGACXI6IA6gSAEIIQIA0geAFtHPIAtgoAAVpLIgVgBIgoABAhjpEIg6AMAjVolQgcALgbAOAlAntIgwAjAmcmjIgEAEIgmAqApBB4IAPA6ApMAAIACA8AojjcIgTA5ApDhoIgIA8AnqlGIgfAzAk2H3IA1AdAjJIrIA5ARAhUJIIA8AFAodDrIAaA1AniFTIAmAwAmUGtIAtAn");
	this.shape.setTransform(-0.0993,-18.2778);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	var sprImg_shape_1 = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_8"],6);
	sprImg_shape_1.onload = function(){
		this.shape_1.graphics.bf(sprImg_shape_1, null, new cjs.Matrix2D(0.979,0,0,0.979,-213.5,-170.9)).s().p("EghWAatMAAAg1ZMBCtAAAMAAAA1Zg")
	}.bind(this);
	this.shape_1.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-213.5,-170.9,427.1,341.8);


(lib.shape108 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_8"],5);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.943,0,0,0.943,-198.2,-175.5)).s().p("A+9bbMAAAg21MA97AAAMAAAA21g")
	}.bind(this);
	this.shape.setTransform(208.2,175.475);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(10,0,396.4,351);


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

	// Layer_2
	this.instance = new lib.CachedBmp_107();
	this.instance.setTransform(-87.2,-102.2,0.3155,0.3155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],34);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-217,-169.5)).s().p("Egh5AafMAAAg09MBDzAAAMAAAA09g")
	}.bind(this);
	this.shape.setTransform(-8.3,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-225.3,-169.5,434,339);


(lib.shape81 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_8"],10);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(0.886,0,0,0.886,-205.5,-188.2)).s().p("EggGAdbMAAAg60MBANAAAMAAAA60g")
	}.bind(this);
	this.shape.setTransform(188.725,0.75);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-16.8,-187.5,411.1,376.5);


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

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#0000FF").ss(1,0,0,3).p("ACDg/IAKAnIAbgxIgwgcIALAmQjRAHhbCn");
	this.shape.setTransform(124.5928,-42.0046);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#0000FF").s().p("AgNAAIgKgmIAvAcIgaAxg");
	this.shape_1.setTransform(139,-48.375);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#0000FF").ss(1,0,0,3).p("AAAiaIAoAAIgognIgnAnIAnAAIAAFj");
	this.shape_2.setTransform(56.761,29.8758);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#0000FF").s().p("AAAATIgnAAIAngmIAoAmg");
	this.shape_3.setTransform(56.75,12.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// Layer_2
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#0000FF").ss(1,0,0,3).p("AAAiaIAoAAIgognIgnAnIAnAAIAAFj");
	this.shape_4.setTransform(-89.589,29.8758);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#0000FF").s().p("AAAATIgnAAIAngmIAoAmg");
	this.shape_5.setTransform(-89.6,12.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	// Layer_1
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#0000FF").ss(1,0,0,3).p("AOKBsIAdAcIgCg4Ig3gBIAcAdQheAhgRBOAsWjSIAUAjIANg3Ig1gOIAUAiQi8BBA6CxAqEAIIAUAjIANg2Ig1gOIAUAhQi8BBBTCy");
	this.shape_6.setTransform(-23.4526,-43.8446);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#0000FF").s().p("ANMCiIgcgcIA3AAIACA5gArCA/IgUgjIA1APIgNA3gAtUibIgUgjIA1APIgNA3g");
	this.shape_7.setTransform(-17.3,-49.275);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-117.9,-69.3,260.3,120.3);


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

	// Layer_5
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#0000FF").ss(1,0,0,3).p("ACDg/QjRAHhbCnACDg/IAKAnIAbgxIgwgcg");
	this.shape.setTransform(100.1928,-40.7046);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#0000FF").s().p("AgNAAIgKgmIAvAcIgbAxg");
	this.shape_1.setTransform(114.6,-47.075);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_4
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#0000FF").ss(1,0,0,3).p("AAAg3IAACcAAAg3IAoAAIgognIgnAng");
	this.shape_2.setTransform(56.761,-16.4992);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#0000FF").s().p("AAAATIgnAAIAnglIAoAlg");
	this.shape_3.setTransform(56.75,-24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// Layer_3
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#0000FF").ss(1,0,0,3).p("AAAiaIAoAAIgognIgnAnIAnAAIAAFj");
	this.shape_4.setTransform(56.761,48.1758);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#0000FF").s().p("AAAAUIgnAAIAngnIAoAng");
	this.shape_5.setTransform(56.75,30.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	// Layer_2
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#0000FF").ss(1,0,0,3).p("AAAiaIAoAAIgognIgnAnIAnAAIAAFj");
	this.shape_6.setTransform(-89.589,48.1758);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#0000FF").s().p("AAAAUIgnAAIAngnIAoAng");
	this.shape_7.setTransform(-89.6,30.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	// Layer_1
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#0000FF").ss(1,0,0,3).p("AgSjSIATAjIAOg3Ig1gOIAUAiQi8BBA7CxAB/AIQi1A/BHCpIAFALAB/AIIAUAjIAOg2Ig2gOg");
	this.shape_8.setTransform(-106.8432,-37.7468);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#0000FF").s().p("ABCBtIgUgiIA2AOIgOA3gAhPhtIgUgiIA2AOIgOA3g");
	this.shape_9.setTransform(-100.725,-47.825);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-124,-63.2,242,132.5);


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
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("ABTAJIilAAIAAgRIClAAg");
	this.shape.setTransform(8.275,0.925);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AhSAJIAAgRIClAAIAAARg");
	this.shape_1.setTransform(8.275,0.925);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,18.6,3.9);


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

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("ABVgIIAAARIipAAIAAgRg");
	this.shape.setTransform(8.45,0.925);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AhUAJIAAgRICpAAIAAARg");
	this.shape_1.setTransform(8.45,0.925);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,18.9,3.9);


(lib.shape65 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_10
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF6600").ss(1,0,0,3).p("AgiCBQgtjbClhPAgiCBIgpgBIApAoIAngng");
	this.shape.setTransform(-28.3713,-30.7019);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF6600").s().p("AhQCBIApABIAnAAIgnAngAgnCCQgKgvAAgoQAAAoAKAvgABRioQiCA+AACVQAAiVCCg+g");
	this.shape_1.setTransform(-27.85,-30.825);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_9
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IAAijAAAA7IgnAAIAoAnIAngng");
	this.shape_2.setTransform(40.028,17.7742);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAng");
	this.shape_3.setTransform(40.05,25.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// Layer_8
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IAAijAAAA7IgnAAIAoAnIAngng");
	this.shape_4.setTransform(23.878,17.7742);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAng");
	this.shape_5.setTransform(23.9,25.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	// Layer_7
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IAAijAAAA7IgnAAIAoAnIAngng");
	this.shape_6.setTransform(40.028,72.5242);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FF6600").s().p("AgngSIAnAAIAoAAIgnAlg");
	this.shape_7.setTransform(40.05,80.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	// Layer_6
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IAAijAAAA7IgnAAIAoAnIAngng");
	this.shape_8.setTransform(23.878,72.5242);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FF6600").s().p("AgngSIAnAAIAoAAIgnAlg");
	this.shape_9.setTransform(23.9,80.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8}]}).wait(1));

	// Layer_5
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAjCBQAtjbilhPAAjCBIApgBIgpAoIgngng");
	this.shape_10.setTransform(29.5713,-31.4519);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FF6600").s().p("AgngSIAnAAIAogBIgoAng");
	this.shape_11.setTransform(33.125,-16.675);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10}]}).wait(1));

	// Layer_4
	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IAAijAAAA7IgnAAIAoAnIAngng");
	this.shape_12.setTransform(-23.922,17.7742);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAng");
	this.shape_13.setTransform(-23.9,25.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12}]}).wait(1));

	// Layer_3
	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IAAijAAAA7IgnAAIAoAnIAngng");
	this.shape_14.setTransform(-40.072,17.7742);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAng");
	this.shape_15.setTransform(-40.05,25.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_15},{t:this.shape_14}]}).wait(1));

	// Layer_2
	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IAAijAAAA7IgnAAIAoAnIAngng");
	this.shape_16.setTransform(-23.922,72.5242);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FF6600").s().p("AgngSIAnAAIAoAAIgnAlg");
	this.shape_17.setTransform(-23.9,80.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_17},{t:this.shape_16}]}).wait(1));

	// Layer_1
	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IAAijAAAA7IgnAAIAoAnIAngng");
	this.shape_18.setTransform(-40.072,72.5242);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FF6600").s().p("AgngSIAnAAIAoAAIgnAlg");
	this.shape_19.setTransform(-40.05,80.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_19},{t:this.shape_18}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.2,-49.4,90.5,132.8);


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

	// Layer_10
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IgnAAIAoAnIAngnIgoAAIAAij");
	this.shape.setTransform(40.028,-4.1258);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAmg");
	this.shape_1.setTransform(40.05,3.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_9
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IgnAAIAoAnIAngnIgoAAIAAij");
	this.shape_2.setTransform(23.878,-4.1258);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAmg");
	this.shape_3.setTransform(23.9,3.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// Layer_8
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IgnAAIAoAnIAngnIgoAAIAAij");
	this.shape_4.setTransform(40.028,50.6242);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAng");
	this.shape_5.setTransform(40.05,58.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	// Layer_7
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IgnAAIAoAnIAngnIgoAAIAAij");
	this.shape_6.setTransform(23.878,50.6242);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAng");
	this.shape_7.setTransform(23.9,58.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	// Layer_6
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#FF6600").ss(1,0,0,3).p("ABJBsIAngKIgdAwIgwgbIAmgLQgNjfi0gg");
	this.shape_8.setTransform(24.3891,-45.6822);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FF6600").s().p("AAnB4IAngLIAmgKIgcAwgAh0iSQC1AgANDfQgNjfi1ggg");
	this.shape_9.setTransform(23.9,-45.775);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8}]}).wait(1));

	// Layer_5
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("#FF6600").ss(1,0,0,3).p("AhIBsIgngKIAdAwIAwgbIgmgLQANjfC0gg");
	this.shape_10.setTransform(-25.4391,-45.6822);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FF6600").s().p("AgmgXIAmAKIAnALIgvAag");
	this.shape_11.setTransform(-32.75,-33.475);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10}]}).wait(1));

	// Layer_4
	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IgnAAIAoAnIAngnIgoAAIAAij");
	this.shape_12.setTransform(-23.922,-4.1258);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAmg");
	this.shape_13.setTransform(-23.9,3.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12}]}).wait(1));

	// Layer_3
	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IgnAAIAoAnIAngnIgoAAIAAij");
	this.shape_14.setTransform(-40.072,-4.1258);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAmg");
	this.shape_15.setTransform(-40.05,3.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_15},{t:this.shape_14}]}).wait(1));

	// Layer_2
	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IgnAAIAoAnIAngnIgoAAIAAij");
	this.shape_16.setTransform(-23.922,50.6242);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAng");
	this.shape_17.setTransform(-23.9,58.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_17},{t:this.shape_16}]}).wait(1));

	// Layer_1
	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f().s("#FF6600").ss(1,0,0,3).p("AAAA7IgnAAIAoAnIAngnIgoAAIAAij");
	this.shape_18.setTransform(-40.072,50.6242);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FF6600").s().p("AgngTIAnAAIAoAAIgnAng");
	this.shape_19.setTransform(-40.05,58.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_19},{t:this.shape_18}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.2,-61.5,90.5,123);


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
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("AKFAHICqAAIAAgNIiqAAgAsuAGIClAAIAAgMIilAAg");
	this.shape.setTransform(0.125,-3.475);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FE0000").s().p("AKFAHIAAgNICqAAIAAANgAsuAGIAAgMIClAAIAAAMg");
	this.shape_1.setTransform(0.125,-3.475);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-82.4,-5.1,165.10000000000002,3.3);


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
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("AAdgJIA5AAIAAAKIhiACIAAAHIhJAAIAAgGIAjAAIAAgEIAgAAIAAgEIAvAAg");
	this.shape.setTransform(0,-0.675);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AhVAKIAAgGIAjAAIAAgEIAgAAIAAgEIAwAAIAAgFIA4AAIAAAKIhiACIAAAHg");
	this.shape_1.setTransform(0,-0.675);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-9.6,-2.7,19.2,4.1);


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
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("AArAEIAlAAIAAAEIglAAAAoABIAAADAhOgCIAAgFIAgAAIABAAIAAACIAqAAIABAAIAAAGIgBAAIgqAAIAAgDIgBAAgAAoAIIgpAAIAAgIIApAA");
	this.shape.setTransform(-0.1738,-0.575);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AArAIIAAgBIgCAAIAAABIgqAAIAAgIIAqAAIAAABIAAADIAAAAIACAAIAAAAIAlAAIAAAEgAgtABIAAgDIgBAAIgfAAIgBgFIAgAAIAAACIABAAIArAAIAAAGgAguABIAAgDIABAAIAAADgAhPgCIAAgFIABAAIABAFgAhOgHg");
	this.shape_1.setTransform(-0.2,-0.575);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-9.1,-2.4,17.9,3.7);


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
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("AHNgFIAAAKIkbABIAAgLgAnMgFIAAAKIEbAAIAAgKg");
	this.shape.setTransform(-0.025,-0.0246);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FE8000").s().p("ACygFIEbAAIAAAKIkbABgAnMAFIAAgKIEbAAIAAAKg");
	this.shape_1.setTransform(-0.025,-0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-47.1,-1.6,94.2,3.2);


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

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("AAxABIgQAAIAAAEIgxAAIAAAEIgvAAIAAAEIguAAIAAgEIAAgFIAmAAIAAgDIAxAAIAAgFIA1AAIAAgIIASAAAAxABIAAgNAAxABIAcAAIAAgEIAhAAIAAgJIg9AA");
	this.shape.setTransform(2.6,-0.725);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#000000").ss(0.3,0,0,3).p("ACIgRIAAAIIggAAIAAAFIgdAAAhTAJIAwAAIAAgFIAuAAIAAgEIAtAAIAAgEIATAAIAAgIAhTAJIAAAEIg0AAIAAgJIAAgIIA0AAAhTAEIAAAFAhTAAIAAAEAiHAEIA0AA");
	this.shape_1.setTransform(-0.025,0.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#999999").s().p("AiHAUIAAgJIA0AAIAAAFIAAgFIg0AAIAAgJIA0AAIAAgEIAnAAIAAgDIAvAAIAAgGIA2AAIAAgIIASAAIAAAOIgQAAIAAAEIgyAAIAAADIguAAIAAAEIguAAIAAgEIAAAEIAuAAIAAgEIAuAAIAAgDIAyAAIAAgEIAQAAIAAgOIA9AAIAAAJIghAAIAAAFIgcAAIAAAHIgTAAIAAAEIgtAAIAAAFIguAAIAAAFIgwAAIAAAEgAhTALIAAgFgABLACIAAgHIAcAAIAAgFIAhAAIAAAJIggAAIAAADgACIgKg");
	this.shape_2.setTransform(-0.025,-0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-14.6,-3,29.2,6);


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
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("ABRgNIALAAIAAAFIAvAAIAAAKIAAAOIg6AAIAAgIIgxAAIAAgFIgxAAIAAgDIgrAAIAAgGIgSAAIgdAAIAAgEIgfAAIAAgKAhOgQIAAAKABRACIAAgCABRAIIAAgGIA6AA");
	this.shape.setTransform(0.025,0.575);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#000000").ss(0.3,0,0,3).p("AgxgMIAXAAIAAAEIAuAAIAAAEIAxAAIAAAEIApAAIAAANIgzAAIAAgGIgvAAIAAgEIgqAAIAAgFIgTAAIgZAAIAAgEIgjAAIAAgGgAgxgCIAAgK");
	this.shape_1.setTransform(-2.875,-0.825);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#999999").s().p("ABRAWIAAgIIgxAAIAAgFIgxAAIAAgEIgrAAIAAgFIgSAAIAAgKIATAAIAAAGIArAAIAAADIAuAAIAAAGIAzAAIAAgMIALAAIAAAEIAvAAIAAAKIg6ABIAAgDIAAADIAAAGIAAgGIA6gBIAAAPgABRAIgAAeAFIAAgGIguAAIAAgDIgrAAIAAgGIgTAAIAAgLIAAALIgZAAIAAgEIgjAAIAAgHIA8AAIAXAAIAAAFIAvAAIAAADIAwAAIAAAGIApAAIAAAMgAhrAAIAAgEIgfAAIAAgKIAjAAIAAAEIAZAAIAAAKgABRgHgAhOgKg");
	this.shape_2.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-14.9,-3.1,29.9,6.300000000000001);


(lib.shape57 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("ANDANI6FAAIAAgwIaFAAgANDhfI6FAAIAAgrIaFAAgANDCHI6FAEIAAg+IaFAAg");
	this.shape.setTransform(0,-50.9243);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FEFE80").s().p("AtBBNIaDAAIAAA6I6DAEgAtBANIAAgwIaDAAIAAAwgAtBhfIAAgrIaDAAIAAArg");
	this.shape_1.setTransform(0,-50.925);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#000000").ss(0.3,0,0,3).p("ANDrmIAAXJIgKAKI5nABIgUgRIAA2+IASgMIZtAAg");

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#DBDBDB").s().p("AtBLdIAA2+IASgMIZsAAIAFAHIAAXKIgJAKI5nAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-84.4,-76,168.9,152);


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

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("ADugnIAAAXIAAA4IAQAAICQAAIAZAAIBJAAIAAhPIgkAAIg+AAIigAAIg9AAIAAAXIA9AAICggBIA+AAIAAgWADuAqIAAgCIg9AAIAAg4AGOgRIAAgWAGOAoIAAg5AmOgbIAAgMIhhAAIAABIIBhAAIAAgyIAAgKICfAAIAAAKIifAAAiygbIAAAKIAAAyIg9AAIAAgyIA9AAAjvgnIA9AAIAAAMIg9AAgAjvAhIifAAAmOgnICfAA");
	this.shape.setTransform(-11.2,-113.65);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FEFEFE").s().p("ACxApIAAgCIAAg4IAAgXIA8AAIAAAXIAAgXICgAAIA/AAIAAAXIg/AAIAAgXIAAAXIigAAIg8AAIA8AAICgAAIA/AAIAAgXIAjAAIAABPIhIAAIgaAAIAAg4IAAA4IiQAAIgQAAIAAg4IAAA4IAQAAIgQACIAAgCIg8AAIA8AAIAAACgADtAngAjvAgIAAgyIA9AAIAAAygAjvAgIifAAIAAgyIAAAyIhhAAIAAhIIBhAAIAAAMIAAAKIAAgKICfAAIAAAKIifAAICfAAIAAgKIifAAIAAgMICfAAIA9AAIAAAMIg9AAIA9AAIAAAKIg9AAIAAAygAjvgcIAAgMgAGNgRgAiygcgAmOgog");
	this.shape_1.setTransform(-11.2,-113.575);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#000000").ss(0.3,0,0,3).p("AMygeIAiAAIAAA+IgiAAIisAAIAAgOICsAAIAAAOAMygeIAAAwAKGASIAAgwICsAAAqIAgIAjAAIAAg+IgjAAgArcAgIh3AAIAAg+IB2AAIABA+IBUAAAqIgeIhVAA");
	this.shape_2.setTransform(-11.3,-120.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FEFEFE").s().p("AMyAgIAAgPIAAgvIAAAvIAAAPIisAAIAAgPICsAAIisAAIAAgvICsAAIAiAAIAAA+gAqIAgIAAg+IAkAAIAAA+gArbAgIgCg+IBVAAIAAA+gAtTAgIAAg+IB2AAIACA+gArdgeg");
	this.shape_3.setTransform(-11.3,-120.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-97.4,-124.9,172.3,16.400000000000006);


(lib.shape53 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_106();
	this.instance.setTransform(-175.3,-294.6,0.3833,0.3833);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-175.3,-294.6,349.6,431.70000000000005);


(lib.shape52 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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
	this.shape.graphics.f().s("#000000").ss(0.3,0,0,3).p("ACYGYIAAgIIAPAIAhtF0QgbgGgZgPAgvF1QggAFgegGIAAsQAgDFpQgXAJgVADIAAsRAgDFpIAYgKIAzAAIBQAxACnGQIAAssAimFbIAAr3AAyFbIAAr3ABmmcIAAL3AgHmcIAEMF");
	this.shape.setTransform(16.65,41.2645);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,35.3,84.1);


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
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["AIR_COMP_atlas_7"],33);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1.247,0,0,1.247,-229.4,-157.1)).s().p("Egj1AYjMAAAgxFMBHrAAAMAAAAxFg")
	}.bind(this);
	this.shape.setTransform(197.85,11.35);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-31.5,-145.7,458.8,314.2);


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
	this.instance = new lib.CachedBmp_105();
	this.instance.setTransform(5,12,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_104();
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


(lib.sprite712 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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


(lib.sprite195 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1256 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1256).call(this.frame_1256).wait(1));

	// Masked_Layer_5___3
	this.instance = new lib.text188("synched",0);
	this.instance.setTransform(-500,-178.4);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1257));

	// Masked_Layer_4___3
	this.instance_1 = new lib.text118("synched",0);
	this.instance_1.setTransform(-500,-200);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1257));

	// Layer_8
	this.instance_2 = new lib.shape193("synched",0);
	this.instance_2.setTransform(0,-17.15);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(506).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(731));

	// Layer_3
	this.instance_3 = new lib.shape190("synched",0);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(166).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(1071));

	// Layer_2
	this.instance_4 = new lib.shape186("synched",0);
	this.instance_4.setTransform(0,-2.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1257));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-200,918.9,373.6);


(lib.sprite183 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1183 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(1183).call(this.frame_1183).wait(1));

	// Masked_Layer_4___2
	this.instance = new lib.text177("synched",0);
	this.instance.setTransform(-500,-178.4);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1184));

	// Masked_Layer_3___2
	this.instance_1 = new lib.text118("synched",0);
	this.instance_1.setTransform(-500,-200);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1184));

	// Layer_7
	this.instance_2 = new lib.shape182("synched",0);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(878).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(286));

	// Layer_2
	this.instance_3 = new lib.shape178("synched",0);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(83).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).wait(1081));

	// Layer_1
	this.instance_4 = new lib.shape175("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1184));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-200,916.8,379.1);


(lib.sprite173 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1431 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(1431).call(this.frame_1431).wait(1));

	// Masked_Layer_4___2
	this.instance = new lib.text168("synched",0);
	this.instance.setTransform(-500,-174.4);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1432));

	// Masked_Layer_3___2
	this.instance_1 = new lib.text118("synched",0);
	this.instance_1.setTransform(-500,-200);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1432));

	// Layer_1
	this.instance_2 = new lib.shape166("synched",0);
	this.instance_2.setTransform(0,-15.4,0.9306,0.9305);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1432));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-200,872.6,373.9);


(lib.sprite164 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1279 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(1279).call(this.frame_1279).wait(1));

	// Masked_Layer_5___3
	this.instance = new lib.text155("synched",0);
	this.instance.setTransform(-500,-179.4);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1280));

	// Masked_Layer_4___3
	this.instance_1 = new lib.text118("synched",0);
	this.instance_1.setTransform(-500,-200);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1280));

	// Layer_4
	this.instance_2 = new lib.shape156("synched",0);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(79).to({_off:false},0).wait(1201));

	// Layer_3
	this.instance_3 = new lib.shape162("synched",0);
	this.instance_3.setTransform(157.45,110);
	this.instance_3.alpha = 0;
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(816).to({_off:false},0).to({alpha:0.9219},11).wait(1).to({alpha:1},0).wait(452));

	// Layer_2
	this.instance_4 = new lib.shape156("synched",0);

	this.instance_5 = new lib.shape159("synched",0);
	this.instance_5.setTransform(313.65,110);
	this.instance_5.alpha = 0;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_4}]},59).to({state:[]},5).to({state:[{t:this.instance_4}]},5).to({state:[]},5).to({state:[{t:this.instance_5}]},239).to({state:[{t:this.instance_5}]},11).to({state:[{t:this.instance_5}]},1).wait(955));
	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(313).to({_off:false},0).to({alpha:0.9219},11).wait(1).to({alpha:1},0).wait(955));

	// Layer_1
	this.instance_6 = new lib.shape153("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1280));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-202.1,885.9,371.6);


(lib.sprite151 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1038 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1038).call(this.frame_1038).wait(1));

	// Masked_Layer_8___5
	this.instance = new lib.text141("synched",0);
	this.instance.setTransform(-500,-141.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1039));

	// Masked_Layer_7___5
	this.instance_1 = new lib.text140("synched",0);
	this.instance_1.setTransform(-500,-166);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1039));

	// Masked_Layer_6___5
	this.instance_2 = new lib.text118("synched",0);
	this.instance_2.setTransform(-500,-200);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1039));

	// Layer_12
	this.instance_3 = new lib.shape144("synched",0);
	this.instance_3.setTransform(0,-21.4);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(169).to({_off:false},0).wait(870));

	// Layer_11
	this.instance_4 = new lib.shape145("synched",0);
	this.instance_4.setTransform(0,-21.4);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(198).to({_off:false},0).to({_off:true},6).wait(835));

	// Layer_10
	this.instance_5 = new lib.shape144("synched",0);
	this.instance_5.setTransform(0,-21.4);

	this.instance_6 = new lib.shape142("synched",0);
	this.instance_6.setTransform(0,-21.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_5}]},149).to({state:[]},5).to({state:[{t:this.instance_5}]},5).to({state:[]},5).to({state:[{t:this.instance_6}]},134).to({state:[]},6).to({state:[{t:this.instance_6}]},5).to({state:[]},5).to({state:[{t:this.instance_6}]},5).wait(720));

	// Layer_4
	this.instance_7 = new lib.shape142("synched",0);
	this.instance_7.setTransform(-348,-81.4);

	this.instance_8 = new lib.shape146("synched",0);
	this.instance_8.setTransform(0,-21.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_7}]},49).to({state:[]},5).to({state:[{t:this.instance_7}]},5).to({state:[]},5).to({state:[{t:this.instance_7}]},5).to({state:[]},129).to({state:[{t:this.instance_8}]},11).to({state:[]},5).to({state:[{t:this.instance_8}]},5).wait(820));

	// Layer_3
	this.instance_9 = new lib.shape138("synched",0);
	this.instance_9.setTransform(0,-21.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(1039));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-202.3,920.7,381.5);


(lib.sprite136 = function(mode,startPosition,loop,reversed) {
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
	this.frame_882 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(882).call(this.frame_882).wait(1));

	// Masked_Layer_5___3
	this.instance = new lib.text133("synched",0);
	this.instance.setTransform(-500,-166);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(883));

	// Masked_Layer_4___3
	this.instance_1 = new lib.text132("synched",0);
	this.instance_1.setTransform(-500,-200,0.9996,0.9987);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(883));

	// Layer_2
	this.instance_2 = new lib.shape130("synched",0);
	this.instance_2.setTransform(198.65,-16.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(883));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-208.5,886.3,383.8);


(lib.sprite128 = function(mode,startPosition,loop,reversed) {
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
	this.frame_964 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(964).call(this.frame_964).wait(1));

	// Masked_Layer_7___3
	this.instance = new lib.text121("synched",0);
	this.instance.setTransform(-492.6,-62.65);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(965));

	// Masked_Layer_6___3
	this.instance_1 = new lib.text120("synched",0);
	this.instance_1.setTransform(-493.6,-151.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(965));

	// Masked_Layer_5___3
	this.instance_2 = new lib.text119("synched",0);
	this.instance_2.setTransform(-496.7,-177.75);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(965));

	// Masked_Layer_4___3
	this.instance_3 = new lib.text118("synched",0);
	this.instance_3.setTransform(-500,-200,0.9996,0.9987);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(965));

	// Layer_3
	this.instance_4 = new lib.shape125("synched",0);
	this.instance_4.setTransform(85,93.95);
	this.instance_4.alpha = 0;
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(441).to({_off:false},0).to({alpha:0.8711},13).wait(1).to({alpha:0.9297},0).wait(510));

	// Layer_2
	this.instance_5 = new lib.shape116("synched",0);
	this.instance_5.setTransform(197.75,-0.25);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(965));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-205.8,854.4,380);


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
	this.frame_853 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(853).call(this.frame_853).wait(1));

	// Masked_Layer_15___13
	this.instance = new lib.text103("synched",0);
	this.instance.setTransform(-495.5,-172.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(854));

	// Masked_Layer_14___13
	this.instance_1 = new lib.text102("synched",0);
	this.instance_1.setTransform(-496,-201.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(854));

	// Layer_14
	this.instance_2 = new lib.text109("synched",0);
	this.instance_2.setTransform(175,-98.45);
	this.instance_2.alpha = 0.0117;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(548).to({_off:false},0).to({alpha:0.8711},14).wait(1).to({alpha:0.9297},0).wait(291));

	// Layer_13
	this.instance_3 = new lib.shape108("synched",0);
	this.instance_3.setTransform(-23.65,-182.5);
	this.instance_3.alpha = 0.0117;
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(548).to({_off:false},0).to({alpha:0.8594},13).wait(1).to({alpha:0.9297},0).wait(292));

	// Layer_12
	this.instance_4 = new lib.text100("synched",0);
	this.instance_4.setTransform(23,-4.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({_off:true},563).wait(291));

	// Layer_11
	this.instance_5 = new lib.text99("synched",0);
	this.instance_5.setTransform(12,-21.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).to({_off:true},563).wait(291));

	// Layer_10
	this.instance_6 = new lib.text98("synched",0);
	this.instance_6.setTransform(19,-39.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({_off:true},563).wait(291));

	// Layer_9
	this.instance_7 = new lib.text97("synched",0);
	this.instance_7.setTransform(16,-57.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({_off:true},563).wait(291));

	// Layer_8
	this.instance_8 = new lib.text96("synched",0);
	this.instance_8.setTransform(293,-35.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).to({_off:true},563).wait(291));

	// Layer_7
	this.instance_9 = new lib.text95("synched",0);
	this.instance_9.setTransform(299,-16.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).to({_off:true},563).wait(291));

	// Layer_6
	this.instance_10 = new lib.text94("synched",0);
	this.instance_10.setTransform(304.45,-1.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).to({_off:true},563).wait(291));

	// Layer_5
	this.instance_11 = new lib.text93("synched",0);
	this.instance_11.setTransform(311,-56.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).to({_off:true},563).wait(291));

	// Layer_4
	this.instance_12 = new lib.text92("synched",0);
	this.instance_12.setTransform(310,-78.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_12).to({_off:true},563).wait(291));

	// Layer_3
	this.instance_13 = new lib.text91("synched",0);
	this.instance_13.setTransform(309,-97.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_13).to({_off:true},563).wait(291));

	// Layer_2
	this.instance_14 = new lib.shape90("synched",0);
	this.instance_14.setTransform(208.7,1);

	this.instance_15 = new lib.shape112("synched",0);
	this.instance_15.setTransform(190.25,8.3);
	this.instance_15.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_14}]}).to({state:[{t:this.instance_15}]},563).wait(291));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-204.9,935.6,384.1);


(lib.sprite88 = function(mode,startPosition,loop,reversed) {
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
	this.frame_642 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(642).call(this.frame_642).wait(1));

	// Masked_Layer_4___2
	this.instance = new lib.text84("synched",0);
	this.instance.setTransform(-496,-189.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(643));

	// Masked_Layer_3___2
	this.instance_1 = new lib.text83("synched",0);
	this.instance_1.setTransform(-494.4,-172.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(643));

	// Layer_1
	this.instance_2 = new lib.shape81("synched",0);
	this.instance_2.setTransform(0,-1.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(643));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-192.9,894.3,380.8);


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

	// timeline functions:
	this.frame_278 = function() {
		this.gotoAndPlay(61);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(278).call(this.frame_278).wait(1));

	// Layer_30
	this.instance = new lib.shape64("synched",0);
	this.instance.setTransform(-11.25,-142.3);
	this.instance._off = true;

	this.instance_1 = new lib.shape65("synched",0);
	this.instance_1.setTransform(-11.25,-142.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},64).to({state:[]},5).to({state:[{t:this.instance}]},5).to({state:[]},5).to({state:[{t:this.instance}]},5).to({state:[{t:this.instance_1}]},10).to({state:[{t:this.instance}]},10).to({state:[{t:this.instance_1}]},10).to({state:[{t:this.instance}]},10).to({state:[]},14).to({state:[{t:this.instance}]},5).to({state:[]},5).wait(131));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(64).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},10).wait(10).to({_off:false},0).to({_off:true},10).wait(10).to({_off:false},0).to({_off:true},14).wait(5).to({_off:false},0).to({_off:true},5).wait(131));

	// Layer_27
	this.instance_2 = new lib.shape68("synched",0);
	this.instance_2.setTransform(5.15,-140.8);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(174).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},5).wait(5).to({_off:false},0).to({_off:true},10).wait(10).to({_off:false},0).to({_off:true},10).wait(10).to({_off:false},0).to({_off:true},14).wait(5).to({_off:false},0).to({_off:true},5).wait(21));

	// Layer_26
	this.instance_3 = new lib.shape69("synched",0);
	this.instance_3.setTransform(5.15,-140.8);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(204).to({_off:false},0).to({_off:true},10).wait(10).to({_off:false},0).to({_off:true},10).wait(45));

	// Layer_22
	this.instance_4 = new lib.shape67("synched",0);
	this.instance_4.setTransform(-92.6,-123.85);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(167).to({_off:false},0).to({scaleY:0.9805},4).to({scaleY:0.8052},27).to({scaleY:0.487,y:-124},49).to({scaleY:0.3831,y:-123.95},16).to({_off:true},1).wait(15));

	// Layer_21
	this.instance_5 = new lib.shape66("synched",0);
	this.instance_5.setTransform(53.5,-123.95);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(167).to({_off:false},0).to({scaleY:0.981},4).to({scaleY:0.9747,y:-123.9},1).to({scaleY:0.9684,y:-123.95},1).to({scaleY:0.962,y:-123.9},1).to({scaleY:0.9494,y:-124},2).to({scaleY:0.9304,y:-123.9},3).to({scaleY:0.9241,y:-123.95},1).to({scaleY:0.9051},3).to({scaleY:0.8735,y:-123.9},5).to({scaleY:0.8545},3).to({scaleY:0.8481,y:-123.95},1).to({scaleY:0.8292,y:-123.85},3).to({scaleY:0.8038,y:-123.95},4).to({scaleY:0.7532,y:-123.85},8).to({scaleY:0.7469,y:-123.9},1).to({scaleY:0.7406,y:-123.85},1).to({scaleY:0.7279,y:-123.95},2).to({scaleY:0.7089,y:-123.85},3).to({scaleY:0.7026,y:-123.9},1).to({scaleY:0.6836},3).to({scaleY:0.6583},4).to({scaleY:0.652,y:-123.85},1).to({scaleY:0.633},3).to({scaleY:0.6267,y:-123.9},1).to({scaleY:0.6077,y:-123.8},3).to({scaleY:0.5887},3).to({scaleY:0.5824,y:-123.9},1).to({scaleY:0.5318,y:-123.8},8).to({scaleY:0.5254,y:-123.85},1).to({scaleY:0.5065,y:-123.9},3).to({scaleY:0.4875,y:-123.8},3).to({scaleY:0.4811,y:-123.85},1).to({scaleY:0.4622},3).to({scaleY:0.4116,y:-123.8},8).to({scaleY:0.3989,y:-123.85},2).to({_off:true},1).wait(15));

	// Layer_20
	this.instance_6 = new lib.shape63("synched",0);
	this.instance_6.setTransform(-11.2,-114.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({startPosition:0},153).to({y:-117.6},13).wait(1).to({y:-117.8},0).to({startPosition:0},2).wait(1).to({y:-117.85},0).to({startPosition:0},1).wait(1).to({y:-117.9},0).to({startPosition:0},2).wait(1).to({y:-117.95},0).to({startPosition:0},1).wait(1).to({y:-118},0).to({startPosition:0},2).wait(1).to({y:-118.05},0).to({startPosition:0},1).wait(1).to({y:-118.1},0).to({startPosition:0},2).wait(1).to({y:-118.15},0).to({startPosition:0},1).wait(1).to({y:-118.2},0).to({startPosition:0},2).wait(1).to({y:-118.25},0).to({startPosition:0},1).wait(1).to({y:-118.3},0).to({startPosition:0},2).wait(1).to({y:-118.35},0).to({startPosition:0},1).wait(1).to({y:-118.4},0).to({startPosition:0},2).wait(1).to({y:-118.45},0).to({startPosition:0},1).wait(1).to({y:-118.5},0).to({startPosition:0},2).wait(1).to({y:-118.55},0).to({startPosition:0},1).wait(1).to({y:-118.6},0).to({startPosition:0},2).wait(1).to({y:-118.65},0).to({startPosition:0},1).wait(1).to({y:-118.7},0).to({startPosition:0},2).wait(1).to({y:-118.75},0).to({startPosition:0},1).wait(1).to({y:-118.8},0).to({startPosition:0},2).wait(1).to({y:-118.85},0).to({startPosition:0},1).wait(1).to({y:-118.9},0).to({startPosition:0},2).wait(1).to({y:-118.95},0).to({startPosition:0},1).wait(1).to({y:-119},0).to({startPosition:0},2).wait(1).to({y:-119.05},0).to({startPosition:0},1).wait(1).to({y:-119.1},0).to({startPosition:0},2).wait(1).to({y:-119.15},0).to({startPosition:0},1).wait(1).to({y:-119.2},0).to({startPosition:0},2).wait(1).to({y:-119.25},0).to({startPosition:0},1).wait(1).to({y:-119.3},0).to({startPosition:0},2).wait(1).to({y:-119.35},0).to({startPosition:0},1).wait(1).to({y:-119.4},0).to({startPosition:0},2).wait(1).to({y:-119.45},0).to({startPosition:0},1).wait(1).to({y:-119.5},0).to({startPosition:0},2).wait(1).to({y:-119.55},0).to({startPosition:0},1).wait(1).to({y:-119.6},0).to({startPosition:0},2).wait(1).to({y:-119.65},0).to({startPosition:0},1).wait(1).to({y:-119.7},0).to({startPosition:0},1).to({y:-114.9},15).wait(1));

	// Mask_Layer_17 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_263 = new cjs.Graphics().p("AhWAYIAAgvICtAAIAAAvg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(263).to({graphics:mask_graphics_263,x:61.875,y:-121.6}).wait(16));

	// Masked_Layer_18___17
	this.instance_7 = new lib.shape62("synched",0);
	this.instance_7.setTransform(62,-123.35,1,2.2958);
	this.instance_7._off = true;

	var maskedShapeInstanceList = [this.instance_7];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(263).to({_off:false},0).to({y:-122.65},3).to({x:61.95,y:-122.4},1).to({y:-120.75},7).to({x:61.9,y:-120.5},1).to({y:-119.8},3).wait(1));

	// Layer_15
	this.instance_8 = new lib.shape62("synched",0);
	this.instance_8.setTransform(61.9,-119.8,1,2.2958);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(1).to({scaleY:2.2957,y:-119.75},0).to({startPosition:0},151).to({scaleY:2.2958,y:-119.8},1).to({scaleY:1.0864,y:-122},14).to({_off:true},1).wait(111));

	// Mask_Layer_14 (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_263 = new cjs.Graphics().p("AnOo2IAAg1ICpAAIAAA1g");

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:null,x:0,y:0}).wait(263).to({graphics:mask_1_graphics_263,x:-46.34,y:-62.0279}).wait(16));

	// Masked_Layer_15___14
	this.instance_9 = new lib.shape61("synched",0);
	this.instance_9.setTransform(-84.25,-123.5,1,2.8596);
	this.instance_9._off = true;

	var maskedShapeInstanceList = [this.instance_9];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_1;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(263).to({_off:false},0).to({y:-119.8},15).wait(1));

	// Layer_14
	this.instance_10 = new lib.shape61("synched",0);
	this.instance_10.setTransform(-84.25,-119.8,1,2.8596);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(1).to({startPosition:0},0).to({startPosition:0},152).to({scaleY:1.1239,y:-122.35},14).to({_off:true},1).wait(111));

	// Layer_13
	this.instance_11 = new lib.shape60("synched",0);
	this.instance_11.setTransform(-11.25,-119.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).to({startPosition:0},44).to({y:-115},14).wait(1).to({y:-114.7},0).to({startPosition:0},94).to({y:-119.2},14).wait(1).to({y:-119.5},0).to({startPosition:0},95).to({y:-114.7},15).wait(1));

	// Layer_12
	this.instance_12 = new lib.shape59("synched",0);
	this.instance_12.setTransform(-42.7,-115.4,1,2.0189);

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(1).to({scaleY:2.019},0).to({scaleY:2.0189},42).to({scaleY:2.1852,y:-114.55},1).to({scaleY:1.1543,y:-112.3},14).wait(1).to({scaleY:1.0807,y:-112.2},0).to({startPosition:0},94).to({scaleY:2.1852,y:-114.55},15).wait(1).to({y:-114.6},0).to({startPosition:0},93).to({y:-114.55},1).to({scaleY:1.0807,y:-112.2},15).wait(1));

	// Layer_11
	this.instance_13 = new lib.shape58("synched",0);
	this.instance_13.setTransform(20.4,-115.2,1,1.9445);

	this.timeline.addTween(cjs.Tween.get(this.instance_13).to({startPosition:0},43).to({scaleY:2.1046,y:-114.35},1).to({scaleY:1.1118,y:-112.2},14).wait(1).to({scaleY:1.0409,y:-112.1},0).to({startPosition:0},94).to({scaleY:2.1046,y:-114.35},15).wait(1).to({scaleY:2.1047,y:-114.3},0).to({startPosition:0},93).to({scaleY:2.1046,y:-114.35},1).to({scaleY:1.0409,y:-112.1},15).wait(1));

	// Layer_10
	this.instance_14 = new lib.shape57("synched",0);
	this.instance_14.setTransform(-11.5,15);

	this.timeline.addTween(cjs.Tween.get(this.instance_14).to({startPosition:0},44).to({y:49.05},14).wait(1).to({y:51.5},0).to({startPosition:0},94).to({y:17.45},14).wait(1).to({y:15},0).to({startPosition:0},95).to({y:51.5},15).wait(1));

	// Layer_8
	this.instance_15 = new lib.shape56("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(279));

	// Layer_6
	this.instance_16 = new lib.text55("synched",0);
	this.instance_16.setTransform(10.75,-166.15);

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(279));

	// Layer_5
	this.instance_17 = new lib.text55("synched",0);
	this.instance_17.setTransform(-54.95,-166.15);

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(279));

	// Layer_4
	this.instance_18 = new lib.text54("synched",0);
	this.instance_18.setTransform(47.95,-93.15);

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(279));

	// Layer_3
	this.instance_19 = new lib.text54("synched",0);
	this.instance_19.setTransform(-92,-93.15);

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(279));

	// Layer_2
	this.instance_20 = new lib.shape53("synched",0);
	this.instance_20.setTransform(0,0,1.0003,1);

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(279));

	// Layer_1
	this.instance_21 = new lib.shape52("synched",0);
	this.instance_21.setTransform(-27,59.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_21).to({startPosition:0},44).to({x:-26.8,y:87.9},13).wait(1).to({y:90.1},0).to({startPosition:0},95).to({x:-27,y:61.6},13).wait(1).to({y:59.4},0).to({startPosition:0},96).to({x:-26.8,y:90.1},15).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-175.3,-294.6,349.70000000000005,467.8);


(lib.sprite13 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1110 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1110).call(this.frame_1110).wait(1));

	// Masked_Layer_4___2
	this.instance = new lib.text8("synched",0);
	this.instance.setTransform(-500,-168);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1111));

	// Masked_Layer_3___2
	this.instance_1 = new lib.text6("synched",0);
	this.instance_1.setTransform(-500,-200);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1111));

	// Layer_1
	this.instance_2 = new lib.shape3("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1111));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-504,-203,931.3,371.5);


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


(lib.sprite79 = function(mode,startPosition,loop,reversed) {
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
	this.frame_1136 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(1136).call(this.frame_1136).wait(1));

	// Masked_Layer_34___32
	this.instance = new lib.text74("synched",0);
	this.instance.setTransform(-494.15,-164.15);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1137));

	// Masked_Layer_33___32
	this.instance_1 = new lib.text73("synched",0);
	this.instance_1.setTransform(-496,-196.95);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1137));

	// Layer_1
	this.instance_2 = new lib.sprite71();
	this.instance_2.setTransform(197.95,44.75,0.8227,0.8227);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1137));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-500,-199.9,841.4,361.1);


// stage content:
(lib.AIR_COMP = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {p1:0,p2:1111,p3:2243,p4:2896,p5:3765,p6:4733,p7:5610,p8:6646,p9:7927,p10:9435,p11:10619};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,1,1109,1110,1111,1112,2241,2242,2243,2244,2894,2895,2896,2897,3763,3764,3765,3766,4731,4732,4733,4734,5608,5609,5610,5611,6644,6645,6646,6647,7925,7926,7927,7928,9433,9434,9435,9436,10617,10618,10619,10620,11876];
	this.streamSoundSymbolsList[1] = [{id:"air_comp1",startFrame:1,endFrame:1110,loop:1,offset:0}];
	this.streamSoundSymbolsList[1112] = [{id:"air_comp2",startFrame:1112,endFrame:2240,loop:1,offset:0}];
	this.streamSoundSymbolsList[2244] = [{id:"air_comp3_rrrrr",startFrame:2244,endFrame:2895,loop:1,offset:0}];
	this.streamSoundSymbolsList[2897] = [{id:"air_comp4",startFrame:2897,endFrame:3764,loop:1,offset:0}];
	this.streamSoundSymbolsList[3766] = [{id:"air_comp5",startFrame:3766,endFrame:4732,loop:1,offset:0}];
	this.streamSoundSymbolsList[4734] = [{id:"air_comp6",startFrame:4734,endFrame:5608,loop:1,offset:0}];
	this.streamSoundSymbolsList[5611] = [{id:"air_comp7",startFrame:5611,endFrame:6645,loop:1,offset:0}];
	this.streamSoundSymbolsList[6647] = [{id:"air_comp8",startFrame:6647,endFrame:7926,loop:1,offset:0}];
	this.streamSoundSymbolsList[7928] = [{id:"air_comp9_rrrrr",startFrame:7928,endFrame:9434,loop:1,offset:0}];
	this.streamSoundSymbolsList[9436] = [{id:"air_comp10",startFrame:9436,endFrame:10618,loop:1,offset:0}];
	this.streamSoundSymbolsList[10620] = [{id:"air_comp11",startFrame:10620,endFrame:11876,loop:1,offset:0}];
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
		
		//-------------------------------------
		// スライダー操作関連
		//-------------------------------------
		// 再生/停止ボタンクリック
		this.playpau.addEventListener("click", ClickPlayPau);
		// リプレイボタンクリック
		this.replay.addEventListener("click", ClickReplay);
	}
	this.frame_1 = function() {
		var soundInstance = playSound("air_comp1",0);
		this.InsertIntoSoundStreamData(soundInstance,1,1110,1);
	}
	this.frame_1109 = function() {
		this.stop();
	}
	this.frame_1110 = function() {
		this.stop();
	}
	this.frame_1111 = function() {
		Prev(1);
		InitAnim();
	}
	this.frame_1112 = function() {
		var soundInstance = playSound("air_comp2",0);
		this.InsertIntoSoundStreamData(soundInstance,1112,2240,1);
	}
	this.frame_2241 = function() {
		this.stop();
	}
	this.frame_2242 = function() {
		this.stop();
	}
	this.frame_2243 = function() {
		InitAnim();
	}
	this.frame_2244 = function() {
		var soundInstance = playSound("air_comp3_rrrrr",0);
		this.InsertIntoSoundStreamData(soundInstance,2244,2895,1);
	}
	this.frame_2894 = function() {
		this.stop();
	}
	this.frame_2895 = function() {
		this.stop();
	}
	this.frame_2896 = function() {
		InitAnim();
	}
	this.frame_2897 = function() {
		var soundInstance = playSound("air_comp4",0);
		this.InsertIntoSoundStreamData(soundInstance,2897,3764,1);
	}
	this.frame_3763 = function() {
		this.stop();
	}
	this.frame_3764 = function() {
		this.stop();
	}
	this.frame_3765 = function() {
		InitAnim();
	}
	this.frame_3766 = function() {
		var soundInstance = playSound("air_comp5",0);
		this.InsertIntoSoundStreamData(soundInstance,3766,4732,1);
	}
	this.frame_4731 = function() {
		this.stop();
	}
	this.frame_4732 = function() {
		this.stop();
	}
	this.frame_4733 = function() {
		InitAnim();
	}
	this.frame_4734 = function() {
		var soundInstance = playSound("air_comp6",0);
		this.InsertIntoSoundStreamData(soundInstance,4734,5608,1);
	}
	this.frame_5608 = function() {
		this.stop();
	}
	this.frame_5609 = function() {
		this.stop();
	}
	this.frame_5610 = function() {
		InitAnim();
	}
	this.frame_5611 = function() {
		var soundInstance = playSound("air_comp7",0);
		this.InsertIntoSoundStreamData(soundInstance,5611,6645,1);
	}
	this.frame_6644 = function() {
		this.stop();
	}
	this.frame_6645 = function() {
		this.stop();
	}
	this.frame_6646 = function() {
		InitAnim();
	}
	this.frame_6647 = function() {
		var soundInstance = playSound("air_comp8",0);
		this.InsertIntoSoundStreamData(soundInstance,6647,7926,1);
	}
	this.frame_7925 = function() {
		this.stop();
	}
	this.frame_7926 = function() {
		this.stop();
	}
	this.frame_7927 = function() {
		InitAnim();
	}
	this.frame_7928 = function() {
		var soundInstance = playSound("air_comp9_rrrrr",0);
		this.InsertIntoSoundStreamData(soundInstance,7928,9434,1);
	}
	this.frame_9433 = function() {
		this.stop();
	}
	this.frame_9434 = function() {
		this.stop();
	}
	this.frame_9435 = function() {
		Next(1);
		InitAnim();
	}
	this.frame_9436 = function() {
		var soundInstance = playSound("air_comp10",0);
		this.InsertIntoSoundStreamData(soundInstance,9436,10618,1);
	}
	this.frame_10617 = function() {
		this.stop();
	}
	this.frame_10618 = function() {
		this.stop();
	}
	this.frame_10619 = function() {
		Next(0);
		InitAnim();
	}
	this.frame_10620 = function() {
		var soundInstance = playSound("air_comp11",0);
		this.InsertIntoSoundStreamData(soundInstance,10620,11876,1);
	}
	this.frame_11876 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1108).call(this.frame_1109).wait(1).call(this.frame_1110).wait(1).call(this.frame_1111).wait(1).call(this.frame_1112).wait(1129).call(this.frame_2241).wait(1).call(this.frame_2242).wait(1).call(this.frame_2243).wait(1).call(this.frame_2244).wait(650).call(this.frame_2894).wait(1).call(this.frame_2895).wait(1).call(this.frame_2896).wait(1).call(this.frame_2897).wait(866).call(this.frame_3763).wait(1).call(this.frame_3764).wait(1).call(this.frame_3765).wait(1).call(this.frame_3766).wait(965).call(this.frame_4731).wait(1).call(this.frame_4732).wait(1).call(this.frame_4733).wait(1).call(this.frame_4734).wait(874).call(this.frame_5608).wait(1).call(this.frame_5609).wait(1).call(this.frame_5610).wait(1).call(this.frame_5611).wait(1033).call(this.frame_6644).wait(1).call(this.frame_6645).wait(1).call(this.frame_6646).wait(1).call(this.frame_6647).wait(1278).call(this.frame_7925).wait(1).call(this.frame_7926).wait(1).call(this.frame_7927).wait(1).call(this.frame_7928).wait(1505).call(this.frame_9433).wait(1).call(this.frame_9434).wait(1).call(this.frame_9435).wait(1).call(this.frame_9436).wait(1181).call(this.frame_10617).wait(1).call(this.frame_10618).wait(1).call(this.frame_10619).wait(1).call(this.frame_10620).wait(1256).call(this.frame_11876).wait(1));

	// Layer_52
	this.instance = new lib.text30("synched",0);
	this.instance.setTransform(10,0,1.585,1.585);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(11877));

	// Layer_126_page
	this.page = new cjs.Text("Page number", "italic bold 15px 'Arial'", "#FF9900");
	this.page.name = "page";
	this.page.lineHeight = 17;
	this.page.lineWidth = 193;
	this.page.parent = this;
	this.page.setTransform(23,658,1.4989,1.4989);

	this.timeline.addTween(cjs.Tween.get(this.page).wait(11877));

	// Layer_116_next
	this.next = new lib.button94();
	this.next.name = "next";
	this.next.setTransform(1496.1,5.1,0.9998,0.9999,0,0,0,0.1,0.1);
	new cjs.ButtonHelper(this.next, 0, 1, 2, false, new lib.button94(), 3);

	this.timeline.addTween(cjs.Tween.get(this.next).wait(11877));

	// Layer_111_previous
	this.previous = new lib.button87();
	this.previous.name = "previous";
	this.previous.setTransform(1432,5,1.0003,0.9993);
	new cjs.ButtonHelper(this.previous, 0, 1, 2, false, new lib.button87(), 3);

	this.timeline.addTween(cjs.Tween.get(this.previous).wait(11877));

	// Layer_108_slider
	this.slider = new lib.sprite822();
	this.slider.name = "slider";
	this.slider.setTransform(610.1,670.1,0.9937,0.9983,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.slider).wait(11877));

	// Layer_101_replay
	this.replay = new lib.sprite782();
	this.replay.name = "replay";
	this.replay.setTransform(1045.1,650.1,0.9999,0.9999,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.replay).wait(11877));

	// Layer_95_slider_base
	this.instance_1 = new lib.sprite75();
	this.instance_1.setTransform(600,650,1,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(11877));

	// Layer_89_playpau
	this.playpau = new lib.sprite712();
	this.playpau.name = "playpau";
	this.playpau.setTransform(555,650,0.9999,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.playpau).wait(11877));

	// Mask_Layer_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("Eh8/AyyMAAAhfTMD5/AAAMAAABfTg");
	mask.setTransform(800,325);

	// Masked_Layer_2___1
	this.ani1 = new lib.sprite13();
	this.ani1.name = "ani1";
	this.ani1.setTransform(825,374.5,1.585,1.585);

	this.ani2 = new lib.sprite79();
	this.ani2.name = "ani2";
	this.ani2.setTransform(825,374.5,1.585,1.585);

	this.ani3 = new lib.sprite88();
	this.ani3.name = "ani3";
	this.ani3.setTransform(825,353.9,1.585,1.585);

	this.ani4 = new lib.sprite114();
	this.ani4.name = "ani4";
	this.ani4.setTransform(825,374.5,1.585,1.585);

	this.ani5 = new lib.sprite128();
	this.ani5.name = "ani5";
	this.ani5.setTransform(825,374.5,1.585,1.585);

	this.ani6 = new lib.sprite136();
	this.ani6.name = "ani6";
	this.ani6.setTransform(825,374.5,1.585,1.585);

	this.ani7 = new lib.sprite151();
	this.ani7.name = "ani7";
	this.ani7.setTransform(825,374.5,1.585,1.585);

	this.ani8 = new lib.sprite164();
	this.ani8.name = "ani8";
	this.ani8.setTransform(825,374.5,1.585,1.585);

	this.ani9 = new lib.sprite173();
	this.ani9.name = "ani9";
	this.ani9.setTransform(825,374.5,1.585,1.585);

	this.ani10 = new lib.sprite183();
	this.ani10.name = "ani10";
	this.ani10.setTransform(825,374.5,1.585,1.585);

	this.ani11 = new lib.sprite195();
	this.ani11.name = "ani11";
	this.ani11.setTransform(825,374.5,1.585,1.585);

	var maskedShapeInstanceList = [this.ani1,this.ani2,this.ani3,this.ani4,this.ani5,this.ani6,this.ani7,this.ani8,this.ani9,this.ani10,this.ani11];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.ani1}]}).to({state:[{t:this.ani2}]},1111).to({state:[{t:this.ani3}]},1132).to({state:[{t:this.ani4}]},653).to({state:[{t:this.ani5}]},869).to({state:[{t:this.ani6}]},968).to({state:[{t:this.ani7}]},877).to({state:[{t:this.ani8}]},1036).to({state:[{t:this.ani9}]},1281).to({state:[{t:this.ani10}]},1508).to({state:[{t:this.ani11}]},1184).wait(1258));

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
		{src:"images/AIR_COMP_atlas_1.png", id:"AIR_COMP_atlas_1"},
		{src:"images/AIR_COMP_atlas_2.png", id:"AIR_COMP_atlas_2"},
		{src:"images/AIR_COMP_atlas_3.png", id:"AIR_COMP_atlas_3"},
		{src:"images/AIR_COMP_atlas_4.png", id:"AIR_COMP_atlas_4"},
		{src:"images/AIR_COMP_atlas_5.png", id:"AIR_COMP_atlas_5"},
		{src:"images/AIR_COMP_atlas_6.png", id:"AIR_COMP_atlas_6"},
		{src:"images/AIR_COMP_atlas_7.png", id:"AIR_COMP_atlas_7"},
		{src:"images/AIR_COMP_atlas_8.png", id:"AIR_COMP_atlas_8"},
		{src:"sounds/air_comp1.mp3", id:"air_comp1"},
		{src:"sounds/air_comp10.mp3", id:"air_comp10"},
		{src:"sounds/air_comp11.mp3", id:"air_comp11"},
		{src:"sounds/air_comp2.mp3", id:"air_comp2"},
		{src:"sounds/air_comp3_rrrrr.mp3", id:"air_comp3_rrrrr"},
		{src:"sounds/air_comp4.mp3", id:"air_comp4"},
		{src:"sounds/air_comp5.mp3", id:"air_comp5"},
		{src:"sounds/air_comp6.mp3", id:"air_comp6"},
		{src:"sounds/air_comp7.mp3", id:"air_comp7"},
		{src:"sounds/air_comp8.mp3", id:"air_comp8"},
		{src:"sounds/air_comp9_rrrrr.mp3", id:"air_comp9_rrrrr"}
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