---
public: true
category: "programming"
title: "GC에게 먹이를 주지 마시오"
tags: ["programming"]
excerpt: "객체, 문자열, 배열 등이 생성될 때 그 데이터를 저장하기 위한 메모리는 `Heap`이라고 불리는 영역에서 할당됩니다."

references_link: ["https://docs.unity3d.com/Manual/BestPracticeUnderstandingPerformanceInUnity4-1.html", 
                "https://docs.unity3d.com/Manual/UnderstandingAutomaticMemoryManagement.html", 
                "https://www.jacksondunstan.com/articles/3792"]
references_book: []
recommend_tags: []

layout: post
group: wiki

created : 2020-03-16 00:00:00 +0900
updated : 2020-03-16 00:00:00 +0900
---
## Managed Heap

객체, 문자열, 배열 등이 생성될 때 그 데이터를 저장하기 위한 메모리는 `Heap`이라고 불리는 영역에서 할당됩니다.

그 데이터들이 더 이상 쓰이지 않게 되면 사용했던 메모리를 해제해서 다른 곳에 사용해야 합니다.

과거에는 프로그래머가 함수를 직접 호출하여 메모리를 관리했지만, 요즘에는 유니티의 Mono 엔진같은 런타임 시스템이 자동으로 메모리를 관리해 줍니다.

`Managed heap`은 Mono 또는 IL2CPP의 메모리 관리자가 자동으로 관리하는 메모리 영역입니다. 코드에서 생성되는 모든 참조 타입과 박싱된 값 타입 오브젝트는 managed heap에 할당됩니다.

  



## 값 타입 value type 과 참조 타입 reference type

함수 호출 시 인자의 값은 복사되어 전달됩니다. 자료형들은 크기가 작아 빠르고 쉽게 복사될 수 있지만, 오브젝트, 스트링, 배열 등은 훨씬 큰 경우가 많아 계속 복사를 하기에는 매우 비효율적입니다.

그래서 이런 큰 아이템들은 Heap에 저장하고, 값의 위치를 나타내는 포인터를 인자의 값으로 복사해서 전달합니다.



인자 전달 시 값이 복사되는 타입은 `값 타입`이라고 불립니다. 값 타입에는 int, float 등이 있고, 구조체 또한 값 타입입니다. 유니티의 경우 Color, Vector3등이 구조체입니다.

힙에 저장해서 포인터로 접근하는 타입은 `참조 타입`이라고 불립니다. 참조 타입에는 객체, 문자열, 배열 등이 있습니다.

  



## Boehm GC

유니티는 `Boehm GC`를 사용하고 있습니다. `Boehm GC` 알고리즘은 non-generational (비세대), non-compacting (비압축) 방식으로 동작합니다.

### non-generational (비세대)
GC가 컬렉션을 수행할 때 힙에 할당된 모든 오브젝트를 순회한다는 의미입니다. 따라서 힙에 할당된 오브젝트가 많아질수록 성능이 저하됩니다.
### non-compacting (비압축)
더 이상 참조되지 않는 오브젝트가 해제된 이후 오브젝트들 사이의 빈 공간을 없애기 위해 재배치를 하지 않는 것을 뜻합니다. 이는 메모리 파편화를 유발합니다.

![Boehm GC 메모리 파편화](/wiki-images/do-not-feed-the-gc/boehmgc.png)


위 그림은 메모리 파편화의 예시를 보여줍니다.

A와 C 오브젝트가 해제되어 공간이 생겼지만 하나의 큰 빈 공간으로 합쳐지지 않아서 (비압축) 해당 공간에는 해제된 객체와 동일하거나 더 작은 데이터만 할당될 수 있습니다.

파편화가 발생하면 실제로는 충분한 메모리 공간이 있음에도 필요한 크기의 연속적인 메모리 블록을 찾을 수 없어 메모리를 할당할 수 없는 경우가 생깁니다.

이런 경우 유니티 메모리 관리자는 (이미 GC가 돌지 않았다면) GC를 실행시켜 할당 요청에 충분한 "연속적인 메모리 공간"을 만드려고 시도합니다.

GC가 실행된 이후에도 충분한 공간이 생기지 않으면 힙이 증가해야 합니다. 플랫폼에 따라 다르지만, 대부분의 유니티 플랫폼은 관리되는 힙의 공간을 2배로 늘립니다.



## Stop-the-world

Boehm GC는 stop-the-world 가비지 콜렉터입니다. 유니티가 GC를 시작하면 프로그램 전체를 멈추고 GC가 끝나기를 기다린다는 것입니다.

GC가 처리해야 할 메모리의 양에 따라 게임은 수 백 밀리초나 멈춰 있을 수도 있습니다. 이 현상은 GC Spike라고 불리기도 합니다.

그렇기 때문에 최대한 가비지 컬렉터가 해야 할 일을 줄이는 것이 중요합니다.





## GC에게 먹이를 주지 마시오🚫


### '+' operator 대신 String Builder

String은 immutable합니다. 즉, 한 번 생성되면 값이 바뀔 수 없습니다. 그렇기 때문에 +  연산자를 사용하여 문자열을 합치면 한 번 합칠 때마다 새로운 객체가 생기게 됩니다.

![immutable string object](/wiki-images/do-not-feed-the-gc/string-immutable.png)

한 statement에서는 + 연산자를 여러 번 사용한다고 해도 문자열은 한 번만 복사됩니다. (eg. string str = "Hello " + userName + ". Today is " + dateString + "."; )



그렇지만 루프 안에서 + 연산자를 사용하면 여러 번의 복사가 일어나게 됩니다.

(물론 +연산자의 작동은 언어별, 버전별로 다릅니다. 예를 들어, 자바 1.5 이전은 매번 문자열 인스턴스를 만들지만 1.5 이후는 컴파일 단계에서 StringBuilder로 컴파일 되도록 변경되었습니다.)



예를 들어 아래의 코드는 루프를 한 번 돌 때마다 이전 루프에서 생성된 스트링은 버려지고 새로운 스트링을 생성하기 때문에 쓸데없이 힙의 공간을 소비하게 됩니다.
```
void ConcatExample(int[] intArray) {
    string line = intArray[0].ToString();
     
    for (i = 1; i < intArray.Length; i++) {
        line += ", " + intArray[i].ToString();
    }
     
    return line;
}
```

이런 문제를 방지하기 위해서 빈번하게 바뀌는 문자열의 경우 StringBuilder를 활용할 수 있습니다.



### Collection과 array 재사용

컬렉션이나 배열을 사용할 때, 가능하다면 재사용하거나 풀링을 하는 것을 고려해 봅시다.

Clear 메소드를 사용하면 컬렉션에 할당된 메모리는 해제하지 않은 채 값만 제거할 수 있습니다.
```
// 나쁜 예
void Update()
{
    List<float> nearestNeighbors = new List<float>();
    findDistancesToNearestNeighbors(nearestNeighbors);
    nearestNeighbors.Sort();
}
 
// 좋은 예
List<float> m_NearestNeighbors = new List<float>();
 
void Update()
{
    m_NearestNeighbors.Clear();
    findDistancesToNearestNeighbors(NearestNeighbors);
    m_NearestNeighbors.Sort();
}
```


### 클로저


```
List<float> listOfNumbers = createListOfRandomNumbers();
 
int desiredDivisor = getDesiredDivisor();
 
listOfNumbers.Sort( (x, y) => (int)x.CompareTo((int)(y/desiredDivisor)));
```

`클로저`란 로컬 스코프 상위의 지역변수를 사용하는 무명메서드 혹을 람다식을 뜻합니다.

예를 들어, 위 익명함수는 로컬 스코프 바깥에 있는 변수인 desiredDivisor의 상태에 접근할 수 있어야 하기에 클로저가 되었습니다.

desiredDivisor에 접근하기 위해 C#은 내부적으로 desiredDivisor를 보유한 클래스를 자동으로 생성합니다.

클로저를 실행할 때는 이 클래스의 인스턴스가 생성되고 힙에 할당되기 때문에 결과적으로 가비지를 생성하게 되는 것입니다.

매 프레임 실행되거나 성능이 중요한 코드라면 사용하지 않는 것이 좋겠지요?



### 박싱

유니티 프로젝트에서 의도치 않게 메모리 할당을 하게 되는 흔한 방법 중 하나는 `박싱`입니다. 이는 값 타입을 참조 타입처럼 활용하려고 할 때 발생합니다.


```
int x = 1;
object y = new object();
 
y.Equals(x); // x는 object의 Equals 메소드의 인자로 쓰이기 위해 object로 박싱되었습니다.
```

C#은 작은 임시할당이 세대별 GC에 의해 효율적으로 관리될 것이라는 가정 하에 만들어졌기 때문에 C# IDE나 컴파일러는 의도하지 않은 메모리 할당에 대한 경고를 하지 않습니다.

그러나 유니티의 GC는 비세대이기 때문에 작고 빈번한 임시할당을 효율적으로 관리할 수 없습니다. 그렇기에 박싱은 가능하면 피하는 게 좋습니다.



### Enum을 키로 사용하는 Dictionary

박싱을 일으키는 흔한 원인 중 하나는 딕셔너리의 키로 enum을 사용하는 것입니다.

Dictionary.add, Dictionary.tryGetValue, Dictionary.remove 등 딕셔너리의 키를 사용하는 함수들의 경우, 내부적으로 Object.getHashCode(Object)를 호출합니다.

enum은 int같은 값 타입이기 때문에 enum을 키로 사용하는 딕셔너리의 경우 함수를 호출할 때 최소 한 번의 박싱이 일어나게 됩니다.

이 문제를 해결하기 위해서 IEqualityComparer 인터페이스를 구현한 커스텀 Comparer 클래스를 만들어 딕셔너리의 생성자에 전달할 수 있습니다.

```
public class MyEnumComparer : IEqualityComparer<MyEnum> {
 
    public bool Equals(MyEnum x, MyEnum y) {
        return x == y;
    }
 
    public int GetHashCode(MyEnum x) {
        return (int)x;
    }
 
}
```

### 배열을 리턴하는 Unity API

배열을 리턴하는 Unity API는 매 접근마다 배열을 복사합니다. 그러므로 배열을 리턴하는 Unity API를 쓸 때는 주의가 필요합니다.

아래의 코드를 예로 들면, .vertices 프로퍼티에 접근할 때마다 할당이 일어나기 때문에 1번의 루프마다 4개의 vertices 배열이 생성됩니다.
```
array valued unity api
for(int i = 0; i < mesh.vertices.Length; i++)
 
{
    float x, y, z;
 
    x = mesh.vertices[i].x;
    y = mesh.vertices[i].y;
    z = mesh.vertices[i].z;
 
    DoSomething(x, y, z);  
}
```


그러나, 루프에 진입하기 전 vertices 배열을 만드는 작은 리팩토링만으로 할당을 총 1번으로 줄일 수 있습니다.

```
var vertices = mesh.vertices;
 
for(int i = 0; i < vertices.Length; i++)
 
{
    float x, y, z;
 
    x = vertices[i].x;
    y = vertices[i].y;
    z = vertices[i].z;
 
    DoSomething(x, y, z);  
}
```


