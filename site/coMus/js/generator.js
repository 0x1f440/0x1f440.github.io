
var _v_key      = "WeAddaBabyEetsABoy"; // change this to refresh the seed
var _roots      = "C Db D Eb E F F# G Ab A Bb".split(" ");
var _modes      = "maj min".split(" ");
var _hold       = "HOLD";
var _container  = document.getElementById("staff-container");
var _staff      = document.getElementById("staff");
var _midi       = document.getElementById("midi");
var _min_oct    = 2;
var _max_oct    = 5;
var _playing    = false;
var _res        = 8;
var _curr_meas  = 0;
var _curr_note  = 0;
var _scale      = [];
var _measures   = [];
var _abc        = "";
var _total_abc  = "";
var _treb_abc   = "";
var _bass_abc   = "";
var _gen_meas   = 0;
var _meas_gen   = 4;
var _first_one  = true;

var _bpm        = null;
var _generator  = null;
var _len_seqs   = null;
var _mode       = null;
var _output     = null;
var _root       = null;
var _seed       = null;
var _synth      = null;


// console.clear();

var APP = {};
var seed = "";
var points = [];
var count = 0;
var typecounter;
var types = ['sine', 'square', 'triangle','sawtooth'];
var bpmMade = 60;

var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var started = false;
// There's a bug that happens occasionally. Intercept it.
// a seed that triggers it: d12d21ddd
window.ABCJS.parse.each = function(a, d, c) {
  var e = (a === undefined) ? 0 : a.length;
  // for (var b = 0, e = a.length; b < e; b++) {
  // ^^ this is the code that gets around it
  for (var b = 0; b < e; b++) {
    d.apply(c, [a[b], b])
  }
}

//작곡

document.getElementById("load").addEventListener("click", function(e) {

  document.getElementById("song-title").style.display="inline-block";
  document.getElementById("play").style.display="block";
  if(seed) {
    // if(seed.match(/^[A-Za-z0-9]+$/g)) {
      started = true;
      document.getElementById("myCanvas").style.backgroundColor = '#000000';
      document.getElementById("title").style.display = "none";
      document.getElementById("factor").style.margin = 0;
      document.getElementById("factor").style.float = "right";
      document.getElementById("title-select").style.right = 0;
      document.getElementById("factor").style.color = "white";
      document.getElementById("factor").style.fontSize = "12px";
      document.getElementById("factor").style.width = "100px";
      document.getElementById("factor").style.textAlign ="right";
    //  document.getElementById("play").style.display = "block";

      APP.MusicGenerator.init(seed);

    //document.getElementById("play").setAttribute("data-playing", "true");
      APP.MusicGenerator.play();
      // document.getElementById("play").addEventListener("click", function(e) {
      //   var $el = e.target;
      //   if($el.getAttribute("data-playing") === "true") {
      //     APP.MusicGenerator.pause();
      //     $el.setAttribute("data-playing", "false");
      //     $el.innerHTML = "<i class='fas fa-play'></i>";
      //     //APP.MusicGenerator.report();
      //   } else {
      //     APP.MusicGenerator.play();
      //     $el.innerHTML = "<i class='fas fa-pause'></i>";
      //     $el.setAttribute("data-playing", "true");
      //   }
      // });

      countdown();
      //document.getElementById("play").focus();

    // } else {
    //   alert("Letters and numbers only");
    // }
  } else {
    alert("화면을 클릭해주세요.");
  }

  document.getElementById("load").style.display = "none";
});

function countdown() {
    var seconds = 60;
    var width = 0;
    function tick() {
        //This script expects an element with an ID = "counter". You can change that to what ever you want.
        var counter = document.getElementById("counter");
        seconds--;
        //counter.innerHTML = "0:" + (seconds < 10 ? "0" : "") + String(seconds);
        if( seconds > 0 ) {
            width = 100 - (1.66 * seconds);
            document.getElementById("progress-bar").style.width = width + "%";
            setTimeout(tick, 1000);

        } else {
            //counter.innerHTML = "끝~"
            document.getElementById("progress-bar").style.width = "100%";
            document.getElementById("myCanvas").style.backgroundColor = '#ffffff';
            APP.MusicGenerator.pause();
            document.getElementById("end").style.display = "block";
            document.getElementById("staff").style.display = "none";
            document.getElementById("bottom-bar").style.display = "none";
            APP.MusicGenerator.report();

        }
    }
    tick();
}

(function() {

  APP.MusicGenerator = {};



  APP.MusicGenerator.init = function(seed) {
    _staff.innerHTML = "";
    _seed = seed + _v_key;
    _setGenerator(_seed);
    //_setKey();
    if(!_synth) _setSynth();
    _setTransport();
    _genStaff();
    _renderStaff();

    _genLengthSequences();
    _genScale();

    _addMeasure(_meas_gen);
  };

  APP.MusicGenerator.play = playPlayer;
  APP.MusicGenerator.pause = pausePlayer;
  APP.MusicGenerator.report = reportData;

  //////////////
  // PUBLIC METHODS
  //////////////

  // play the player
  function playPlayer() {
    _midi.innerHTML = "";
    Tone.Transport.start();
  }

  // pause the player
  function pausePlayer() {
    Tone.Transport.stop();
  }

  // reporting the data
  function reportData() {
    _output = {
      root: _root, mode: _mode, resolution: _res,
      scale: _scale, measures: _measures, abc: _total_abc
    };
    ABCJS.renderMidi(_midi, _total_abc , {}, {}, {});
    console.log(_total_abc);
    console.log(_output);

    document.getElementById("midi").childNodes[1].innerHTML = "<i class='fas fa-cloud-download-alt'></i>";
  }





  //////////////
  // PRIVATE METHODS
  //////////////

  // get a unique random number generator based on the seed
  function _setGenerator(seed) {
    _generator = new Math.seedrandom(seed);
  }

  // play the bass and treble notes
  function _playSong() {
    var measure = _measures[_curr_meas];
    if(measure) {
      var treb = measure.treb[_curr_note];
      var bass = measure.bass[_curr_note];
      if(treb.chord) {
        _synth.triggerAttackRelease(treb.chord, treb.len + "n");
      }
      if(bass.chord) {
        _synth.triggerAttackRelease(bass.chord, bass.len + "n");
      }
      if(_curr_note + _curr_meas === 0) {
        var hidden = document.querySelector(".hide");
        if(hidden) hidden.className = "";
      }
      _curr_note++;
      if(_curr_note >= _res) {
        _curr_note = 0;
        _curr_meas++;
        if(_gen_meas % _meas_gen === 0) {
          _addMeasure(_meas_gen);
        } else if (_gen_meas % _meas_gen === 3) {
          // scroll to the bottom of container
          var hidden = document.querySelector(".hide");
          if(hidden) hidden.className = "";
          _utilScrollTo(_container, _container.scrollHeight, 500);
        }
        _gen_meas++;
      }
    } else {
      pausePlayer();
    }
  }

  // add a measure to the sequence
  function _addMeasure(how_many, loaded) {
    loaded = loaded || 0;
    var get_measure = _getMeasure();
    get_measure.then(function(measure) {
      loaded++;
      // console.log("_getMeasure", measure);
      _measures.push(measure);
      _staffABC(measure);
      if(loaded < how_many) {
        _addMeasure(how_many, loaded);
      } else {
        _renderStaff();
      }
    });
  }

  // generate a measure's worth of notes
  function _getMeasure() {
    return new Promise(function(resMeasure, rejMeasure) {
      var data = {
        scale: _scale.length / 2,
        bass: { max_notes: 1, offset: 0 },
        treb: { max_notes: 3, offset: Math.floor(_scale.length / 2) }
      };
      var measure = {
        bass: [], treb: []
      };

      // for each clef
      var get_treb = _getClef('treb', data);
      get_treb.then(function(t) {
        // console.log("_getClef: t", t);
        measure.treb = measure.treb.concat(t);
        var get_bass = _getClef('bass', data);
        get_bass.then(function(b) {
          // console.log("_getClef: b", b);
          measure.bass = measure.bass.concat(b);
          resMeasure(measure);
        }, function(b) {
          rejMeasure(b);
        });
      }, function(t) {
        rejMeasure(t);
      });
    });
  }

  // generate notes for a clef
  function _getClef(clef_name, data) {
    return new Promise(function(resClef, rejClef) {
      var _clef_generator = new Math.seedrandom(_generator.int32() + "");
      // find a sequence
      var seq = _len_seqs[Math.floor(_clef_generator.quick() * _len_seqs.length)];
      // shuffle the sequence order
      _utilShuffleArray(seq);

      // set the data
      var max_notes = data[clef_name].max_notes;
      var note_offset = data[clef_name].offset;

      var chord_promises = [];
      // for each length in sequence
      for(var s = 0; s < seq.length; s++) {
        // generate x notes for a random bass count. no rests.
        var note_count = Math.ceil(_clef_generator.quick() * max_notes);
        // generate random note length
        var note_length = seq[s];
        chord_promises.push(_getChord(_clef_generator, data.scale, note_offset, note_count, note_length));
      }

      Promise.all(chord_promises).then(function(chords) {
        var clef = [];
        // console.log("_getChord: promises", chords);
        for(var i = 0; i < chords.length; i++) {
          var chord = chords[i];
          clef.push(chord);
          if(chord.len) {
            var chord_length_i = _res / chord.len;
            for(var e = 0; e < chord_length_i - 1; e++) {
              clef.push(_hold);
            }
          }
        }
        resClef(clef);
      }, function(chords) {
        rejClef(chords);
      });

    });
  }

  // generate the chord notes
  function _getChord(_clef_generator, scale, offset, note_count, note_length) {

    return new Promise(function(resNotes, rejNotes) {
      // used note indexes
      var used_note_indexes = [];
      var note_promises = [];
      // generate the notes
      for(var i = 0; i < note_count; i++) {
        note_promises.push(_getNote(_clef_generator, scale, offset, used_note_indexes));
      }
      Promise.all(note_promises).then(function(chord) {
        // console.log("_getNote: promises", chord);
        var abc = _getABC(chord, note_length);
        // add notes to measure
        resNotes({ abc: abc, chord: chord, len: note_length });
      }, function(chord) {
        rejNotes(chord);
      });
    });
  }

  // generate a note
  function _getNote(_clef_generator, scale, offset, used_note_indexes) {
    return new Promise(function(resNote, rejNote) {
      // add the note to the chord
      resNote(_note());

      function _note() {
        // get a random index
        var index = Math.floor(_clef_generator.quick() * scale) + offset;
        // for measuring note is a "good" one.
        var good_note = true;
        // ensure we havent selected this index
        if(used_note_indexes.indexOf(index) !== -1) good_note = false;
        // or one below it
        if(index > 0 && used_note_indexes.indexOf(index - 1) !== -1) good_note = false;
        // or one above it
        if(used_note_indexes.indexOf(index + 1) !== -1) good_note = false;

        // if we found a good note
        if(good_note) {
          // add the index to the used array
          used_note_indexes.push(index);
          // grab the note
          var note = _scale[index];
          // build the tone version of the note
          var n = note.note + note.octave;
          return n;
        } else {
          return _note();
        }
      }
    });
  }





  //////////////
  // ABC MUSICAL NOTATION
  //////////////

  // get abc notation for notes at a certain length
  function _getABC(notes, len) {
    if(!len) return "";
    var str = notes.length > 1 ? "[" : "";
    for(var n = 0; n < notes.length; n++) {
      str += _ABCNotation(notes[n], len);
    }
    str += notes.length > 1 ? "]" : "";
    return str;
  }

  // render the current abc to staff
  function _renderStaff() {
    var $par = document.createElement("div");
    if(_first_one) {
      _first_one = false;
    } else {
      $par.className = "hide";
    }
    var $el = document.createElement("div");
    // beats per second times four beats * measures per line * 1 second
    $par.appendChild($el);
    _staff.appendChild($par);
    _abc += _treb_abc;
    _abc += "\n" + _bass_abc;
    var cleaned = _abc;
    _total_abc += cleaned;
    _abc = _genStaffHeader();
    _treb_abc = "[V: 1] ";
    _bass_abc = "[V: 2] ";
    _renderABC($el, cleaned);
  }

  function _renderABC(el, abc) {
    console.log(abc);
    ABCJS.renderAbc(el, abc, {}, { //악보 그려줌
      paddingright: 0,
      paddingleft: 0,
      scale: 1,
      add_classes: true,
      responsive: "resize"
    });
  }

  // take a measure and generate the abc output
  function _staffABC(measure) {
    var abc = "";
    // TODO: every two measures new line with _gen_meas, _treb_abc, _bass_abc
    for(var i = 0; i < measure.treb.length; i++) {
      if(measure.treb[i].abc) {
        _treb_abc += measure.treb[i].abc + " ";
      }
    }
    for(var i = 0; i < measure.bass.length; i++) {
      if(measure.bass[i].abc) {
        _bass_abc += measure.bass[i].abc + " ";
      }
    }
    _treb_abc = _treb_abc.replace(/ $/g, "|");
    _bass_abc = _bass_abc.replace(/ $/g, "|");

    // abc += [treb, bass].join("\n");
    // return abc;
  }


  // set the initial staff
  function _genStaff() {
    _abc = [
      "M:/4/4",
      "O:I",
      "R:R",
      "Q:1/4=" + _bpm,
      "",
      "X:2",
      "T:" + _seed.replace(_v_key, ""),
      "C:" + _root.replace(/b$/g, "♭") + " " + _mode + ", " + _bpm + " bpm",
    ].join("\n");
  }

  // generate the staff header
  function _genStaffHeader() {
    return [
      "K:" + _root + _mode,
      "L:1/" + _res,
      "%%staves {1 2}",
      "V: 1 clef=treble",
      "V: 2 clef=bass",
      ""
    ].join("\n");
  }

  // abc notation
  function _ABCNotation(note, length) {
    // note = note.replace(/([A-G])b/,"_$1");

    // TODO: know if this is needed based on mode.
    note = note.replace(/([A-G])b/,"$1");
    note = note
      .replace(/(.)1/, "$1,,,")
      .replace(/(.)2/, "$1,,")
      .replace(/(.)3/, "$1,")
      .replace(/(.)4/, "$1");
    if(note.match(/(.)5|6/)) {
      note = note
        .replace(/(.)5/, "$1")
        .replace(/(.)6/, "$1'")
        .toLowerCase();
    }
    note += _res / length;
    return note;
  }





  //////////////
  // DATA
  //////////////

  // generate the scale
  function _genScale() {
    // generate the scale
    var _steps_lib = _genStepsLib();
    var _notes_lib = _genNotesLib();
    var steps = _steps_lib;
    var start = _notes_lib.indexOf(_root + _min_oct);
    var last_note = (_max_oct - _min_oct) * 8;
    for(var o = 0; o < last_note; o++) {
      var index = start + steps[o % steps.length] + (Math.floor(o / steps.length) * 12);
      var note = _notes_lib[index];
      if(note) {
        _scale.push({ note: note.match(/[^\d]+/)[0], octave: note.match(/\d/)[0] });
      }
    }
    if(!_scale.length) console.error("Too high up. Lower the octave or note count.");
  }

  // potential combinations of note lengths
  // this could be done programmatically.
  function _genLengthSequences() {
    _len_seqs = [
      [1],
      [2,2],
      [2,4,4],
      [2,4,8,8],
      [4,4,4,4],
      [2,8,8,8,8],
      [4,4,4,8,8],
      [8,8,8,8,8,8,8,8],
      // [2,4,8,16,16],
      // [2,4,16,16,16,16],
      // [2,8,8,8,16,16],
      // [2,8,8,16,16,16,16],
      // [2,8,16,16,16,16,16,16],
      // [2,16,16,16,16,16,16,16,16],
      // [4,4,4,8,16,16],
      // [4,4,4,16,16,16,16],
      // [4,4,8,8,16,16,16,16],
      // [4,4,8,16,16,16,16,16,16],
      // [4,4,16,16,16,16,16,16,16,16],
      // [4,8,8,16,16,16,16,16,16,16,16],
      // [4,8,16,16,16,16,16,16,16,16,16,16],
      // [4,16,16,16,16,16,16,16,16,16,16,16,16],
      // [8,8,8,8,8,8,8,16,16],
      // [8,8,8,8,8,8,16,16,16,16],
      // [8,8,8,8,8,16,16,16,16,16,16],
      // [8,8,8,8,16,16,16,16,16,16,16,16],
      // [8,8,8,16,16,16,16,16,16,16,16,16,16],
      // [8,8,16,16,16,16,16,16,16,16,16,16,16,16],
      // [8,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
      // [16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
    ];
  }

  // set the notes for the key
  function _genStepsLib() {
    // generate major and minor integer step arrays from whole/half notation
    // whole/half note steps for minor and major
    var mode = {
      // ionian:     "W W H W W W H",
      // dorian:     "W H W W W H W",
      // phrygian:   "H W W W H W W",
      // lydian:     "W W W H W W H",
      // mixolydian: "W W H W W H W",
      // aeolian:    "W H W W H W W",
      // locrian:    "H W W H W W W",
      maj:        "W W H W W W H",
      min:        "W H W W H W W",
    }[_mode].split(" ");
    // start each with root step
    var steps = [0];

    // loop through
    var step = 0;
    for(var s = 0; s < mode.length; s++) {
      var key = mode[s];
      if(key === "W") {
        steps.push(steps[s] + 2);
      } else if(key == "WH") {
        steps.push(steps[s] + 3);
      } else {
        steps.push(steps[s] + 1);
      }
      step++;
    }
    return steps;
  }

  // generate every possible note/octave pairing in order
  function _genNotesLib() {
    var notes = [];
    for(var i = 0; i < 9; i++) {
      var n = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
      for(var x = 0; x < n.length; x++) notes.push(n[x] + i);
    }
    return notes;
  }



  //////////////
  // TONE.js
  //////////////

  // set the tone js transport
  function _setTransport() {
    _bpm = bpmMade;
    Tone.Transport.bpm.value = _bpm;
    Tone.Transport.scheduleRepeat(function(time) {
      _playSong();
    }, _res + "n");
  }

  // set the synthesizer
  function _setSynth() {


    // master compression
    var multiband = new Tone.MultibandCompressor({
      lowFrequency: 200,
      highFrequency: 1300,
      low: { threshold: -12 }
     });

    var reverb = new Tone.Freeverb();
        reverb.roomSize.value = 0.6;
        reverb.wet.value = 0.2;

    Tone.Master.chain(reverb, multiband);

    // _synth = new Tone.PolySynth(6, Tone.SimpleAM).toMaster();
    _synth = new Tone.PolySynth(6, Tone.SimpleSynth).toMaster();
    _synth.set({
      oscillator: {
        type: types[typecounter]
      },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    });

//     _synth.set({
//       envelope: {
//         attack:  0.5,
//         release: 0.5
//       }
//     });

//     _synth.set("carrier", {
//       volume: -8,
//       oscillator: {
//         type: "triangle8",
//         partials: [1, 0.2, 0.01]
//       },
//       envelope: {
//         attack:  0.05,
//         decay:   0.02,
//         sustain: 0.6,
//         release: 0.8
//       }
//     });

    // _synth.set("modulator", {
    //   volume: -16,
    //   oscillator: {
    //     type: "triangle8",
    //     detune: 0,
    //     phase: 90,
    //     partials: [1, 0.2, 0.01]
    //   },
    //   envelope: {
    //     attack:  0.05,
    //     decay:   0.01,
    //     sustain: 1,
    //     release: 1
    //   }
    // });
  }






  //////////////
  // UTILS
  //////////////

  // shuffle an array
  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function _utilShuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(_generator() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function _utilScrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      _utilScrollTo(element, to, duration - 10);
    }, 10);
  }
}());
