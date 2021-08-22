---
public: true
category: "how-to"
title:  "Capslock키를 Ctrl키로 바꾸기"
tags: ["how-to"]
excerpt: "새 컴퓨터를 장만하거나 포맷을 할 때마다 캡스락 키를 컨트롤 키로 바꿔서 쓰고 있다."

references_link: []
references_book: []
recommend_tags: []

layout: post
group: wiki

created : 2018-03-24 00:00:00 +0900
updated : 2018-03-24 00:00:00 +0900
---

새 컴퓨터를 장만하거나 포맷을 할 때마다 캡스락 키를 컨트롤 키로 바꿔서 쓰고 있다.
캡스락은 잘 쓰지도 않을 뿐더러 눌리면 계속 대문자가 나와서 불편하고,
ctrl+R등의 단축키는 캡스락 자리에 컨트롤 키가 있어야 편하기 때문이다.
<br><br>
방법은 매우 간단하다.
<br><br>
![screenshot](/wiki-images/capslock-to-ctrl/capslock-to-ctrl-registry-editor-screenshot.png)

1.regedit을 연다.<br>
2.HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout로 이동한다.<br>
3.Scancode Map이라는 이름으로 new binary value를 만든다.<br>
4.값을 00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00 으로 채운 뒤 재부팅한다.<br>

