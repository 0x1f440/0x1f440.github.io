---
layout: post
title:  "Capslock키를 Ctrl키로 바꾸기"
date:   2018-03-24
group: blog
tags: ["50.etc"]
---

새 컴퓨터를 장만하거나 포맷을 할 때마다 캡스락 키를 컨트롤 키로 바꿔서 쓰고 있다.
캡스락은 잘 쓰지도 않을 뿐더러 눌리면 계속 대문자가 나와서 불편하고,
ctrl+R등의 단축키는 캡스락 자리에 컨트롤 키가 있어야 편하기 때문이다.
<br><br>
방법은 매우 간단하다.
<br><br>
![screenshot](/assets/images/2018/180324.png)

1.regedit을 연다.<br>
2.HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout로 이동한다.<br>
3.Scancode Map이라는 이름으로 new binary value를 만든다.<br>
4.값을 00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00 으로 채운 뒤 재부팅한다.<br>

