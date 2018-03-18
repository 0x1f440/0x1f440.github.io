---
layout: post
title:  "유니티에서 현재 재생되고 있는 모든 사운드 끄기"
date:  2018-03-19
group: blog
tags: ["Unity"]
---
```c#
 //Stop all sounds
 private AudioSource[] allAudioSources;

 void StopAllAudio() {
     allAudioSources = FindObjectsOfType(typeof(AudioSource)) as AudioSource[];
     foreach( AudioSource audioS in allAudioSources) {
         audioS.Stop();
     }
 }
 ```
[참고 링크 : How to Stop all audio](https://answers.unity.com/questions/194110/how-to-stop-all-audio.html)
