---
layout: post
title:  "[A Tour of C++] 문자열과 정규 표현식"
date:   2020-02-07
group: blog
tags: ["programming"]
references_book: "A tour of C++ (Bjarne Stroustrup)"
recommend_tags: ["A tour of C++"]
---
## 문자열

 - C++표준 라이브러리는 string 타입을 제공함으로써 C에서처럼 포인터를 이용해 문자의 배열을 조작하지 않아도 된다.

    - string은 mutable하다.
    - [ ]을 이용한 인덱싱과 부분 문자열 연산을 제공한다.
    - substr( ) 연산은 인자로 지정된 부분 문자열을 복사한 string을 반환한다.
    - 유용한 string 연산으로는 (=을 이용한) 대입과 ([ ]이나 at( )을 이용한) 인덱싱, (==와 ! =을 이용한) 비교, 사전 순 순서 부여, 반복, 스트리밍 등이 있다.
    - 문자열 리터럴은 const char*다. 그 대신 std::string 타입의 리터럴이 필요하다면 다음과 같이 접미사 s를 사용하자

```
        auto s = "Cat"s // std::string
        auto p = "Dog" // C스타일 문자열: const char* 
```
## string  구현

- 오늘날 string은 보통 짧은 문자열 최적화를 바탕으로 구현된다. 즉, 짧은 문자열 값은 string 객체 자체에 저장되고, 더 긴 문자열인 경우에만 자유 저장소에 저장된다.

    - string의 값이 짧은 문자열에서 긴 문자열로 변경되거나 그 반대의 경우 메모리 표현이 적절히 변경된다
    - 짧은 문자열은 구현에 따라 다르지만 약 문자 14개 정도면 맞을 것이다
    - string의 실제 성능은 런타임 환경에 큰 영향을 받는데 특히 멀티스레딩 구현에서 `메모리 단편화`를 유발할 수도 있다. 이는 짧은 문자열 최적화를 널리 사용하는 주요 이유 중 하나다.

## 문자열 뷰 (string_view)

- string_view 타입을 이용하면 문자열의 저장 방식 (예: std::string이나 char[])에 상관 없이 문자 시퀀스를 조작할 수 있다.

    - string_view를 이용하면 연속적인 문자의 시퀀스에 접근할 수 있다.
    - string_view가 가리키는 문자열을 직접 소유하지 않는다는 점에서 포인터나 참조와 비슷하며, STL의 반복자와도 유사하다.
    - 두 문자열을 합칠 때 장점이 있다. 아래의 예제를 보자.

```
    //문자열을 합치는 간단한 함수
    string cat(string_view sv1, string_view sv2)
    {
    	string res(sv1.length()+sv2.length());
    
    	char* p = &res[0];
    
    	for (char c: sv1) // 복사를 수행하는 한 가지 방법
    		*p++ = c;
    	copy(sv2.begin(), sv2.end(), p); // 다른 방법
    }
    
    //이제 cat을 호출해 보자
    
    string king = "Harold";
    auto s1 = cat(king, "William") // string과 const char*
    auto s2 = cat("Edward", "Stephen"sv); // const char*과 string_view
```

- const string&을 인자로 받는 compose( )에 비해 cat( )에는 세 가지 장점이 있다.
    - 다양한 방식으로 관리되는 문자의 시퀀스에 적용할 수 있다.
    - C스타일 문자열을 인자로 받을 때 임시적인 string 객체가 생성되지 않는다
    - 부분 문자열을 쉽게 전달할 수 있다

## 정규 표현식

정규 표현식은 강력한 텍스트 처리 도구로, 텍스트 안에 존재하는 패턴을 간단히 기술하고 그러한 패턴을 효율적으로 찾을 수 있다.

- 표준 라이브러리 <regex>에서는 다음과 같은 정규 표현식 기능을 제공한다
    - `regex_match()` : 정규 표현식을 (길이를 알고 있는)문자열에 매칭한다.
    - `regex_search()` : (임의의 길이의) 데이터 스트림에 정규 표현식에 매칭되는 문자열을 찾는다.
    - `regex_replace()` : (임의의 길이의) 데이터 스트림에서 정규 표현실에 매칭되는 문자열을 찾아 교체한다
    - `regex_iterator` : 매치와 부분 매치를 찾아 순회한다.
    - `regex_token_iterator` : 매치되지 않는 부분을 순회한다.