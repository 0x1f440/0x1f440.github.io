---
layout: post
group: blog
date: 2020-08-06
title:  "C# List의 내부 구현 살펴보기"
tags: ["programming"]
references_book: []
references_link: []
recommend_tags: []
---



```
// Implements a variable-size List that uses an array of objects to store the
// elements. A List has a capacity, which is the allocated length
// of the internal array. As elements are added to a List, the capacity
// of the List is automatically increased as required by reallocating the
// internal array.
```

List의 내부 구현을 보면 윗 부분에 이런 주석이 있습니다.

이 주석에서도 알 수 있듯이 사실 리스트는 내부적으로는 배열로 구현되어 있습니다. 그렇기 때문에 리스트의 특징을 잘 알고 쓰는 것이 중요합니다.

이 글에서는 리스트의 몇 가지 메소드들을 살펴보도록 하겠습니다.





## Add()

```
// Adds the given object to the end of this list. The size of the list is
// increased by one. If required, the capacity of the list is doubled
// before adding the new element.
//
public void Add(T item) {
    if (_size == _items.Length) EnsureCapacity(_size + 1);
    _items[_size++] = item;
    _version++;
}
```
먼저 Add()의 코드를 보겠습니다.

내부적으로 _items라는 배열을 이용해서 구현되어 있다는 사실을 알 수 있습니다.



리스트는 원소의 추가가 자유로운 것 같지만, 실제로는 EnsureCapacity() 함수를 호출하여 만약 배열의 길이가 꽉 차면 2배씩 늘리는 방식을 사용하고 있습니다.

그렇기 때문에 애매한 수의 원소를 가진 리스트는 많은 메모리를 낭비하게 될 가능성이 있습니다.





## RemoveAt()

```
// Removes the element at the given index. The size of the list is
        // decreased by one.
        //
        public void RemoveAt(int index) {
            if ((uint)index >= (uint)_size) {
                ThrowHelper.ThrowArgumentOutOfRangeException();
            }
            Contract.EndContractBlock();
            _size--;
            if (index < _size) {
                Array.Copy(_items, index + 1, _items, index, _size - index);
            }
            _items[_size] = default(T);
            _version++;
        }
```
RemoveAt()은 내부적으로 Array.Copy()를 사용하여, 특정 인덱스 이후의 원소들을 한 칸씩 당겨서 복사하고 있습니다. 

그렇기 때문에 RemoveAt(0)의 경우 O(n)의 시간이 걸리며, 삭제가 잦은 경우 적합하지 않습니다.



## Clear()

```
// Clears the contents of List.
public void Clear() {
    if (_size > 0)
    {
        Array.Clear(_items, 0, _size); // Don't need to doc this but we clear the elements so that the gc can reclaim the references.
        _size = 0;
    }
    _version++;
}
```

Clear()는 내부적으로는 Array.Clear() 를 사용하고 있으며,

Array.Clear()는 배열 내 모든 객체의 참조를 해제하고, 값을 각 타입의 디폴트 값으로 변경하는 함수입니다. 

즉, 레퍼런스 카운트만 줄어들 뿐이지 실제로 당장 뭔가가 삭제되지는 않습니다.



List에 대량의 데이터를 할당하고 Clear()를 호출하는 것을 반복하면 메모리를 많이 차지하게 됩니다. 

GC.Collect()등을 사용해 gc를 바로바로 호출하는 방법이 있지만 그만큼 느려질 수 있습니다.


## 참고 링크
[C# 내부 구현 코드를 읽을 수 있는 사이트](https://referencesource.microsoft.com/)