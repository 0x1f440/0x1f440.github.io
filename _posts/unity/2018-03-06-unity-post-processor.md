---
public: true
category: "unity"
title: "편한 텍스쳐 임포트를 위한 유니티 포스트 프로세서 만들기"
tags: ["gamedev", "unity", "texture"]
excerpt: "도트 그래픽의 게임을 만들 경우, 필터모드가 `Bilinear`라면 경계부분이 흐려져 버리게 된다."

references_link: https://answers.unity.com/questions/55118/changing-texture-import-default-settings.html
references_book: []
recommend_tags: []

layout: post
group: wiki

created : 2018-03-06 13:03:30 +0900
updated : 2018-03-06 13:03:30 +0900
---


유니티의 기본 필터모드는 `Bilinear`로 되어 있다.
그러나 도트 그래픽의 게임을 만들 경우, 필터모드가 `Bilinear`라면 경계부분이 흐려져 버리게 된다.
그렇기 때문에 픽셀 아트 스타일의 `FilterMode`를 `Point`로 바꾸어 주어야 한다.

나는 개발 초기에 필터모드에 관한 지식이 없었기 때문에 이 사실을 깨달았을 땐 수많은 스프라이트를 이미 게임에 임포트해둔 상태였다.
또한, 앞으로 새로 만들어질 스프라이트마다 필터 모드를 바꾸기도 참 귀찮은 일이다.

위의 목적을 달성하기 위해 아래와 같은 스크립트를 작성했고,
Assets/Editor에 넣고 이미지 애샛들을 다시 임포트 시켰다.

~~~~
using UnityEngine;
using UnityEditor;

public class TexturePostProcessor : AssetPostprocessor
{
 void OnPostprocessTexture(Texture2D texture)
 {
    TextureImporter importer = assetImporter as TextureImporter;
    TextureImporterSettings textureImporterSettings = new TextureImporterSettings();
    
    importer.filterMode = FilterMode.Point;
    importer.ReadTextureSettings(textureImporterSettings);
    
    importer.SetTextureSettings(textureImporterSettings);
 }
}
~~~~

꽤 간단한 코드로 큰 효과를 얻을 수 있다!