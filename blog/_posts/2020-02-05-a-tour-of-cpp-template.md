---
layout: post
title:  "[A Tour of C++] Template"
date:   2020-02-05
group: blog
tags: ["50.C++"]
references_book: "A tour of C++ (Bjarne Stroustrup)"
recommend_tags: ["A tour of C++"]
---

## 템플릿(Template)

> 템플릿이란 타입이나 값의 집합을 파라미터화한 클래스나 함수다

### 소개

- 접두사 template<typename T>는 T를 앞으로 선언할 클래스의 파라미터로 만든다.
```
    template<typename T>
    Vector<T>::Vector(int s)
    {
    	if(s<0)
    		throw Negative_size{};
    	elem = new T[s];
    	sz = s;
    }

    Vector<char> vc(200) // 문자 200개를 포함하는 벡터
    Vector<string> vs(200) // 문자열 200개를 포함하는 벡터
```
- 템플릿은 컴파일 타임에 적용되는 메커니즘이므로 실행 시간에 추가적 성능 부담이 없다

### 값 템플릿 인자


- 템플릿은 타입 인자에 더불어 `값 인자(value argument)`도 받아들일 수 있다.
- 템플릿의 값 인자는 반드시 상수 표현식이여야 한다.
```
    template<typename T, int N>
    struct Buffer{
    	using value_type = T;
    	constexpr int size() { return N; }
    	T[N];
    	//...
    };
```
- 값 인자는 많은 경우에 유용한데, 예로 `Buffer`를 이용하면 자유 저장 영역(동적 메모리)를 사용하지 않고도 임의의 크기를 갖는 버퍼를 만들 수 있다.
```
    Buffer<char, 1024> glob; // (정적으로 할당된) 문자를 저장할 전역 버퍼
    
    void fct()
    {
    	Buffer<int, 10> buf; // (스택에 생성된) 정수를 저장할 지역 버퍼
    }
```
### 템플릿 인자 추론

```
    pair<int, double> p = {1, 5.2};
```
- 위처럼 일일히 타입을 지정하는 게 귀찮다면 make_pair()를 이용하자. 이 함수는 반환할 pair의 템플릿 인자 타입을 함수의 인자로부터 유추한다.
```
  auto p = make_pair(1, 5.2};
```
- C++17부터는 생성자의 인자로부터 유추도 가능하다
```
pair p = {1, 5.2}; // p 는 pair<int, double>
```
- 이러한 추론은 코드를 단순하게 하고 템플릿 인자를 잘못 작성하는 실수를 방지할 수 있다.
- 그러나 템플릿 타입 추론은 실수를 유발할 가능성도 있다.
```
    Vector<string> vs {"Hello", "World"} // Vector<string>
    
    Vector<string> vs1 {"Hello", "World"} // Vector<const char*>로 추론 (실수일까?)
    Vector<string> vs2 {"Hello"s, "World"s} // Vector<string>으로 추론
    Vector<string> vs3 {"Hello"s, "World"} // 에러: 초깃값 목록의 요소 타입이 일치하지 않음
```
- 생성자의 인자로부터 템플릿 인자를 추론할 수 없다면 `추론 가이드(user-defined deduction guide)`를 제공할 수 있다. (참고링크 : [https://en.cppreference.com/w/cpp/language/class_template_argument_deduction](https://en.cppreference.com/w/cpp/language/class_template_argument_deduction))

### 제한된 템플릿 인자(C++20)

- 많은 경우에 템플릿은 특정 조건을 만족하는 템플릿 인자에 대해서만 의미를 갖는다.
    - 예를 들어 Vector는 복사 연산을 제공하는데, 이렇게 하려면 그 요소가 복사 가능해야 한다.
    - 따라서 Vector의 템플릿 인자는 그냥 typename이 아니라 Element여야 한다(요소가 될 수 있는 타입이라는 의미)
    - Element는 Vector에서 요구하는 성질을 T가 만족하는지를 확인하는 술어다. 이런 술어를 `컨셉`이라고 하며, 컨셉이 적용된 템플릿 인자를 `제한된 인자(constrained argument)`, 제한된 인자를 사용하는 템플릿을 `제한된 템플릿(constrained template)`이라고 한다.

### 파라미터화된 연산

- 템플릿은 단순히 컨테이너의 요소 타입을 파라미터화하는 것 외에도 표준 라이브러리에서 타입과 알고리즘을 모두 파라미터화할때 많이 쓰인다
- 타입이나 값이 파라미터화된 연산을 표현하는 방법에는 다음 3가지가 있다
    - 함수 템플릿
    - 함수 객체: 데이터를 포함하면서도 함수처럼 호출 가능한 객체
    - 람다 표현식: 함수 객체를 간단하게 표기하는 방법